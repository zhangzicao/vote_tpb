import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import PropTypes from 'prop-types'
import {ConvertToRGBA} from '@/scripts/common'
import './Dialog.less'

Modal.setAppElement('#root');
export default class Dialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state={}
    this.onRequestClose = this.onRequestClose.bind(this);
    this.close = this.onRequestClose;

    this.defaultBtns={
      alert:[{text:'确认',type:'primary'}],
      confirm:[{text:'确认',type:'primary'},'取消'],
      prompt:[{text:'确认',type:'primary'},'取消'],
      other:[]
    }

    this.$content = null;
    this.setContentRef = element => {
      this.$content = element;
      if(this.$content)
        this.setPosition(this.props.offset);//居中
    };
  }
  static getDerivedStateFromProps(nextProps,prevState){
    if(prevState.area!==nextProps.area
      || prevState.shade!==nextProps.shade
    ){
      let width=typeof nextProps.area==='string'
          ?nextProps.area
          :( nextProps.area instanceof Array && nextProps.area[0] || "300px");
      if(nextProps.type==='toast') width="auto"
      let height=nextProps.area instanceof Array && nextProps.area[1] || "auto";

      let bg=typeof nextProps.shade === 'string' || typeof nextProps.shade === 'number'
          ?'rgba(0,0,0,'+ nextProps.shade +')'
          : nextProps.shade instanceof Array
              ? ConvertToRGBA(nextProps.shade[1],nextProps.shade[0]):null;
      return {
        customStyles: {
          overlay:{
            backgroundColor:bg
          },
          content : {
            width:width,
            height:height
          }
        }
      }
    }
    return null
  }

  componentDidMount() {
    //设置可拖动区域
    if(this.props.move){
      if(!this.onMoveStart){
        this.onMoveStart= (event) => {
          if(!this.$content) return;
          let blocks=this.$content.querySelectorAll(this.props.move);
          let node=event.target;
          for (let i = 0; i < blocks.length; i++) {
            do {
              if(node.isSameNode(blocks[i])){
                this.startX=event.pageX;
                this.startY=event.pageY;
                this.$movePlaceholder=document.createElement('div');
                this.$movePlaceholder.style.position = 'absolute'
                this.$movePlaceholder.style.width = "100%";
                this.$movePlaceholder.style.height = "100%";
                this.$movePlaceholder.style.top = "0";
                this.$movePlaceholder.style.left = "0";
                this.$movePlaceholder.style.border = "2px solid #2196f3";
                this.$content.appendChild(this.$movePlaceholder)
                document.addEventListener('mousemove',this.onMoving)
                document.addEventListener('mouseup',this.onMoveEnd)
                return
              }
              node=node.parentNode;
            }while (node)
          }
        }
        this.onMoving= (event) => {
          this.$movePlaceholder.style.left = event.pageX-this.startX+'px';
          this.$movePlaceholder.style.top = event.pageY-this.startY+'px';
        }
        this.onMoveEnd= (event) => {
          let layerLeft=this.$content.getAttribute('data-left')||0;
          let layerTop=this.$content.getAttribute('data-top')||0;
          let pos=this.getAfterMovedPosition(event.pageX,event.pageY,this.startX,this.startY,layerLeft,layerTop,this.$content.offsetWidth,this.$content.offsetHeight);
          this.setPosition([pos.left+'px',pos.top+'px'])
          this.cancelMove()
        }
        this.cancelMove= () => {
          if(this.$movePlaceholder){
            this.$movePlaceholder.parentNode.removeChild(this.$movePlaceholder)
            this.$movePlaceholder=null;
          }
          document.removeEventListener('mousemove',this.onMoving)
          document.removeEventListener('mouseup',this.onMoveEnd)
        }
        this.getAfterMovedPosition= (currX,currY,startX,startY,layerLeft,layerTop,layerWidth,layerHeight) => {
          let minLeft=0;
          let minTop=0;
          let maxLeft=window.innerWidth-layerWidth;
          let maxTop=window.innerHeight-layerHeight;
          var rsLeft = parseFloat(layerLeft)+currX-startX;
          rsLeft = rsLeft<minLeft?minLeft:rsLeft>maxLeft?maxLeft:rsLeft;
          var rsTop = parseFloat(layerTop)+currY-startY;
          rsTop = rsTop<minTop?minTop:rsTop>maxTop?maxTop:rsTop;
          return {
            left: rsLeft,
            top: rsTop,
          }
        }
      }
      document.removeEventListener('mousedown',this.onMoveStart)
      document.addEventListener('mousedown',this.onMoveStart)
    }
    if(this.props.time || this.props.type==='toast'){
      this.timer=setTimeout( () => {
        this.onRequestClose()
      },this.props.time||1500)
    }
  }

  setPosition(positionStr){
    //设置弹窗位置接收坐标[x,y]。也接收单个参数，表示特殊位置的字符串如'center','c','left top','lt','cb','b'
    if(this.$content && this.$content.offsetHeight){
      let x,y;
      if(typeof positionStr === 'string'){
        x = (window.innerWidth-this.$content.offsetWidth)/2
        y = (window.innerHeight-this.$content.offsetHeight)/2
        if(positionStr.search('left')>-1||(positionStr.length<=2&&positionStr.search('l')>-1)){
          x = 0
        }
        if(positionStr.search('right')>-1||(positionStr.length<=2&&positionStr.search('r')>-1)){
          x = window.innerWidth-this.$content.offsetWidth;
        }
        if(positionStr.search('top')>-1||(positionStr.length<=2&&positionStr.search('t')>-1)){
          y = 0
          if(this.props.type==='toast'){
            y=y+20
          }
        }
        if(positionStr.search('bottom')>-1||(positionStr.length<=2&&positionStr.search('b')>-1)){
          y = window.innerHeight-this.$content.offsetHeight;
          if(this.props.type==='toast'){
            y=y-20
          }
        }
      }else{
        x=positionStr[0]||0;
        y=positionStr[1]||0;
        if((x+'').search('%')>-1){
          x=window.innerWidth*parseFloat(x)/100
        }
        if((y+'').search('%')>-1){
          y=window.innerHeight*parseFloat(y)/100
        }
        x=parseFloat(x)
        y=parseFloat(y)
      }
      this.$content.style.height=this.$content.offsetHeight+'px'
      this.$content.style.left=x+'px'
      this.$content.style.top=y+'px'
      this.$content.setAttribute('data-left', x+"")
      this.$content.setAttribute('data-top', y+"")
    }
  }

  onRequestClose() {
    this.props.onRequestClose();
  }

  render() {
    let btns;
    if(typeof this.props.btn==='undefined'){
      btns=this.defaultBtns[this.props.type]||this.defaultBtns.other;
    }else{
      btns=this.props.btn
    }

    return (
        <div>
          <Modal {...this.props}
                 onRequestClose={this.onRequestClose}
                 style={ this.state.customStyles }
                 overlayClassName={"dialog__overlay dialog__overlay_"+this.props.type+(!this.props.shade?' dialog__overlay_hide':'')}
                 className={"dialog__container dialog__container_"+this.props.type}
                 contentRef={this.setContentRef}
          >
            {
              this.props.title===false || this.props.type==='toast'
                  ?null
                  :<h2 className="dialog__title">{this.props.title||"信息"}</h2>
            }
            {
              !btns || btns.length===0
                  ?null
                  :(<div className="dialog__btns">
                    {
                      btns.map((item,i)=>{
                        let onClick=this.props['btn'+(i+1)];
                        if(!onClick){
                          if(this.props.type==='alert'
                              ||(this.props.type==='confirm' && i===btns.length-1)
                              ||(this.props.type==='prompt' && i===btns.length-1)
                          ){
                            onClick=this.onRequestClose
                          }
                        }
                        return <button className={"dialog__btn "+(item.type?"dialog__btn_"+item.type:"")}
                                       key={(item.text||item)+(item.type||"")}
                                       onClick={onClick}>{item.text||item}
                        </button>
                      })
                    }
                  </div>)
            }
            <div className="dialog__content">
              {this.props.content}
              {
                this.props.type==='prompt' && (
                    this.props.formType===0
                        ? <input type="text" className="dialog__input" value={this.props.value}/>
                        : this.props.formType===1
                        ? <input type="password" className="dialog__input" value={this.props.value}/>
                        : <textarea  className="dialog__input" value={this.props.value}></textarea>
                )
              }
            </div>
            {
              this.props.closeBtn && this.props.type!=='toast' &&
              (
                  <div className="dialog__setwin">
                    {
                      this.props.closeBtn === 1
                        ? <a href="javascript:;" onClick={this.onRequestClose} className="dialog__close dialog__close1"></a>
                        : this.props.closeBtn === 2
                          ? <a href="javascript:;" onClick={this.onRequestClose} className="dialog__close dialog__close2"></a>
                          : null
                    }
                  </div>
              )
            }
          </Modal>
        </div>
    );
  }

  componentWillUnmount(){
    if(this.onMoveStart){
      document.addEventListener('mousedown',this.onMoveStart)
    }
    if(this.cancelMove){
      this.cancelMove()
    }
    if(this.timer){
      clearTimeout(this.timer)
      this.timer=null
    }
  }
}
Dialog.propTypes={
  type:PropTypes.oneOf(['page','alert','confirm','prompt','toast']),
  title:PropTypes.string,//标题
  content:PropTypes.node,//内容
  area:PropTypes.oneOfType([PropTypes.array,PropTypes.string]),//弹窗宽高数组
  btn:PropTypes.array,//按钮数组
  onRequestClose:PropTypes.func.isRequired,//关闭弹窗
  shouldCloseOnOverlayClick:PropTypes.bool,//overlay点击关闭弹窗
  formType:PropTypes.oneOf([0,1,2]), //输入框类型，支持0（文本）默认1（密码）2（多行文本）
  value: PropTypes.string, //输入框初始时的值，默认空字符
  closeBtn:PropTypes.oneOf([1,2,false,0]),
  shade:PropTypes.oneOfType([PropTypes.string,PropTypes.number,PropTypes.array,PropTypes.bool]),
  move:PropTypes.string,//可拖动窗口的元素
  time: PropTypes.number,//自动关闭所需毫秒
  offset: PropTypes.oneOfType(PropTypes.string,PropTypes.array),//弹窗初始坐标
}

Dialog.defaultProps={
  type:"alert",
  area:['300px','auto'],
  formType:0,
  value:"",
  closeBtn:1,
  shade:'0.3',
  move:'.dialog__title',
  time:0,
  offset:'center'
}

export const DialogPlugin ={
  open:function (content,option,btn1,btn2) {
    if(typeof content!=='string'){
      btn2=btn1;
      btn1=option;
      option=content;
    }
    else option={...option,content:content};
    let divEl = document.createElement('div');
    // document.getElementsByTagName('body')[0].appendChild(divEl)
    let closeFn=function(){
      if(divEl)
        ReactDOM.unmountComponentAtNode(divEl)
      divEl=null;
    }
    let dialog = React.createElement(
        Dialog,
        {
          isOpen:true,
          onRequestClose:closeFn,
          btn1:btn1,
          btn2:btn2,
          ...option,
        }
    );
    ReactDOM.render(dialog,divEl)
    return closeFn;
  },
  alert:function (content,option,btn1,btn2) {
    return DialogPlugin.open(content,{...option,type:'alert'},btn1,btn2);
  },
  confirm:function (content,option,btn1,btn2) {
    return DialogPlugin.open(content,{...option,type:'confirm'},btn1,btn2);
  },
  prompt:function (content,option,btn1,btn2) {
    return DialogPlugin.open(content,{...option,type:'prompt'},btn1,btn2);
  },
  toast:function (content,option,btn1,btn2) {
    return DialogPlugin.open(content,{...option,type:'toast'},btn1,btn2);
  }
};