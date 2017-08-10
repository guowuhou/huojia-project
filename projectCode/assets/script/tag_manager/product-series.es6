const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
require('lib/bootstrap-table.js');
const httpreq = require('httpreq.es6');
const moment = require('lib/moment.js');
const utils = require('utils');

class productSeries extends uu.Component {

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
            tableList: {
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
            this.onAddProductSeries();
        });
        //删除按钮
        $(this.btnDel).on('click', () => {
            this.onDelTagGroup();
        });
        $("#group_search").on('click',()=>{
             self.deptList=self.vm.get("deptCode");
             self.name=$("#productSeries").val();
            $(self.tableList).bootstrapTable('refresh');
        });
        //编辑按钮
        $(this.node.dom).on('click', 'button[uuid]', function () {
            const btn = $(this);
            const uuid = btn.attr('uuid');
            location.href = `product-series-edit.html?tagCode=${uuid}`;
            const row = $(self.tableList).bootstrapTable('getRowByUniqueId', uuid);
        })
    }

    findDept() {
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
        //监听
        vm.observe('deptCode', (newValue, oldValue, keypath)=>{
            this.deptCode = newValue;
            $(this.tableList).bootstrapTable('refresh');
        });
        //获取数据
        utils.xhr.post(httpreq.Tag_FindDept, {}, (res) => {
            vm.splice.apply(vm, ['list', 1, 0, ...res.data.dataList]);
        });
        //默认执行一次
        this.initTable();
    }

    onAddProductSeries() {
        var romateHtml = null;
        //数据绑定
        const vm = new uu.ViewModel({
            view: require('./tpl-productseries-add.tpl'),
            model: {
                name: '',
                deptCode: '',
                deptlist: [],
                desc: '',
                status:'',
                statuslist:[],
            }
        });
        //启动窗口
        Dialog.show({
            title: '创建产品系列',
            nl2br: false,
            message: vm.getFragment(),
            buttons: [{
                label: '保存',
                cssClass: 'btn-primary',
                action: (dialogRef) => {
                    const data = {
                        name: vm.get('name'),
                        deptCode: vm.get('deptCode'),
                        //dept: utils.array.find( vm.get('deptlist'), 'code', vm.get('deptCode'), 'name' ),
                        desc: vm.get('desc'),
                        status:vm.get('status'),
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
         //状态
        utils.xhr.post(httpreq.findAllDept,{ddType:32}, (res) => {
            vm.set('statuslist', res.data.dataList);
            vm.set('status', vm.get('statuslist.0.deptNo'));
        });
    }

    //向后台发送增加组合标签的请求
    doAddTagGroup(dialogRef, data) {
        const url = httpreq.TagGroup_Add;
        utils.xhr.post(url, data, (res) => {
            dialogRef.close();
            $(this.tableList).bootstrapTable('refresh');
        });
    }

    onDelTagGroup() {
        const list = $(this.tableList).bootstrapTable('getAllSelections');
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
            $(this.tableList).bootstrapTable('refresh');
        });
    }

    initTable() {
        $(this.tableList).bootstrapTable({
            url: httpreq.TagGroup_AllPages,
            pagination: true,
            uniqueId: 'tagCode',
            pageSize: 10,
            pageNumber: 1,
            queryParams: (params) => {
                return {
                    pageSize: params.limit,
                    currentPage: (params.offset / params.limit) + 1,
                    name:this.name,//产品系列名称
                    deptCode: this.deptCode
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
                    title: '产品系列ID',
                    field: 'tagCode',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    title: '产品系列名称',
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
                    "class": 'padding0',
                    formatter: function (value, row, index) {
                        return `<button type="button" class="btn btn-default btn-sm" uuid="${row.tagCode}">编辑</button>`;
                    }
                }
            ]
        });
    }

};

module.exports = productSeries;