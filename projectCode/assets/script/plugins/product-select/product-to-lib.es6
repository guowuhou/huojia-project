const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const productInfoDialog = require("./product-to-lib-showInfo.es6");
const utils = require('utils');


class selectMenuClass{
  constructor() {

  }
  show(options = {}, callback = null) {
    var dafaultData = {
      btnLabel: "确定",
      channelId:"",
      channelName:"",
      prdCode: "",
      prdName:"",
      prdType: ""
    };
    this.remarkHtml = $(require('./product-to-lib.tpl'));
    this.options = _.extend({}, dafaultData, options);
    this.callback = callback;
    this.quryFenXiao();
    this.remarkHtml.find("#channelName").text(this.options.channelName);
    this.bindEvents();
    this.showDialog();
  }
  bindEvents(){
      var self=this;
      this.remarkHtml.find("#fXList").on("change",()=>{
          var merchantCode=self.remarkHtml.find("#fXList").val();
          var channelId=this.options.channelId;
          self.queryPage(channelId,merchantCode);
      });
      this.remarkHtml.find("#pageList").on("change",()=>{
          var pageCode=self.remarkHtml.find("#pageList").val();
          self.queryRegion(pageCode);
      });
  }
  
  //查商户合作
  quryFenXiao(){
      var self = this;
        utils.xhr.post(httpreq.QueryAccessMechantList, (response) => {
            let pageData = response.data;
            for (let index = 0; index < pageData.length; index++) {
                let element = pageData[index];
                if (element.merchantCode == 'C0003') {
                    self.remarkHtml.find('#fXList').append(`<option value=${element.merchantCode} selected>${element.merchantName}</option>`);
                } else {
                    self.remarkHtml.find('#fXList').append(`<option value=${element.merchantCode}>${element.merchantName}</option>`);
                }
            }
            var channelId=this.options.channelId;
            let merchantCode = self.remarkHtml.find('#fXList').val();
            self.queryPage(channelId,merchantCode);
    });
  }
  
  //查页面
   queryPage(parentCode,merchantCode) {
        var self = this;
        let data1 = {
            parentCode: parentCode,
            merchantCode:merchantCode
        };
        utils.xhr.post(httpreq.PS_QryPageModuleInfo, data1, (response) => {
            let pageData = response.data;
            self.remarkHtml.find('#pageList').html('');
            for (let index = 0; index < pageData.length; index++) {
                let element = pageData[index];
                if (element.pageModuleCode == 'C0003') {
                    self.remarkHtml.find('#pageList').append(`<option value=${element.pageModuleCode} selected>${element.pageModuleName}</option>`);
                } else {
                    self.remarkHtml.find('#pageList').append(`<option value=${element.pageModuleCode}>${element.pageModuleName}</option>`);
                }
            }
            let pageCode = self.remarkHtml.find('#pageList').val();
            self.queryRegion(pageCode);
        });
}
    //查区域
   queryRegion(parentCode) {
        var self = this;
        let data1 = {
            parentCode: parentCode
        };
        utils.xhr.post(httpreq.PS_QryPageRegionInfo, data1, (response) => {
            let pageRegionList = [];
            if (!response.data || response.data == '') {
                pageRegionList = [{ 'pageRegionCode': 'onlyOneRegion', 'pageRegionName': '' }];
            } else {
                pageRegionList = response.data;
            }
            self.remarkHtml.find('#pageRegionList').empty();
            for (let index = 0; index < pageRegionList.length; index++) {
                let element = pageRegionList[index];
                self.remarkHtml.find('#pageRegionList').append(`<option value=${element.pageRegionCode}>${element.pageRegionName}</option>`);
            }
        });
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
            var inputData = {
                merchantCode:$("#fXList").val(),
                pageRegionName: $("#pageRegionList").find('option:selected').text(),
                pageCodeName: $("#pageList").find('option:selected').text(),
                pageRegion: $("#pageRegionList").val(),
                pageCode: $("#pageList").val()
            };
            var data=_.extend({},self.options,inputData);
            productInfoDialog.show(data);
            dialogRef.close();
        }
    }]
    });
}

}

module.exports=new selectMenuClass();
