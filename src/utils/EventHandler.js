export function convertEventFromGoogleCalendar(event) {
  return {
    start: convertDate(event.start.dateTime),
    end: convertDate(event.end.dateTime),
    title: event.summary,
    content: event.location,
    class: 'gg-event'
  }
}

function convertDate(inputDatetime){
    var date = new Date(inputDatetime);
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
}

export function getEvent(start, end, title, content, cssClass) {
  return {
    start: start,
    end: end,
    title: title,
    content: content,
    class: cssClass
  }
}

export function convertEventToGoogleCalendar(start, end, title, content){
    return {
        start: {
            dateTime: start,
            timeZone: "Asia/Ho_Chi_Minh"
        },
        end: {
            dateTime: end,
            timeZone: "Asia/Ho_Chi_Minh"
        },
        summary: title,
        location: content
    }
}
