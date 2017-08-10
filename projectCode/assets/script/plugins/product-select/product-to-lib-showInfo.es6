const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const artTemplate = require("lib/artTemplate.js");
const EditRemark = require('plugins/edit-remark.es6');
const utils = require('utils');


class selectMenuClass{
  constructor() {
  } 
  show(options = {}, callback = null) {
    var dafaultData = {
      btnLabel: "确定",
      channelId:"",
      channelName:""
    };
    this.remarkHtml = $(require('./product-to-lib-showInfo.tpl'));
    this.options = _.extend({}, dafaultData, options);
    this.callback = callback;
    this.searchRecPro();
    this.showDialog();
  }
 showDialog() {
        const self = this;
        const dialogFlag=true;
        Dialog.show({
        title: '配置到智能货架',
        nl2br: false,
        cssClass: 'ts-dialog',
        message: () => {
            return this.remarkHtml;
        },
        buttons: [{
            label: this.options.btnLabel,
            cssClass: 'btn-primary',
            action: (dialogRef) => {
               self.addToRecommendedLib();
               dialogRef.close();
            }
        }]
        });
    }
     //添加推荐产品第一步
    addToRecommendedLib() {
        let options=this.options;
        let addQueryData = {
            prdCodes: options.prdCodes,
            index: '',
            distributionChannel: options.distributionChannel,
            pageCode: options.pageCode,
            region: options.pageRegion,
            prdType: options.prdType,
            channelId: options.channelId,
            regionsName:options.pageCodeName+'-->'+options.pageRegionName,
            reviewType: '1',
            productId:this.productInfo.productId   
        };
        if (this.options.prdType == '02') {
            addQueryData.prdArr = this.productInfo.extendData.prdArr;
            addQueryData.status = this.productInfo.extendData.status;
        }
        this.addToRecommendedLibSuccess(addQueryData);
    }
    //添加产品第二步
    addToRecommendedLibSuccess(queryData){
        //  var channelMapToBuss={
        //      "C0003":"003",  //产品货架—口袋
        //      "C0007":"004", //产品货架—千人千面
        //      "C0009":"005",  //口袋插件
        //      "C0010":"008",  //产品货架-厅堂
        //      "C0012":"009"  //产品货架-新口袋银行
        //  };
         EditRemark.show({
                 verifyType:"0006", //审批类型,必传；
                //  businessType:channelMapToBuss[queryData.channelId], //业务类型----传渠道
                 btnLabel: '提交审批' //设置按钮的文字,非必传，默认【提交审批】
             }, (data)=>{     //返回信息包括
                  var transData = {//转字段名字
                        reviewUser:data.applicant?data.applicant:'',//申请人
                        reviewType:data.verifyType,//审批类型
                        applyRemark:data.describe,//申请备注
                        priorityLevel:data.priorityLevel,//优先级
                        applyTit:data.reviewTaskName,//申请标题
                        // businessType:data.businessType//业务类型
                 };
                 var addData = _.extend({},transData,queryData);
                 this.addToRecommended(addData,2);
             });
    }
     //添加成功
    addToRecommended(data,addFlag){
          var self = this;
          let url = httpreq.PS_RecommendAddList;
          if(addFlag == 2){
             data.redStatus = 2;
          }
          utils.xhr.post(url, data, (response) => {
             Dialog.alert("添加成功");
        });
    }
    initHtml(){
        var response=this.productInfo;
        var data=response.data;
        var extendData=response.extendData;
        var prdListInfo=data.prdListInfo;
        var prdTypeMap={
            "01":"本行理财产品",
            "02":"代销理财产品",
            "03":"消费金融",
            "04":"大额存单",
            "09":"本行存款产品"
        };
        var saleStatusMap={
            "NEW_SALE":"新产品上架",
            "ON_SALE":"上架中",
            "WAIT_SALE":"待上架",
            "OFF_SALE":"已下架",
            "FAIL_SALE":"上架失败",
            "INIT":"初始"
        };
        var prdTyMap = {"0":"大额存单","1":"定活宝-大额存单"}
        if(this.options.prdType=="04"){
            this.remarkHtml.find("#no_des").show();
            this.remarkHtml.find("#prdCode").text(this.options.reallyPrdCode);
            this.remarkHtml.find("#prdTy").text(prdTyMap[this.options.prdTy]);
            
        }else{
            this.remarkHtml.find("#prdCode").text(this.options.prdCodes);
            this.remarkHtml.find("#no_des").hide();
        };
        this.remarkHtml.find("#prdName").text(this.options.prdName);
        this.remarkHtml.find("#prdType").text(prdTypeMap[this.options.prdType]);
        this.remarkHtml.find("#region").text(this.options.pageCodeName+'-'+this.options.pageRegionName);
        var renderData={};
        this.productInfoRender="";
        if(this.options.prdType=="01"){
            this.productInfoRender=artTemplate.compile(require('./fina-info.tpl'));
            renderData={
               saleStatus:saleStatusMap[data.saleStatus],
               totalQuota:prdListInfo.totalQuota,
               remainQuota:prdListInfo.remainQuota,
               planRate:prdListInfo.planRate,
               subMinAmt:data.subMinAmt,
               saleEndDate:prdListInfo.saleEndDate
            };
        }
        if(this.options.prdType=="02"){
            this.productInfoRender=artTemplate.compile(require('./fund-info.tpl'));
            renderData={
               saleStatus:saleStatusMap[data.saleStatus],
               status:extendData.status?this.prdStatusData[response.extendData.status]:"",
               prdArrName:extendData.prdArrName,
               planRate:prdListInfo.planRate,
               subMinAmt:data.subMinAmt,
               saleEndDate:prdListInfo.saleEndDate
            };
        }
        if(this.options.prdType=="04"){
            this.productInfoRender=artTemplate.compile(require('./deposit-info.tpl'));
            renderData={
               saleStatus:saleStatusMap[data.saleStatus],
               status:this._getPrdStatus(prdListInfo).statusName,
               ckType:prdListInfo.prdType?(prdListInfo.prdType=="0"?'发售':'转让'):"",
               resellType:prdListInfo.resellType?(prdListInfo.resellType=="0"?'指定':'挂网'):"",
               saveDeadline:this.getSaleDate(prdListInfo.saveDeadline),
               totalQuota:prdListInfo.totalQuota,
               remainQuota:prdListInfo.remainQuota,
               saleEndDate:this._formatDate(prdListInfo.saleEndDate)
            };
        }
        if(this.options.prdType=="09"){
            this.productInfoRender=artTemplate.compile(require('./fix-info.tpl'));
            renderData={
               saleStatus:saleStatusMap[data.saleStatus],
               ccy:data.ccy,
               minBuyAmt:data.prdListInfo.minBuyAmt,
               planRate:data.prdListInfo.planRate,
               saveDeadline:this.getSaleDate(data.saveDeadline) 
            };
        }
        var prodcutInfoHtml=this.productInfoRender(renderData);
        this.remarkHtml.append(prodcutInfoHtml);
        if(this.options.prdType=="04"&&prdListInfo.prdType=="1"){
            this.remarkHtml.find("#resellTypeDiv").show();
        }
        
    }
    getPrdStatusMap() {//产品状态转义
        var self = this;
        utils.xhr.post(httpreq.PS_GetDictionaryType, { 'ddType': 16 }, (response) => {
            let obj = {};
            for (let i = 0; i < response.data.length; i++) {
                let ele = response.data[i];
                obj[ele.ddCode] = ele.ddName;
            }
            self.prdStatusData = obj;
            self.initHtml();
        });
    }
    _getPrdStatus(data){
       const statusMap0={
           "01":"新建",
           "02":"删除",
           "03":"复核中",
           "04":"复核通过",
           "05":"募集中",
           "06":"募集结束",
           "07":"到期结清"
       };
       const statusMap1={
           "01":"转让中",
           "02":"已转让",
           "03":"已撤"
       };
       if(data.prdType=="0"){
           data.statusName=statusMap0[data.prdState];
       }
       else if(data.prdType=="1"){
           data.statusName=statusMap1[data.prdState];
       }
       else{
           data.statusName="";
       }
       return data;
    }
     //产品期限转义
    getSaleDate(val){
        if(!val){
            return "";
        }
        if(val.charAt(val.length-1)=='M'){
            return `${val.charAt(0)}个月`;
        }else if(val.charAt(val.length-1)=='Y'){
            return `${val.charAt(0)}年`; //可能还有周
        } 
    }
    _formatDate(val){
        if(!val){return "";}
        if(val.length==8){
            return val.substring(0,4)+"-"+val.substring(4,6)+"-"+val.substring(6,8);
        }else{
            return moment(val).format("YYYY-MM-DD");  
        }
    }
    searchRecPro() {
        var self = this,truePrdCode;
        if(this.options.prdType=="04"){
            truePrdCode=this.options.reallyPrdCode;
        }else{
            truePrdCode=this.options.prdCodes;
        }
        let url = httpreq.PS_SearchProduct;
        let params = {
            prdCode: truePrdCode,
            prdType: this.options.prdType,
            operateType: 'ADD',
            channelId:this.options.channelId
        };
        //调用搜索接口
        utils.xhr.post(url, params, (response) => {
            self.productInfo=response;    
            self.getPrdStatusMap();    
        },(response)=>{
             $("#otherInfo").empty();
             Dialog.alert(response.msg || response.responseMsg)
        });
    }

}

module.exports=new selectMenuClass();
