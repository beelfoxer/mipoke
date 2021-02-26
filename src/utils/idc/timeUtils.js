function formatDate(date) {
  const year = date.getFullYear() % 100
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return year +
    '/' +
    month +
    '/' +
    day +
    ' ' +
    hour +
    ':' +
    minute +
    ':' +
    second
}

export function formatUnix(timeStamp) {
  return formatDate(new Date(timeStamp))
}

export function timeFormat(timeStamp) {
  const ts = new Date(timeStamp)
  const year = ts.getFullYear()
  const month = ts.getMonth() + 1
  const day = ts.getDate()

  const hour = ts.getHours()
  const minute = ts.getMinutes()
  const second = ts.getSeconds()
  const fullMonth = month >= 10 ? month : 0 + '' + month
  const fullDay = day >= 10 ? day : 0 + '' + day
  const fullHour = hour >= 10 ? hour : 0 + '' + hour
  const funnMinute = minute >= 10 ? minute : 0 + '' + minute
  const fullSecond = second >= 10 ? second : 0 + '' + second

  return year +
    '-' +
    fullMonth +
    '-' +
    fullDay +
    ' ' +
    fullHour +
    ':' +
    funnMinute +
    ':' +
    fullSecond

  // return year % 100 +
  //   '/' +
  //   month +
  //   '-' +
  //   day +
  //   ' ' +
  //   hour +
  //   ':' +
  //   minute

  // return month +
  //   '-' +
  //   day +
  //   ' ' +
  //   hour +
  //   ':' +
  //   minute
}
