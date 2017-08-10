const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
require('lib/bootstrap.autocomplete.js');
const utils = require('utils');
require('lib/bootstrap-table.js');
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
  bindEvent(){
    var self=this;
    $("#proSearchBtn").on("click",function(){
        let url = httpreq.PS_SearchProduct;
        let params = {
            prdCode: $('#proCode').val(),
            prdType: $('#proType').val(),
            operateType:"ADD"
        };
         if(!params.prdCode){
             Dialog.alert("请输入产品代码");
             return;
          }
        utils.xhr.post(url, params, (response) => {
          if (response.code == "000000") {
            let res = response.extendData;
            if (res != undefined && res != '') {
              let prdStatusList = _.findWhere(self.prdStatusData, { ddCode: res.status });
              let salsStatusShow = res.saleStatus;
              var saleStatusMap = {
                "ON_SALE": "上架中",
                "WAIT_SALE": "待上架",
                "OFF_SALE": "已下架",
                "NEW_SALE": "新产品上架",
                "FAIL_SALE": "上架失败",
                "INIT": "初始",
              };
              $("#detailInfo").empty().append(`
                      <div class="form-group">
                        <label class="col-sm-3 control-label">产品简称:</label>
                        <div class="col-sm-8" style="line-height:34px;">
                        ${res.prdName||""}
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="col-sm-3 control-label">产品状态:</label>
                        <div class="col-sm-8" style="line-height:34px;">
                         ${prdStatusList.ddName||""}
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="col-sm-3 control-label">上架状态:</label>
                        <div class="col-sm-8" style="line-height:34px;">
                         ${saleStatusMap[salsStatusShow]||""}
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="col-sm-3 control-label">产品名字:</label>
                        <div class="col-sm-8" style="line-height:34px;">
                           <input type="text" placeholder="请输入" id="productName" style="width:300px;">
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="col-sm-3 control-label">服务协议地址:</label>
                        <div class="col-sm-8" style="line-height:34px;">
                          <input type="text" placeholder="请输入" id="protocolUrl" style="width:300px;">
                        </div>  
                      </div>
                    
                    `);
            } else {
              $("#detailInfo").empty();
              Dialog.alert(response.msg);
            }
          }
        })
    })
  }
  show(options = {}, callback = null) {
    var dafaultData = {
      businessType: "001",   //默认是理财
      btnLabel: "确认"
    };
    this.remarkHtml = $(require('./addProduct.tpl'));
    this.options = _.extend({}, dafaultData, options);
    this.callback = callback;
    this.showDialog(options);
    this.getPrdStatus();
  }
  getPrdStatus() { //产品状态转义
    var self = this;
     utils.xhr.post(httpreq.PS_GetDictionaryType, {'ddType': 16}, (res) => {
             self.prdStatusData=res.data||'';
     });
  }
  //模糊搜索
  getSearch() {
      $("#proCode").autocomplete({
          source: function (query, process) {
              var matchCount = this.options.items; //返回结果集最大数量
              var data = {
                  prdCode: query,
                  operateType: "channelProductInfo",
                  matchCount: matchCount,
                  prdType: $('#proType').val()
              };
              utils.xhr.post(httpreq.PS_codeblurSel, data, function (response) {
                  return process(response.data.selectedLibList);
              });
          },
          formatItem: function (item) {
              return item["prdCode"] + item["prdName"];
          },
          setValue: function (item) {
              return {
                  'data-value': item["prdCode"],
                  'real-value': item["prdName"]
              };
          }
      })
  }
  getBusCoopList(){
     var self = this;
        utils.xhr.post(httpreq.QueryAccessMechantList, {}, (res) => {
             let BusCoopList = res.data;
                for (let index = 0; index < BusCoopList.length; index++) {
                    let element = BusCoopList[index];
                    $('#businessCoop').append(`<option value=${element.merchantCode}>${element.merchantName}</option>`);
                }
        });
  }
  getqueryChannel() {
        var self = this;
        utils.xhr.post(httpreq.PS_QryAccChannelAuth, {}, (res) => {
            let channelList = res.data;
                for (let index = 0; index < channelList.length; index++) {
                    let element = channelList[index];
                    $('#insertChannel').append(`<option value=${element.accessChannelCode}>${element.accessChannelName}</option>`);
                }
        });
    }
  showDialog(parmData) {
    const self = this;
    Dialog.show({
      title:"挑选闲钱+产品",
      nl2br: false,
      cssClass: 'ts-dialog',
      message: () => {
        return this.remarkHtml;
      },
      onshown: () => {
                this.bindEvent();
                this.getSearch();
                this.getBusCoopList();//获取商户合作下拉框
                this.getqueryChannel();//获取接入渠道
            },
      buttons: [{
        label: this.options.btnLabel,
        cssClass: 'btn-primary',
        action: (dialogRef) => {
          var noContent = $("#detailInfo").html(); 
          if(noContent==""){
             Dialog.alert("请先搜索产品");
             return;
          }
          var Inputdata = {
            prdCode:$('#proCode').val(),
            protocolUrl:$('#protocolUrl').val(),
            productName:$('#productName').val(),
            accessMerchantCode:$('#businessCoop').val(),
            accessChannelCode:$('#insertChannel').val()
          };
          this.callback && this.callback(Inputdata);
          dialogRef.close();
        }
      }]
    });
  }
};

module.exports = new addLevelProfitDialog();