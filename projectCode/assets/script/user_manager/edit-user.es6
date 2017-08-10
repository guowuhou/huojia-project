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
            userName: {
                defaultValue: null,
                type: uu.Dom
            },
            userUM_ID: {
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
            btnAddRole: {
                defaultValue: null,
                type: uu.Dom
            },
            btnDel: {
                defaultValue: null,
                type: uu.Dom
            },
            btnSave: {
                defaultValue: null,
                type: uu.Dom
            },
            btnBack: {
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
        this.userAuthList = [];
        this.userAuth = [];
        let userNo = location.search.split("=")[1];
        this.userNo = userNo;
        this.showUserInfo(userNo);
        this.bindEvents();
    }
    bindEvents() {
        $(this.btnAddRole).on('click', () => {
            this.addRole();
        });
        $(this.btnDel).on('click', () => {
            this.delRole();
        });
        $(this.btnSave).on('click', () => {
            this.save();
        });
        // $(this.btnBack).on('click', () => {
        //     history.back();
        // });
    }

    showUserInfo(userNo) {
        utils.xhr.post(httpreq.qryOneUser, { userNo }, (res) => {
            let info = res.data.dataList;
            let statusMap = {
                0: "禁用",
                1: "启用"
            };
            $(this.userUM_ID).html(info.userNo);
            $(this.userName).val(info.userName);
            $("input[name='Status']").val(info.status);
            $(this.createBy).html(info.createBy);
            $(this.createTime).html(moment(info.createTime).format('YYYY-MM-DD HH:mm'));
            if (res.data.dataList.userAuthList) this.userAuthList = _.uniq(res.data.dataList.userAuthList,function(item) {
                return item.roleNo
            });
            if (res.data.dataList.userAuth) this.userAuth = _.uniq(res.data.dataList.userAuth);
            this.showTableList(this.userAuthList);
        })
    }

    addRole() {
        Dialog.show({
            title: '添加角色',
            nl2br: false,
            cssClass: 'ts-dialog',
            message: () => {
                let addRoleHTML = $(require('./add-role.tpl'));
                utils.xhr.post(httpreq.qryAllDept, {}, (res) => {
                    let list = res.data.dataList;
                    let len = list.length;
                    let html = "";
                    for (let i = 0; i < len; i++) {
                        html += "<option value=";
                        html += list[i].deptNo;
                        html += ">"
                        html += list[i].deptName;
                        html += "</option>";
                    }
                    addRoleHTML.find("#depts").html(html);
                    this.selectDept = list[0];
                    this.depts = _.indexBy(list, "deptNo");
                    utils.xhr.post(httpreq.qryRoleInfoByDeptNo, { deptNo: list[0].deptNo }, (res) => {
                        let list = res.data.dataList;
                        let len = list.length;
                        let html = "";
                        for (let i = 0; i < len; i++) {
                            html += "<option value=";
                            html += i;
                            html += ">"
                            html += list[i].roleName;
                            html += "</option>";
                        }
                        this.rolesByDept = list;
                        addRoleHTML.find("#userRoles").html(html);
                    })
                    addRoleHTML.find("#depts").on('change', (e) => {
                        utils.xhr.post(httpreq.qryRoleInfoByDeptNo, { deptNo: e.target.value }, (res) => {
                            let list = res.data.dataList;
                            let len = list.length;
                            let html = "";
                            for (let i = 0; i < len; i++) {
                                html += "<option value=";
                                html += i;
                                html += ">"
                                html += list[i].roleName;
                                html += "</option>";
                            }
                            addRoleHTML.find("#userRoles").html(html);
                            let i = e.target.value;
                            this.selectDept = this.depts[i];
                            this.rolesByDept = list;
                        })
                    })
                    addRoleHTML.find("#userRoles").on('change', (e) => {
                        let i = e.target.value;
                        this.selectRole = this.rolesByDept[i];
                    })
                })
                return addRoleHTML;
            },
            buttons: [{
                label: '添加',
                cssClass: 'btn btn-primary',
                action: (dialogRef) => {
                    if (_.contains(this.userAuth, this.selectRole.roleNo)) {
                        Dialog.alert('已包含此角色了！');
                        dialogRef.close();
                        return
                    }
                    if (this.selectRole.roleNo === undefined) {
                        Dialog.alert('此选项角色代码为空，请重新选一个！');
                        dialogRef.close();
                        return
                    }
                    this.selectRole.deptInfoList = [{ deptName: this.selectDept.deptName }];
                    this.userAuthList.push(this.selectRole);
                    this.userAuth.push(this.selectRole.roleNo);
                    this.showTableList(this.userAuthList);
                    dialogRef.close();
                }
            }]
        });
    }

    delRole() {
        let selectList = $(this.roleTable).bootstrapTable('getAllSelections');
        if (selectList.length == 0) {
            Dialog.alert('请选择要删除的角色！');
            return
        }

        for (let i = 0, len1 = selectList.length; i < len1; i++) {
            for (let j = 0, len2 = this.userAuth.length; j < len2; j++) {
                if (this.userAuth[j] == selectList[i].roleNo) {
                    this.userAuth.splice(j, 1);
                    j--;
                    len2--;
                }
            }
            for (let k = 0, len3 = this.userAuthList.length; k < len3; k++) {
                if (this.userAuthList[k].roleNo == selectList[i].roleNo) {
                    this.userAuthList.splice(k, 1);
                    k--;
                    len3--;
                }
            }
        }
        this.showTableList(this.userAuthList);
    }

    save() {
        if ($(this.userName).val().trim() === "") {
            Dialog.alert('用户名称不能为空！');
            return;
        }
        let userAuth = "";
        for (let i = 0, len = this.userAuth.length; i < len; i++) {
            userAuth += "|" + this.userAuth[i];
        }
        userAuth = userAuth.slice(1);
        let params = {
            userNo: this.userNo,
            userName: $(this.userName).val(),
            status: $("input[name='Status']:checked").val(),
            userAuth: userAuth
        };
        utils.xhr.post(httpreq.editUser, params, (res) => {
            Dialog.alert("保存成功！",()=>{history.back();});
        },(res) => {
            Dialog.alert(res.msg,()=>{history.back();});
        })
        
    }

    showTableList(data) {
        $(this.roleTable).bootstrapTable('destroy');
        $(this.roleTable).bootstrapTable({
            columns: [{
                align: 'center',
                checkbox: true
            }, {
                field: 'deptInfoList',
                title: '所属部门',
                align: 'center',
                formatter: (list) => {
                    if(list[0]) {
                        return list[0].deptName;
                    } else {
                        return "---";
                    }
                }
            }, {
                field: 'roleNo',
                title: '角色代码',
                align: 'center'
            }, {
                field: 'roleName',
                title: '角色名称',
                align: 'center',
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
                events: {
                    'click #delRoleMsg': (e, value, row, index) => {
                        this.delRoleMsg(row.roleNo);
                    }
                },
                formatter: (value,row) => {
                    return `<a  href="role-detailInfo.html?roleNo=${row.roleNo}">查看角色信息</a> &nbsp&nbsp <a id="delRoleMsg">删除</a>`
                }
            }],
            checkboxHeader: false,
            data: data,
            formatNoMatches: () => {
                return '查无记录';
            },
        });
    }

    delRoleMsg(roleNo) {
        var dialog2 = Dialog.show({
            title: '',
            nl2br: false,
            cssClass: 'ts-dialog',
            message: (i, j) => {
                return `确定要删除角色代码为${roleNo}的角色吗？`;
            },
            buttons: [{
                label: '确定',
                cssClass: 'btn btn btn-primary',
                action: () => {
                    for (let i = 0, len = this.userAuth.length; i < len; i++) {
                        if (this.userAuth[i] == roleNo) {
                            this.userAuth.splice(i, 1);
                            i--;
                            len--;
                        }
                    }
                    for (let j = 0, len2 = this.userAuthList.length; j < len2; j++) {
                        if (this.userAuthList[j].roleNo == roleNo) {
                            this.userAuthList.splice(j, 1);
                            j--;
                            len2--;
                        }
                    }
                    this.showTableList(this.userAuthList);
                    dialog2.close();
                }
            }, {
                label: '取消',
                cssClass: 'btn btn-default',
                action: () => {
                    dialog2.close();
                }
            }]
        });
    }
};
module.exports = examineUser