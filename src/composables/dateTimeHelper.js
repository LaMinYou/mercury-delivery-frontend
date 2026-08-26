export const formatToLocalDateTime = (utcDateString) => {
    if (!utcDateString) return "";
    const date = new Date(utcDateString);
    const pad = (num) => String(num).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',   // 2026
    month: 'short',    // May, Aug, Sep
    day: '2-digit'     // 13, 05
  });

  return formatter.format(date);
};