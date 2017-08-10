const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const ejs = require("lib/ejs.js");
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
const Dialog = require('plugins/dialog.es6');
const urlMethod = require('utils/url.es6');
require('lib/bootstrap-table.js');
const utils = require('utils');

class bussinessCoopClass extends uu.Component {
    properties() {
      return {
          seeFlagInfoAttach: {
              defaultValue: null,
              type: uu.Node
          }
      }
    }
    onLoad() {
      window.$ = $;
      this.bindEvent();
      this.getbussinessCoopList();
    }
    bindEvent(){
         $("#addMerchantCoop").on("click",(event)=>{
            this.addMerchantCoopFun();
        });
    }
    addMerchantCoopFun() {
        var mearchantHtml;
        const self = this;
        var dialogRef=Dialog.show({
            title: "添加商户合作",
            nl2br: false,
            cssClass: 'ts-dialog',
            message: () => {
                mearchantHtml=$(require('./addmerchantcoop.tpl'));;
                return mearchantHtml;
            },
            onshown: () => {
                this.getchannelList();//获取接入渠道
                this.getBusCoopList();//获取商户合作下拉框
                this.getColorList();//获取颜色模板下拉列表
            },
            buttons: [{
                label: "确认",
                cssClass: 'btn-primary',
                action: (resdata) => {
                    var requireoptions={};
                    let filter = $('#addDialog').find('[filter]');
                    for(let i = 0; i < filter.length; i++){
                        var element=filter[i];
                        requireoptions[$(element).attr('filter')]=$(element).val();
                    };
                    if((requireoptions['purseName']=="") || (requireoptions['protocolUrl']=="")){
                        Dialog.alert("请填写必填项");
                        return;
                    };
                    const url = httpreq.SaveRemainingMoneyMerchantCooperate;
                    utils.xhr.post(url, requireoptions, (res) => {
                        dialogRef.close();
                        window.location.reload();
                    });
                }
            }]
        });
    }
    getchannelList(){
        var self = this;
        utils.xhr.post(httpreq.PS_QryAccChannelAuth, {}, (res) => {
            let channelList = res.data;
                for (let index = 0; index < channelList.length; index++) {
                    let element = channelList[index];
                    $('#incomeChannel').append(`<option value=${element.accessChannelCode}>${element.accessChannelName}</option>`);
                }
        });
    }
    getBusCoopList(){
         var self = this;
        utils.xhr.post(httpreq.QueryAccessMechantList, {}, (res) => {
             let BusCoopList = res.data;
                for (let index = 0; index < BusCoopList.length; index++) {
                    let element = BusCoopList[index];
                    $('#businessCooper').append(`<option value=${element.merchantCode}>${element.merchantName}</option>`);
                }
        });
    }
    getColorList(){
         var self = this;
        utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:"78"}, (res) => {
             let colorTemList = res.data;
                for (let index = 0; index < colorTemList.length; index++) {
                    let element = colorTemList[index];
                    $('#colorTemplate').append(`<option value=${element.ddCode}>${element.ddName}</option>`);
                }
        });
    }
    //查询附件信息
    getbussinessCoopList() {
        var self=this;
        //清除表格
        $("#merchantcooptable").bootstrapTable('destroy');
        var columnList=[
              {
                field: 'accessChannel',
                title: '接入渠道',
                align: 'center',
                formatter:(value,row,index)=>{
                    var showAccessChannel;
                    if(value){
                        showAccessChannel=value.accessChannelName;
                    }else{
                        showAccessChannel='';
                    }
                   return showAccessChannel;
                }
            },{
                field: 'accessMerchant',
                title: '商户合作ID',
                align: 'center',
                formatter:(value,row,index)=>{
                    var showAccessMerchant;
                    if(value){
                        showAccessMerchant=value.merchantCode;
                    }else{
                        showAccessMerchant='';
                    }
                   return showAccessMerchant;
                }
            }, {
                field: 'accessMerchant',
                title: '商户合作名称',
                align: 'center',
                formatter:(value,row,index)=>{
                    var showAccessMerchant;
                    if(value){
                        showAccessMerchant=value.merchantName;
                    }else{
                        showAccessMerchant='';
                    }
                   return showAccessMerchant;
                }
            }, {
                field: 'purseName',
                title: '钱包名称',
                align: 'center'
            }, {
                field: 'colorTemplate',
                title: '颜色模板',
                align: 'center'
                // formatter: (value) => {
                //     const saleStatusMap = {
                //         "INIT": "初始",
                //         "NEW_SALE": "新产品上架",
                //         "WAIT_SALE": "待上架",
                //         "ON_SALE": "上架中",
                //         "OFF_SALE": "已下架",
                //         "FAIL_SALE": "上架失败"
                //     };
                //     return saleStatusMap[value];
                // }
            }, {
                title: '状态',
                field: 'status',
                align: 'center'
            },{
                field: '',
                title: '操作',
                align: 'center',
                formatter: function (value, row, index) {
                        return `  <a class='del' id="editInfor" href="remander-businessCoop-info.html?id=${row.id}" style='text-decoration:none;cursor: pointer'>编辑</a> `
                },
            }];
        $('#merchantcooptable').bootstrapTable({
            url: httpreq.QueryRemainingMoneyMerchantCooperate,
            columns: columnList,
            // singleSelect: true, //设置是否强制单选，默认false
            // pagination: true,//是否显示分页
            // pageSize: requireoptions.pageSize,//每页的记录行数
            queryParams: {},
            responseHandler: (res) => {
                let resDate = {};
                if (res.code == "000000"&&res.data) {
                    var rowdata =res.data;
                    _.extend(resDate, {
                        rows: rowdata || []
                    });
                } else if(res.responseCode=="683310"||res.responseCode=="900106"){
                    Dialog.alert(res.responseMsg||res.msg,()=>{
                        window.top.location.href="http://brop.pab.com.cn/portal/login.html";
                    });
                }else {
                    Dialog.alert(res.msg || res.responseMsg);
                    resDate = {};
                }
                return resDate;
            },
            formatNoMatches: () => {
                return '查无记录';
            },
        });
    }
};


module.exports = bussinessCoopClass;


