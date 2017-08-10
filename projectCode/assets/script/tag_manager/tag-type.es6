const $ = require("lib/jquery.js");
const ejs = require("lib/ejs.js");
const _ = require('lib/underscore.js');
const httpreq = require('httpreq.es6');
const moment = require('lib/moment.js');
const Dialog = require('plugins/dialog.es6');
const utils = require('utils');
require('lib/bootstrap-table.js');

class tagTypeMaintence extends uu.Component {
    properties() {
        return {
            addTag: {
                defaultValue: null,
                type: uu.Dom
            },
            delTag: {
                defaultValue: null,
                type: uu.Dom
            },
            table: {
                defaultValue: null,
                type: uu.Dom
            },
            select_val: {
                defaultValue: null,
                type: uu.Node
            }
        }
    }

    onLoad() {
        this.rqoptions = { pageSize: 10, pageNo: 1 };
        this.getInitTableParms();
        this.select_dom = this.select_val.getComponent('tag-type-select.es6').getSelectDom();
        this.bindEvent();
        this.initTable();
    }
    getInitTableParms() {
        this.tableParams = this.select_val.getComponent('tag-type-select.es6').getSelectValues();
    }
    initTable() {
        let rqoptions = this.rqoptions;
        for (let v in rqoptions) {
            this.rqoptions[v] = rqoptions[v];
        };
        $(this.table).bootstrapTable({
            url: httpreq.findClassificationByPage,
            uniqueId: 'classificationCode',
            pagination: true,
            sortStable: true,
            sortName: "classificationCode",
            sortOrder: "desc",
            pageSize: this.rqoptions.pageSize,
            queryParams: (params) => {
                return _.extend({}, this.rqoptions, {
                    sort: params.sort,
                    order: params.order,
                    pageSize: params.limit,
                    deptCode: this.tableParams.deptCode,
                    productClassificationCode: this.tableParams.productClassificationCode,
                    classification:this.tableParams.classification,//标签分类名称
                    status:this.tableParams.status,
                    currentPage: params.offset / params.limit + 1
                });
            },
            responseHandler: (res) => {
                let resDate = {};
                if (res.code == "000000") {
                    this.showQryTimeOrRedCount(res.data.count);
                    this.list = res.data.list;
                    _.extend(resDate, {
                        rows: res.data.list || [],
                        total: res.data.count
                    });
                } else if(res.responseCode=="683310"||res.responseCode=="900106"){
                    Dialog.alert(res.responseMsg||res.msg,()=>{
                        window.top.location.href="http://brop.pab.com.cn/portal/login.html";
                    });
                } else {
                    Dialog.alert(res.msg || res.responseMsg);
                    this.showQryTimeOrRedCount(0);
                    resDate = {};
                }
                return resDate;
            },
            columns: [
                {
                    title: '',
                    checkbox: true,
                    align: 'center', valign: 'middle'
                },
                {
                    title: '分类ID',
                    field: 'classificationCode',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '标签分类名称',
                    field: 'classification',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '产品分类',
                    field: 'productClassification',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '所属部门',
                    field: 'dept',
                    align: 'center', valign: 'middle'
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
                    align: 'center', valign: 'middle'
                },
                {
                    title: '创建时间',
                    field: 'createDate',
                    align: 'center', valign: 'middle',
                    formatter: function (value, row, index) {
                        return moment(value).format("YYYY-MM-DD HH:mm:ss")
                    }
                },
                {
                    title: '操作',
                    align: 'center',
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

    bindEvent() {
        var self = this;
        this.select_dom.sel_prd.change(() => {
            this.getInitTableParms();
            $(this.table).bootstrapTable('refresh');
        });
        this.select_dom.sel_dep.change(() => {
            this.getInitTableParms();
            $(this.table).bootstrapTable('refresh');
        });
        $("#btn_search").on("click",()=>{
            this.searchList();
        });
        $("#status").change(function(){
            self.getInitTableParms();
            $(self.table).bootstrapTable('refresh');
        });
        $(this.addTag).on("click", () => {
            this.onAddTag();
        });
        $(this.delTag).on("click", () => {
            this.onDelTag();
        })
    }

    deptSelect(romateHtml,deptCode){
        utils.xhr.post(httpreq.findAllDept,{ddType:32}, (res, event) => {
                    var dep_data = res.data.dataList || [];
                    romateHtml.find("#dept").html="";
                    if(dep_data.length > 0){
                        for(let i = 0;i < dep_data.length;i++){
                            romateHtml.find("#dept").append(`<option value=${dep_data[i].deptNo}>${dep_data[i].deptName}</option>`)
                        }
                        if(deptCode!=""){
                            romateHtml.find("#dept").val(deptCode);
                        }
                    }
                });
    }
    
    addPrdSelect(romateHtml,productClassificationCode) {
        utils.xhr.post(httpreq.findAllProduct, {deptCode:""},(res) => {
            var prd_data = res.data.list || [];
            romateHtml.find("#productClassification").html = '';
            if (prd_data.length > 0) {
                for (let i = 0; i < prd_data.length; i++) {
                    romateHtml.find("#productClassification").append(
                        `<option value=${prd_data[i].code}>${prd_data[i].name}</option>`);
                }
                if(typeof productClassificationCode=="string"){
                    romateHtml.find("#productClassification").val(productClassificationCode);
                }
            }
        });
    }
    searchList(){
         this.getInitTableParms();
         this.tableParams.classification=$("#labelClass").val();
         $(this.table).bootstrapTable('refresh');
    }
    onAddTag() {
        
        var romateHtml = null;
        Dialog.show({
            title: '创建标签分类',
            nl2br: false,
            message: () => {
                romateHtml = $(require('tpl/tag-type-add.tpl'));
                this.deptSelect(romateHtml,"");
                this.addPrdSelect(romateHtml,{});
                return romateHtml;
            },
            buttons: [{
                label: '保存',
                cssClass: 'btn-primary',
                action: (dialogRef) => {
                    const name = romateHtml.find('input[classification]').val();
                    const desc = romateHtml.find('textarea[desc]').val();
                    // var vali_flag = this.select_val.getComponent('tag-type-select.es6')._Validation(name);//对输入框限制输入条件
                    // if (!vali_flag) { return };
                    var add_obj = {
                        classification: name,
                        productClassificationCode: romateHtml.find("#productClassification").val(),
                        productClassification: romateHtml.find("#productClassification  option:selected").text(),
                        deptCode: romateHtml.find("#dept").val(),
                        dept: $("#dept option:selected").text(),
                        remark: desc
                    };
                    this.insert(add_obj);
                    dialogRef.close();
                }
            }]
        });
    }
    insert(params) {
        var self = this;
        utils.xhr.post(httpreq.insert_classification, params, function (res) {
            Dialog.alert("添加成功")
            $(self.table).bootstrapTable('refresh');
        });
    }
    onDelTag() {
        var ids = $.map($(this.table).bootstrapTable('getSelections'), (row) => {
            let _obj = {};
            _obj['classificationCode'] = row.classificationCode;
            _obj['deptCode'] = row.deptCode;
            return _obj;
        });
        var _deptCode = [], _list = [];
        for (let i = 0; i < ids.length; i++) {
            _deptCode.push(ids[i].deptCode);
            // if (ids[i].deptCode == "dpt0003") {
                _list.push(ids[i].classificationCode);
            // }
        }
        // var noneKDFlag = _.every(_deptCode, (item) => {
        //     return item != "dpt0003"
        // });
        if (!ids.length) {
            Dialog.alert("至少选择一个标签")
        }  else {
            let url = httpreq.delete_classification;
            utils.xhr.post(url, { list: JSON.stringify(_list)  }, (res) => {
                Dialog.alert("删除成功")
                $(this.table).bootstrapTable('refresh');
            });
        }
    }
    editTable(row,flag) {
        var self = this;
        let dept = row.dept;
        let deptCode = row.deptCode;
        let classification = row.classification;
        var classificationCode = row.classificationCode;
        var productClassificationCode = row.productClassificationCode;
        var createDateString = row.createDateString;
        var updateDateString = row.updateDateString;
        var remark = row.remark;
        var romateHtml = null;
        Dialog.show({
            title: flag?'查看标签分类':'编辑标签分类',
            nl2br: false,
            message: () => {
                romateHtml = $(require('tpl/tag-type-edit.tpl'));
                self.deptSelect(romateHtml,deptCode);
                self.addPrdSelect(romateHtml,productClassificationCode);
                romateHtml.find("#classificationCode").text(classificationCode);
                romateHtml.find("#classification").val(classification);
                romateHtml.find("#status").val(row.status);
                romateHtml.find('textarea[desc]').val(remark);
                romateHtml.find("p[createTime]").text(moment(row.createDate).format("YYYY-MM-DD HH:mm:ss"));
                romateHtml.find("p[updateTime]").text(moment(row.updateDate).format("YYYY-MM-DD HH:mm:ss"));
                if(flag){
                    romateHtml.find("input").attr('disabled',true);
                    romateHtml.find("select").attr('disabled',true);
                    romateHtml.find("textarea").attr('disabled',true);
                };
                romateHtml.find("#dept").change(function () {
                    self.addPrdSelect(romateHtml,{});
                });
                return romateHtml;
            },
            buttons: [{
                label: flag?'确定':'保存',
                cssClass: 'btn-primary',
                action: (dialogRef) => {
                    var params = {
                        name: classification,
                        classificationCode: classificationCode,
                        productClassification: romateHtml.find("#productClassification  option:selected").text(),
                        productClassificationCode: romateHtml.find("#productClassification").val(),
                        deptCode: romateHtml.find("#dept").val(),
                        dept: $("#dept option:selected").text(),
                        status:romateHtml.find('#status').val(),
                        remark: romateHtml.find('textarea[desc]').val()
                    }
                    if(!flag){
                        this.doEditTag(params);
                    }
                    dialogRef.close();
                }
            }]
        });
    }
    
   editStatus(row) {
        var self = this;
        var data1 = {
            status : row.status , 
            classificationCode : row.classificationCode
        };
        var url = httpreq.PS_fectiveClass;
        utils.xhr.post(url, data1, (res) => {
            $(self.table).bootstrapTable('refresh');
        });
   }

    doEditTag(params) {
        // this.select_val.getComponent('tag-type-select.es6')._Validation(params.name);
        let url = httpreq.update_classification;
        utils.xhr.post(url, params, (res) => {
            this.getInitTableParms();
            $(this.table).bootstrapTable('refresh');
        });
    }
    showQryTimeOrRedCount(totalSize) {
        let total = parseInt(totalSize, 10);
        total = isNaN(total) ? 0 : total;
        $(this.node.dom).parent().find("#recordtext").text(`共有 ${total} 条记录`);
    }
}

module.exports = tagTypeMaintence;