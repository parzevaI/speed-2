export function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  let timeString = '';

  if (hours > 0) {
      timeString += `${hours} hour${hours > 1 ? 's' : ''}`;
  }

  if (minutes > 0) {
      if (timeString) timeString += ' ';
      timeString += `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  if (remainingSeconds > 0 || timeString === '') {
      if (timeString) timeString += ' ';
      timeString += `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  }

  return timeString.trim();

}
