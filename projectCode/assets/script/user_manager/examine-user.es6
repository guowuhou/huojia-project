const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const ejs = require('lib/ejs.js');
const shelfup = require('plugins/shelf-up.es6');
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
const utils = require('utils');
require('lib/bootstrap-table.js');

class examineUser extends uu.Component {
    properties() {
        return {
            userUM_ID: {
                defaultValue: null,
                type: uu.Dom
            },
            userName: {
                defaultValue: null,
                type: uu.Dom
            },
            userStatus: {
                defaultValue: null,
                type: uu.Dom
            },
            createBy: {
                defaultValue: null,
                type: uu.Dom
            },
            createTime: {
                defaultValue: null,
                type: uu.Dom
            },
            roleTable: {
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
        this.showUserInfo();
    }
    bindEvents() {

    }

    showUserInfo() {
        let userNo = location.search.split("=")[1];
        utils.xhr.post(httpreq.qryOneUser, { userNo }, (res) => {
            let info = res.data.dataList;
            let statusMap = {
                0: "禁用",
                1: "启用"
            };
            $(this.userUM_ID).html(info.userNo);
            $(this.userName).html(info.userName);
            $(this.userStatus).html(statusMap[info.status]);
            $(this.createBy).html(info.createBy);
            $(this.createTime).html(moment(info.createTime).format('YYYY-MM-DD HH:mm'));
            this.showTableList(res.data.dataList.userAuthList);
        })
    }

    showTableList(data) {
        $(this.roleTable).bootstrapTable('destroy');
        $(this.roleTable).bootstrapTable({
            columns: [{
                field: 'deptInfoList',
                title: '所属部门',
                align: 'center',
                formatter: (list) => {
                    return list[0].deptName;
                }
            }, {
                field: 'roleNo',
                title: '角色代码',
                align: 'center'
            }, {
                field: 'roleName',
                title: '角色名称',
                align: 'center'
            }, {
                field: 'status',
                title: '角色状态',
                align: 'center',
                formatter: (status) => {
                    const map = {
                        "1": "启用",
                        "0": "禁用"
                    }
                    return map[status];
                }
            }, {
                title: '<span style="padding:0px 47px">操作</span>',
                align: 'center',
                formatter: (val,row) => {
                    return `<a  href="role-detailInfo.html?roleNo=${row.roleNo}">查看角色信息</a>`
                }
            }],
            data: data,
            formatNoMatches: () => {
                return '查无记录';
            },
        });
    }
};
module.exports = examineUser