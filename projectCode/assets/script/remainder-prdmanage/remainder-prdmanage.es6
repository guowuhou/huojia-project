const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const ejs = require('lib/ejs.js');
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
const Dialog = require('plugins/dialog.es6');
const urlMethod = require('utils/url.es6');
const addProductDialog=require("./addProduct.es6");
require('lib/bootstrap-table.js');
const utils = require('utils');

class prdmanageClass extends uu.Component {
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
      this.getPrdStatusList();
      this.queryChannel();//查询接入渠道
      this.queryBusCooperation();
    } 
    queryChannel() {
        var self = this;
        utils.xhr.post(httpreq.PS_QryAccChannelAuth, {}, (res) => {
            let channelList = res.data;
                for (let index = 0; index < channelList.length; index++) {
                    let element = channelList[index];
                    $(self.node.dom).find('#accessChannelCode').append(`<option value=${element.accessChannelCode}>${element.accessChannelName}</option>`);
                }
        });
    }
     //查询商户合作
    queryBusCooperation(){
        var self = this;
        utils.xhr.post(httpreq.QueryAccessMechantList, {}, (res) => {
             let BusCoopList = res.data;
                for (let index = 0; index < BusCoopList.length; index++) {
                    let element = BusCoopList[index];
                    $(self.node.dom).find('#accessMerchantCode').append(`<option value=${element.merchantCode}>${element.merchantName}</option>`);
                }
        });
    }
    //获取产品状态this.prdStatusData用于转译
    getPrdStatusList(){
        var self=this;
        utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:"16"},(res, event) => {
                self.prdStatusData = res.data || [];  
        });
    }
    start() {
      this.getAttachList();    
    }
    bindEvent(){
        $("#addProduct").on("click",(event)=>{
            this.addProductItem();
        });
        $("#cleanSearchItem").on("click",(event)=>{
            this.cleanSearchItem();
        });
        $("#prdManagerSearch").on("click",(event)=>{
            this.getPrdManagerList();
        })
    }
    //清空搜索条件
    cleanSearchItem(){
        $("#accessChannelCode").val("");
        $("#accessMerchantCode").val("");
    }
     getPrdManagerList(){
        let requireoptions = {};
        requireoptions['accessChannelCode']=$("#accessChannelCode").val();
        requireoptions['accessMerchantCode']=$("#accessMerchantCode").val();
        this.getAttachList(requireoptions);
    }
    //查询附件信息
    getAttachList(requireoptions) {
        var paramsData;
        if(requireoptions){
            paramsData=requireoptions;
        }else{
            paramsData={}
        }
        //清除表格
        $("#prdmanagetable").bootstrapTable('destroy');
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
                title: '商户合作',
                align: 'center',
                formatter:(value,row,index)=>{
                    var showContent;
                    if(value){
                        showContent=value.merchantCode+value.merchantName;
                    }else{
                        showContent='';
                    }
                   return showContent;
                }
            },{
                field: 'prdType',
                title: '产品类型',
                align: 'center',
                formatter: (value) => {
                    const prdTypeMap={
                        '01':"本行理财产品",
                        '02':"代销理财产品",
                        '04':"大额存单产品",
                        '06':"黄金定投产品",
                        '07':"黄金份额产品",
                        '09':"本行存款产品"
                    };
                    return prdTypeMap[value];
                }
            },{
                field: 'prdCode',
                title: '产品代码',
                align: 'center',
                formatter:(value,row,index)=>{
                   let html=`<a class="prdCodeId" href="new-public-custom.html?prdCode=${row.prdCode}&type=02&seeFlag=1"">${value}</a>`;
                   return html;
                }
            }, {
                field: 'prdShortName',
                title: '产品简称',
                align: 'center'
            }, {
                field: 'prdStatus',
                title: '产品状态',
                align: 'center',
                formatter: (value,row,index) => {
                    let proStatusobj = _.findWhere(this.prdStatusData, { ddCode: value });
                    return !proStatusobj ? value : proStatusobj.ddName;
                }
            }, {
                field: 'saleStatus',
                title: '上架状态',
                align: 'center',
                formatter: (value) => {
                    const saleStatusMap = {
                        "INIT": "初始",
                        "NEW_SALE": "新产品上架",
                        "WAIT_SALE": "待上架",
                        "ON_SALE": "上架中",
                        "OFF_SALE": "已下架",
                        "FAIL_SALE": "上架失败"
                    };
                    return saleStatusMap[value];
                }
            },{
                field: 'isDefault',
                title: '渠道默认',
                align: 'center',
                formatter: (value) => {
                    const saleStatusMap = {
                        "0": "",
                        "1": "默认"
                    };
                    return saleStatusMap[value];
                }
            },{
                field: '',
                title: '操作',
                align: 'center',
                formatter: function (value, row, index) {
                    if(row.isDefault=='1'){
                        return `<a class='del' id="cancelDefault" style='text-decoration:none;cursor: pointer' uuid="${row.prdCode}">取消默认</a>&nbsp&nbsp
                                <a class='del' id="editInfo" style='text-decoration:none;cursor: pointer' uuid="${row.prdCode}">编辑</a>`;
                    }else{
                        
                        return `<a class='del' id="setDefault" style='text-decoration:none;cursor: pointer' uuid="${row.prdCode}">设为默认</a>&nbsp&nbsp
                                <a class='del' id="editInfo" style='text-decoration:none;cursor: pointer' uuid="${row.prdCode}">编辑</a>
                        `;
                    }     
                },
                events: {
                        'click #editInfo': (e, value, row, index) => {
                            this.editRowInfoFun(row);
                        },
                        'click #setDefault': (e, value, row, index) => {
                            this.defaultFun(row);
                        },
                        'click #cancelDefault': (e, value, row, index) => {
                            this.defaultFun(row);
                        }
                        
                    },
            }
            // {
            //     title: '默认产品',
            //     field: 'isDefault',
            //     align: 'center',
            //     valign: 'middle',
            //     checkbox: true,
            //     formatter:(value,row,index)=>{
            //        if(value=='1'){
            //            return true
            //        }
            //     },
            //     // events: {//此方法不行，会导致单选失效，使用onCheck方法
            //     //     'click [name="btSelectItem"]': (e, value, row) => {
            //     //         var currentTarget=e.target;
            //     //         if(currentTarget.checked){
            //     //             alert("999")
            //     //         }
            //     //     },

            //     // },
            //     width:'150px'
            // }
            ];
        $('#prdmanagetable').bootstrapTable({
            url: httpreq.ListRemainingMoneyProduct,
            columns: columnList,
            singleSelect: true, //设置是否强制单选，默认false
            queryParams: paramsData,
            responseHandler: (res) => {
                let resDate = {};
                if (res.code == "000000"&&res.data) {
                    this.rowdata =res.data;
                    _.extend(resDate, {
                        rows: this.rowdata || []
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
            }
            // onCheck: (row) => {//选中某一行触发的事件
            //     var paramData={
            //         isDefault:"1",
            //         prdCode:row.prdCode
            //     };
            //     utils.xhr.post(httpreq.SaveRemainingMoneyProduct, paramData, (res) => {
            //         Dialog.alert("添加默认产品成功")
            //     });
            // },
            // onUncheck:(rows)=>{//单选框为被选中时触发的事件
            //     var paramData={
            //         isDefault:"0",
            //         prdCode:rows.prdCode
            //     };
            //     utils.xhr.post(httpreq.SaveRemainingMoneyProduct, paramData, (res) => {
            //         Dialog.alert("移除默认产品成功")
            //     });
            // }
        });
    }
    editRowInfoFun(row){
        var rowInfoHtml;
         var dialog2 = Dialog.show({
                    title: '编辑闲钱+产品',
                    nl2br: false,
                    cssClass: 'ts-dialog',
                    message: () => {
                        let productStatusobj = _.findWhere(this.prdStatusData, { ddCode: row.prdStatus });
                        var saleStatusMap = {
                            "ON_SALE": "上架中",
                            "WAIT_SALE": "待上架",
                            "OFF_SALE": "已下架",
                            "NEW_SALE": "新产品上架",
                            "FAIL_SALE": "上架失败",
                            "INIT": "初始",
                        };
                        rowInfoHtml = $(require('./addProduct.tpl'));
                        rowInfoHtml.find("#editShowInfo").show();
                        rowInfoHtml.find("#addInfo").hide();
                        rowInfoHtml.find("#editDetail").show();
                        rowInfoHtml.find("#detailInfo").css("display","none");
                        rowInfoHtml.find("#getbusinessCoop").html(row.accessMerchant.merchantName);
                        rowInfoHtml.find("#proCode").prop("disabled",true);
                        rowInfoHtml.find("#getChannel").html(row.accessChannel.accessChannelName);
                        rowInfoHtml.find("#proCode").val(row.prdCode);
                        rowInfoHtml.find("#prdShortName").text(row.prdShortName);
                        rowInfoHtml.find("#productType").text(productStatusobj.ddName);
                        rowInfoHtml.find("#onsaleType").text(saleStatusMap[row.saleStatus]);
                        rowInfoHtml.find("#prdName").val(row.productName);
                        rowInfoHtml.find("#prdUrl").val(row.protocolUrl);
                        return rowInfoHtml
                    },
                    buttons: [{
                        label: '确定',
                        cssClass: 'btn btn btn-primary',
                        action: () => {
                                utils.xhr.post(httpreq.SaveRemainingMoneyProduct, {
                                    productName:rowInfoHtml.find("#prdName").val(),
                                    protocolUrl:rowInfoHtml.find("#prdUrl").val(),
                                    id: row.id,
                                    prdCode:row.prdCode,
                                    prdType:'02'
                                }, (res) => {
                                    Dialog.alert('保存成功',function(){
                                        dialog2.close();
                                        window.location.reload();
                                    });
                                });
                        }
                    }]
                });
        
    }
    defaultFun(row){
           var dialog1 = Dialog.show({
                    title: '',
                    nl2br: false,
                    cssClass: 'ts-dialog',
                    message: () => {
                        if(row.isDefault=='1'){
                            return `<p>${'是否确定要取消现有产品的默认？'}</P> `;
                        }else{
                            return `<p>${'是否确定要替代现有产品，'}</P>
                                <p>${'成为'}${row.accessChannel.accessChannelName}${row.accessMerchant.merchantCode}${row.accessMerchant.merchantName}${'的默认产品？'}</P>
                           `;
                        }
                    },
                    buttons: [{
                        label: '确定',
                        cssClass: 'btn btn btn-primary',
                        action: () => {
                            if (row.isDefault=='1'){
                                utils.xhr.post(httpreq.SetRemainingMoneyProductDefault, {
                                    isDefault:'0',
                                    id: row.id
                                }, (res) => {
                                    Dialog.alert('取消默认产品成功');
                                    dialog1.close();
                                    window.location.reload();
                                });
                            }else{
                                utils.xhr.post(httpreq.SetRemainingMoneyProductDefault, {
                                    isDefault:'1',
                                    id: row.id
                                }, (res) => {
                                    Dialog.alert('添加默认产品成功');
                                    dialog1.close();
                                    window.location.reload();
                                });
                            }
                        }
                    }]
                });
    }
    addProductItem(row){
        var rowData;
        if(row){
            rowData=row;
        }else{
            rowData={};
        }
         var incomeChannel=$("#accessChannelCode option:selected").text();
         var self=this,url="";
         rowData.incomeChannel=incomeChannel;
        url=httpreq.SaveRemainingMoneyProduct;  //编辑
        addProductDialog.show(rowData,(data)=>{
            var params={
              prdCode:data.prdCode,
              protocolUrl:data.protocolUrl,
              productName:data.productName,
              accessMerchantCode:data.accessMerchantCode,
              prdType:'02',
              accessChannelCode:data.accessChannelCode
            //   isDefault:"0"
            };
            utils.xhr.post(url,params,(res)=>{
              self.getAttachList();
            });
        });
    }
};


module.exports = prdmanageClass;


