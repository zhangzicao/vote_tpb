import React from 'react';
import PropTypes from 'prop-types';
import '@/components/Laypage.less'

export default class Laypage extends React.PureComponent {
  constructor(props){
    super(props)
    this.prevPage = this.prevPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.toFirstPage = this.toFirstPage.bind(this)
    this.toLastPage = this.toLastPage.bind(this)
    this.onChange = this.onChange.bind(this)
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    //切换标签页后保存投票数据
    if(this.props.currPage > this.props.pages)
      this.props.onChange(this.props.pages)
    else if(this.props.currPage < 1)
      this.props.onChange(1)
  }
  prevPage(){
    let pa=this.props.currPage-1;
    this.props.onChange(pa<1?1:pa)
  }
  nextPage(){
    let pa=this.props.currPage+1;
    this.props.onChange(pa>this.props.pages?this.props.pages:pa)
  }
  toFirstPage(){
    this.props.onChange(1)
  }
  toLastPage(){
    this.props.onChange(this.props.pages)
  }
  onChange(e){
    this.props.onChange(parseInt(e.target.title))
  }
  render() {
    let {currPage, pages}=this.props;
    let btnNum=5;
    let nextNum=parseInt((btnNum-1)/2);
    let prevNum=btnNum-nextNum-1;
    let pagingEnd = currPage+nextNum;
    let diff = pagingEnd - pages;
    let pagingStart = currPage-prevNum;
    if(diff>0) pagingStart = pagingStart-diff;
    pagingStart = pagingStart<1?1:pagingStart;
    let arr=[];
    for (let i=0;i<btnNum;i++){
      if(pagingStart+i>pages){
        break
      }
      arr.push(pagingStart+i)
    }
    return (
        <div className={'laypage-container '+(this.props.className||'')}>
          <span className="laypage-btn" style={{
            display: currPage === 1?'none':'inline-block'
          }} onClick={this.toFirstPage}>&lt;&lt;</span>
          <span className="laypage-btn" style={{
            display: currPage === 1?'none':'inline-block'
          }} onClick={this.prevPage}>&lt;</span>
          {
            arr.map((item)=>{
              return (<span key={item} className={'laypage-btn '+(currPage===item?'active':'')} title={item} onClick={this.onChange}>{item}</span>)
            })
          }
          <span className="laypage-btn" style={{
            display: currPage === pages?'none':'inline-block'
          }} onClick={this.nextPage}>&gt;</span>
          <span className="laypage-btn" style={{
            display: currPage === pages?'none':'inline-block'
          }} onClick={this.toLastPage}>&gt;&gt;</span>
        </div>
    );
  }
}

Laypage.propTypes={
  currPage:PropTypes.number.isRequired,
  pages:PropTypes.number.isRequired,
  onChange:PropTypes.func.isRequired,
}

Laypage.defaultProps={
  currPage:1,
  pages:1
}