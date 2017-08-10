const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
const artTemplate = require("lib/artTemplate.js");
const _ = require('lib/underscore.js');
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
const urlMethod = require('utils/url.es6');
const utils = require('utils');
require('lib/bootstrap-table.js');
class deoartEdit extends uu.Component {
    properties() {
        return {
            Edittable: {
                defaultValue: null,
                type: uu.Dom,
            },
            daperID: {
                defaultValue: null,
                type: uu.Dom,
            },
            daperName: {
                defaultValue: null,
                type: uu.Dom,
            },
            remearks: {
                defaultValue: null,
                type: uu.Dom,
            },
        }
    }
    onLoad() {
        this.getProductInfoData();
        //console.log(this._data);
        this.getDataList();
        this.bindEvent();
        this.channelTable();
    }

    bindEvent() {
        $('#submit').on('click', (res) => {
            let editParms = this.initParms()
            this.saveSubmit(editParms);
        });
        $('#back').on('click', (e) => {
            this.backUrl()
        })
    }
    //获取信息
    initParms() {
        let parms = {
            deptNo: this._data.deptNo,
            deptName: this._data.deptName,
            remark: $(this.remearks).val(),
            status: $('input[name="status"]:checked').val(),
            deptAuth: this.getTableParms(),
            deptChannel:this.getChannelList(),
        }
        let paramremark = parms.remark.trim();
        let paramdeptAuth = parms.deptAuth;
        if (paramremark.length > 250) {
            alert('您输入的备注字符过长，请重新输入');
            return;
        }
        if (paramdeptAuth.length === 0) {
            let romateHtml = null
            let Dialog1 = Dialog.show({
                title: '提示',
                nl2br: false,
                message: () => {
                    romateHtml = '请选择部门权限';
                    return romateHtml;
                },
                buttons: [{
                    label: '知道了',
                    cssClass: 'btn-primary',
                    action: (dialogRef) => {
                        Dialog1.close();
                        return;
                    }
                }]
            })

        }

        return parms;
    }
    getParms() {
        let parms1 = {
            deptNo: this._data.deptNo,
            deptName: this._data.deptName,
            remark: $(this.remearks).val(),
            status: $('input[name="status"]:checked').val(),
        }
        return parms1;
    }
    //获取一、二级菜单参数
    getTableParms() {
        //debugger;
        let self = this,
            checkedList = [],
            changeList = [];
        $(this.Edittable).bootstrapTable("expandAllRows")
        let subTableList = $('table[subTable]');
        $.each(subTableList, (index, value) => {
            let listDta = $(subTableList[index]).bootstrapTable('getAllSelections');
            $.each(listDta, (index, item) => {
                checkedList.push(item);
            })
        });
        $.each(checkedList, (index, item) => {
            changeList.push(item.id);
        });
        $(this.Edittable).bootstrapTable("collapseAllRows")
        var newDataList = changeList.join(',')
        return newDataList
    }
    //产品信息
    getProductInfoData() {
        this._data = JSON.parse(localStorage.getItem('row'));
        this.dataDispose(this._data);
    }
    //初始化状态
    dataDispose(data) {
        // 用户状态
        $(this.daperID).text(data.deptNo);
        $(this.daperName).text(data.deptName);
        $(this.remearks).text(data.remark);
        $('#editStatus').find('input').first().attr('checked', 'checked');
    }
    //绑定下拉选择事件
    getDataList() {
        var self = this;
        var deptListUrl,
            param;
        deptListUrl = httpreq.editDapratPower;
        param = { deptNo: this._data.deptNo };
        $("#operationTable").bootstrapTable('destroy');
        $("#operationTable").bootstrapTable({
            url: deptListUrl,
            method: 'get',
            detailView: true,//父子表
            queryParams: param,
            //sidePagination: "server",
            onLoadSuccess: function () {
                $("#operationTable").bootstrapTable("expandAllRows")
            },
            columns: [{
                field: 'authName',
                title: '一级菜单',
                align: 'center'
            }, {
                    field: '',
                    title: '允许操作',
                    align: 'center'
                },],
            //注册加载子表的事件。注意下这里的三个参数！
            onExpandRow: function (index, row, $detail) {
                self.InitSubTable(index, row, $detail);
            },
            responseHandler: (res) => {
                let resDate = {};
                if (res.code == "000000") {
                    var FirstList = res.data.FirstList;
                    var secondList = res.data.SecondList;
                    _.each(FirstList, (first) => {
                        first.submenu = _.where(secondList, {
                            parentAuthNo: first.authNo
                        })
                    });
                    _.extend(resDate, {
                        rows: res.data.FirstList || []
                    });
                } else {
                    if (res.responseCode == "683310" || res.responseCode == "900106") {
                        Dialog.alert(res.responseMsg || res.msg, () => {
                            window.top.location.href = "http://brop.pab.com.cn/portal/login.html";
                        });
                    }
                    else {
                        Dialog.alert(res.msg || res.responseMsg);
                    }
                }
                return resDate;
            },
        });
    }

    InitSubTable(index, row, $detail) {
        var self = this;
        var parentid = row.ddCode;
        var cur_table = $detail.html('<table subTable></table>').find('table');
        //debugger;
        //$(cur_table).bootstrapTable('destroy');
        $(cur_table).bootstrapTable({
            data: row.submenu,//this.secondData,
            method: 'get',
            queryParams: {
                ddType: 68,
                parentCode: '',
            },
            columns: [{
                field: 'authName',
                title: '二级菜单',
                align: 'center'
            },
                {
                    checkbox: true,
                    title: "允许操作",
                    field: 'isSelect',
                    formatter: (index, data, $detail) => {
                        //console.log(data)
                        if (data.isSelect == "1") {
                            return true
                        } else {
                            return false
                        }
                    }
                },],
        })
    }
    channelTable(){
        var self = this;
        var deptListUrl,
        deptListUrl = httpreq.EditChannel;
        $("#channelTable").bootstrapTable('destroy');
        $("#channelTable").bootstrapTable({
            url: deptListUrl,
            method: 'get',
            queryParams:{deptNo:this._data.deptNo},
            columns: [{
                field: 'accessChannelCode',
                title: '接入渠道Code',
                align: 'center'
            },{
                field: 'accessChannelName',
                title: '接入渠道',
                align: 'center'
            }, {
                    checkbox:true,
                    field: 'isSelect',
                    title: '允许操作',
                    align: 'center',
                    formatter:(isSelect)=>{
                        if(isSelect=='1'){
                        return true
                    }
                    }
                },],
            responseHandler: (res) => {
                let resDate = {};
                if (res.code == "000000") {
                    var FirstList = res.data.ChannelList;
                    _.extend(resDate, {
                        rows: FirstList || []
                    });
                } else {
                    if (res.responseCode == "683310" || res.responseCode == "900106") {
                        Dialog.alert(res.responseMsg || res.msg, () => {
                            window.top.location.href = "http://brop.pab.com.cn/portal/login.html";
                        });
                    }
                    else {
                        Dialog.alert(res.msg || res.responseMsg);
                    }
                }
                return resDate;
            },
        });
    }
    getChannelList(){
         var channeltableList='';
         let channelList = $("#channelTable").bootstrapTable('getAllSelections');
         if(channelList.length>0){
             for(var i=0;i<channelList.length;i++){
                 channeltableList+=channelList[i].accessChannelCode+(i+1<channelList.length?',':'');
             }
         };
         return channeltableList;
    }
    saveSubmit(queryData) {  //点击保存处理函数
        var self = this;
        let url = httpreq.saveDept;
        utils.xhr.post(url, queryData, this.successCb());
    }
    successCb() {
        let romateHtml = null;
        let Dialog1 = Dialog.show({
            title: '提示',
            nl2br: false,
            message: () => {
                romateHtml = '提交成功';
                return romateHtml;
            },
            buttons: [{
                label: '知道了',
                cssClass: 'btn-primary',
                action: (dialogRef) => {
                    this.backUrl()
                    Dialog1.close();
                }
            }]
        })
    }
    backUrl() {
        localStorage.removeItem("row");
        window.location.href = 'depart-permission.html'
    }

    isOK() {
        localStorage.removeItem("row");
        let row = this.getParms();
        localStorage.setItem("row", JSON.stringify(row));
        this.getProductInfoData();

    }
}
module.exports = deoartEdit;