const $ = require("lib/jquery.js");
const _ = require("lib/underscore.js");
const utils = require('utils');
const Dialog = require("plugins/dialog.es6");
const httpreq = require('httpreq.es6');
const moment = require('lib/moment.js');
require('lib/bootstrap-table.js');

class templetCardList extends uu.Component {
    properties() {
      return {
          seeFlagInfoTag: {
              defaultValue: null,
              type: uu.Node
          }
      }
    }
    onLoad() {
      this.bindEvent();
      window.$ = $;
    } 
    start() {
        this.getTagList(0);
    }
    getselectTag(){
        var self = this,selectList=[];
         selectList = $("#cardListContainer").bootstrapTable('getAllSelections');
         return selectList;
    }
    bindEvent(){
        var self=this;
         $("#cardListContainer").on('click', 'a[uuid]', function () {
            const a = $(this);
            const uuid = a.attr('uuid');
            const row = $("#cardListContainer").bootstrapTable('getRowByUniqueId', uuid);
            self.editTable(row);
        })
    }
    //查询标签信息
    getTagList(_qparam) {
        if(this.reqFlag){
           return;
        }else{
           this.reqFlag = true;   //防止重复提交
        }

        if(!_qparam){
            this.queryData={
                prdCode:utils.url.get()['templetCode']
            };
        }
        else{
            this.queryData=_qparam;
        }
        //清除表格
        $("#cardListContainer").bootstrapTable('destroy');
        var columnList=[{
                title: '',
                field: '_isChecked',
                align: 'center',
                valign: 'middle',
                checkbox: true
            },{
                field: 'type',
                title: '标签/组合标签',
                align: 'center',
                formatter:(value,row)=>{
                    if(value=="1"){
                       return '标签';
                    }
                    if(value=="2"){
                       return '组合标签';
                    }
                }
            }, {
                field: 'tagCode',
                title: '标签ID',
                align: 'center'
            }, {
                field: 'name',
                title: '标签名称',
                align: 'center'
            }, {
                field: 'remark',
                title: '标签描述',
                align: 'center'
            }, {
                field: 'classification',
                title: '标签分类',
                align: 'center'
            }, {
                field: 'productClassification',
                title: '产品分类',
                align: 'center'
            },
            {
                field: 'dept',
                title: '所属部门',
                align: 'center'
            }, {
                field: '',
                title: '所含标签',
                align: 'center',
                formatter:(value,row)=>{
                    var tagChildren=row.tagChildren;
                    if(_.isEmpty(tagChildren)){
                       return '--';
                    }else{
                       var childTagList=_.map(tagChildren,(item)=>{
                           return item.name;
                       });
                       return childTagList.join(',');
                    }
                }
            },{
                    title: '操作',
                    field: 'edit',
                    align: 'center', valign: 'middle',
                    formatter: function (value, row, index) {
                        return `<a class='del' style='text-decoration:none;cursor: pointer' uuid="${row.tagCode}">编辑</a>`;
                    }
                }];
        $('#cardListContainer').bootstrapTable({
            url:httpreq.TagGroup_AllPages,//httpreq.attach_search
            columns: columnList,
            uniqueId:'tagCode',
            queryParams: (params) => {
                return this.queryData;
            },
            responseHandler: (res) => {
                let resDate = {};
                if (res.code == "000000"&&res.data) {
                    this.reqFlag = false;
                    this.list =res.data.list;
                    _.extend(resDate, {
                        rows: this.list || []
                    });
                } else if(res.responseCode=="683310"||res.responseCode=="900106"){
                    Dialog.alert(res.responseMsg||res.msg,()=>{
                        window.top.location.href="http://brop.pab.com.cn/portal/login.html";
                    });
                }else {
                    Dialog.alert(res.msg || res.responseMsg);
                    this.reqFlag = false;
                    resDate = {};
                }
                return resDate;
            },
            formatNoMatches: () => {
                return '查无记录';
            }
        });
    }
    editTable(row) {
        var self = this;
        let dept = row.dept;
        let deptCode = row.deptCode;
        var tagCode = row.tagCode;
        var name = row.name;
        var classificationCode = row.classificationCode;
        var productClassificationCode = row.productClassificationCode;
        var romateHtml = null;
        Dialog.show({
            title: '产品卡片和列表-编辑系统字段',
            nl2br: false,
            message: () => {
                romateHtml = $(require('./tpl-templetEdit.tpl'));
                var DeptParams = {
                    editTag:true,
                    deptCode:deptCode,
                    productClassificationCode:productClassificationCode,
                    classificationCode:classificationCode
                };
                romateHtml.find("#productType").text(dept);
                romateHtml.find("#productCode").text(deptCode);
                romateHtml.find('#product').text(tagCode);
                self.productFieldType(romateHtml,DeptParams);
                self.useScene(romateHtml,DeptParams);
                return romateHtml;
            },
            buttons: [{
                label: '保存',
                cssClass: 'btn-primary',
                action: (dialogRef) => {
                    var classificationCode = romateHtml.find("#classification").val();
                    
                        var _params = {
                            productfieldType: romateHtml.find('#productfieldType').val(),
                            useScene:romateHtml.find('#useScene').val(),
                            descName: romateHtml.find('#descName').val(),
                            descContent: romateHtml.find('#descContent').val(),
                            useDescName: romateHtml.find('#useDescName').val(),
                            useDescContent: romateHtml.find('#useDescContent').val(),
                        };
                        this.doEditTag(_params);
                    dialogRef.close();
                }
            }]
        });
    }
    doEditTag(_params){
        const url = httpreq.updateSingle;
        var self = this;
        utils.xhr.post(url, _params, (res) => {
            $("#ListContainer").bootstrapTable('refresh');
        });
    }
    productFieldType(romateHtml,DeptParams){
          var self = this;
          utils.xhr.post(httpreq.findAllDept,{ddType:32}, (res, event) => {
                var dep_data = res.data.dataList || [];
                romateHtml.find("#productfieldType").html="";
                if(dep_data.length > 0){
                    for(let i = 0;i < dep_data.length;i++){
                        romateHtml.find("#productfieldType").append(`<option value=${dep_data[i].deptNo}>${dep_data[i].deptName}</option>`)
                    }
                }
            });
    }
    useScene(romateHtml,DeptParams){
         var self = this;
          utils.xhr.post(httpreq.findAllDept,{ddType:32}, (res, event) => {
                var dep_data = res.data.dataList || [];
                romateHtml.find("#useScene").html="";
                if(dep_data.length > 0){
                    for(let i = 0;i < dep_data.length;i++){
                        romateHtml.find("#useScene").append(`<option value=${dep_data[i].deptNo}>${dep_data[i].deptName}</option>`)
                    }
                }
            });
    }
};


module.exports = templetCardList;


