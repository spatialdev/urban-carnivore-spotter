import * as moment from "moment";

const HIGH_CONFIDENCE = "100% confident";
const MEDIUM_CONFIDENCE = "More than 75% confident";

const allCarnivores = [
  "Black Bear",
  "Bobcat",
  "Coyote",
  "Cougar/Mountain Lion",
  "Raccoon",
  "Opossum",
  "River Otter",
  "Red Fox",
  "Other",
];
const allMedia = ["Photos", "Video", "No Media"];
const allTimes = [
  "Early Morning (12:00am-4:59am)",
  "Morning (5:00am-11:59am)",
  "Afternoon (12:00pm-5:59pm)",
  "Evening (6:00pm-11:59pm)",
];
const allDates = ["Today", "Past 30 Days", "Date Range"];

const DATE_BOUNDS = [
  {
    name: "all",
    early: 0,
    late: 25,
  },
  {
    name: "Early Morning (12:00am-4:59am)",
    early: 0,
    late: 5,
  },
  {
    name: "Morning (5:00am-11:59am)",
    early: 5,
    late: 12,
  },
  {
    name: "Afternoon (12:00pm-5:59pm)",
    early: 12,
    late: 18,
  },
  {
    name: "Evening (6:00pm-11:59pm)",
    early: 18,
    late: 24,
  },
];

/**
 * Given two Date() objects, return true if target is on the same day as startDate or endDate,
 * OR (target is before endDate AND target is after startDate)
 * @param target
 * @param startDate
 * @param endDate
 */
const insideDateBounds = (target, startDate, endDate) => {
  return (
    (startDate === null || target.isSameOrAfter(startDate, "day")) &&
    (endDate === null || target.isSameOrBefore(endDate, "day"))
  );
};

const insideAnyActiveTimeBounds = (date, filter) => {
  const { timeFilter } = filter;
  return DATE_BOUNDS.filter(
    (bounds) => timeFilter[bounds.name].value
  ).some((bounds) => insideTimeBounds(date, bounds));
};

const insideTimeBounds = (date, bounds) => {
  const hour = date.getHours();
  return hour < bounds.late && hour >= bounds.early;
};

const matchesOtherCarnivore = (filter, species) => {
  const { carnivoreFilter } = filter;
  return (
    carnivoreFilter["Other"].value && carnivoreFilter[species] === undefined
  );
};

const matchesMediaTypes = (filter, media) => {
  const { mediaFilter } = filter;
  const videoFormats = [
    ".mov",
    ".mp4",
    ".webm",
    ".ogg",
    ".avi",
    ".wmv",
    ".mkv",
  ];
  let isVideo = false;
  if (media && media.length > 0) {
    const mediaTypes = media.map((mediaItem) => {
      const fileExtensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim;
      const extension = mediaItem.match(fileExtensionPattern);
      isVideo = videoFormats.includes(
        extension ? extension[0].toLowerCase() : false
      );
      if (isVideo) {
        return mediaFilter["Video"].value && isVideo;
      } else {
        return mediaFilter["Photos"].value && !isVideo;
      }
    });
    return mediaTypes.includes(false) ? false : true;
  } else {
    return false;
  }
};

const matchesNoMediaType = (filter, media) => {
  const { mediaFilter } = filter;
  return (
    mediaFilter["No Media"].value &&
    media.length === 0 &&
    !matchesMediaTypes(filter, media)
  );
};

const matchesTodayDate = (filter, timestamp) => {
  const { dateFilter } = filter;
  const today = new Date().setHours(0, 0, 0, 0);
  const day = new Date(timestamp).setHours(0, 0, 0, 0);

  if (today === day && dateFilter["Today"].value) {
    return true;
  }
  return false;
};

const matchesPast30Date = (filter, timestamp) => {
  const { dateFilter } = filter;
  const today = new Date().setHours(0, 0, 0, 0);
  const day = new Date(timestamp).setHours(0, 0, 0, 0);

  const diff = Math.abs(today - day);
  const numOfDaysBetween = diff / (1000 * 60 * 60 * 24);

  if (numOfDaysBetween <= 30 && dateFilter["Past 30 Days"].value) {
    return true;
  }
  return false;
};

export const getInitialFilter = (allNeighborhoods) => {
  // Carnivore, media, neighborhood, and times defaults
  const defaultCarnivoreFilter = { all: { order: 0, value: true } };
  allCarnivores.forEach(
    (carnivore, ind) =>
      (defaultCarnivoreFilter[carnivore] = { order: ind + 1, value: true })
  );
  const defaultMediaFilter = { all: { order: 0, value: true } };
  allMedia.forEach(
    (media, ind) =>
      (defaultMediaFilter[media] = { order: ind + 1, value: true })
  );
  const defaultNeighborhoodFilter = allNeighborhoods
    .filter((hood) => hood !== "all")
    .reduce(
      (obj, neighborhood, index) => {
        obj[neighborhood] = { order: index + 1, value: true };
        return obj;
      },
      { all: { order: 0, value: true } }
    );
  const defaultTimeFilter = { all: { order: 0, value: true } };
  allTimes.forEach(
    (time, ind) => (defaultTimeFilter[time] = { order: ind + 1, value: true })
  );
  const defaultDateFilter = { all: { order: 0, value: true } };
  allDates.forEach(
    (date, ind) => (defaultDateFilter[date] = { order: ind + 1, value: true })
  );

  return {
    carnivoreFilter: { ...defaultCarnivoreFilter },
    mediaFilter: { ...defaultMediaFilter },
    neighborhoodFilter: { ...defaultNeighborhoodFilter },
    startDate: null,
    endDate: null,
    timeFilter: { ...defaultTimeFilter },
    dateFilter: { ...defaultDateFilter },
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

  try {
    return (
      // ok with species
      (filter.carnivoreFilter.all.value ||
        (filter.carnivoreFilter[data.species] &&
          filter.carnivoreFilter[data.species].value) ||
        matchesOtherCarnivore(filter, data.species)) &&
      // ok with media
      (filter.mediaFilter.all.value ||
        (filter.mediaFilter[data.mediaPaths] &&
          filter.mediaFilter[data.mediaPaths].length > 0) ||
        matchesMediaTypes(filter, data.mediaPaths) ||
        matchesNoMediaType(filter, data.mediaPaths)) &&
      // ok with neighborhood
      (filter.neighborhoodFilter.all.value === true ||
        (data.hasOwnProperty("neighborhood") &&
          filter.neighborhoodFilter[data.neighborhood].value === true)) &&
      // ok with date
      ((filter.dateFilter["Date Range"].value &&
        insideDateBounds(
          moment(parsedDate),
          filter.startDate,
          filter.endDate
        )) ||
        filter.dateFilter.all.value === true ||
        matchesTodayDate(filter, data.timestamp) ||
        matchesPast30Date(filter, data.timestamp)) &&
      // ok with time
      (filter.timeFilter.all.value ||
        insideAnyActiveTimeBounds(parsedDate, filter)) &&
      // ok with confidence
      (!filter.confidenceFilterActive ||
        data.confidence === HIGH_CONFIDENCE ||
        data.confidence === MEDIUM_CONFIDENCE)
    );
  } catch (err) {
    return false;
  }
};
