const $ = require("lib/jquery.js");
const httpreq = require('httpreq.es6');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const moment = require('lib/moment.js');
const utils=require('utils');
require('lib/bootstrap-table.js');
require('lib/bootstrap.autocomplete.js');

class financialConsumption extends uu.Component {
    properties() {
        return {
            btnSearch: {
                defaultValue: null,
                type: uu.Dom
            },
            btnDel: {
                defaultValue: null,
                type: uu.Dom
            },
            table: {
                defaultValue: null,
                type: uu.Dom
            }
        }
    }

    onLoad() {
        window.$ = $;
        this.initSelect();
        this.tableParams = {
            typeNoOrName: '',
            vouchTypeEnable: $("#dassure").val(),
            salesChannels: $("#dept").val(),
            saleStatus: $("#status").val(),
            returnMethodEnable: $("#payType").val(),
        };
        this.initTable();
        this.bindEvent();
    }

    bindEvent() {
        const self = this;
        $("#name").autocomplete({
            source: function (query, process) {
                var matchCount = this.options.items;//返回结果集最大数量
                var data = {
                    "typenoOrName": query,
                    "matchCount": matchCount
                }
                utils.xhr.post(httpreq.fuzzySearch, data, function (res) {
                    return process(res.data.list);
                });
            },
            formatItem: function (item) {
                return item["prdCode"] + "-" + item["prdName"];
            },
            setValue: function (item) {
                return { 'data-value': item["prdCode"] + "-" + item["prdName"], 'real-value': item["prdCode"] + "-" + item["prdName"]};
            },
            
        })
        $(this.btnDel).on('click', () => {
            $("#name").attr("real-value", '');
            $("#name").val('');
            $("#dept").val("");
            $("#status").val("");
        });
        $(this.btnSearch).on('click', () => {
            var val = $("#name").val() ,data = $("#name").attr("real-value") , noOrName = '';
            if(data!=val) $("#name").attr("real-value",'');
            if(data == val){
                noOrName = data.split("-")[0]
            }else{
                noOrName = val
            }
            this.tableParams['typeNoOrName'] = noOrName;
            this.tableParams['salesChannels'] = $("#dept").val();
            this.tableParams['saleStatus'] = $("#status").val();
            $(this.table).bootstrapTable('refresh');
        });
        $(this.table).on('click', 'a[uuid]', function () {
            const a = $(this);
            const uuid = a.attr('uuid');
            const index = $(this).parent().attr("index");
            if(index=="0"){
                 location.href = `new-public-custom.html?prdCode=${uuid}&type=03&seeFlag=1`
            }else{
                location.href = `new-public-custom.html?prdCode=${uuid}&type=03`
            }
        });
    }

    initSelect() {
        this.findDept();
        this.findStatus();
    }

    findPayType() {
        utils.xhr.post(httpreq.getCodeLibrary,{codeNo:"MainReturnMethod"}, (res) => {
            var data = res.data.list || [];
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    $("#payType").append(`<option value=${data[i].itemNo}>${data[i].itemName}</option>`)
                }
            }
        });
    }

    findDassure() {
       utils.xhr.post(httpreq.getCodeLibrary,{codeNo:"VouchType"}, (res) => {
            var data = res.data.list || [];
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    $("#dassure").append(`<option value=${data[i].itemNo}>${data[i].itemName}</option>`)
                }
            }
        });
    }

    findDept() {
        utils.xhr.post(httpreq.PS_getDictionaryType,{ddType:36}, (res) => {
            var dep_data = res.data || [];
            this.deptData = dep_data;
            if (dep_data.length > 0) {
                for (let i = 0; i < dep_data.length; i++) {
                    $("#dept").append(`<option value=${dep_data[i].ddCode}>${dep_data[i].ddName}</option>`)
                }
            }
        });
    }

    findStatus() {
        var dep_data = [
            {code:"INIT",name:"初始"},
            {code:"NEW_SALE",name:"新产品上架"},
            {code:"WAIT_SALE",name:"待上架"},
            {code:"ON_SALE",name:"上架中"},
            {code:"OFF_SALE",name:"已下架"},
            {code:"FAIL_SALE",name:"上架失败"}
        ];
         for (let i = 0; i < dep_data.length; i++) {
            $("#status").append(`<option value=${dep_data[i].code}>${dep_data[i].name}</option>`)
        }
    }

    getStatus(value) {
        let map = {"INIT": "初始", "NEW_SALE": "新产品上架","WAIT_SALE": "待上架","ON_SALE": "上架中","OFF_SALE": "已下架","FAIL_SALE": "上架失败" };
        return map[value];
    }
    
    getChannels(value) {
        var self = this;
       if(value.length==0) return ;
       for(var i=0;i<value.length;i++){//去除数组中的空值
           if(value[i]==""||value[i].length==0){
               value.splice(i,1);
           }
       }
    var arr=[];
      _.each(value,function(item){
          arr.push(_.findWhere(self.deptData,{ddCode:item}).ddName)
      });
      return arr
    }

    initTable() {
        var self = this;
        $(this.table).bootstrapTable({
            url: httpreq.getConsumerFinances,
            sortable: true,
            sortOrder: "prdCode",
            pagination: true,
            uniqueId: 'prdCode',
            pageSize: 10,
            pageNo: 1,
            queryParams: (params) => {
                return _.extend({},this.tableParams, {
                    pageSize: params.limit,
                    pageNo: (params.offset / params.limit) + 1
                });
            },
            responseHandler: (res) => {
                if (res.code == "000000") {
                    this.showQryTable(res.data.totalSize, res.data.updateTime);
                    return {
                        rows: res.data.list,
                        total: res.data.totalSize
                    };
                }else if(res.responseCode=="683310"||res.responseCode=="900106"){
                    Dialog.alert(res.responseMsg||res.msg,()=>{
                        window.top.location.href="http://brop.pab.com.cn/portal/login.html";
                    });
                }
                else {
                    this.showQryTable(0, 0);
                    Dialog.alert(res.msg);
                    return {
                        rows: [],
                        total: 0
                    };
                }
            },
            columns: [
                {
                    title: '贷款品种代码',
                    field: 'prdCode',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    title: '贷款品种名称',
                    field: 'prdName',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    title: '接入渠道',
                    field: 'salesChannels',
                    align: 'center',
                    valign: 'middle',
                    formatter:function (value,row,index) {
                        return self.getChannels(value);
                    }
                },
                {
                    title: '上架状态',
                    field: 'saleStatus',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return self.getStatus(value);
                    }
                },
                {
                    title: '操作',
                    field: '',
                    align: 'center',
                    valign: 'middle',
                    "class": 'padding0',
                    formatter: function (value, row, index) {
                        var status = '';
                        if(row.saleStatus=='FAIL_SALE'||row.saleStatus=='OFF_SALE') {
                            status = "editPrd" ;
                        };
                        return `<div class="btn-group">
                                <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                   操作 <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu" role="menu">
                                   <li index='0'><a href="#" uuid="${row.prdCode}">查看产品信息</a></li>
                                   <li index='1' class= ${status}><a href="#" uuid="${row.prdCode}">编辑产品信息</a></li>
                                </ul>
                                </div>`
                    },
                }
            ]
        });
    }
    showQryTable(totalSize, updateTime) {
        $("#total").html("共有" + totalSize + "条记录");
       // $("#updateTable").html("数据更新于：" + updateTime);
    }

}

module.exports = financialConsumption;