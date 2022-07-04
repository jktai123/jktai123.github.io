function isDate(myDate) {
  return myDate.constructor.toString().indexOf("Date") > -1;
}