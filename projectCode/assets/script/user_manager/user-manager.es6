const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const ejs = require('lib/ejs.js');
const shelfup = require('plugins/shelf-up.es6');
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
const utils = require('utils');
require('lib/bootstrap-table.js');

class userManager extends uu.Component {
    properties() {
        return {
            userUM_ID: {
                defaultValue: null,
                type: uu.Dom
            },
            userStatus: {
                defaultValue: null,
                type: uu.Dom
            },
            btnSearch: {
                defaultValue: null,
                type: uu.Dom
            },
            btnCreateUser: {
                defaultValue: null,
                type: uu.Dom
            },
            userTable: {
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
        this.showTableList({});
    }
    bindEvents() {
        $(this.btnSearch).on('click', () => {
            this.searchUserList();
        });
        $(this.btnCreateUser).on('click', () => {
            this.createUser();
        });
    }

    searchUserList() {
        let userUM_ID = $(this.userUM_ID).val().trim();
        let userStatus = $(this.userStatus).val();
        let params = {};
        if (userUM_ID !== "") {
            params.userNo = userUM_ID;
        }
        if (userStatus !== "ALL") {
            params.status = userStatus;
        } else {
            params.status = "";
        }
        this.showTableList(params);
    }

    createUser() {
        Dialog.show({
            title: '创建用户',
            nl2br: false,
            cssClass: 'ts-dialog',
            message: () => {
                const CreateUserHTML = $(require('./create-user.tpl'));
                return CreateUserHTML;
            },
            buttons: [{
                label: '添加',
                cssClass: 'btn btn-primary',
                action: (dialogRef) => {
                    if ($('#UM_ID').val().trim() === "") {
                        Dialog.alert('UM_ID不能为空！');
                        return;
                    }
                    if ($('#userName').val().trim() === "") {
                        Dialog.alert('用户名称不能为空！');
                        return;
                    }
                    let params = {
                        status: $("input[name='Status']:checked").val(),
                        userNo: $('#UM_ID').val().trim(),
                        userName: $('#userName').val().trim(),
                    };
                    utils.xhr.post(httpreq.isUserExist, { userNo: params.userNo }, (res) => {
                        if (res.data.exist == 1) {
                                Dialog.alert('此用户已存在！');
                        } else {
                            utils.xhr.post(httpreq.addUser, params, (res) => {
                                Dialog.alert('用户创建成功！');
                                $(this.userTable).bootstrapTable('refresh');
                            })
                        }
                    })
                    dialogRef.close();
                }
            }]
        });
    }

    showTableList(query) {
        this.queryTableParams = query;
        $(this.userTable).bootstrapTable('destroy');
        $(this.userTable).bootstrapTable({
            url: httpreq.qryUserList,
            columns: [{
                field: 'userNo',
                title: '用户UM_ID',
                align: 'center',
            }, {
                    field: 'userName',
                    title: '用户名字',
                    align: 'center'
                }, {
                    field: 'status',
                    title: '状态',
                    align: 'center',
                    formatter: (status) => {
                        const map = {
                            "1": "启用",
                            "0": "禁用"
                        }
                        return map[status];
                    }
                }, {
                    field: 'createBy',
                    title: '添加操作人',
                    align: 'center',
                }, {
                    field: 'createTime',
                    title: '首次添加时间',
                    align: 'center',
                    formatter: (createTime) => {
                        return moment(createTime).format('YYYY-MM-DD HH:mm');
                    }
                }, {
                    title: '<span style="padding:0px 47px">操作</span>',
                    align: 'center',
                    events: {
                        'click .forbiddenUser': (e, value, row, index) => {
                            this.forbiddenOrStart(row, true);
                        },
                        'click .startUser': (e, value, row, index) => {
                            this.forbiddenOrStart(row, false);
                        }
                    },
                    formatter: _.bind(this.addEvents, this)
                }],
            pagination: true,
            pageSize: this.reqOptions.pageSize,
            queryParams: (params) => {
                return _.extend({}, query, {
                    pageSize: params.limit,
                    pageNum: params.offset / params.limit + 1
                });
            },
            responseHandler: (res) => {
                let resDate = {};
                if (res.code == "000000") {
                    this.productInfoList = (res.data && res.data.dataList) || [];
                    _.extend(resDate, {
                        rows: (res.data && res.data.dataList) || [],
                        total: res.data.totalRows
                    });
                } else if(res.responseCode=="683310"||res.responseCode=="900106"){
                    Dialog.alert(res.responseMsg||res.msg,()=>{
                        window.top.location.href="http://brop.pab.com.cn/portal/login.html";
                    });
                } else {
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

    forbiddenOrStart(row, flag) {
        let msg = "";
        if (flag) {
            msg = "确认禁用此用户吗？";
        } else {
            msg = "确认启用此用户吗？";
        }
        var dialog1 = Dialog.show({
            title: '',
            nl2br: false,
            cssClass: 'ts-dialog',
            message: (i, j) => {
                return msg;
            },
            buttons: [{
                label: '确定',
                cssClass: 'btn btn btn-primary',
                action: () => {
                    let params = { userNo: row.userNo };
                    if (flag) {
                        params.status = 0;
                    } else {
                        params.status = 1;
                    }
                    utils.xhr.post(httpreq.chgUserStatus, params, (res) => {
                        Dialog.alert('操作成功');
                        $(this.userTable).bootstrapTable('refresh');
                        dialog1.close();
                    })
                }
            }, {
                    label: '取消',
                    cssClass: 'btn btn-default',
                    action: () => {
                        dialog1.close();
                    }
                }]
        });
    }

    addEvents(value, row, index) {
        let addInsertHtml = "";
        if (row.status == "1") {
            addInsertHtml = `<li><a href="examine-user.html?userNo=${row.userNo}">查看用户</a></li>
                          <li><a href="edit-user.html?userNo=${row.userNo}">编辑用户</a></li>
                          <li><a class="forbiddenUser">禁用此用户</a></li>
                       `;
        } else {
            addInsertHtml = `<li><a href="examine-user.html?userNo=${row.userNo}">查看用户</a></li>
                          <li><a class="startUser">启用此用户</a></li>
                          `;
        };
        let html = `<div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">操作<span class="caret"></span></button>
                   <ul class="dropdown-menu dropdown-menu-right" role="menu">
                       ${addInsertHtml}
                  </ul>
          </div>
        `;
        return html;
    }
};
module.exports = userManager