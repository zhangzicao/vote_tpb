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
export const dateFormat=function(date, formatStr) {
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