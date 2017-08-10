const ejs = require('lib/ejs.js');
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
require('lib/bootstrap-table.js');
const utils=require('utils');

class managerList extends uu.Component {
    properties() {
        return {
            managertype: {
                defaultValue: null,
                type: uu.Node
            },
        };
    }
    onLoad() {
        this.rqoptions = {pageSize: 20, pageNum: 1};
        this.initTable();
    }
    initTable(){
        let params={
            roleName:'',
            status:'',
            roleDept:'',
        };
        this.getproshelflist(params);
    }
    //根据筛选条件rqoptions查询产品列表
    getproshelflist(rqoptions) {
        //var self=this;
        for (let v in rqoptions) {
            this.rqoptions[v] = rqoptions[v];
        }
        //防重复提交
        if (this.reqFlag) return;
        $("#table").bootstrapTable('destroy');
        $('#table').bootstrapTable({
            url: httpreq.QryRoleList,
            columns: [ 
                {
                    field: 'roleNo',
                    title: '角色代码',
                    align: 'center'
                },{
                    field: 'roleName',
                    title: '角色名称',
                    align: 'center'
                },{
                    field: 'roleDept',
                    title: '所属部门',
                    formatter: function (roleDept, row, index) {
                         const map = {'dpt0002': '理财产品部', 'dpt0003': '口袋渠道','dpt0004': '千人千面','dpt0005': '存款产品部','dpt0006': '消费信贷产品部','dpt0007':'口袋插件渠道','dpt0008':'厅堂渠道','dpt0009': '黄金产品部',};
                         return map[roleDept];
                    },
                    align: 'center'
                },{
                    field: 'status',
                    title: '状态',
                    formatter: function (value, row, index) {
                         const map = { '0': '禁用', '1': '启用'};
                         return map[value];
                    },
                    align: 'center'
                },{
                    field: 'updateBy',
                    title: '更新人',
                    align: 'center'
                },{
                    field: 'updateTime',
                    title: '更新时间',
                    formatter:function(updateTime) {//格式化时间
                        return moment(updateTime).format('YYYY-MM-DD HH:mm:ss');
                    },
                    align: 'center'
                },{
                    title: '<span style="padding:0px 47px">操作</span>',
                    align: 'center',
                    events: {
                         'click #forbidden,#enable': (e, value, row, index) => {
                                 if(row.deptStatus=='0'){
                                     this.conditionOpe(row);
                                 }else{
                                    this.operation(row); 
                                 }
                        },
                        'click #editor':(e, value, row, index)=>{
                            if(row.deptStatus=='0'){
                                Dialog.alert('部门禁用状态下，不能编辑角色权限');
                            }else{
                                location.href=`operation-editor.html?roleNo=${row.roleNo}`;
                            }
                        },
                    },
                    formatter:_.bind(this.functionEvent, this) 
                }
            ],
            sortable: true,//是否启用排序
            sortOrder: "roleNo",//排序方式
            pagination: true,//是否显示分页
            pageSize: this.pageSize,//每页的记录行数
            queryParams: (params) => {//传递的参数
                return _.extend({}, this.rqoptions, {
                    pageSize: params.limit,//页面大小
                    pageNum: params.offset / params.limit + 1,
                });
            },
            responseHandler: (res) => {
                let resDate = {};
                if (res.code == "000000") {
                    this.reqFlag = false;
                    this.showQryTimeOrRedCount(res.data.totalRecords);
                    this.productInfoList = res.data.dataList;
                    _.extend(resDate, {
                        rows: res.data.dataList || [],
                        total: res.data.totalSize
                    });
                }else if(res.responseCode == '900106'||res.responseCode == '683310'){
                         Dialog.alert(res.msg || res.responseMsg);
                         window.top.location.href = "http://brop.pab.com.cn/portal/login.html";
                }else {
                        Dialog.alert(res.msg || res.responseMsg);
                        this.reqFlag = false;
                        this.showQryTimeOrRedCount(0);
                        this.productInfoList = res.data.dataList;
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
    functionEvent(value,row,index) {
        let insertHtml='';
        if(row.status=='1'){
            insertHtml=`<li><a class="editor" id="editor">编辑角色权限</a></li>
                        <li><a class="forbidden" id="forbidden">禁用此角色</a></li>
                       `        
         }else{
            insertHtml=`<li><a class="enable" id="enable">启用此角色</a></li>          `  
         };
        let html = `<div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">操作<span class="caret"></span></button>
                   <ul class="dropdown-menu dropdown-menu-right" role="menu">
                       <li><a class="detail" href="role-detailInfo.html?roleNo=${row.roleNo}">查看角色权限</a></li>
                       ${insertHtml}
                  </ul>
          </div>
        `;
        return html;
    } 
    conditionOpe(data){
        if(data.status=="0"){
            Dialog.alert('部门禁用状态下，不能启用');
        }else{
            Dialog.alert('部门禁用状态下，不能禁用');
        }
    }
    //删除数据
    operation(row) {
        var dialog1 = Dialog.show({
            title: '',
            nl2br: false,
            cssClass: 'ts-dialog',
            message: (i, j) => {
                if(row.status=='0'){
                   return `<div>确认启用此角色吗？</div>
                        <div>拥有此角色的用户权限都被启用</div>`; 
                }else{
                   return `<div>确认禁用此角色吗？</div>
                        <div>拥有此角色的用户权限都被禁用</div>`;
                }
            },
            buttons: [{
                label: '确定',
                cssClass: 'btn btn btn-primary',
                action: () => {
                    var status="";
                    if(row.status=="0"){
                        status="1";
                    }
                    else{
                        status="0";
                    }
                    utils.xhr.post(httpreq.UpdateRoleStatus, {
                        roleNo: row.roleNo,
                        status:status
                    }, (res) => {
                            if(row.status=='0'){  
                               Dialog.alert('启用成功'); 
                            }else{
                               Dialog.alert('禁用成功'); 
                            };
                        $("#table").bootstrapTable('refresh');
                        dialog1.close();
                    });
                }
            }]
        });
    }      
    //更新查询的记录条数和更新的时间
    showQryTimeOrRedCount(totalSize) {
        let total = parseInt(totalSize, 10);
        total = isNaN(total) ? 0 : total;
        let thistime = moment().format('YYYY-MM-DD HH:mm:ss');
        $(this.node.dom).parent().find("#recordtext").text(`共有 ${total} 条记录`);
        $(this.node.dom).parent().find("#qrytimeshow").text(`数据更新时间：${thistime}`);
    }
    //返回查询产品列表的上送的参数
    getqryparamdatas() {
        return this.rqoptions || {};
    }
    //返回查询产品列表的的数据
    getqrydatas() {
        return this.productInfoList || [];
    }
};
module.exports = managerList;