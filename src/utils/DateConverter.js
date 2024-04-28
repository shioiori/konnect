export function getTime(shiftCode) {
  switch (shiftCode) {
    case 1:
      return {
        start: '7:00',
        end: '9:30',
        cssClass: 'shift1'
      }
    case 2:
      return {
        start: '9:30',
        end: '12:00',
        cssClass: 'shift2'
      }
    case 3:
      return {
        start: '13:00',
        end: '15:30',
        cssClass: 'shift3'
      }
    case 4:
      return {
        start: '15:30',
        end: '18:00',
        cssClass: 'shift4'
      }
  }
}

export function getDateOnly(date) {
  return date.getFullYear() + '-' + date.getMonth() + '-' + date.getUTCDate()
}

export function dateTimeToJSDate(date) {
  return date.split('T')[0]
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
