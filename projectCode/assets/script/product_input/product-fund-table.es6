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
class productInputProxy extends uu.Component {
    properties() {
        return {
            searchFundCondition: {
                defaultValue: null,
                type: uu.Node
            },
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
            }
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
        $('body').on('click', '#add_tag', () => {
            this.onAddTag();
        }).on('click', '#add_to_lib', () => {
            this.addOrRemove(1);
        }).on('click', '#remove_from_lib', () => {
            this.addOrRemove(2);
        });
        $("#proxyInteligent").on("click", () => {
            this.proxyInteligent();
        })
    }
    onAddTag(targetList) {
        var self = this,selectList=[],prdCodeList = "";
        selectList=targetList;
        if(_.isEmpty(targetList)){
            selectList = $("#table").bootstrapTable('getAllSelections');
            if(selectList.length <= 0) {
                Dialog.alert("请勾选要操作的产品");
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
                prdType: "02",
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
        let sel = $('#table').bootstrapTable('getSelections');
        if (sel && sel.length === 0) {
            Dialog.alert('请至少选择一个产品!');
            return
        }
        let prdList = '';
        _.each(sel, (item) => {
            prdList += '|' + item.prdCode + ":02";
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
    proxyInteligent(){
         var self = this,selectedList,selectedCodeList='';
         selectedList = $("#table").bootstrapTable('getAllSelections');
         if(selectedList.length <= 0) {
                Dialog.alert("请勾选要操作的产品");
                return;
         };
         if(selectedList.length >10){
              Dialog.alert("勾选操作的产品不能超过10条");
                return;
         };
         for(var i=0;i<selectedList.length;i++){
             //var codeList='';
             selectedCodeList+=selectedList[i].prdCode+(i+1<selectedList.length?",":"");
             //selectedCodeList.push(codeList)
         }
        dialogLib1.show({
                channelName:$("#channelId").find('option:selected').text(),
                channelId:$("#channelId").val(),
                prdCodes:selectedCodeList,
                prdType: "02"   //代销
        });
    };
    showTableList(query) {
        this.queryTableParams = query;
        $('#withTable').show();
        if (this.reqFlag) return;
        this.reqFlag = true;
        Array.prototype.indexOf = function(value){
            return _.indexOf(this,value);
        }
        $("#table").bootstrapTable('destroy');
        $('#table').bootstrapTable({
            url: httpreq.product_lib_fund,
            columns: [{
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
                    field: 'prdCode',
                    title: '产品代码',
                    align: 'center'
                }, {
                    field: 'prdName',
                    title: '产品名称',
                    align: 'center'
                }, {
                    field: 'totalQuota',
                    title: '总份额',
                    align: 'center',
                }, {
                    field: 'recNav',
                    title: '最新净值',
                    align: 'center'
                }, {
                    field: 'recThrMonFloat',
                    title: '最近三个月涨幅',
                    align: 'center'
                }, {
                    field: 'minBuy',
                    title: '购买起点（元）',
                    align: 'center'
                }, {
                    field: 'saleEndTime',
                    title: '募集截止日期时间',
                    align: 'center',
                    formatter: (time) => {
                        if (time > 0) {
                            return time.slice(0, 4) + "-" + time.slice(4, 6) + "-" + time.slice(6, 8);
                        } else {
                            return '';
                        }
                    }
                }, {
                    field: 'custType',
                    title: '客层分类',
                    align: 'center',
                    formatter: (labelCode) => {
                        const label = {
                            L0001: '大众',
                            L0002: '私行',
                            L0003: '财富',
                            L0004: '不区分',
                        }
                        if (labelCode) {
                            let rightArr = ['L0001','L0002','L0003','L0004'] ;
                            labelCode = labelCode.filter(function(item){
                                return rightArr.indexOf(item)>-1
                            })
                            let len = labelCode.length,
                                result = "";
                            for (let i = 0; i < len; i++) {
                                result += ',' + label[labelCode[i]];
                            }
                            return result.slice(1);
                        }
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
                }, {
                    field: 'labelName',
                    title: '标签/组合标签',
                    align: 'center'
                },{
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
                        dialogLib.show({
                            channelId:$("#channelId").val(),
                            channelName:$("#channelId").find('option:selected').text(),
                            prdCodes: row.prdCode,
                            prdName:row.prdName,
                            prdType: "02"   //代销理财
                        });
                    }
                }
            }],
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
                    this.productInfoList = (res.data && res.data.productInfoList) || [];
                    _.extend(resDate, {
                        rows: (res.data && res.data.productInfoList) || [],
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
        if(row.saleStatus=="NEW_SALE"||row.saleStatus=="WAIT_SALE"||row.saleStatus=="ON_SALE"){
            libHtml='<li><a id="addToProductLibBtn">配置到智能货架</a></li>';
        }
        let insertHtml=`<li id="addTagBtn"><a>配置产品标签</a></li>
                       <li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=02&seeFlag=1&outFlag=1" target="_blank">查看产品信息</a></li>
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
module.exports = productInputProxy