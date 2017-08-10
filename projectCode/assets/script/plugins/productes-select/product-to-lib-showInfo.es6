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
    this.showDialog();
    var num=this.options.prdCodes;
    var checkedNum=num.split(',');
    this.remarkHtml.find("#listNumber").html(checkedNum.length);
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
            prdCode: options.prdCode,
            index: '',
            distributionChannel: options.distributionChannel,
            pageCode: options.pageCode,
            region: options.pageRegion,
            prdType: options.prdType,
            channelId: options.channelId,
            regionsName:options.pageCodeName+'-->'+options.pageRegionName,
            reviewType: '1'
        };
        this.addToRecommendedLibSuccess(addQueryData);
    }
    //添加产品第二步
    addToRecommendedLibSuccess(queryData){
        //  var channelMapToBuss={
        //      "C0003":"003",  //产品货架—口袋
        //      "C0007":"004", //产品货架—千人千面
        //      "C0009":"005",  //产品货架-金管家
        //      "C0010":"008",   //产品货架-厅堂
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
                 var addData= _.extend({},transData,queryData,{prdCodes:this.options.prdCodes});
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
}

module.exports=new selectMenuClass();
