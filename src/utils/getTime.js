/**
 * function to format time
 * @param {*} time created time
 * @returns
 */
export const getTime = (time) => {
  const now = new Date().getTime();
  const created = new Date(time).getTime();
  const diff = now - created;
  if (diff < -100000) return "Online";
  if (diff <= 3000) return "Just now";
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const month = Math.floor(days / 30);
  const year = Math.floor(month / 12);
  if (year > 0) return year + " year" + (year > 1 ? "s" : "");
  if (month > 0) return month + " month" + (month > 1 ? "s" : "");
  if (days > 0) return days + " day" + (days > 1 ? "s" : "");
  if (hours > 24) {
    return `${Math.floor(hours / 24)} days`;
  }
  if (hours > 0) {
    return `${hours} hours`;
  }
  if (minutes > 0) {
    return `${minutes} minutes`;
  }
  return `${seconds} seconds`;
};
