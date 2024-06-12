export function convertEventFromGoogleCalendar(event) {
  return {
    start: convertDate(event.start.dateTime),
    end: convertDate(event.end.dateTime),
    title: event.summary,
    content: event.location,
    class: 'gg-event',
    category: 'Google'
  }
}

function convertDate(inputDatetime) {
  var date = new Date(inputDatetime)
  var year = date.getFullYear()
  var month = ('0' + (date.getMonth() + 1)).slice(-2)
  var day = ('0' + date.getDate()).slice(-2)
  var hours = ('0' + date.getHours()).slice(-2)
  var minutes = ('0' + date.getMinutes()).slice(-2)
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
}

export function getEvent(event, start, end) {
  return {
    ...event,
    start: start,
    end: end,
    class: event.category.toLowerCase()
  }
}

export function convertEventToGoogleCalendar(start, end, title, content, remind) {
  let reminder
  if (remind != -1 || remind != undefined) {
    reminder = {
      useDefault: false,
      overrides: [
        {
          method: 'email',
          minutes: remind
        },
        {
          method: 'popup',
          minutes: remind
        }
      ]
    }
  } else {
    reminder = {
      useDefault: true
    }
  }
  return {
    start: {
      dateTime: convertJSDateToGoogleCalendarDate(start),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    end: {
      dateTime: convertJSDateToGoogleCalendarDate(end),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    summary: title,
    location: content,
    reminders: reminder
  }
}

function convertJSDateToGoogleCalendarDate(jSDate) {
  var date = new Date(jSDate)
  var offsetMinutes = date.getTimezoneOffset()
  var offsetHours = Math.abs(offsetMinutes / 60)
  if (offsetHours.toString().length == 1) {
    offsetHours = '0' + offsetHours
  }
  var offsetSign = offsetMinutes < 0 ? '+' : '-'
  return date.toISOString().slice(0, -5) + offsetSign + offsetHours + ':00'
}
