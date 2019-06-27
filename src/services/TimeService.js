// Functions that relate to the Firebase time format
/**
 * Get a string for a timestamp in the format that Cloud Firestore sends us.
 * Time should be an object with _nanoseconds and _seconds as fields.
 */
export const firebaseTimeToDateTimeString = (time) => {
  if (time) {
    const date = new Date(time);
    return `${date.toDateString()} ${jsDateToTimeString(date)}`;
  }
  return 'Unknown Time';
};

/**
 * Given a JS Date() object, return a string representing the time of day.
 * @param time - a JS Date() object
 */
export const jsDateToTimeString = (time) => {
  if (time) {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  return 'Unknown Time';
};