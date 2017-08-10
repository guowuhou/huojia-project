const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
require('lib/bootstrap-table.js');
const httpreq = require('httpreq.es6');
const moment = require('lib/moment.js');
const utils = require('utils');

class TagGroupMgr extends uu.Component {

    // show properties in Editor, you can use this.xxx directly
    properties() {
        return {
            btnAdd: {
                defaultValue: null,
                type: uu.Dom
            },
            btnDel: {
                defaultValue: null,
                type: uu.Dom
            },
            gridWrap: {
                defaultValue: null,
                type: uu.Dom
            },
            deptList: {
                defaultValue: null,
                type: uu.Dom
            }
        };

    }

    // init
    onLoad() {
        this.bindEvent();
        this.findDept();
    }

    bindEvent() {
        const self = this;
        //增加组合标签
        $(this.btnAdd).on('click', () => {
            this.onAddTagGroup();
        });
        //删除按钮
        $(this.btnDel).on('click', () => {
            this.onDelTagGroup();
        });
        $("#group_search").on('click',()=>{
             self.deptList=self.vm.get("deptCode");
             self.name=$("#groupLabel").val();
             self.status=$("#status").val();
             $(self.gridWrap).bootstrapTable('refresh');
        });
    }

    findDept() {
        //状态界面
        var statusHtml = `
            <label style="margin-left:100px;">状态:</label>
            <select id='status' class="form-control">
                <option value="ALL">所有</option>
                <option value="0">失效</option>
                <option value="1">有效</option>
            </select>`;
        //数据绑定
        const vm =this.vm= new uu.ViewModel({
            view: `
                <select class="form-control" uu-model="{{deptCode}}">
                    <option uu-for="item of list" value="{{item.deptNo}}">{{item.deptName}}</option>
                </select>
            `,
            model: {
                deptCode: '',
                list: [{deptNo:'',deptName:'所有'}]
            }
        });
        window.vm=this.vm;
        this.deptList.appendChild( vm.getFragment() );
        $(this.deptList).append(statusHtml);
        //监听
        vm.observe('deptCode', (newValue, oldValue, keypath)=>{
            this.deptCode = newValue;
            $(this.gridWrap).bootstrapTable('refresh');
        });
        //获取数据
        utils.xhr.post(httpreq.Tag_FindDept, {}, (res) => {
            vm.splice.apply(vm, ['list', 1, 0, ...res.data.dataList]);
        });
        this.status =  $("#status").val();
        $("#status").change((e) =>{
            $("#group_search").trigger('click')
        });
        //默认执行一次
        this.initTable();
    }

    onAddTagGroup() {
        var romateHtml = null;
        //数据绑定
        const vm = new uu.ViewModel({
            view: require('./tpl-taggroup-add.tpl'),
            model: {
                name: '',
                deptCode: '',
                deptlist: [],
                isproduct:true,
                remark: ''
            }
        });
        //启动窗口
        Dialog.show({
            title: '创建组合标签',
            nl2br: false,
            message: vm.getFragment(),
            buttons: [{
                label: '保存',
                cssClass: 'btn-primary',
                action: (dialogRef) => {
                    const data = {
                        name: vm.get('name'),
                        deptCode: vm.get('deptCode'),
                        dept: utils.array.find( vm.get('deptlist'), 'code', vm.get('deptCode'), 'name' ),
                        remark: vm.get('remark'),
                        isProduct: vm.get('isproduct') ? 1: 0
                    };
                    if (!data.name || data.name.length <= 1){
                        Dialog.alert('名称太短!');
                        return false;
                    }
                    this.doAddTagGroup(dialogRef, data);
                }
            }]
        });
        //部门
        utils.xhr.post(httpreq.findAllDept,{ddType:32}, (res) => {
            vm.set('deptlist', res.data.dataList);
            vm.set('deptCode', vm.get('deptlist.0.deptNo'));
        });
    }

    //向后台发送增加组合标签的请求
    doAddTagGroup(dialogRef, data) {
        const url = httpreq.TagGroup_Add;
        utils.xhr.post(url, data, (res) => {
            dialogRef.close();
            $(this.gridWrap).bootstrapTable('refresh');
        });
    }

    onDelTagGroup() {
        const list = $(this.gridWrap).bootstrapTable('getAllSelections');
        if (!list || !list.length) {
            Dialog.alert('请至少选择一个组合标签!');
            return;
        }
        const data = [];
        for (let i = 0; i < list.length; i++) {
            data.push(list[i].tagCode);
        }
        const url = httpreq.TagGroup_Delete;
        utils.xhr.post(url, {
            list: JSON.stringify(data)
        }, (res) => {
            $(this.gridWrap).bootstrapTable('refresh');
        });
    }

    initTable() {
        $(this.gridWrap).bootstrapTable({
            url: httpreq.TagGroup_AllPages,
            pagination: true,
            uniqueId: 'tagCode',
            pageSize: 10,
            pageNumber: 1,
            queryParams: (params) => {
                return {
                    pageSize: params.limit,
                    pageNo: (params.offset / params.limit) + 1,
                    name:this.name,//组合标签名称
                    deptCode: this.deptCode,
                    status:this.status,
                    type:'2'
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
                    Dialog.alert(res.msg);
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
                    title: '组合标签ID',
                    field: 'tagCode',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    title: '组合标签名称',
                    field: 'name',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    title: '所属部门',
                    field: 'dept',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    title: '状态',
                    field: 'status',
                    formatter: function (value) {
                        var statusMap = {"1" : "有效","0" : "失效"};
                        return statusMap[value]
                    },
                    align: 'center', valign: 'middle'
                },
                {
                    title: '创建人UM',
                    field: 'userID',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    title: '创建时间',
                    field: 'createDate',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return moment(value).format("YYYY-MM-DD HH:mm:ss")
                    }
                },
                {
                    title: '操作',
                    field: '',
                    align: 'center',
                    valign: 'middle',
                    formatter:_.bind(this.functionEvents, this),
                    events:{
                        "click .check":(e,value,row)=>{
                            this.editTable(row,true);
                        },
                        "click .edit":(e,value,row)=>{
                            this.editTable(row);
                        },
                        "click .status":(e,value,row)=>{
                            this.editStatus(row);
                        },
                    }
                }
            ]
        });
    }
    
     //编辑按钮
        // $(this.node.dom).on('click', 'button[uuid]', function () {
        //     const btn = $(this);
        //     const uuid = btn.attr('uuid');
        //     location.href = `tag-group-edit.html?tagCode=${uuid}`;
        //     const row = $(self.gridWrap).bootstrapTable('getRowByUniqueId', uuid);
        // })
        
     editTable(row,flag){
         location.href = `tag-group-edit.html?tagCode=${row.tagCode}&check=${flag}`;
     }
     
    editStatus(row) {
        var self = this;
        var data1 = {
            status : row.status , tagCode : row.tagCode
        };
        var url = httpreq.PS_fectiveGroup;
        utils.xhr.post(url, data1, (res) => {
            $(self.gridWrap).bootstrapTable('refresh');
        });
    }
        
    //操作功能事件
    functionEvents(value,row,index) {
        var html = '';
        var statusMap = {"0" : "有效","1" : "失效"};
        if(row.status == "1"){
            html = `<a class='check' style='text-decoration:none;cursor: pointer'>查看</a>
                <a class='edit' style='text-decoration:none;cursor: pointer'>编辑</a>
                <a class='status' style='text-decoration:none;cursor: pointer'>设为${statusMap[row.status]}</a>`;
        }else{
            html = `<a class='check' style='text-decoration:none;cursor: pointer'>查看</a>
                <a class='status' style='text-decoration:none;cursor: pointer'>设为${statusMap[row.status]}</a>`;
        }
        return html;  
    }

};

module.exports = TagGroupMgr;