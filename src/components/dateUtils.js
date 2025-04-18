// dateUtils.js
export const formatDateForAPI = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDayName = date => {
  return date.toLocaleDateString('en-US', {weekday: 'short'});
};

export const generateWeek = (startDate = new Date()) => {
  const today = new Date(startDate);
  return Array.from({length: 7}).map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });
};

export const formatDisplayDate = date => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) {
    return false;
  }
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const calculateDuration = (start, end) => {
  if (!start || !end) return 0;

  try {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const duration = (endHour * 60 + endMin - (startHour * 60 + startMin)) / 60;
    return duration.toFixed(1);
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 0;
  }
};

export const normalizeDateString = date => {
  if (!date) {
    return '';
  }

  let dateObj;

  if (typeof date === 'string') {
    if (date.includes('T')) {
      dateObj = new Date(date.split('T')[0]);
    } else {
      dateObj = new Date(date);
    }
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return '';
  }

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const isTimeSlotAvailable = slot => {
  return (slot?.Status || '').toLowerCase() === 'available';
};
