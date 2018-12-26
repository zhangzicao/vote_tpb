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