const $ = require("lib/jquery.js");
const ejs = require("lib/ejs.js");
const httpreq = require('httpreq.es6');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const moment = require('lib/moment.js');
const utils = require('utils');
require('lib/bootstrap-table.js');

class tagMaintence extends uu.Component {
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
            table: {
                defaultValue: null,
                type: uu.Dom
            },
            select_val: {
                defaultValue: null,
                type: uu.Node
            },
            sel_prd: {
                defaultValue: null,
                type: uu.Dom
            },
            sel_dep: {
                defaultValue: null,
                type: uu.Dom
            }
        }
    }

    onLoad() {
        this.rqoptions = { pageSize: 10, pageNo: 1 };
        this.getInitTableParms();
        this.initTable();
        this.bindEvent();
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
            url: httpreq.Tag_AllPages,
            uniqueId: 'tagCode',
            pagination: true,
            pageSize: this.rqoptions.pageSize,
            queryParams: (params) => {
                return _.extend({}, this.rqoptions, {
                    pageSize: params.limit,
                    pageNo: params.offset / params.limit + 1,
                    deptCode: this.tableParams.deptCode,
                    productClassificationCode: this.tableParams.productClassificationCode,
                    name:this.tableParams.name,//标签名称参数
                    status:this.tableParams.status,
                    type:'1'
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
                    title: '标签ID',
                    field: 'tagCode',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '标签名称',
                    field: 'name',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '标签分类',
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
        $(this.btnAdd).on("click", () => {
            this.onAddTag();
        });
        $(this.btnDel).on('click', () => {
            this.onDelTag();
        });
        $("#label_search").on("click",()=>{
            this.labelSearch();
        });
        $("#status").change(function(){
            self.getInitTableParms();
            $(self.table).bootstrapTable('refresh');
        });
        $(this.sel_prd).change(() => {
            this.getInitTableParms();
            $(this.table).bootstrapTable('refresh');

        });
        $(this.sel_dep).change(() => {
            this.getInitTableParms();
            $(this.table).bootstrapTable('refresh');

        });
    }
    deptSelect(romateHtml,DeptParams){
        var self = this;
            utils.xhr.post(httpreq.findAllDept,{ddType:32}, (res, event) => {
                var dep_data = res.data.dataList || [];
                romateHtml.find("#dept").html="";
                if(dep_data.length > 0){
                    for(let i = 0;i < dep_data.length;i++){
                        romateHtml.find("#dept").append(`<option value=${dep_data[i].deptNo}>${dep_data[i].deptName}</option>`)
                    }
                    var PrdParams = DeptParams ;
                    if(!DeptParams.addTag){
                        romateHtml.find("#dept").val(DeptParams.deptCode);
                    }else{
                        PrdParams["deptCode"] = romateHtml.find("#dept").val()
                    }
                    self.addPrdSelect(romateHtml,PrdParams)
                }
            });
        }

    addPrdSelect(romateHtml,PrdParams) {
        var self = this;
        var  deptCode = PrdParams.deptCode;
        if(PrdParams.isChange||PrdParams.isChecked){
            deptCode = romateHtml.find("#dept").val();
        }
        utils.xhr.post(httpreq.findAllProduct, { deptCode: deptCode}, (res) => {
            var prd_data = res.data.list || [];
            romateHtml.find("#productClassification").html("");
            if (prd_data.length > 0) {
                for (let i = 0; i < prd_data.length; i++) {
                    romateHtml.find("#productClassification").append(
                        `<option value=${prd_data[i].code}>${prd_data[i].name}</option>`);
                }
                var ClassParams = PrdParams;
                if(PrdParams.isChecked){
                    romateHtml.find("#productClassification").val("pro0001");
                    ClassParams.deptCode = "dpt0003";
                }else if(!PrdParams.addTag&&!PrdParams.isChange){
                    romateHtml.find("#productClassification").val(PrdParams.productClassificationCode);
                }
                ClassParams.productClassificationCode = romateHtml.find("#productClassification").val();
                self.addTypeSelect(romateHtml,ClassParams)
            }
        });
    }

    addTypeSelect(romateHtml,ClassParams) {
        var self = this , deptCode = ClassParams.deptCode , productClassificationCode = ClassParams.productClassificationCode ;
        if(ClassParams.isChange){
            productClassificationCode = romateHtml.find("#productClassification").val()
            deptCode = romateHtml.find("#dept").val()
        }
        if(ClassParams.isChecked){
            productClassificationCode = "pro0001"
        }
        utils.xhr.post(httpreq.Tag_FindClassification, {deptCode: deptCode , productClassificationCode:productClassificationCode}, (res) => {
            var prd_data = res.data.list || [];
            romateHtml.find("#classification").html("");
            if (prd_data.length > 0) {
                for (let i = 0; i < prd_data.length; i++) {
                    romateHtml.find("#classification").append(
                        `<option value=${prd_data[i].classificationCode}>${prd_data[i].classification}</option>`);
                }
                if(ClassParams.isChecked){
                    romateHtml.find("#classification").val("cpa000013");
                }else if(!ClassParams.addTag&&!ClassParams.isChange){
                    romateHtml.find("#classification").val(ClassParams.classificationCode);
                }
            }
        });
    }
    labelSearch(){
         this.getInitTableParms();
         this.tableParams.name=$("#labelName").val();
         $(this.table).bootstrapTable('refresh');
    }  
    onAddTag() {
        var romateHtml = null;
        var self = this;
        Dialog.show({
            title: '创建标签',
            nl2br: false,
            message: () => {
                romateHtml = $(require('tpl/tag-add.tpl'));
                var DeptParams = {
                    addTag:true,
                    deptCode:"",
                    productClassificationCode:"",
                    classificationCode:""
                };
                self.deptSelect(romateHtml,DeptParams);
                romateHtml.find('input[_check]').on('click', () => {
                    let checkFlag = romateHtml.find('input[_check]').is(':checked');
                    var CheckParams = {
                        isChecked:checkFlag
                    };
                    this.input_checked(romateHtml, CheckParams);
                });
                romateHtml.find("#dept").change(function () {
                     var PrdParams = {
                         isChange:true,
                         deptCode:romateHtml.find("#dept").val()
                        }
                    self.addPrdSelect(romateHtml,PrdParams)
                });
                romateHtml.find("#productClassification").change(function () {
                    var ClassParams = {
                        isChange:true,
                        productClassificationCode:romateHtml.find("#productClassification").val()
                        }
                    self.addTypeSelect(romateHtml,ClassParams)
                    });
                return romateHtml;
            },
            buttons: [{
                label: '保存',
                cssClass: 'btn-primary',
                action: (dialogRef) => {
                    var name = romateHtml.find('input[name]').val();
                    var classification = romateHtml.find("#classification").val();
                    var desc = romateHtml.find('textarea[desc]').val();
                    var vali_flag = this.select_val.getComponent('tag-type-select.es6')._Validation(name);
                    if (!vali_flag) { return };
                    if(classification==''){
                        Dialog.alert("请选择标签分类");
                        return;
                    }
                    var _params = {
                        name: name,
                        classificationCode: classification,
                        deptCode:romateHtml.find("#dept").val(),
                        remark: desc
                    };
                    this.doAddTag(_params);
                    dialogRef.close();
                }
            }]
        });
    }

    doAddTag(params) {
        var url = httpreq.insertSingle;
        var self = this;
        utils.xhr.post(url, params, (res) => {
            Dialog.alert("添加成功")
            $(self.table).bootstrapTable('refresh');
        });
    }
    editTable(row,flag) {
        var self = this;
        let dept = row.dept;
        let deptCode = row.deptCode;
        var tagCode = row.tagCode;
        var status = row.status;
        var name = row.name;
        var classificationCode = row.classificationCode;
        var productClassificationCode = row.productClassificationCode;
        var romateHtml = null;
        Dialog.show({
            title: flag?'查看标签':'编辑标签',
            nl2br: false,
            message: () => {
                romateHtml = $(require('tpl/tag-edit.tpl'));
                var DeptParams = {
                    editTag:true,
                    deptCode:deptCode,
                    productClassificationCode:productClassificationCode,
                    classificationCode:classificationCode
                };
                self.deptSelect(romateHtml,DeptParams);
                romateHtml.find("#tagCode").text(tagCode);
                romateHtml.find("#status").val(row.status);
                romateHtml.find("input[name]").val(name);
                romateHtml.find('textarea[desc]').text(row.remark);
                romateHtml.find('p[createTime]').text(moment(row.createDate).format("YYYY-MM-DD HH:mm:ss"));
                romateHtml.find('p[updateTime]').text(moment(row.updateDate).format("YYYY-MM-DD HH:mm:ss"));
                if(flag){
                    romateHtml.find("input").attr('disabled',true);
                    romateHtml.find("select").attr('disabled',true);
                    romateHtml.find("textarea").attr('disabled',true);
                };
                romateHtml.find("#dept").change(function () {
                     var PrdParams = {
                         isChange:true,
                         deptCode:romateHtml.find("#dept").val()
                        }
                    self.addPrdSelect(romateHtml,PrdParams)
                });
                romateHtml.find("#productClassification").change(function () {
                        var ClassParams = {
                            isChange:true,
                            productClassificationCode:romateHtml.find("#productClassification").val()
                            }
                    self.addTypeSelect(romateHtml,ClassParams)
                    });
                
                romateHtml.find('input[_check]').on('click', () => {
                    let checkFlag = romateHtml.find('input[_check]').is(':checked');
                    var CheckParams = {
                        isChecked:checkFlag
                    };
                    this.input_checked(romateHtml, CheckParams);
                })
                return romateHtml;
            },
            buttons: [{
                label: flag?'确定':'保存',
                cssClass: 'btn-primary',
                action: (dialogRef) => {
                    var remark = romateHtml.find('textarea[desc]').val();
                    var classificationCode = romateHtml.find("#classification").val();
                    var _params = {
                        tagCode: tagCode,
                        name: romateHtml.find('input[name]').val(),
                        classificationCode: classificationCode,
                        status:romateHtml.find('#status').val(),
                        remark: remark
                    };
                    if(!flag){
                    this.doEditTag(_params);
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
            tagCode : row.tagCode
        };
        var url = httpreq.PS_fectiveSingle;
        utils.xhr.post(url, data1, (res) => {
            $(self.table).bootstrapTable('refresh');
        });
    }
    
    input_checked(romateHtml, CheckParams) {
        var self = this;
        if (CheckParams.isChecked) {
            romateHtml.find("#dept").val("dpt0003");
            self.addPrdSelect(romateHtml,CheckParams);
            romateHtml.find("#dept,#classification,#productClassification").attr("disabled", "disabled")
        } else {
            romateHtml.find("#dept,#classification,#productClassification").attr("disabled", false)
        }
    }

    doEditTag(params) {
        this.select_val.getComponent('tag-type-select.es6')._Validation(params.name);
        const url = httpreq.updateSingle;
        var self = this;
        utils.xhr.post(url, params, (res) => {
            this.getInitTableParms();
            $(self.table).bootstrapTable('refresh');
        });
    }

    onDelTag() {
        var ids = $.map($(this.table).bootstrapTable('getSelections'), (row) => {
            let _obj = {};
            _obj['tagCode'] = row.tagCode;
            _obj['deptCode'] = row.deptCode;
            return _obj;
        });
        var _deptCode = [], _list = [];
        for (let i = 0; i < ids.length; i++) {
            _deptCode.push(ids[i].deptCode);
            // if (ids[i].deptCode == "dpt0003") {
                _list.push(ids[i].tagCode);
            // }
        };
        var noneKDFlag = _.every(_deptCode, (item) => {
            return item != "dpt0003"
        });
        if (!ids.length) {
            Dialog.alert("至少选择一个标签")
        } else {
            let url = httpreq.deleteSingle;
            utils.xhr.post(url, { list: JSON.stringify(_list) }, (res) => {
                Dialog.alert("删除成功")
                $(this.table).bootstrapTable('refresh');
            });
        }
    }

    showQryTimeOrRedCount(totalSize) {
        let total = parseInt(totalSize, 10);
        total = isNaN(total) ? 0 : total;
        $(this.node.dom).parent().find("#recordtext").text(`共有 ${total} 条记录`);
    }
};

module.exports = tagMaintence