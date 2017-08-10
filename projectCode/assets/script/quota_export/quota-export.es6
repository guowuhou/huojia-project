const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
const _ = require('lib/underscore.js');
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
const utils = require('utils');
require('lib/bootstrap-table.js');
class QuotaExport extends uu.Component {
    properties() {
        return {
            table: {
                defaultValue: null,
                type: uu.Dom,
            },
            btnSearch: {
                defaultValue: null,
                type: uu.Dom
            },
            sel_prd: {
                defaultValue: null,
                type: uu.Dom
            },
            sel_cha: {
                defaultValue: null,
                type: uu.Dom
            },
            btnAdd: {
                defaultValue: null,
                type: uu.Dom
            }
        };
    }
    // init
    onLoad() {
        this.rqoptions = { pageSize: 10, pageNum: 1 };  //默认的在那显示  显示多少条数据
        this.initTable(this.rqoptions);
        this.bindEvent();
    }
    //查询点击事件
    bindEvent() {
        let self = this;
        $(this.btnSearch).on('click', () => { // 查询
            this.searchBtn();
        });
        $(this.btnAdd).on('click', () => { //添加
            this.onAddDate();
        });
        $(this.table).on('click', 'a[uuid]', function () {
            //debugger
            const a = $(this);
            const uuid = a.attr("uuid");
            const row = $(self.table).bootstrapTable('getRowByUniqueId', uuid);    //根据uuid获取行数据  
            self.editTable(row);
        });
        $(this.table).on('click', '#togclasStop', function () {
            const a = $(this);
            const uuid = a.siblings().attr('uuid');
            const row = $(self.table).bootstrapTable('getRowByUniqueId', uuid);    //根据uuid获取行数据
            const dataState = row.dataState;
            if (dataState == '1') {
                let params = {
                    id: row.id,
                    dataState: 0
                };
                self.stopStar(params);
            } else if (dataState === '0') {
                let params = {
                    id: row.id,
                    dataState: 1
                };
                self.stopStar(params);
            }
        })
    }
    //点击是否停用
    stopStar(params) {
        utils.xhr.post(httpreq.QuotaUpdateLimitConfig, params, (res) => {
            $(this.table).bootstrapTable('refresh');
        }
        )
    }
    searchBtn() {
        let paramsObj = this.getInitTableParms();
        this.initTable(paramsObj);
    }
    //根据筛选条件查询产品列表
    initTable(rqoptions) {
        let self = this;
        for (let v in rqoptions) {
            self.rqoptions[v] = rqoptions[v];
        };
        if (this.reqFlag) return;
        this.reqFlag = true;
        //清除表格
        $(this.table).bootstrapTable('destroy');
        $(this.table).bootstrapTable({
            url: httpreq.QuotaList,
            columns: [
                {
                    title: '产品',
                    field: 'prdName',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '渠道',
                    field: 'channelName',
                    align: 'center', valign: 'middle',
                },
                {
                    title: '单个客户最大保有量上限(万元)',
                    field: 'singleHoldings',
                    align: 'center', valign: 'middle',
                    formatter: function (value, row, index) {
                        let singleHoldings = new Number(value);
                        return singleHoldings;
                    }
                },
                {
                    title: '渠道单日销量上限(亿元)',
                    field: 'channelDaySales',
                    align: 'center', valign: 'middle',
                    formatter: function (value, row, index) {
                        let channelDaySales = new Number(value);
                        return channelDaySales;
                    }
                },
                {
                    title: '渠道分配额度（亿元）',
                    field: 'channelVol',
                    align: 'center', valign: 'middle',
                    formatter: function (value, row, index) {
                        let channelVol = new Number(value);
                        return channelVol;
                    }
                },
                {
                    title: '更新时间',
                    field: 'dateUpdated',
                    align: 'center', valign: 'middle',
                    formatter: function (value, row, index) {
                        return moment(value).format("YYYY/\MM/\DD HH:mm")
                    }
                },
                {
                    title: '操作',
                    field: 'edit',
                    align: 'center', valign: 'middle',

                    formatter: function (value, row, index) {
                        if (row.dataState == '1') {
                            var dataState = '停用'
                        } else if (row.dataState == '0') {
                            var dataState = '启用'
                        };
                        return `<span> <a class='del' style='text-decoration:none;cursor: pointer'  uuid = '${row.id}' >修改 </a>
                                       <a id = 'togclasStop'  style='text-decoration:none;cursor: pointer' >${dataState}</a> 
                                </span> `;    //uuid值有待修改
                    }
                },
            ],
            uniqueId: 'id',
            pagination: true,             //是否显示分页
            sortable: true,             //是否启用排序
            sortName: 'dateUpdated',       //根据什么来排列      
            sortOrder: 'desc',             //排序方式           
            pageSize: this.rqoptions.pageSize,   //每页显示的条数
            //toolbar: '#toolbar',                //工具按钮用哪个容器
            queryParams: (params) => {
                let data = _.extend({}, rqoptions, {
                    pageSize: params.limit,
                    pageNum: params.offset / params.limit + 1, //当前页数
                });
                return data;
            },
            responseHandler: (res) => { //是将从夫去器段返回的数据 变成服务器端能够识别的数据
                let resDate = {};
                if (res.code == "000000") {
                    this.reqFlag = false;
                    this.showQryTimeOrRedCount(res.data.totalSize);
                    this.list = res.data.dataList;
                    _.extend(resDate, {
                        rows: res.data.dataList || [],
                        total: res.data.totalSize,
                    });
                }
                else {
                    if (res.responseCode == "683310" || res.responseCode == "900106") {
                        Dialog.alert(res.responseMsg || res.msg, () => {
                            window.top.location.href = "http://brop.pab.com.cn/portal/login.html";
                        });
                    } else {
                        Dialog.alert(res.msg || res.responseMsg);
                        this.showQryTimeOrRedCount(0);
                        this.reqFlag = false;
                        resDate = {};
                    }

                }
                return resDate;
            },
            formatNoMatches: () => {
                return '查无记录';
            },
            formatShowingRows: (pageFrom, pageTo, totalRows) => {
                return '展示' + pageFrom + ' 到 ' + pageTo + ' 条，共计 ' + totalRows + ' 条记录';
            },
            formatRecordsPerPage: (pageNumber) => {
                return '每页 ' + pageNumber + ' 条';
            }
        })
    }
    //新增产品选择
    addPrdSelect(romateHtml, prdCode) {
        utils.xhr.post(httpreq.Quotaprd, {},(res) => {
            var prd_data = res.data || [];
            romateHtml.find("#prdCode").html = '';
            if (prd_data.length > 0) {
                for (let i = 0; i < prd_data.length; i++) {
                    romateHtml.find("#prdCode").append(
                        `<option value=${prd_data[i].code}>${prd_data[i].name}</option>`);
                }
                if (typeof prdCode == "string") {
                    romateHtml.find("#prdCode").val(prdCode);
                }
            }
        }
        );
    }
    //新增渠道选择 
    addQuotaSelect(romateHtml, channelCode) {
        let self = this;
        utils.xhr.post(httpreq.Quotacha, {},(res) => {
            var cha_data = res.data || [];
            romateHtml.find("#channelCode").html = '';
            if (cha_data.length > 0) {
                for (let i = 0; i < cha_data.length; i++) {
                    romateHtml.find("#channelCode").append(
                        `<option value=${cha_data[i].code}>${cha_data[i].name}</option>`);
                }
                if (typeof channelCode == "string") {
                    romateHtml.find("#channelCode").val(channelCode);
                }
            }
        }
        );
    }
    // 新增产品配置 
    onAddDate() {
        var romateHtml = null;
        Dialog.show({
            title: '新增产品配置',
            nl2br: false,
            message: () => { // 
                romateHtml = $(require('tpl/quota-add.tpl'));
                this.addPrdSelect(romateHtml, '');
                this.addQuotaSelect(romateHtml, '');
                return romateHtml;
            },
            buttons: [{
                label: '提交',
                cssClass: 'btn-primary',
                action: (dialogRef) => {
                    let addListobj = {
                        singleHoldings: romateHtml.find('input[singleHoldings]').val(),
                        channelDaySales: romateHtml.find('input[channelDaySales]').val(),
                        channelVol: romateHtml.find('input[channelVol]').val(),
                    }

                    var addmsg = this._Validation(addListobj);
                    if (!addmsg) { return };
                    for (let key in addListobj) {
                        if (addListobj[key].toString().length > 15) {
                            Dialog.alert("你输入的数值长度过长");
                            return
                        }
                    };
                    if (addListobj.singleHoldings > 50000) {
                        Dialog.alert("你输入的数值大于客户最大保有量的最大限度");
                        return
                    } else if (addListobj.channelDaySales > 50) {
                        Dialog.alert("你输入的数值大于渠道单日销量上限的最大限度");
                        return
                    } else if (addListobj.channelVol > 50) {
                        Dialog.alert("你输入的数值大于渠道分配额度的最大限度");
                        return
                    };
                    var add_obj = {  //要传后台的数据
                        prdCode: romateHtml.find("#prdCode").val(),
                        prd: romateHtml.find("#prdCode  option:selected").text(),
                        channelCode: romateHtml.find("#channelCode ").val(),
                        channel: romateHtml.find("#channelCode  option:selected").text(),
                        singleHoldings: addListobj.singleHoldings,
                        channelDaySales: addListobj.channelDaySales,
                        channelVol: addListobj.channelVol,
                    };
                    this.insert(add_obj);
                    dialogRef.close();
                }
            }]
        });
    }
    //添加提交发送数据
    insert(params) {
        var self = this;
        utils.xhr.post(httpreq.QuotaInsertLimitConfig, params, function (res) {
            Dialog.alert("添加成功");
            $(self.table).bootstrapTable('refresh');
        });
    }
    //更新查询的记录条数
    showQryTimeOrRedCount(totalSize) {
        let total = parseInt(totalSize, 10);
        total = isNaN(total) ? 0 : total;
        $(this.node.dom).parent().find("#recordtext").text(`共有 ${total} 条记录`);
    }
    //修改产品配置
    editTable(row) {
        var self = this;
        let prd = row.prdName;
        let prdCode = row.prdCode;
        let channel = row.channelName;
        let channelCode = row.channelCode;
        var channelVol = row.channelVol;
        var channelDaySales = row.channelDaySales;
        var singleHoldings = row.singleHoldings;
        var id = row.id;
        var romateHtml = null;
        Dialog.show({
            title: '修改产品配置',
            nl2br: false,
            message: () => { //
                romateHtml = $(require('tpl/qutoa-edit.tpl'));
                self.addPrdSelect(romateHtml, prdCode);
                self.addQuotaSelect(romateHtml, channelCode);
                romateHtml.find("#channelVol").val(channelVol);
                romateHtml.find("#channelDaySales").val(channelDaySales);
                romateHtml.find('#singleHoldings').val(singleHoldings);
                return romateHtml;
            },
            buttons: [{
                label: '提交',
                cssClass: 'btn-primary',
                action: (dialogRef) => {
                    let EditListobj = {
                        singleHoldings: romateHtml.find('#singleHoldings').val(),
                        channelDaySales: romateHtml.find('#channelDaySales').val(),
                        channelVol: romateHtml.find('#channelVol').val(),
                    }
                    var addmsg = this._Validation(EditListobj);
                    if (!addmsg) { return };
                    for (let key in EditListobj) {
                        if (EditListobj[key].toString().length > 15) {
                            Dialog.alert("你输入的数值长度大于过长");
                            return
                        }
                    }
                    if (EditListobj.singleHoldings > 50000) {
                        Dialog.alert("你输入的数值大于客户最大保有量的最大限度");
                        return
                    } else if (EditListobj.channelDaySales > 50) {
                        Dialog.alert("你输入的数值大于渠道单日销量上限的最大限度");
                        return
                    } else if (EditListobj.channelVol > 50) {
                        Dialog.alert("你输入的数值大于渠道分配额度的最大限度");
                        return
                    }
                    var params = { //发送后台数据
                        id: id,
                        prdName: prd,
                        prdCode: prdCode,
                        channelName: channel,
                        channelCode: channelCode,
                        channelVol: EditListobj.channelVol,
                        channelDaySales: EditListobj.channelDaySales,
                        singleHoldings: EditListobj.singleHoldings,
                    }
                    //点击保存
                    this.doEditTag(params);
                    dialogRef.close();
                }
            }]
        });
    }
    doEditTag(params) {
        let url = httpreq.QuotaUpdateLimitConfig;
        var self = this;
        utils.xhr.post(url, params, (res) => {
            $(self.table).bootstrapTable('refresh');
        });
    }
    //验证数据信息
    _Validation(obj) {
        var reg = /^[0-9]\d*(\.\d+)?$/;
        let msglist = [];
        for (let key in obj) {
            obj[key] = /\s/.test(obj[key]) ? obj[key].replace(/\s/g, "") : obj[key];//去掉全部空格           
            let num = reg.test(obj[key]);
            msglist.push(num);
        }
        let hasfalse = $.inArray(false, msglist);  //返回的是有个下标
        if (hasfalse === -1) {
            return true;
        } else {
            Dialog.alert("请输入正确的数字");
            return false;

        }
    }
    getInitTableParms() {
        let tableParams = { prdCode: $(this.sel_prd).val(), channelCode: $(this.sel_cha).val() };
        return tableParams;
    }
};
module.exports = QuotaExport;