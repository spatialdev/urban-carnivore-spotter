import * as moment from 'moment';

const HIGH_CONFIDENCE = '100% confident';
const MEDIUM_CONFIDENCE = 'More than 75% confident';

const allCarnivores = ['Black Bear', 'Bobcat', 'Coyote', 'Cougar/Mountain Lion', 'Raccoon', 'Opossum', 'River Otter', 'Red Fox', 'Other'];
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
 * Given two Date() objects, return true if target is on the same day as startDate or endDate,
 * OR (target is before endDate AND target is after startDate)
 * @param target
 * @param startDate
 * @param endDate
 */
const insideDateBounds = (target, startDate, endDate) => {
    return (startDate === null || target.isSameOrAfter(startDate, 'day')) &&
        (endDate === null || target.isSameOrBefore(endDate, 'day'));
};

const insideAnyActiveTimeBounds = (date, filter) => {
    const { timeFilter } = filter;
    return DATE_BOUNDS.filter(bounds => timeFilter[bounds.name].value)
        .some(bounds => insideTimeBounds(date, bounds));
};

const insideTimeBounds = (date, bounds) => {
    const hour = date.getHours();
    return hour < bounds.late && hour >= bounds.early;
};

const matchesOtherCarnivore = (filter, species) => {
    const { carnivoreFilter } = filter;
    return carnivoreFilter['Other'].value && carnivoreFilter[species] === undefined;
};

export const getInitialFilter = (allNeighborhoods) => {
    // Carnivore, neighborhood, and times defaults
    const defaultCarnivoreFilter = {all: {order: 0, value: true}};
    allCarnivores.forEach((carnivore, ind) => defaultCarnivoreFilter[carnivore] = {order: ind + 1, value: true});
    const defaultNeighborhoodFilter = allNeighborhoods
        .filter(hood => hood !== 'all')
        .reduce((obj, neighborhood, index) => {
            obj[neighborhood] = {order: index + 1, value: true};
            return obj;
        }, {all: {order: 0, value: true}});
    const defaultTimeFilter = {all: {order: 0, value: true}};
    allTimes.forEach((time, ind) => defaultTimeFilter[time] = {order: ind+1, value: true});

    return {
        carnivoreFilter: {...defaultCarnivoreFilter},
        neighborhoodFilter: {...defaultNeighborhoodFilter},
        startDate: null,
        endDate: null,
        timeFilter: {...defaultTimeFilter},
        confidenceFilterActive: false,
    };
};

/**
 * Returns true if the report should be shown, given the filter
 */
export const dataMatchesFilter = (report, filter) => {
    const { data } = report;
    const parsedDate = new Date(data.timestamp);
    // If the report doesn't have any of the necessary fields, don't display it.
    if (!data.species || !data.neighborhood || !parsedDate || !data.confidence) {
        return false;
    }
    // ok with species
    return (filter.carnivoreFilter.all.value || (filter.carnivoreFilter[data.species] && filter.carnivoreFilter[data.species].value) || matchesOtherCarnivore(filter, data.species)) &&
    // ok with neighborhood
    (filter.neighborhoodFilter.all.value === true || (data.hasOwnProperty('neighborhood') && filter.neighborhoodFilter[data.neighborhood].value === true)) &&
    // ok with date
    insideDateBounds(moment(parsedDate), filter.startDate, filter.endDate) &&
    // ok with time
    (filter.timeFilter.all.value || insideAnyActiveTimeBounds(parsedDate, filter)) &&
    // ok with confidence
    (!filter.confidenceFilterActive || data.confidence === HIGH_CONFIDENCE || data.confidence === MEDIUM_CONFIDENCE);
};
