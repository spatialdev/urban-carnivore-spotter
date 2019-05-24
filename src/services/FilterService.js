const HIGH_CONFIDENCE = '100% confident';
const MEDIUM_CONFIDENCE = 'More than 75% confident';

const allCarnivores = ['Black Bear', 'Bobcat', 'Coyote', 'Cougar/Mountain Lion', 'Racoon', 'Other'];
const allNeighborhoods = ['Ballard', 'Beacon Hill', 'Bothell', 'Broadview', 'Burien', 'Capitol Hill', 'Chinatown', 'Downtown'] // and more...
const allTimes = ['Early Morning (12:00am-4:59am)', 'Morning (5:00am-11:59am)', 'Afternoon (12:00pm-5:59pm)', 'Evening (6:00pm-11:59pm)'];

const DATE_BOUNDS = [
    {
        name: 'all',
        early: 0,
        late: 25
    },
    {
        name: 'Early Morning (12:00am-4:59am)',
        early: 0,
        late: 5
    },
    {
        name: 'Morning (5:00am-11:59am)', 
        early: 5,
        late: 12
    },
    {
        name: 'Afternoon (12:00pm-5:59pm)',
        early: 12,
        late: 18
    },
    {
        name: 'Evening (6:00pm-11:59pm)',
        early: 18,
        late: 24
    }
];

/**
 * Given two Date() objects, return true if they are on the same day, eg:
 *  12/21/2000 at noon and 12/21/2000 at 3pm return true, but
 *  12/21/2000 at noon and 12/22/2000 at noon return false
 */
const daysAreEqual = (one, two) => {
    return one.getUTCFullYear() === two.getUTCFullYear() 
        && one.getUTCMonth() === two.getUTCMonth()
        && one.getUTCDate() === two.getUTCDate();
}

const insideAnyActiveTimeBounds = (date, filter) => {
    const { timeFilter } = filter;
    return DATE_BOUNDS.filter(bounds => timeFilter[bounds.name])
        .some(bounds => insideTimeBounds(date, bounds));
}

const insideTimeBounds = (date, bounds) => {
    const hour = date.getHours();
    return hour < bounds.late && hour >= bounds.early;
}

const matchesOtherCarnivore = (filter, species) => {
    const { carnivoreFilter } = filter;
    return species === 'Other' || (carnivoreFilter['Other'] && carnivoreFilter[species] === undefined)
}

export const getInitialFilter = () => {
    // Carnivore, neighborhood, and times defaults
    const defaultCarnivoreFilter = {all: true};
    allCarnivores.forEach(carnivore => defaultCarnivoreFilter[carnivore] = false);
    const defaultNeighborhoodFilter = {all: true};
    allNeighborhoods.forEach(neighborhood => defaultNeighborhoodFilter[neighborhood] = false);
    const defaultTimeFilter = {all: true};
    allTimes.forEach(time => defaultTimeFilter[time] = false);

    const initialFilter = {
        carnivoreFilter: {...defaultCarnivoreFilter},
        neighborhoodFilter: {...defaultNeighborhoodFilter},
        date: null,
        timeFilter: {...defaultTimeFilter},
        confidenceFilterActive: false,
    }
    return initialFilter;
}

/**
 * Returns true if the report should be shown, given the filter
 */
export const dataMatchesFilter = (report, filter) => {
    const { data } = report;
    const parsedDate = new Date(data.timestamp);
    // ok with species    
    return (filter.carnivoreFilter.all || filter.carnivoreFilter[data.species] || matchesOtherCarnivore(filter, data.species)) &&
    // ok with neighborhood
    // TODO -- don't have the reverse geocoding hooked in yet
    // ok with date
    (filter.date === null || daysAreEqual(filter.date, parsedDate)) &&
    // ok with time
    (filter.timeFilter.all || insideAnyActiveTimeBounds(parsedDate, filter)) &&
    // ok with confidence
    (!filter.confidenceFilterActive || data.confidence === HIGH_CONFIDENCE || data.confidence === MEDIUM_CONFIDENCE);
}
