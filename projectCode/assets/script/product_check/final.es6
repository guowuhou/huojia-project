const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
require('lib/bootstrap-table.js');
const httpreq = require('httpreq.es6');
const utils = require('utils');
const moment = require('lib/moment.js');

class TagGroupMgr extends uu.Component {

    // show properties in Editor, you can use this.xxx directly
    properties() {
        return {
            btnYes: {
                defaultValue: null,
                type: uu.Dom
            },
            btnNo: {
                defaultValue: null,
                type: uu.Dom
            },
            gridWrap: {
                defaultValue: null,
                type: uu.Dom
            }
        };

    }

    // init
    onLoad() {
        this.bindEvent();
        this.initTable();
    }

    bindEvent() {
        const self = this;
        //通过
        $(this.btnYes).on('click', () => {
          this.pass();
        });
        //不通过
        $(this.btnNo).on('click', () => {
            this.refuse();
        });
    }
    
    //审核通过
    pass(){
        const list = $(this.gridWrap).bootstrapTable('getAllSelections');
        const ids = utils.array.pickMul(list, 'prdCode', 'recommendCode', 'recommendSubCode');
        if( !ids.length ){
            Dialog.alert('请至少选择一条记录!');
            return;
        }
        const url = httpreq.Check_FinalPass;
        utils.xhr.post(url, {list: JSON.stringify(ids)}, (res)=>{
            Dialog.alert('操作成功!');
            $(this.gridWrap).bootstrapTable('refresh');
        });
    }
    
    //审核拒绝
    refuse(){
        const list = $(this.gridWrap).bootstrapTable('getAllSelections');
        const ids = utils.array.pickMul(list, 'prdCode', 'recommendCode', 'recommendSubCode');
        if( !ids.length ){
            Dialog.alert('请至少选择一条记录!');
            return;
        }
        const url = httpreq.CHeck_FinalRefuse;
        utils.xhr.post(url, {list: JSON.stringify(ids)}, (res)=>{
            Dialog.alert('操作成功!');
            $(this.gridWrap).bootstrapTable('refresh');
        });
    }

    initTable() {
        $(this.gridWrap).bootstrapTable({
            url: httpreq.Check_FinalReview,
            pagination: true,
            // uniqueId: 'prdCode',
            pageSize: 12,
            pageNumber: 1,
            queryParams: (params) => {
                return {
                    pageSize: params.limit,
                    currentPage: (params.offset / params.limit) + 1,
                    // deptCode: this.deptCode
                };
            },
            responseHandler: (res) => {
                if (res.code == "000000") {
                    return {
                        rows: res.data.list,
                        total: res.data.count
                    };
                } else if(res.responseCode=="683310"||res.responseCode=="900106"){
                    Dialog.alert(res.responseMsg||res.msg,()=>{
                        window.top.location.href="http://brop.pab.com.cn/portal/login.html";
                    });
                } else {
                    Dialog.alert(res.msg || res.responseMsg);
                    return {};
                }
            },
            columns: [
                {
                    title: '',
                    field: '_isChecked',
                    align: 'center',
                    valign: 'middle',
                    checkbox: true
                },
                {
                    title: '审核状态',
                    field: 'prdStatus',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        const map = {'01':'已审核','02':'审核中','03':'已拒绝'};
                        return map[value];
                    }
                },
                {
                    title: '产品名称',
                    field: 'channelProductInfo',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return value['prdName']||'';
                    }
                },
                {
                    title: '渠道',
                    field: 'sourceName',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    title: '审核类型',
                    field: 'reviewType',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        const map = {'1':'产品上架'};
                        return map[value];
                    }
                },
                {
                    title: '备注',
                    field: 'remark',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    title: '申请人',
                    field: 'reviewUser',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    title: '申请时间',
                    field: 'createTime',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return moment(value).format('YYYY-MM-DD HH:mm:ss');
                    }
                }
            ]
        });
    }

};

module.exports = TagGroupMgr;