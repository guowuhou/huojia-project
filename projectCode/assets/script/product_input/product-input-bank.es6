const ejs = require('lib/ejs.js');
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const moment = require('lib/moment.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const TagSelector = require('plugins/tag-selector.es6');
const dialogLib1= require('plugins/productes-select/product-to-lib.es6');
const dialogLib= require('plugins/product-select/product-to-lib.es6');
const utils = require('utils');
require("lib/bootstrap-datetimepicker.js");
require('lib/bootstrap-table.js');
require('lib/bootstrap.autocomplete.js');

class productLibrary extends uu.Component {
    properties() {
        return {
            removePrd: {
                defaultValue: null,
                type: uu.Dom
            },
            addPrd: {
                defaultValue: null,
                type: uu.Dom
            },
            addIndexFlag: {
                defaultValue: null,
                type: uu.Dom
            },
            bankInteligent:{
                defaultValue: null,
                type: uu.Dom
            },
            searchBtn: {
                defaultValue: null,
                type: uu.Dom
            },
            clearQueryParam: {
                defaultValue: null,
                type: uu.Dom
            },
            prdFlagInput: {
                defaultValue: null,
                type: uu.Dom
            },
            searchFlagBtn: {
                defaultValue: null,
                type: uu.Dom
            }

        };

    }
    onLoad() {
        this.rqoptions = {
            pageSize: 20,
            pageNo: 1
        };
    }
    start() {
        window.$ = $;
        window._ = _;
        this.bindEvents();
        this.initDateTimePicker();
    }
    bindEvents() {
        var self = this;
        $(this.removePrd).on("click", () => {
            self._removeOrAddPrd(0);
        });
        $(this.addPrd).on("click", () => {
            self._removeOrAddPrd(1);
        });
        $(this.addIndexFlag).on("click", () => {
            self._addIndexFlag();
        });
        $(this.searchFlagBtn).on("click", () => {
            self._showPrdFlag();
        })
        $(this.searchBtn).on("click", () => {
            self._searchBtn();
        });
        $(this.clearQueryParam).on("click", () => {
            self._clearQueryParam();
        });
        $(this.bankInteligent).on("click", () => {
            self.Inteligent();
        });
      //  this._autoSearch();
    }
    _showPrdFlag() {
        TagSelector.show({
            type: "group",
            typechange: false,
            singleSelect: true
        }, (list) => {
            var tagNameString = "",
                tagData = "";
            _.each(list, (i) => {
                tagNameString += (i.name + ',');
                tagData += (i.tagCode + '|');
            });
            $(this.prdFlagInput).data("tagData", tagData.substring(0, tagData.length - 1));
            $(this.prdFlagInput).val(tagNameString.substring(0, tagNameString.length - 1));
        });
    }
    _searchBtn() {
        let selectList = $(".mybank li select");
        let idList = _.map(selectList, function (i, index) {
            return {
                id: $(i).attr("id")
            }
        });
        let valueList = _.map(selectList, function (i, index) {
            return {
                value: $(i).val()
            }
        });
        let paramObj = {};
        for (let i = 0; i < idList.length; i++) {
            paramObj[idList[i].id] = valueList[i].value;
        }
        paramObj.type = "01"; //产品类型    01：理财  02：基金  
        paramObj.expirateDate = $("#expirateDate").val().replace(/-/g, '');
        paramObj.keyWord = $("#keyWord").val();
        paramObj.prdSerial = $(this.prdFlagInput).data("tagData");
        paramObj.prdCode = $("#prdCode",this.node.dom).val();
        paramObj.channelId = $("#channelId").val();
        this.getProductlist(paramObj);
    }

    _clearQueryParam() {
        let selectList = $(".mybank li select");
        let valueList = _.each(selectList, function (i, index) {
            $(i).val("ALL");
        });
        $("#expirateDate",this.node.dom).val("");
        $("#keyWord",this.node.dom).val("");
        $(this.prdFlagInput).val("").removeData();
        $("#prdCode",this.node.dom).val("");
    }
    _removeOrAddPrd(flag) {
        let url = flag == 1 ? httpreq.AddToProductLib : httpreq.RemoveFromProductLib;
        let list = $("#productContainer").bootstrapTable('getAllSelections'),
            prdArrList = "",
            self = this;
        if (list.length <= 0) {
            Dialog.alert("请勾选要操作的产品");
            return;
        }
        var isSelectedTotal=0;
        _.each(list, (i, index) => {
            prdArrList += i.prdCode + ':' + i.prdType + '|'; //':01|';
            isSelectedTotal+=parseInt(i.isSelected);
        });
        if(flag==1 && isSelectedTotal!=0 ){
            Dialog.alert("请勾选非精选的产品加入精选库");return;
        }
        if(flag==0 && isSelectedTotal!=list.length ){
            Dialog.alert("请勾选精选的产品移除精选库");return;
        }
        else{
            prdArrList = prdArrList.substring(0, prdArrList.length - 1);
            utils.xhr.post(url, {
                prdArrList: prdArrList,
                channelId:$("#channelId").val()
            }, (res) => {
                if (flag == 1) {
                    Dialog.alert("添加精选成功");
                } else {
                    Dialog.alert("移除精选成功");
                }
                self.getProductlist(self.lastQueryParams);
            });
        }
    }
    //添加标签
    _addIndexFlag(targetList) {
        var self = this,selectList=[],prdCodeList = "";
        selectList=targetList;
        if(_.isEmpty(targetList)){
            selectList = $("#productContainer").bootstrapTable('getAllSelections');
            if(selectList.length <= 0) {
                Dialog.alert("请勾选要操作的产品");
                return;
            }
        }
        TagSelector.show({
            type: "group",
            singleSelect: true,
            isProduct: 0,
            canalsCode:$("#channelId").val()
        }, (list) => {
            if (list.length === 0) {
                Dialog.alert('您没有勾选标签!');
                return;
            }
            var tagData = list[0];
            _.each(selectList, (i, index) => {
                prdCodeList += i.prdCode + '|';
            });
            prdCodeList = prdCodeList.substring(0, prdCodeList.length - 1);

            let data = {
                prdCodeList: prdCodeList,
                labelId: tagData.tagCode,
                prdType: "01",
                LabelName:tagData.name,
                channelId:$("#channelId").val()
            };

            utils.xhr.post(httpreq.editSelectedProduct, data, (res) => {
                Dialog.alert("标签添加成功");
                self.getProductlist(self.lastQueryParams);
            });
        });
    }
    //配置智能货架
    Inteligent(){
         var self = this,selectedList,selectedCodeList='';
         selectedList = $("#productContainer").bootstrapTable('getAllSelections');
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
             //var codeList='';
             selectedCodeList+=selectedList[i].prdCode+(i+1<selectedList.length?',':'');
             //selectedCodeList.push(codeList)
         }
         if(selectedList){
             dialogLib1.show({
                channelName:$("#channelId").find('option:selected').text(),
                channelId:$("#channelId").val(),
                prdCodes:selectedCodeList,
                prdType: "01"   //本行理财
            }); 
         }else{
            dialogLib.show({
                channelName:$("#channelId").find('option:selected').text(),
                channelId:$("#channelId").val(),
                prdCodes: row.prdCode,
                prdName: row.prdName,
                prdType: "01"   //本行理财
            }); 
         }
    }
    initDateTimePicker() {
        let curDateTime = moment(new Date());
        $('#up_datetime').datetimepicker({
            format: "yyyy-mm-dd",
            language: 'zhcn',
            todayBtn: true,
            autoclose: true,
            todayHighlight: true,
            startDate: curDateTime.toDate(),
            forceParse: false,
            pickerPosition: "bottom-left",
            startView: 2,
            minView: 2, //时间精确到某个单位，2表示天
            maxView: 'decade'
        });
    }
    getProductlist(rqoptions) {
        for (let v in rqoptions) {
            this.rqoptions[v] = rqoptions[v];
        }
        //防重复提交
        if (this.reqFlag) return;
        this.reqFlag = true;
        Array.prototype.indexOf = function(value){
            return _.indexOf(this,value);
        }
        //清除表格
        $("#productContainer").bootstrapTable('destroy');

        $('#productContainer').bootstrapTable({
            url: httpreq.queryFinaProductLibList,
            columns: [{
                title: '',
                field: '_isChecked',
                align: 'center',
                valign: 'middle',
                checkbox: true
            }, {
                field: 'isSelected',
                title: '精选产品',
                align: 'center',
                formatter: (value) => {
                    return parseInt(value) == 1 ? "精选" : "----";
                }
            }, {
                field: 'prdCode',
                title: '产品代码',
                align: 'center'
            }, {
                field: 'prdName',
                title: '产品名',
                align: 'center'
            }, {
                field: 'totalQuota',
                title: '总额度（剩余额度）',
                align: 'center',
                formatter: (value, row) => {
                    return row.totalQuota + '(' + row.remainQuota + ')';
                }
            }, {
                field: 'yearIncome',
                title: '收益率',
                align: 'center',
                formatter: (value) => {
                    return value + "%";
                }
            }, {
                field: 'minBuy',
                title: '购买起点',
                align: 'center'
            }, {
                field: 'saleEndTime',
                title: '销售截止日期',
                align: 'center'
            }, {
                field: 'custType',
                title: '客层分类',
                align: 'center',
                formatter: (value) => {
                    const customMap = {
                        "L0001": "大众",
                        "L0002": "私行",  
                        "L0003": "财富",
                        "L0004": "不区分"
                    };
                   if (value) {
                        let rightArr = ['L0001','L0002','L0003','L0004'] ;
                        value = value.filter(function(item){
                            return rightArr.indexOf(item)>-1
                        })
                        let len = value.length,
                            result = "";
                        for (let i = 0; i < len; i++) {
                            result += ',' + customMap[value[i]];
                        }
                        return result.slice(1);
                    }
                }
            },{
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
                        this._addIndexFlag(targetList);
                    },
                    "click #addToProductLibBtn":(e,value,row)=>{
                        dialogLib.show({
                            channelId:$("#channelId").val(),
                            channelName:$("#channelId").find('option:selected').text(),
                            prdCodes: row.prdCode,
                            prdName:row.prdName,
                            prdType: "01"   //本行理财
                        });
                    }
                }
            }],
            pagination: true,
            pageSize: this.rqoptions.pageSize,
            queryParams: (params) => {
                let queryParams = _.extend({}, this.rqoptions, {
                    pageSize: params.limit,
                    pageNo: params.offset / params.limit + 1
                });
                this.lastQueryParams = queryParams || {};
                return queryParams;
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
                }else if(res.code=="683310"||res.code=="900106"){
                     Dialog.alert("登录超时，请重新登录！",()=>{
                         window.top.location.href="http://brop.pab.com.cn/portal/login.html";
                     });
                }
                 else {
                    Dialog.alert(res.msg || res.responseMsg);
                    this.reqFlag = false;
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
    functionEvents(value,row,index) {
        var libHtml="";
        if(row.saleStatus=="NEW_SALE"||row.saleStatus=="WAIT_SALE"||row.saleStatus=="ON_SALE"||row.saleStatus=="OFF_SALE"){
            libHtml='<li><a id="addToProductLibBtn">配置到智能货架</a></li>';
        }
        let insertHtml=`<li id="addTagBtn"><a>配置产品标签</a></li>
                        <li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=01&seeFlag=1&outFlag=1" target="_blank">查看产品信息</a></li>
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
    _autoSearch(){
        $(this.node.dom).find("#prdCode").autocomplete({
           source:function(query,process){
                var matchCount = this.options.items;//返回结果集最大数量
                 var data ={
                   "prdCode":query,
                   "matchCount":matchCount,
                    operateType:'financialDetail',
                }
                 $.get(httpreq.PS_CodeblurSel, data, function (res) {
                     if (res.code == '000000') {
                         return process(res.data.selectedLibList);
                     } else {
                         if (res.responseCode == '900106') {
                             Dialog.alert(res.msg || res.responseMsg);
                             window.top.location.href = "http://bcoms.paic.com.cn/bcoms";
                             return;
                         } else {
                             Dialog.alert(res.msg || res.responseMsg);
                         }
                     }
                 });
            },
            formatItem:function(item){
                return item["prdCode"]+item["prdName"];
            },
            setValue:function(item){
                return {'data-value':item["prdCode"]+item["prdName"],'real-value':item["prdCode"]};
            },
            // $("#goBtn").click(function(){ //获取文本框的实际值         var regionCode = $("#autocompleteInput").attr("real-value") || "";         alert(regionCode);     });//获取要上传的参数 

      })
    }
};


module.exports = productLibrary;





