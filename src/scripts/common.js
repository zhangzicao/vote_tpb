/**
 * 常用方法/工具
 */

/**
 * 处理input的输入
 * @param event
 */
export const handleInputChange=function (event) {
  const target = event.target;
  const value = target.type === 'checkbox' ? target.checked : target.value;
  const name = target.name;

  this.setState({
    [name]: value
  });
}


/**
 * 处理switch切换
 * @param checked 是否打开功能
 * @param name 表单名(状态名称)
 */
export const switchChange = function(checked,name){
  //switch切换
  this.setState((prevState)=>({
    [name]:checked
  }))
}

/**
 *
 * @param {date | string} date
 * @param {string} formatStr
 * @returns {string}
 */
export const dateFormat = function(date, formatStr) {
  if(!(date instanceof Date)){
    date=new Date(date);
  }
  let str = formatStr;
  let Week = ['日', '一', '二', '三', '四', '五', '六'];

  str = str.replace(/yyyy|YYYY/, date.getFullYear());
  str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));

  str = str.replace(/MM/, date.getMonth() + 1 > 9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1));
  str = str.replace(/M/g, date.getMonth() + 1);

  str = str.replace(/w|W/g, Week[date.getDay()]);

  str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
  str = str.replace(/d|D/g, date.getDate());

  str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
  str = str.replace(/h|H/g, date.getHours());
  str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
  str = str.replace(/m/g, date.getMinutes());

  str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
  str = str.replace(/s|S/g, date.getSeconds());

  return str;
}

/**
 * 判断2个日期是否在同一天
 * @param date1
 * @param date2
 * @returns {boolean}
 */
export const dateEqualDay = function(date1, date2){
  if(!(date1 instanceof Date)) {
    date1 = new Date(date1);
  }
  if(!(date2 instanceof Date)){
    date2=new Date(date2);
  }
  return date1.getFullYear()===date2.getFullYear() && date1.getMonth()===date2.getMonth() && date1.getDate()===date2.getDate()
}

/**
 * 判断2个日期是否在同一周
 * @param date1
 * @param date2
 * @returns {boolean}
 */
export const dateEqualWeek = function(date1, date2){
  if(!(date1 instanceof Date)) {
    date1 = new Date(date1);
  }
  if(!(date2 instanceof Date)){
    date2=new Date(date2);
  }
  if(date1.getDate()-date2.getDate()>7) return false;
  let day1=date1.getDay();
  let weekStart=date1.getDate()-day1;
  return date2.getDate()>=weekStart && date2.getDate()<=weekStart+6
}

/**
 * 判断2个日期是否在同一月
 * @param date1
 * @param date2
 * @returns {boolean}
 */
export const dateEqualMonth = function(date1, date2){
  if(!(date1 instanceof Date)) {
    date1 = new Date(date1);
  }
  if(!(date2 instanceof Date)){
    date2=new Date(date2);
  }
  return date1.getFullYear()===date2.getFullYear() && date1.getMonth()===date2.getMonth()
}

/**
 * 判断2个日期是否在同一年
 * @param date1
 * @param date2
 * @returns {boolean}
 */
export const dateEqualYear = function(date1, date2){
  if(!(date1 instanceof Date)) {
    date1 = new Date(date1);
  }
  if(!(date2 instanceof Date)){
    date2=new Date(date2);
  }
  return date1.getFullYear()===date2.getFullYear()
}

/**
 * 判断1个日期是否在一个范围内
 * @param date
 * @param dateFrom
 * @param dateTo
 * @param containLastDate=false 是否包含最好一天（dateTo会加一）
 * @returns {boolean}
 */
export const dateIsBetween = function(date, dateFrom, dateTo, containLastDate){
  if(!(date instanceof Date)) {
    date = new Date(date);
  }
  if(!(dateFrom instanceof Date)){
    dateFrom=new Date(dateFrom);
  }
  if(!(dateTo instanceof Date)){
    dateTo=new Date(dateTo);
  }
  if(!!containLastDate){
    dateTo=new Date(dateTo.getTime()+86400000);
  }
  return date.getTime()>=dateFrom.getTime() && date.getTime()<=dateTo.getTime()
}

/**
 * 求两个时间的天数差 日期格式为 YYYY-MM-dd
 * @param DateOne
 * @param DateTwo
 * @returns {number}
 */
export const getDaysBetween = function (DateOne, DateTwo) {
  if(!(DateOne instanceof Date)) {
    DateOne = new Date(DateOne);
  }
  DateOne = new Date(DateOne.getFullYear(),DateOne.getMonth(),DateOne.getDate());
  if(!(DateTwo instanceof Date)){
    DateTwo=new Date(DateTwo);
  }
  DateTwo = new Date(DateTwo.getFullYear(),DateTwo.getMonth(),DateTwo.getDate());

  let cha = (DateOne.getTime() - DateTwo.getTime()) / 86400000;
  return Math.abs(cha);
}

/**
 * 获取一个日期当前月的日期数目
 * @param date
 * @returns {number}
 */
export const getDaysInMonth = function (date) {
  if(!(date instanceof Date)) {
    date = new Date(date);
  }
  if(date.getMonth()<11)
    return (new Date(date.getFullYear(),date.getMonth()+1,0)).getDate();
  else
    return (new Date(date.getFullYear()+1,0,0)).getDate();
}

//将#XXXXXX颜色格式转换为RGB格式，并附加上透明度
export const ConvertToRGBA = function (hex, opacity) {
  if (!/#?\d+/g.test(hex)) return hex; //如果是“red”格式的颜色值，则不转换。//正则错误，参考后面的PS内容
  var h = hex.charAt(0) == "#" ? hex.substring(1) : hex,
      r = parseInt(h.substring(0, 2), 16),
      g = parseInt(h.substring(2, 4), 16),
      b = parseInt(h.substring(4, 6), 16),
      a = opacity;
  if (typeof a==='undefined')
    return "rgb(" + r + "," + g + "," + b + ")";
  else
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}
