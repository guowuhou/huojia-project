const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const utils = require('utils');

/**
 * 用法:
 * const EditRemark = require(此文件);
 * 
 * EditRemark.show({
 *      verifyType:""    //审批类型,必传      ADD ："0001" EDIT ： "0002" QUERY ： "0003" DEL ： "0004" OFFSALE ： "0005";
 *      businessType:""  //业务类型，必传     001：理财；002：基金；003：智能货架   
 *      btnLabel: '提交审批' //设置按钮的文字,非必传，默认【提交审批】
 * }, (data)=>{     //返回信息包括
 *      //TODO
 * });
 * //返回信息data如下：
 * var data = {
 *      applicant		申请人
        verifyType		审核类型
        businessType		业务类型
        applicant		    优先级
        reviewTaskName		申请标题
        describe	 	申请备注  
  };
 */


class EditRemark {

  constructor() {

  }

  show(options = {}, callback = null) {
    var dafaultData = {
      verifyType: "0001",  //默认是新增
      businessType:"001",   //默认是理财
      btnLabel: "提交审批"
    };
    this.remarkHtml = $(require('./edit-remark.tpl'));
    this.options = _.extend({}, dafaultData, options);
    this.callback = callback;
    this.initHtml();
    this.showDialog();
  }
  initHtml() {
    var self=this;
    var verifyTypeMap={
        "0001":"新增",
        "0002":"编辑",
        "0003":"查询",
        "0004":"删除",
        "0005":"下架",
        "0006":"配置智能货架"
    };
    const businessTypeMap = {
        '001': '产品工厂-本行理财产品',
        '002': '产品工厂-代销理财产品',
        '003': '产品货架—口袋',
        '004': '产品货架—千人千面',
        '005': '口袋插件',
        '006': '产品工厂-消费金融产品',
        '007': '产品工厂-大额存单产品',
        '008': '产品货架-厅堂',
        '009': '产品货架-新口袋银行',
        '010': '黄金定投',
        '011': '黄金份额产品',
        '012': '本行存款产品',
    };
    self.remarkHtml.find("#businessType").text(businessTypeMap[this.options.businessType]);
    self.remarkHtml.find("#verifyType").text(verifyTypeMap[this.options.verifyType]);
    utils.xhr.post(httpreq.getVerifyType,{},(res)=>{
        var data=res.data;
        self.applicant=data.applicant;
        self.remarkHtml.find("#applicant").text(data.applicant);
    });
     utils.xhr.post(httpreq.PS_getDictionaryType, {ddType:49}, (res) => {
         let list = res.data,
          selectHtml = "";
        _.each(list, (item) => {
          selectHtml += `<option value=${item.ddCode}>${item.ddName}</option>`;
        });
        self.remarkHtml.find("#priorityLevel").html(selectHtml);
    });
  }
  showDialog() {
    const self = this;
    Dialog.show({
      title: '请补充审批备注',
      nl2br: false,
      cssClass: 'ts-dialog',
      message: () => {
        return this.remarkHtml;
      },
      buttons: [{
        label: this.options.btnLabel,
        cssClass: 'btn-primary',
        action: (dialogRef) => {
          var applyName=$("#reviewTaskName").val();
          if(utils.string.trim(applyName)==''){
            Dialog.alert("申请标题不能为空")
            return;
          };
          //申请人为必须
          var showapplyman=self.remarkHtml.find("#applicant").text();
          if(showapplyman==''||!self.applicant){
            Dialog.alert("申请人不能为空")
            return;
          };
          var Inputdata = {
            priorityLevel: $("#priorityLevel").val(),
            reviewTaskName: $("#reviewTaskName").val(),
            describe: $("#describe").val(),
            verifyType:self.options.verifyType,  
            businessType:self.options.businessType,
            applicant:self.applicant
          };
          this.callback && this.callback(Inputdata);
          dialogRef.close();
        }
      }]
    });
  }
};

module.exports = new EditRemark();