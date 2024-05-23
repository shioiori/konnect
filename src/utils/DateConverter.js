export function getTime(shiftCode) {
  switch (shiftCode) {
    case 1:
      return {
        start: '7:00',
        end: '9:30',
      }
    case 2:
      return {
        start: '9:30',
        end: '12:00',
      }
    case 3:
      return {
        start: '13:00',
        end: '15:30',
      }
    case 4:
      return {
        start: '15:30',
        end: '18:00',
      }
  }
}

export function getDateOnly(date) {
  return date.getFullYear() + '-' + date.getMonth() + '-' + date.getUTCDate()
}

export function getTimeOnly(date) {
  return (
    ('0' + date.getUTCHours()).slice(-2) +
    ':' +
    ('0' + date.getUTCMinutes()).slice(-2) +
    ':' +
    ('0' + date.getUTCSeconds()).slice(-2)
  )
}

export function getFormattedDate(date, special) {
  if (!special) special = '/'
  date = new Date(date)
  return (
    date.getUTCFullYear() +
    special +
    ('0' + (date.getUTCMonth() + 1)).slice(-2) +
    special +
    ('0' + date.getUTCDate()).slice(-2) +
    ' ' +
    ('0' + date.getUTCHours()).slice(-2) +
    ':' +
    ('0' + date.getUTCMinutes()).slice(-2) +
    ':' +
    ('0' + date.getUTCSeconds()).slice(-2)
  )
}

export function dateTimeToJSDate(date) {
  return date.split('T')[0]
}

// format dd/mm/yyyy hh:mm
export function dateTimeToFormatDate(dateTimeString) {
  const date = new Date(dateTimeString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export function getStartDateInRange(from, to, day) {
  var date = new Date(from)
  var startDay = new Date(from).getDate() + 2
  if (startDay <= day) {
    date.setDate(date.getDate() + day - startDay)
  } else {
    date.setDate(date.getDate() + 6 - startDay + day)
  }
  return date
}

// time convert

export function getRelativeTime(date) {
  var cloneDate = date.toString()
  const now = new Date()
  date = new Date(date)
  const timeDifference = now - date

  // Convert time difference to seconds
  const secondsDifference = timeDifference / 1000
  if (secondsDifference < 60) {
    return 'Vừa xong'
  } else if (secondsDifference < 3600) {
    const minutes = Math.floor(secondsDifference / 60)
    return `${minutes} phút trước`
  } else if (secondsDifference < 86400) {
    const hours = Math.floor(secondsDifference / 3600)
    return `${hours} giờ trước`
  } else if (isYesterday(date)) {
    return 'Hôm qua'
  } else if (isSameYear(date)) {
    const days = Math.floor(secondsDifference / 86400)
    return `${days} ngày trước`
  } else if (isSameMonth(date)) {
    const months = Math.floor(secondsDifference / (86400 * 30))
    return `${months} tháng trước`
  } else {
    return cloneDate
  }
}

function isYesterday(date) {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  )
}

function isSameYear(date) {
  const now = new Date()
  return date.getFullYear() === now.getFullYear()
}

function isSameMonth(date) {
  const now = new Date()
  return date.getMonth() === now.getMonth() && isSameYear(date)
}

export function getRelativeChatTime(dateString){
  const parts = dateString.split(' ');
  const dateParts = parts[0].split('/');
  const timePart = parts[1];
  const inputDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
  const today = new Date();
  
  const inputYear = inputDate.getFullYear();
  const inputMonth = inputDate.getMonth();
  const inputDay = inputDate.getDate();
  
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  if (inputYear === todayYear && inputMonth === todayMonth && inputDay === todayDay) {
      return timePart;
  } else if (inputYear === todayYear) {
      return `${dateParts[0]}/${dateParts[1]}`;
  } else {
      return `${dateParts[2]}/${dateParts[1]}`;
  }
}
