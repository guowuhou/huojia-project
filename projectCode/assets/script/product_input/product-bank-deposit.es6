const ejs = require('lib/ejs.js');
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
const prosynchro = require('plugins/bank-synchro.es6');
const dialogLib= require('plugins/product-select/product-to-lib.es6');
const dialogLib1= require('plugins/productes-select/product-to-lib.es6');
const TagSelector = require('plugins/tag-selector.es6');
const utils = require('utils');
require('lib/bootstrap-table.js');

class bankDepositClass extends uu.Component {
    properties() {
        return {
           
        };
    }
    onLoad() {
        this.rqoptions = { pageSize: 25, pageNo: 1 };
        this.bindEvents();
    }
    bindEvents() {
        $("#bank_deposit_add_tag").on("click", () => {
            this.onAddTag();
        });
        $("#add_bank_deposit_lib").on("click", () => {
            this.addOrRemove(1);
        });
        $("#remove_bank_deposit_lib").on("click", () => {
            this.addOrRemove(2);
        });
        $("#bank_desInteligent").on("click", () => {
            this.despoitInteligent();
        });
        $("#bank_deposit_search").on("click", () => {
            var channelId = $("#channelId").val();
            var prdType = $("#productType").val();
            var data = {
                channelId:channelId,
                type:"09"
            }
            this.getproshelflist(data);
        });
        
    }
    
    //根据筛选条件rqoptions查询产品列表
    getproshelflist(data) {
        this.queryTableParams = data;
        let listTable = [ 
                 {
                title: '',
                field: '',
                align: 'center',
                valign: 'middle',
                checkbox: true
                },{
                    field: 'isSelected',
                    title: '精选产品',
                    align: 'center',
                    formatter: (isSelected) => {
                        return (isSelected === '1') ? '精选' : '-'
                    }
                }, {
                    field: 'prdCode',
                    title: '产品代码',
                    align: 'center'
                }, {
                    field: 'prdName',
                    title: '产品名称',
                    align: 'center'
                }, 
                 {
                    field: 'minBuy',
                    title: '起存金额',
                    align: 'center'
                },{
                    field: 'saleStatus',
                    title: '上架状态',
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
                    },
                    align: 'center'
                },{
                    title: '<span style="padding:0px 47px">操作</span>',
                    align: 'center',
                    formatter:_.bind(this.functionEvents, this),
                     events:{
                    "click #addTagBtn":(e,value,row)=>{
                        let targetList=[];
                        targetList.push(row);
                        this.onAddTag(targetList);
                    },
                    "click #addToProductLibBtn":(e,value,row)=>{
                        if(row.productType=='1'){
                            Dialog.alert("转让类型不能配置到智能货架");
                        }else{
                            dialogLib.show({
                            channelId:$("#channelId").val(),
                            channelName:$("#channelId").find('option:selected').text(),
                            prdCodes: row.prdCode,
                            reallyPrdCode:row.prdCode,
                            prdTy:row.certDepositClass,
                            prdName:row.prdName,
                            prdType: "09"   
                        }); 
                        }
                       
                    }
                } 
                }
            ];
        $("#bank_depositTable").bootstrapTable('destroy');
        $('#bank_depositTable').bootstrapTable({
            url: httpreq.PS_queryFixedProductLibList,
            columns: listTable ,
            sortable: true,//是否启用排序
            sortOrder: "prdCode",//排序方式
            pagination: true,//是否显示分页
            pageSize: this.rqoptions.pageSize,//每页的记录行数
            queryParams: (params) => {//传递的参数
                return _.extend({}, this.rqoptions,data, {
                    pageSize: params.limit,//页面大小
                    pageNo: params.offset / params.limit + 1,
                });
            },
            responseHandler: (res) => {
                let resDate = {};
                if (res.code == "000000") {
                    this.reqFlag = false;
                    this.productInfoList = res.data.productInfoList;
                    _.extend(resDate, {
                        rows: res.data.productInfoList || [],
                        total: res.data.totalSize
                    });
                }else if(res.responseCode == '900106'||res.responseCode == '683310'){
                         Dialog.alert(res.msg || res.responseMsg);
                         window.top.location.href = "http://brop.pab.com.cn/portal/login.html";
                }else {
                        Dialog.alert(res.msg || res.responseMsg);
                        this.reqFlag = false;
                        this.productInfoList = res.data.productInfoList;
                        resDate = {};
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
    //操作功能事件
    functionEvents(value,row,index) {
        var libHtml="";
        if(row.saleStatus!="已下架"){
            libHtml='<li><a id="addToProductLibBtn">配置到智能货架</a></li>';
        }
        let insertHtml=`<li id="addTagBtn"><a>配置产品标签</a></li>
                       <li><a href="fixed-clown.html?prdCode=${row.prdCode}&type=04&seeFlag=1" target="_blank">查看产品信息</a></li>
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
    
    
    onAddTag(targetList) {
        var self = this,selectList=[],prdCodeList = "";
        selectList=targetList;
        if(_.isEmpty(targetList)){
            selectList = $("#bank_depositTable").bootstrapTable('getAllSelections');
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
                prdCodeList += i.prdCode + '|';
            });
            let prdArrList = prdCodeList.substring(0, prdCodeList.length - 1);
            let _data = {
                prdCodeList: prdArrList,
                labelId: tagData.tagCode,
                prdType: "09",
                LabelName:tagData.name,
                channelId:$("#channelId").val()
            };
            const url = httpreq.add_tag_to_product;
            utils.xhr.post(url, _data, (res) => {
                 Dialog.alert('添加成功');
                 this.getproshelflist(this.queryTableParams);
            });
        });
    }
    addOrRemove(flag) {
        var isSelectedTotal=0;
        let sel = $('#bank_depositTable').bootstrapTable('getSelections');
        if (sel && sel.length === 0) {
            Dialog.alert('请至少选择一个产品!');
            return
        }
        let prdList = '';
        _.each(sel, (item) => {
            prdList += '|' + item.prdCode + ":09";
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
            this.getproshelflist(this.queryTableParams);
        });
    }
    //添加智能货架
    despoitInteligent(){
        var self = this,selectedList,selectedCodeList='';
         selectedList = $("#bank_depositTable").bootstrapTable('getAllSelections');
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
             selectedCodeList+=selectedList[i].prdCode+(i+1<selectedList.length?',':'');
         }
        dialogLib1.show({
             channelName:$("#channelId").find('option:selected').text(),
                channelId:$("#channelId").val(),
                prdCodes:selectedCodeList,
                prdType: "09"   
        });
    }
   
    //返回查询产品列表的上送的参数
    getqryparamdatas() {
        return this.rqoptions || {};
    }
    //返回查询产品列表的的数据
    getqrydatas() {
        return this.productInfoList || [];
    }
    //格式化时间
    getshelfDate(time, format) {
        if (time > 0) {
            return moment(time).format(format);
        } else {
            return '';
        }
    }
};
module.exports = bankDepositClass;