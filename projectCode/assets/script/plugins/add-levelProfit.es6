const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const utils = require('utils');

/**
 * 用法:
 * const addLevelProfitDialog = require(此文件);
 * 
 * addLevelProfitDialog.show({
 *      businessType:""  //业务类型，必传     001：理财；002：基金；003：智能货架   
 *      btnLabel: '提交审批' //设置按钮的文字,非必传，默认【提交审批】
 * }, (data)=>{     //返回信息包括
 *      //TODO
 * });
 * //返回信息data如下：
 * var data = {
 *      order  顺序
        proFitnName 收益名称
        targetRange 指标范围
        proceeds  收益值
  };
 */


class addLevelProfitDialog {

  constructor() {

  }

  show(options = {}, callback = null) {
    var dafaultData = {
      businessType:"001",   //默认是理财
      btnLabel: "保存"
    };
    this.remarkHtml = $(require('./add-levelProfit.tpl'));
    this.options = _.extend({}, dafaultData, options);
    this.callback = callback;
    this.initHtml();
    this.showDialog();
  }
  initHtml() {
    this.remarkHtml.find("#sequence").val(this.options.order||'');
    this.remarkHtml.find("#profitName").val(this.options.proFitnName||'');
    this.remarkHtml.find("#targetrange").val(this.options.targetRange||'');
    this.remarkHtml.find("#targetval").val(this.options.proceeds||'');
  }
  showDialog() {
    var showTitle;
    if(this.options.operateType=='0'){
        showTitle="添加档位"
    }else{
        showTitle="编辑档位"
    };  
    const self = this;
    Dialog.show({
      title:showTitle,
      nl2br: false,
      cssClass: 'ts-dialog',
      message: () => {
        return this.remarkHtml;
      },
      buttons: [{
        label: this.options.btnLabel,
        cssClass: 'btn-primary',
        action: (dialogRef) => {
          var Inputdata = {
            order: $("#sequence").val(),
            proFitnName: $("#profitName").val(),
            targetRange: $("#targetrange").val(),
            proceeds: $("#targetval").val(),
          };
          if(!(Inputdata.order && Inputdata.proFitnName && Inputdata.targetRange && Inputdata.proceeds)){
             Dialog.alert("请输入必填项");
             return;
          }
          this.callback && this.callback(Inputdata);
          dialogRef.close();
        }
      }]
    });
  }
};

module.exports = new addLevelProfitDialog();