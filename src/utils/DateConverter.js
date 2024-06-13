export function getTime(shiftCode) {
  switch (shiftCode) {
    case 1:
      return {
        start: '7:00',
        end: '9:30'
      }
    case 2:
      return {
        start: '9:30',
        end: '12:00'
      }
    case 3:
      return {
        start: '13:00',
        end: '15:30'
      }
    case 4:
      return {
        start: '15:30',
        end: '18:00'
      }
  }
}

export function getDateOnly(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
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

export function JSDateToCSharpDate(date) {
  let pad = function (num) {
    return (num < 10 ? '0' : '') + num
  }

  let year = date.getFullYear()
  let month = pad(date.getMonth() + 1)
  let day = pad(date.getDate())
  let hours = pad(date.getHours())
  let minutes = pad(date.getMinutes())
  let seconds = pad(date.getSeconds())

  let offset = -date.getTimezoneOffset()
  let offsetSign = offset >= 0 ? '+' : '-'
  offset = Math.abs(offset)
  let offsetHours = pad(Math.floor(offset / 60))
  let offsetMinutes = pad(offset % 60)

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`
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
  let start = new Date(from)
  let end = new Date(to)
  if (day < 2 || day > 8) {
    throw new Error('Ngày trong phạm vi từ 2 đến 8')
  }
  day = day === 8 ? 0 : day - 1

  while (start <= end) {
    if (start.getDay() === day) {
      return start
    }
    start.setDate(start.getDate() + 1)
  }
  return null
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

export function getRelativeChatTime(dateString) {
  const parts = dateString.split(' ')
  const dateParts = parts[0].split('/')
  const timePart = parts[1]
  const inputDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0])
  const today = new Date()

  const inputYear = inputDate.getFullYear()
  const inputMonth = inputDate.getMonth()
  const inputDay = inputDate.getDate()

  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth()
  const todayDay = today.getDate()

  if (inputYear === todayYear && inputMonth === todayMonth && inputDay === todayDay) {
    return timePart
  } else if (inputYear === todayYear) {
    return `${dateParts[0]}/${dateParts[1]}`
  } else {
    return `${dateParts[2]}/${dateParts[1]}`
  }
}
