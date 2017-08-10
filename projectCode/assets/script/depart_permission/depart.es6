const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
const _ = require('lib/underscore.js');
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
const utils = require('utils');
require('lib/bootstrap-table.js');
class departPer extends uu.Component {
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
            input_depart: {
                defaultValue: null,
                type: uu.Dom
            },
            sel_status: {
                defaultValue: null,
                type: uu.Dom
            },
        };
    }
    // init
    onLoad() {
        this.rqoptions = { pageSize: 10, pageNum: 1 };  //默认的在那显示  显示多少条数据
        this.initTable(this.rqoptions);
        this.Eventbind();
    }
    Eventbind() {
        let self = this;
        $(self.btnSearch).on('click', () => {
            self.BtnSearch()
        })
    }
    BtnSearch() {
        let paramsObj = this.getInitTableParms();
        let paramStatus = paramsObj.deptName.trim();
        if (paramStatus.length > 10) {
            alert('您输入的部门名称字符过长，请重新输入');
            return;
        }
        this.initTable(paramsObj);
    }
    getInitTableParms() {
        let parms = {
            status: $(this.sel_status).val(),
            deptName: $(this.input_depart).val()
        }
        return parms;
    }
    changeStatusText(row) {
        //debugger;
        var dialog1 = Dialog.show({
            title: '消息提示',
            nl2br: false,
            cssClass: 'ts-dialog',
            message: (res) => {
                if (row.status == '1') {
                    return `确认禁用此部门吗？此部门下的所有角色都被禁用!`;
                } else {
                    return `确认启用此部门吗？`;
                }
            },
            buttons: [{
                label: '确定',
                cssClass: 'btn btn btn-primary',
                action: () => {
                    utils.xhr.post(httpreq.updateDeptStatus, {
                        id: row.deptNo,
                        status: !Number(row.status) ? 1 : 0,
                    }, (res) => {
                        $(this.table).bootstrapTable('refresh');
                    })
                    dialog1.close();
                }
            }]
        });
    }
    initTable(rqoptions) {
        let self = this;
        for (let v in rqoptions) {
            self.rqoptions[v] = rqoptions[v];
        };
        if (this.reqFlag) return;
        this.reqFlag = true;
        //清除表格
        $(this.table).bootstrapTable('destroy');
        // debugger;
        $(this.table).bootstrapTable({
            url: httpreq.checkDapartList,  //待修改
            //data:[{data:1122,sdsd:131313}],
            columns: [
                {
                    title: '部门代码',
                    field: 'deptNo',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '部门名称',
                    field: 'deptName',
                    align: 'center', valign: 'middle',
                },
                {
                    title: '总角色数',
                    field: 'totalRoles',
                    align: 'center', valign: 'middle',
                },
                {
                    title: '状态',
                    field: 'status',
                    align: 'center', valign: 'middle',
                    formatter: function (value, row, index) {
                        let status = { '0': '禁用', '1': '启用' }
                        return status[row.status]
                    }
                },
                {
                    title: '更新人',
                    field: 'updateBy',
                    align: 'center', valign: 'middle',
                },
                {
                    title: '更新时间',
                    field: 'updateTime',
                    align: 'center', valign: 'middle',
                    formatter: function (value, row, index) {
                        return moment(value).format("YYYY-MM-DD HH:mm:ss")
                    }
                },
                {
                    title: '操作',
                    field: 'edit',
                    align: 'center', valign: 'middle',
                    events: {
                        'click #Nper,#Yper': (e, value, row, index) => {
                            this.changeStatusText(row);
                        }, 'click #editper': (e, value, row, index) => {
                            this.localStorage(row);
                        }
                    },
                    formatter: function (value, row, index) {
                        let listHtml;
                        if (row.status == '1') {
                            listHtml = `<li id="editper"> <a href="depart-editpower.html" >编辑部门权限 </a></li> 
                                         <li id="Nper"> <a href="#"> 禁用此部门权限 </a></li> `;
                        } else {
                            listHtml = `<li id ='Yper'> <a href="#" >开启此部门权限 </a></li>`;
                        }
                        return `<div class="btn-group" style='vertical-align: baseline'  >
                                     <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"  >  操作 <span class="caret"></span>
                                     </button>
                                     <ul class="dropdown-menu dropdown-menu-right" id = 'menu' >`+ listHtml + `</ul>   </div>`;
                    }
                }],
            uniqueId: 'id',
            pagination: true,             //是否显示分页
            sortable: true,              //是否启用排序
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
    localStorage(row) {
        localStorage.setItem("row", JSON.stringify(row));

    }
    //更新查询的记录条数  
    showQryTimeOrRedCount(totalSize) {
        let total = parseInt(totalSize, 10);
        total = isNaN(total) ? 0 : total;
        $(this.node.dom).parent().find("#recordtext").text(`共有 ${total} 条记录`);
    }
};
module.exports = departPer;