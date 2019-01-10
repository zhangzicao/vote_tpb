/*eslint-disable*/
const http = require('http');
const qs = require('querystring');

function BrushVote({voteSite, voteNo, voteNum, voteSpeed, randomSpeed, voteUA, randomIP, complete, onVote, localTest, onLog}) {
  if(!voteNum||!voteNo||!voteSpeed) return;
  this.voteSite=voteSite;
  this.voteNo=voteNo;
  this.voteNum=voteNum;
  this.voteSpeed=voteSpeed;
  this.randomSpeed=randomSpeed;
  this.voteUA=voteUA;
  this.randomIP=randomIP;
  this.complete=complete;
  this.onVote=onVote;
  this.localTest=localTest;
  this.onLog=onLog;
  this.init();
}

//初始化
BrushVote.prototype.init=function () {
  this.useTime=this.voteSpeed*this.voteNum;
  this.chunkTimes=[];

  for (let i = 0; i < this.voteNum; i++) {
    this.chunkTimes[i]=this.voteSpeed*i*1000+ (
        i===0
        ||i===this.voteNum-1
        ||!this.randomSpeed
            ? 0
            : BrushVote.prototype.__random(-parseInt(this.voteSpeed*500),parseInt(this.voteSpeed*500)));
  }

  this.voteOptionName="";
  this.currTime=0;//当前第几次
  this.successTime=0;//成功次数
  this.errorTime=0;//失败次数
  this.abortedTime=0;//中断次数
  // this.exitTime=this.voteNum;//要终止的目标次数

  if(this.localTest){
    this.hostname="localhost"
    this.port="3000"
    this.path="/static/testVote.html"
  }else{
    let matchAr=this.voteSite.match(/(http:\/\/)?(https:\/\/)?([^\/\:]+)\:?(\d{2,4})?\/?([^\?\#]*)?(\?.*)?$/)||[];

    this.hostname=matchAr[3];
    this.port=matchAr[4]||"80";
    this.path="/"+(matchAr[5]||"").replace("/","");
  }

  this.voting=false;

  this.timer=null;//计时器
  this.reqCollection={};//req集合
  this.delayCollection={};//页面初次加载与获取验证码与投票之间的延时
  this.stateCollection={};//每次投票的状态合集
}

//随机数
BrushVote.prototype.__random=function(start,end) {
  let diff=end-start+1;
  let rs=parseInt(Math.random()*diff)+start;
  rs=rs>end?end:rs;
  return rs
}

//开始投票
BrushVote.prototype.start=function() {
  // let startTime=(new Date()).getTime();
  // this.startTime=startTime;

  let useTimeStr="";
  if(this.useTime<250){
    useTimeStr=this.useTime+"秒"
  }else if(this.useTime<7200){
    useTimeStr=parseInt(this.useTime*100/60)/100+"分钟"
  }else{
    useTimeStr=parseInt(this.useTime*100/3600)/100+"小时"
  }

  this.log("现在开始刷屏（时间："+(new Date()).toTimeString()+"）,用时"+useTimeStr+"，目标票数"+this.voteNum+"票")
  this.voting=true;
  this.loopVote();
}

//循环投票
BrushVote.prototype.loopVote=function() {
  this.currTime++;
  if(this.currTime!=this.chunkTimes.length){
    let diffTime=this.chunkTimes[this.currTime]-this.chunkTimes[this.currTime-1];
    this.log("下次刷票距离现在:"+diffTime/1000+"秒");
    this.nextTime=(new Date()).getTime()+diffTime;//记录下次刷票时间
    this.timer=setTimeout(()=>{
      this.loopVote();
    },diffTime)
    this.stateCollection[this.currTime+1]="pending";
  }

  this.stateCollection[this.currTime]="voting";
  let currTime = this.currTime;
  this.vote(currTime,(ct,state)=>{
    this.voteCallback(ct,state)
  });
}

//每次投票完成后回调
BrushVote.prototype.voteCallback= function(currTime,state) {
  if(state==='error'){
    this.errorTime++;
  }
  if(state==='aborted'){
    this.abortedTime++;
  }
  if(state==='success'){
    this.successTime++;
  }
  delete this.reqCollection[currTime];

  this.stateCollection[currTime]=state;
  this.log("第"+currTime+"次：已刷票"+this.currTime+"，成功"+this.successTime+"次，失败"+this.errorTime+"次，已中断"+this.abortedTime+"次，投票中"+(this.currTime-this.successTime-this.errorTime-this.abortedTime)+"次，剩余"+(this.voteNum-this.currTime)+"次")
  if(parseInt(this.voteNum)===this.successTime+this.errorTime+this.abortedTime){
    this.log("投票结束~")
    this.voting=false;
    let cpl=this.complete;
    let sct=this.successTime;
    let ert=this.errorTime;
    let abt=this.abortedTime;
    this.destroy();
    typeof cpl==='function' && cpl(sct,ert,abt);
  }
  this.onVote && this.onVote({
    state:state,
    voteNo:this.voteNo,
    voteOptionName:this.voteOptionName,
    voteSite:this.voteSite,
    localTest:this.localTest,
    completeDate:Date.now(),
  })
}

//投票信息错误导致的终止
BrushVote.prototype.errorExit=function(currTime,msg) {
  this.log(msg);
  this.voting=false;
  this.stateCollection[currTime-1]='error';
  this.log("投票参数错误，已终止~")
  let cpl=this.complete;
  let sct=this.successTime;
  let ert=this.errorTime;
  this.destroy();
  typeof cpl==='function' && cpl(sct,ert);
}

//投票
BrushVote.prototype.vote=function(currTime,callback) {
  let obj=this;
  let ua,ip;

  let headers={
    'User-Agent':this.voteUA==="auto"?BrushVote.prototype.getRandomUA():this.voteUA
  };

  if(this.randomIP){
    ip = BrushVote.prototype.__random(1 , 126)
        + "." + BrushVote.prototype.__random(1 , 254)
        + "." + BrushVote.prototype.__random(1 , 254)
        + "." + BrushVote.prototype.__random(1 , 254);
    headers['X-Forwarded-For']=ip
  }

  const req = http.request({
    hostname: this.hostname,
    port: this.port,
    path: this.path,
    method: 'GET',
    headers: headers
  });
  req.on('response',
      function (res) {
        res.setEncoding('utf8');
        let htmlStr="";
        let cookie="";
        let cks=res.headers["set-cookie"];
        if(cks && cks.length>0){
          cookie=cks[0]
        }
        res.on('data', function (chunk) {
          htmlStr+=chunk;
        });
        res.on('end', function () {
          if(req.aborted){
            obj.log('第'+currTime+'次：获取页面失败（暂停）: ');
            typeof callback ==='function' && callback(currTime,'aborted')
            return
          }
          let rs=htmlStr.match(/id=\"hiddenTimeStampEncodeString\"\svalue=\"([\d\w\,]+)\"/);
          let rs2=htmlStr.match(/id=\"__VIEWSTATE\"\svalue=\"(.+)\"/);
          let rs3=htmlStr.match(/id=\"__VIEWSTATEGENERATOR\"\svalue=\"(.+)\"/);
          let rs4=htmlStr.match(/id=\"content_rptTopicList_hiddenTopicID_0\"\svalue=\"(.+)\"/);
          let rs5=htmlStr.match(/id=\"ctl00\$content\$ucVerifyCode\$hiddenVerifyCodeModeInfo\"\svalue=\"(.+)\"/);
          let rs6=htmlStr.match(/doPostBack\(\&\#39\;(.+)\&\#39\;\,\&\#39\;(.+)\&\#39\;/);
          let rs7=htmlStr.match(/id=\"hiddenRefererUrl\"\svalue=\"(.+)\"/);
          let rs8=htmlStr.match(/id=\"hiddenLatitude\"\svalue=\"(.+)\"/);
          let rs9=htmlStr.match(/id=\"hiddenLongitude\"\svalue=\"(.+)\"/);
          let rs10=htmlStr.match(/id=\"hiddenGeoLocationEncode\"\svalue=\"(.+)\"/);
          let rs11=htmlStr.match(new RegExp('for\\=\\"option\\_(\\d+)\\"\\stitle\\=\\"('+obj.voteNo+'号.+\\")'));
          let voteOption=rs11&&rs11.length>0?rs11[1]:""
          obj.voteOptionName=rs11&&rs11.length>1?rs11[2]:""
          let viewstate=rs2&&rs2.length>0?rs2[1]:""
          let viewstategenerator=rs3&&rs3.length>0?rs3[1]:""
          let topicID=rs4&&rs4.length>0?rs4[1]:""
          let verifyCode=rs5&&rs5.length>0?rs5[1]:""
          let doPostTarget=rs6&&rs6.length>0?rs6[1]:""
          let doPostArg=rs6&&rs6.length>1?rs6[2]:""
          let refererUrl=rs7&&rs7.length>0?rs7[1]:""
          let latitude=rs8&&rs8.length>0?rs8[1]:""
          let longitude=rs9&&rs9.length>0?rs9[1]:""
          let geoLocationEncode=rs10&&rs10.length>0?rs10[1]:""
          if(!voteOption){
            obj.errorExit(currTime,'第'+currTime+'次：'+obj.voteNo+"号不存在")
            return
          }
          if(htmlStr.search("投票已过截止时间")>-1){
            obj.errorExit(currTime,'第'+currTime+'次：投票已过截止时间')
            return
          }
          if(rs&&rs.length>0){
            let hiddenTimeStampEncodeString=rs[1];

            let maxTime=obj.voteSpeed*1000/4;
            maxTime=maxTime>5000?5000:maxTime;

            obj.delayCollection[currTime]=setTimeout(()=>{
              delete obj.delayCollection[currTime];
              obj.getCode({currTime,voteOption,hiddenTimeStampEncodeString,viewstate,viewstategenerator,topicID,verifyCode,doPostTarget,doPostArg,refererUrl,latitude,longitude,geoLocationEncode,cookie,ua,ip,callback})
            },BrushVote.prototype.__random(maxTime/4,maxTime))
          }else{
            callback(currTime,'error')
          }
        });
      });
  req.on('error', function (e) {
    obj.log('第'+currTime+'次：获取页面'+(req.aborted?'暂停':'失败')+': ' + e);
    callback(currTime,req.aborted?'aborted':'error')
  });
  req.end();
  this.reqCollection[currTime]=req;
}

//获取验证码
BrushVote.prototype.getCode= function({currTime,voteOption,hiddenTimeStampEncodeString,viewstate,viewstategenerator,topicID,verifyCode,doPostTarget,doPostArg,refererUrl,latitude,longitude,geoLocationEncode,cookie,ua,ip,callback}) {
  let obj=this;

  let headers={
    'Accept': '*/*',
    'Connection': 'keep-alive',
    'Referer': this.voteSite,
    'X-Requested-With':'XMLHttpRequest',
    'Cookie':cookie,
    'User-Agent':this.voteUA==="auto"?BrushVote.prototype.getRandomUA():this.voteUA
  };
  if(this.randomIP){
    headers['X-Forwarded-For']=ip
  }

  const req = http.request({
    hostname: this.hostname,
    port:this.port,
    path: this.localTest?'/static/testGetCode.txt':'/Front/VerifyCodeImage/Vote8Click.ashx',
    method: 'GET' ,
    headers:headers
  });
  req.on("response", function (res) {
    res.setEncoding('utf8');
    let validateCode="";
    res.on('data', function (chunk) {
      validateCode+=chunk
    });
    res.on('end', function () {
      if(req.aborted){
        obj.log('第'+currTime+'次：获取验证码失败（暂停）: ');
        typeof callback ==='function' && callback(currTime,'aborted')
        return
      }
      let maxTime=obj.voteSpeed*1000/4;
      maxTime=maxTime>1200?1200:maxTime;

      obj.delayCollection[currTime]=setTimeout(()=>{
        delete obj.delayCollection[currTime];
        obj.voteHandle({currTime,voteOption,hiddenTimeStampEncodeString,viewstate,viewstategenerator,topicID,verifyCode,doPostTarget,doPostArg,refererUrl,latitude,longitude,geoLocationEncode,validateCode,cookie,ua,ip,callback})
      },BrushVote.prototype.__random(maxTime/4,maxTime))
    });
  });
  req.on('error', function (e) {
    obj.log('第'+currTime+'次：获取验证码'+(req.aborted?'暂停':'失败')+': ' + e);
    callback(currTime,req.aborted?'aborted':'error')
  });
  req.end();
  this.reqCollection[currTime]=req;
}

//投票操作
BrushVote.prototype.voteHandle=function ({currTime,voteOption,hiddenTimeStampEncodeString,viewstate,viewstategenerator,topicID,verifyCode,doPostTarget,doPostArg,refererUrl,latitude,longitude,geoLocationEncode,validateCode,cookie,ua,ip,callback}){
  let obj=this;
  let data = {
    "__EVENTTARGET": doPostTarget||"ctl00$content$lbtnVote",
    "__EVENTARGUMENT": doPostArg||"",
    "__VIEWSTATE": viewstate||"/wEPDwUKLTE2Njc5OTIyM2RkkCVjlmC5fqR6W7Squ3mV6bel6O4=",
    "__VIEWSTATEGENERATOR": viewstategenerator||"C9E13C34",
    "VoteOption_2876476": voteOption,
    "ctl00$content$rptTopicList$ctl00$hiddenTopicID": topicID,
    "hiddenVote8ClickValidateCode": validateCode||"",
    "ctl00$content$ucVerifyCode$hiddenVerifyCodeModeInfo": verifyCode||"8,c34ae9393dc18664f38ff73c956c2820",
    "ctl00$content$hiddenRefererUrl": refererUrl||"",
    "ctl00$content$hiddenTimeStampEncodeString": hiddenTimeStampEncodeString||"",
    "ctl00$content$hiddenLatitude": latitude||"",
    "ctl00$content$hiddenLongitude": longitude||"",
    "ctl00$content$hiddenGeoLocationEncode":geoLocationEncode||""
  };//这是需要提交的数据

  let headers={
    'Content-Type': 'application/x-www-form-urlencoded',
    'Upgrade-Insecure-Requests': '1',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Referer': this.voteSite,
    'Cookie':cookie,
    'User-Agent':this.voteUA==="auto"?BrushVote.prototype.getRandomUA():this.voteUA
  }

  if(this.randomIP){
    headers['X-Forwarded-For']=ip
  }

  let content = qs.stringify(data);
  const req = http.request({
    hostname: this.hostname,
    port:this.port,
    path: this.path,
    method: this.localTest?'GET':'POST',
    headers: headers
  });
  req.on("response", function (res) {
    res.setEncoding('utf8');
    let str=""
    res.on('data', function (chunk) {
      str+=chunk;
    });
    res.on('end', function () {
      if(req.aborted){
        obj.log('第'+currTime+'次：投票失败（暂停）: ');
        typeof callback === 'function' && callback(currTime, 'aborted')
        return
      }
      let sc=str.search("成功投票")>-1;
      obj.log('第'+currTime+'次：结果: 给'+obj.voteOptionName + (sc?"成功投票":"投票失败"));
      typeof callback=="function"&&callback(currTime, sc?'success':'error')
    });
  });
  req.on('error', function (e) {
    obj.log('第'+currTime+'次：投票'+(req.aborted?'暂停':'失败')+': ' + e);
    callback(currTime,req.aborted?'aborted':'error')
  });
  !this.localTest && req.write(content);
  req.end();
  this.reqCollection[currTime]=req;
}

//随机ua
BrushVote.prototype.getRandomUA=function() {
  let uas=['Mozilla/5.0 (Linux; Android 8.1; PAR-AL00 Build/HUAWEIPAR-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.3.1360(0x26070333) NetType/WIFI Language/zh_CN Process/tools','Mozilla/5.0 (Linux; Android 8.1; EML-AL00 Build/HUAWEIEML-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.143 Crosswalk/24.53.595.0 XWEB/358 MMWEBSDK/23 Mobile Safari/537.36 MicroMessenger/6.7.2.1340(0x2607023A) NetType/4G Language/zh_CN','Mozilla/5.0 (Linux; Android 8.0; DUK-AL20 Build/HUAWEIDUK-AL20; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044353 Mobile Safari/537.36 MicroMessenger/6.7.3.1360(0x26070333) NetType/WIFI Language/zh_CN Process/tools','Mozilla/5.0 (Linux; Android 8.0; MHA-AL00 Build/HUAWEIMHA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.3.1360(0x26070333) NetType/NON_NETWORK Language/zh_CN Process/tools','Mozilla/5.0 (Linux; Android 8.0; MHA-AL00 Build/HUAWEIMHA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.3.1360(0x26070333) NetType/4G Language/zh_CN Process/tools','Mozilla/5.0 (Linux; Android 5.1.1; vivo X6S A Build/LMY47V; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044207 Mobile Safari/537.36 MicroMessenger/6.7.3.1340(0x26070332) NetType/4G Language/zh_CN Process/tools','Mozilla/5.0 (Linux; Android 5.1.1; vivo X6S A Build/LMY47V; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044207 Mobile Safari/537.36 MicroMessenger/6.7.3.1340(0x26070332) NetType/4G Language/zh_CN Process/tools','Mozilla/5.0 (Linux; Android 7.0; Redmi Note 4X Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.3.1360(0x26070333) NetType/WIFI Language/zh_CN Process/tools','Mozilla/5.0 (Linux; Android 7.1.1; vivo X20A Build/NMF26X; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.2.1340(0x2607023A) NetType/WIFI Language/zh_CN','Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366 MicroMessenger/6.7.3(0x16070321) NetType/WIFI Language/zh_CN','Mozilla/5.0 (Linux; Android 8.1; PAR-AL00 Build/HUAWEIPAR-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.3.1360(0x26070333) NetType/4G Language/zh_CN Process/tools','Mozilla/5.0 (Linux; Android 8.0; FIG-AL10 Build/HUAWEIFIG-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.3.1360(0x26070333) NetType/4G Language/zh_CN Process/tools','Mozilla/5.0 (Linux; Android 6.0.1; KIW-AL10 Build/HONORKIW-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.6.7.1321(0x26060739) NetType/4G Language/zh_CN','Mozilla/5.0 (Linux; Android 8.1; BLA-AL00 Build/HUAWEIBLA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.2.1340(0x2607023A) NetType/WIFI Language/zh_CN','Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366 MicroMessenger/6.7.3(0x16070321) NetType/WIFI Language/zh_HK','Mozilla/5.0 (Linux; Android 7.0; KNT-AL20 Build/HUAWEIKNT-AL20; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.6.7.1321(0x26060739) NetType/4G Language/zh_CN','Mozilla/5.0 (iPhone; CPU iPhone OS 11_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15G77 wxwork/2.5.8 MicroMessenger/6.3.22 Language/zh','Mozilla/5.0 (Linux; Android 8.0; BKL-AL20 Build/HUAWEIBKL-AL20; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 wxwork/2.5.8 MicroMessenger/6.3.22 NetType/4G Language/zh','Mozilla/5.0 (iPhone; CPU iPhone OS 11_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15G77 wxwork/2.5.1 MicroMessenger/6.3.22 Language/zh','Mozilla/5.0 (iPhone; CPU iPhone OS 11_0_2 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Mobile/15A421 wxwork/2.5.8 MicroMessenger/6.3.22 Language/zh','Mozilla/5.0 (Linux; Android 7.1.1; OD105 Build/NMF26F; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044208 Mobile Safari/537.36 wxwork/2.4.9 MicroMessenger/6.3.22 NetType/4G Language/zh','Mozilla/5.0 (Linux; Android 8.0; VKY-AL00 Build/HUAWEIVKY-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 wxwork/2.5.8 MicroMessenger/6.3.22 NetType/WIFI Language/zh','Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366 wxwork/2.5.8 MicroMessenger/6.3.22 Language/zh','Mozilla/5.0 (Linux; Android 8.0; FIG-AL10 Build/HUAWEIFIG-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.2.1340(0x2607023A) NetType/4G Language/zh_CN','Mozilla/5.0 (Linux; Android 8.0; BLN-AL40 Build/HONORBLN-AL40; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044207 Mobile Safari/537.36 MicroMessenger/6.7.2.1340(0x2607023A) NetType/4G Language/zh_CN','Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Mobile/14D27 MicroMessenger/6.7.3(0x16070321) NetType/4G Language/zh_CN','Mozilla/5.0 (Linux; Android 8.0; VTR-AL00 Build/HUAWEIVTR-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.6.7.1321(0x26060739) NetType/WIFI Language/zh_CN','Mozilla/5.0 (Linux; Android 7.1.1; OPPO R11st Build/NMF26X; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.2.1340(0x2607023A) NetType/WIFI Language/zh_CN','Mozilla/5.0 (Linux; Android 7.1.1; vivo X20A Build/NMF26X; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.2.1340(0x2607023A) NetType/4G Language/zh_CN','Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92 MicroMessenger/6.7.3(0x16070321) NetType/4G Language/zh_HK','Mozilla/5.0 (Linux; Android 8.1; ALP-AL00 Build/HUAWEIALP-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.2.1340(0x26070264) NetType/4G Language/zh_CN','Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_1 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C153 MicroMessenger/6.7.3(0x16070321) NetType/4G Language/zh_CN','Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F79 MicroMessenger/6.7.2 NetType/4G Language/zh_TW','Mozilla/5.0 (iPhone; CPU iPhone OS 11_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15G77 MicroMessenger/6.7.2 NetType/WIFI Language/en','Mozilla/5.0 (Linux; Android 7.1.1; MI MAX 2 Build/NMF26F; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.2.1340(0x2607023A) NetType/WIFI Language/zh_CN','Mozilla/5.0 (Linux; Android 8.0; SM-G9500 Build/R16NW; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044208 Mobile Safari/537.36 MicroMessenger/6.7.2.1340(0x2607023A) NetType/WIFI Language/zh_CN','Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366 MicroMessenger/6.7.3(0x16070321) NetType/4G Language/zh_CN','Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A5366a MicroMessenger/6.7.2 NetType/WIFI Language/zh_CN','Mozilla/5.0 (iPhone; CPU iPhone OS 9_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13C75 MicroMessenger/6.7.1 NetType/4G Language/zh_CN','Mozilla/5.0 (Linux; Android 8.0; MI 6 Build/OPR1-wesley_iui-18.08.28; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044208 Mobile Safari/537.36 MicroMessenger/6.7.2.1340(0x2607023A) NetType/4G Language/zh_CN','Mozilla/5.0 (Linux; Android 8.1; MI 8 Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044208 Mobile Safari/537.36 MicroMessenger/6.7.2.1340(0x2607023A) NetType/4G Language/en','Mozilla/5.0 (iPhone; CPU iPhone OS 11_0_3 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Mobile/15A432 MicroMessenger/6.7.2 NetType/WIFI Language/zh_CN','Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Mobile/14D27 MicroMessenger/6.7.2 NetType/4G Language/zh_CN','Mozilla/5.0 (Linux; Android 8.1; Mi Note 3 Build/OPM1.171019.019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044208 Mobile Safari/537.36 MicroMessenger/6.7.2.1340(0x2607023A) NetType/4G Language/zh_CN','Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366 MicroMessenger/6.7.2 NetType/WIFI Language/zh_CN','Mozilla/5.0 (Linux; Android 7.0; MI 5s Plus Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/64.0.3282.137 Mobile Safari/537.36 MicroMessenger/6.7.2.1340(0x26070239) NetType/NON_NETWORK Language/zh_CN','Mozilla/5.0 (Linux; Android 6.0.1; NX531J Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044208 Mobile Safari/537.36 MicroMessenger/6.6.7.1321(0x26060736) NetType/4G Language/zh_CN','Mozilla/5.0 (Linux; Android 8.0; MI 6 Build/OPR1.170623.027; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044208 Mobile Safari/537.36 MicroMessenger/6.7.2.1340(0x2607023A) NetType/4G Language/zh_CN']
  let uaindex = BrushVote.prototype.__random(0,uas.length-1);
  return uas[uaindex];
}

//暂停
BrushVote.prototype.pause=function() {
  this.log("开始暂停");
  if(this.isPaused) return;

  clearTimeout(this.timer)

  Object.keys(this.reqCollection).forEach( (index) => {
    this.reqCollection[index].abort&&this.reqCollection[index].abort();
  });
  this.reqCollection={};

  Object.keys(this.delayCollection).forEach( (index) => {
    clearTimeout(this.delayCollection[index])
    this.voteCallback(index,'aborted')
  });
  this.delayCollection={};

  this.voting=false;
  this.isPaused=true;
  this.log("已暂停");
}
//继续
BrushVote.prototype.continue=function() {
  if(this.isPaused){
    this.isPaused=null;
    this.voting=true;

    let diff=this.nextTime-(new Date()).getTime()
    diff=diff<0?0:diff;
    this.timer=setTimeout(()=>{
      this.loopVote();
    },diff)
  }
  this.log("已继续");
}

//打印记录
BrushVote.prototype.log=function(a1) {
  if(typeof this.onLog==='function')
    this.onLog(a1)
  else
    console.log(a1)
}

//销毁
BrushVote.prototype.destroy=function() {
  this.log('已销毁')
  this.voting=false;
  // this.exitTime=this.currTime;
  clearTimeout(this.timer)

  Object.keys(this.reqCollection).forEach( (index) => {
    this.reqCollection[index].abort&&this.reqCollection[index].abort();
  });
  this.reqCollection={};

  Object.keys(this.delayCollection).forEach( (index) => {
    clearTimeout(this.delayCollection[index])
    this.voteCallback(index,'aborted')
  });
  this.delayCollection={};
}
module.exports = BrushVote;