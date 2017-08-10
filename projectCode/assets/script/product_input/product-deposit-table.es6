const ejs = require('lib/ejs.js');
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const shelfup = require('plugins/shelf-up.es6');
const Dialog = require('plugins/dialog.es6');
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
const prosynchro = require('plugins/product-synchro.es6');
const TagSelector = require('plugins/tag-selector.es6');
const dialogLib= require('plugins/product-select/product-to-lib.es6');
const dialogLib1= require('plugins/productes-select/product-to-lib.es6');
const utils = require('utils');
require('lib/bootstrap-table.js');
require('lib/bootstrap-magicsuggest.js');

///hello///
class productInputDeposit extends uu.Component {
    properties() {
        return {
            addTagBtn: {
                defaultValue: null,
                type: uu.Dom
            },
            addToLibBtn: {
                defaultValue: null,
                type: uu.Dom
            },
            removeFromLibBtn: {
                defaultValue: null,
                type: uu.Dom
            },
            desInteligent:{
                defaultValue: null,
                type: uu.Dom
            },
        }
    }
    onLoad() {
        this.reqOptions = {
            pageSize: 10,
            pageNo: 1
        };
        this.bindEvents();
    }
    bindEvents() {
        $("#deposit_add_tag").on("click", () => {
            this.onAddTag();
        });
        $("#add_deposit_lib").on("click", () => {
            this.addOrRemove(1);
        });
        $("#remove_deposit_lib").on("click", () => {
            this.addOrRemove(2);
        });
        $("#desInteligent").on("click", () => {
            this.despoitInteligent();
        });
    }
    onAddTag(targetList) {
        var self = this,selectList=[],prdCodeList = "";
        selectList=targetList;
        if(_.isEmpty(targetList)){
            selectList = $("#depositTable").bootstrapTable('getAllSelections');
            if(selectList.length <= 0) {
                Dialog.alert("请勾选要操作的产品");
                return;
            };
            if(selectList.length >10) {
                Dialog.alert("勾选操作的产品不能超过10条");
                return;
            }
        }
        TagSelector.show({
            type: 'group',
            typechange: true,
            singleSelect: true,
            btnLable: '添加',
            isProduct: 0,
            canalsCode:$("#channelId").val()
        }, (list) => {
            if (list.length === 0) {
                Dialog.alert('您没有勾选标签!');
                return
            }
            var tagData = list[0];
            _.each(selectList, (i, index) => {
                prdCodeList += i.productId + '|';
            });
            let prdArrList = prdCodeList.substring(0, prdCodeList.length - 1);
            let _data = {
                prdCodeList: prdArrList,
                labelId: tagData.tagCode,
                prdType: "04",
                LabelName:tagData.name,
                channelId:$("#channelId").val()
            };
            const url = httpreq.add_tag_to_product;
            utils.xhr.post(url, _data, (res) => {
                 Dialog.alert('添加成功');
                 this.showTableList(this.queryTableParams);
            });
        });
    }
    addOrRemove(flag) {
        var isSelectedTotal=0;
        let sel = $('#depositTable').bootstrapTable('getSelections');
        if (sel && sel.length === 0) {
            Dialog.alert('请至少选择一个产品!');
            return
        }
        let prdList = '';
        _.each(sel, (item) => {
            prdList += '|' + item.productId + ":04";
            isSelectedTotal+=parseInt(item.isSelected);
        });
        prdList = prdList.slice(1);
        if(flag==1 && isSelectedTotal!=0 ){
            Dialog.alert("请勾选非精选的产品加入精选库");return;
        }
        if(flag==2 && isSelectedTotal!=sel.length ){
            Dialog.alert("请勾选精选的产品移除精选库");return;
        }

        
        const url = (flag === 1) ? httpreq.add_to_selected_lib : httpreq.remove_from_selected_lib;
        $.post(url, {
            prdArrList: prdList,
            channelId:$("#channelId").val()
        }, (res) => {
            //成功则刷新列表
            Dialog.alert('操作成功');
            this.showTableList(this.queryTableParams);
        });
    }
    //添加智能货架
    despoitInteligent(){
        var self = this,selectedList,selectedCodeList='';
         selectedList = $("#depositTable").bootstrapTable('getAllSelections');
        if(selectedList.length <= 0) {
                Dialog.alert("请勾选要操作的产品");
                return;
         };
         if(selectedList.selector){
             Dialog.alert("没有勾选要操作的产品");
                return;
         };
         if(selectedList.length >10){
              Dialog.alert("勾选操作的产品不能超过10条");
                return;
         };
         for(var i=0;i<selectedList.length;i++){
             if(selectedList[i].prdType=='1'){
                 Dialog.alert("转让类型状态下不能配置到智能货架")
                 return;
             }else{
                 //大额存单配置智能货架用的字段是prdCodeList，实际传的是productId;
             //selectedIdList+=selectedList[i].productId+(i+1<selectedList.length?',':'');
             selectedCodeList+=selectedList[i].productId+(i+1<selectedList.length?',':'');
             //selectedCodeList.push(codeList)
             }; 
         }
        dialogLib1.show({
             channelName:$("#channelId").find('option:selected').text(),
                channelId:$("#channelId").val(),
                prdCodes:selectedCodeList,
                prdType: "04"   //大额存单
        });
    }
    showTableList(query) {
        this.queryTableParams = query;
        this.queryTableParams.type = "04";
        $('#withTable').show();
        if (this.reqFlag) return;
        this.reqFlag = true;
        let TableList =[{
                title: '操作',
                checkbox: true,
                align: 'center'
                }, {
                    field: 'isSelected',
                    title: '精选产品',
                    align: 'center',
                    formatter: (isSelected) => {
                        return (isSelected === '1') ? '精选' : '-'
                    }
                },
                //  {
                //     field: 'certDepositClass',
                //     title: '产品种类',
                //     formatter: function (value) {
                //         const map={'0':'大额存单','1':'定活宝-大额存单'}
                //         return map[value]; 
                //     },
                //     align: 'center'
                // },
                {
                    field: 'productId',
                    title: '产品ID',
                    align: 'center'
                }, {
                    field: 'prdCode',
                    title: '产品Code',
                    align: 'center'
                }, {
                    field: 'prdName',
                    title: '产品名称',
                    align: 'center',
                }, {
                    field: 'saveDeadline',
                    title: '产品期限',
                    align: 'center',
                    formatter: function (saveDeadline, row, index) {
                        if(saveDeadline.charAt(saveDeadline.length-1)=='M'){
                            return `${saveDeadline.charAt(0)}个月`
                        }else if(saveDeadline.charAt(saveDeadline.length-1)=='Y'){
                            return `${saveDeadline.charAt(0)}年` //可能还有周
                        } 
                    },
                }, {
                    field: 'prdType',
                    title: '存款类型',
                    align: 'center',
                    formatter:function(value){
                        const map={'0':'发售','1':'转让' }
                        return map[value];   
                    },
                }, {
                    field: 'resellType',
                    title: '转让类型',
                    align: 'center',
                    formatter: function (value, row, index) {
                        const map = { '0': '指定转让', '1': '挂网转让'};
                        return map[value]
                    },
                },{
                    field: 'saleStatus',
                    title: '上架状态',
                    align: 'center',
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
                field: '',
                title: '操作',
                align: 'center',
                formatter:_.bind(this.functionEvents,this),
                events:{
                    "click #addTagBtn":(e,value,row)=>{
                        let targetList=[];
                        targetList.push(row);
                        this.onAddTag(targetList);
                    },
                    "click #addToProductLibBtn":(e,value,row)=>{
                        if(row.prdType=='1'){
                            Dialog.alert("转让类型不能配置到智能货架");
                        }else{
                            dialogLib.show({
                            channelId:$("#channelId").val(),
                            channelName:$("#channelId").find('option:selected').text(),
                            prdCodes: row.productId,//大额存存单prdCode参数实际传的是productId
                            reallyPrdCode:row.prdCode,
                            prdTy:row.certDepositClass,
                            prdName:row.prdName,
                            prdType: "04"   //代销理财
                        }); 
                        }
                       
                    }
                }
            }];
        let newTableList = [{
                title: '操作',
                checkbox: true,
                align: 'center'
                }, {
                    field: 'isSelected',
                    title: '精选产品',
                    align: 'center',
                    formatter: (isSelected) => {
                        return (isSelected === '1') ? '精选' : '-'
                    }
                }, {
                    field: 'certDepositClass',
                    title: '产品种类',
                    formatter: function (value) {
                        const map={'0':'大额存单','1':'定活宝-大额存单'}
                        return map[value]; 
                    },
                    align: 'center'
                },{
                    field: 'productId',
                    title: '产品ID',
                    align: 'center'
                }, {
                    field: 'prdCode',
                    title: '产品Code',
                    align: 'center'
                }, {
                    field: 'prdName',
                    title: '产品名称',
                    align: 'center',
                }, {
                    field: 'saveDeadline',
                    title: '产品期限',
                    align: 'center',
                    formatter: function (saveDeadline, row, index) {
                        if(saveDeadline.charAt(saveDeadline.length-1)=='M'){
                            return `${saveDeadline.charAt(0)}个月`
                        }else if(saveDeadline.charAt(saveDeadline.length-1)=='Y'){
                            return `${saveDeadline.charAt(0)}年` //可能还有周
                        } 
                    },
                }, {
                    field: 'prdType',
                    title: '存款类型',
                    align: 'center',
                    formatter:function(value){
                        const map={'0':'发售','1':'转让' }
                        return map[value];   
                    },
                },{
                    field: 'saleStatus',
                    title: '上架状态',
                    align: 'center',
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
                field: '',
                title: '操作',
                align: 'center',
                formatter:_.bind(this.functionEvents,this),
                events:{
                    "click #addTagBtn":(e,value,row)=>{
                        let targetList=[];
                        targetList.push(row);
                        this.onAddTag(targetList);
                    },
                    "click #addToProductLibBtn":(e,value,row)=>{
                        if(row.prdType=='1'){
                            Dialog.alert("转让类型不能配置到智能货架");
                        }else{
                            dialogLib.show({
                            channelId:$("#channelId").val(),
                            channelName:$("#channelId").find('option:selected').text(),
                            prdCode: row.productId,//大额存存单prdCode参数实际传的是productId
                            reallyPrdCode:row.prdCode,
                            prdTy:row.certDepositClass,
                            prdName:row.prdName,
                            prdType: "04"   //代销理财
                        }); 
                        }
                       
                    }
                }
            }];
        $("#depositTable").bootstrapTable('destroy');
        // query.certDepositClass=="1"?newTableList:TableList
        $('#depositTable').bootstrapTable({
            url: httpreq.GetShelfDepositList,
            columns: TableList,
            pagination: true,
            pageSize: this.reqOptions.pageSize,
            queryParams: (params) => {
                return _.extend({}, this.reqOptions, query, {
                    pageSize: params.limit,
                    pageNo: params.offset / params.limit + 1
                });
            },
            responseHandler: (res) => {
                this.reqFlag = false;
                let resDate = {};
                if (res.code == "000000") {
                    this.productInfoList = (res.data && res.data.list) || [];
                    _.extend(resDate, {
                        rows: (res.data && res.data.list) || [],
                        total: res.data.totalSize
                    });
                } else if(res.responseCode=="683310"||res.responseCode=="900106"){
                    Dialog.alert(res.responseMsg||res.msg,()=>{
                        window.top.location.href="http://brop.pab.com.cn/portal/login.html";
                    });
                }else {
                    Dialog.alert(res.msg || res.responseMsg);
                }
                return resDate;
            },
            formatNoMatches: () => {
                return '查无记录';
            },
            formatShowingRows: (pageFrom, pageTo, totalRows) => {
                return '展示' + pageFrom + ' 到 ' + pageTo + ' 条，共 ' + totalRows + ' 条记录';
            },
            formatRecordsPerPage: (pageNumber) => {
                return '每页 ' + pageNumber + ' 条';
            }
        });
    }
    //操作事件
    functionEvents(value,row,index) {
        var libHtml="";
        if(row.saleStatus!="OFF_SALE"&&row.prdType=="0"){
            libHtml='<li><a id="addToProductLibBtn">配置到智能货架</a></li>';
        }
        let insertHtml=`<li id="addTagBtn"><a>配置产品标签</a></li>
                       <li><a href="new-public-custom.html?productId=${row.productId}&prdCode=${row.prdCode}&type=04&seeFlag=1&outFlag=1" target="_blank">查看产品信息</a></li>
                      ${libHtml}`;
        let html= `<div class="btn-group">
                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" uuid="${row.prdCode}">
                        操作 <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-right" role="menu">
                            ${insertHtml}
                    </ul>
                    </div>`;
        return html;  
    } 
};
module.exports = productInputDeposit