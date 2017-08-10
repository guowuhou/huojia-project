const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const utils = require('utils');

/**
 * 用法:
 * const AddAttachDialog = require(此文件);
 * 
 * AddAttachDialog.show({
 *      附件信息
 *     
 * }, (data)=>{     //返回信息包括
 *      //TODO
 * });
 * //返回信息data如下：
 * var data = {
 *      attachName: $("#priority").val(),   //附件名称
        url: $("#applyLabel").val(), //url
        remark: $("#applyRemark").val() //备注
        
  };
 */

class AddAttachDialog {

  constructor() {

  }

  show(options = {}, callback = null) {
    var dafaultData = {
      operateType:0,       //操作类型 0：新增，1：修改
      btnLabel: "确定"
    };
    this.remarkHtml = $(require('./add-attach.tpl'));
    this.options = _.extend({}, dafaultData, options);
    this.callback = callback;
    this._getDictionaryType();
    this.showDialog();
  }
  initHtml() {
    this.remarkHtml.find("#attachName").val(this.options.attachName);
    this.remarkHtml.find("#url").val(this.options.url);
    this.remarkHtml.find("#remark").text(this.options.remark);
    this.showCheckbox("#operType", this.options.attachType);
  }
  _getDictionaryType(){
    var self=this;
    utils.xhr.post(httpreq.PS_getDictionaryType,{ddType:67},(res)=>{
        let list = res.data;
        _.each(list, (item) => {
          let itemhtml=`<label class="checkbox-inline m20" style="margin-left: 15px;"><input type="radio" name="operTypeRadio" 
                id="" value=${item.ddCode}>${item.ddName}</label>`;
          self.remarkHtml.find("#operType").append(itemhtml);
        });  
        if(self.options.operateType==1){
          self.initHtml();
        }
    });
  }
  showDialog() {
    const self = this;
    Dialog.show({
      title: '附件信息',
      nl2br: false,
      cssClass: 'ts-dialog',
      message: () => {
        return this.remarkHtml;
      },
      buttons: [{
        label: this.options.btnLabel,
        cssClass: 'btn-primary',
        action: (dialogRef) => {
          var attachType = $("#operType").find("input");
          var attachType = this.findCheckedValue(attachType);
          var inputData = {
            attachName: $("#attachName").val(),
            url: $("#url").val(),
            remark: $("#remark").val(),
            attachType:attachType
          };
          if(!(inputData.attachName && inputData.url&&inputData.attachType)){
             Dialog.alert("请输入必填项");return;
          }
          var data=_.extend({},self.options,inputData);
          this.callback && this.callback(data);
          dialogRef.close();
        }
      }]
    });
  }
  findCheckedValue(list) {
    let result = "";
    for (let i = 0; i < list.length; i++) {
      if (list[i].checked) {
        result += list[i].value + ',';
      }
    }
    result = result.substring(0, result.length - 1);
    return result;
  }
  showCheckbox(id, value) {
    if (value) {
      var list = value.split(','),
        targetId = "";
      for (let i = 0; i < list.length; i++) {
        targetId = id + ` input[value=${list[i]}]`;
        this.remarkHtml.find(targetId).prop("checked", true);
      }
    }
  }
};

module.exports = new AddAttachDialog();