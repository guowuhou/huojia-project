const $ = require("lib/jquery.js");
const _ = require('lib/underscore.js');
const httpreq = require('httpreq.es6');
const Dialog = require('plugins/dialog.es6');
const TagSelector = require('plugins/tag-selector.es6');
const EditRemark = require('plugins/edit-remark.es6');
const moment = require('lib/moment.js');
const utils = require('utils');
require('lib/bootstrap-table.js');
require('lib/bootstrap.autocomplete.js');

class ProPageManager extends uu.Component {
    
    properties() {
        return {
            myTable:{
                defaultValue: null,
                type: uu.Dom
            }
        };
    }
    
    onLoad(){
        window.$ = $;
        this.rqoptions = { pageSize: 10, pageNo: 1 };
        this.queryChannel();
        this.bindEvents();
    }
    
    bindEvents(){
        var self = this;
        $("#label_search").on('click',(event) =>{
            var obj = self.getParams();
            localStorage.setItem('pageModule',JSON.stringify(obj));
            this.initTable(obj);
        });
        $("#createModle").on('click',(event) =>{
            this.createModle();
        });
    }
    
    showBack(obj) {
        var self = this;
        var filter = $("#pageModule").find('[filter]');
         _.each(filter,(item)=>{
            let name = $(item).attr('filter');
            if(name !='pageNo'){
                $(item).val(obj[name])
            }
        });
        self.initTable(obj);
    }
    
    //获取参数
    getParams(){
        var channelCode = $("#recList").val();
        var merchantCode = $("#fXList").val();
        var val = $("#prdCode").val() ,data = $("#prdCode").attr("real-value") , noOrName = '';
            if(data!=val) $("#prdCode").attr("real-value",'');
            if(data == val){
                noOrName = data.split("-")[0]
            }else{
                noOrName = val
            }
        var prdCode = noOrName;
        var obj = {
            parentCode:channelCode,
            merchantCode:merchantCode,
            pageModuleCode:prdCode
        };
        return obj;
    }
    
    initTable(obj){
        let rqoptions = this.rqoptions;
        for (let v in rqoptions) {
            this.rqoptions[v] = rqoptions[v];
        };
        if (this.reqFlag) return;
        this.reqFlag = true;
        let listTable = [ 
                {
                    field: 'pageModuleSeq',
                    title: '页面模块顺序',
                    align: 'center'
                }, {
                    field: 'pageModuleCode',
                    title: '页面模块Code',
                    align: 'center'
                }, {
                    field: 'pageModuleName',
                    title: '页面模块名称',
                    align: 'center'
                },
                 {
                    field: 'regionCount',
                    title: '包含页面区域数量',
                    align: 'center'
                }, {
                    field: 'recommendCount',
                    title: '总配置已推荐产品数量',
                    align: 'center'
                },
                 {
                    field: 'updateBy',
                    title: '更新人',
                    align: 'center'
                }, {
                    field: 'updateTime',
                    title: '更新时间',
                    formatter:function(val){
                        if(val){
                            return moment(val).format('YYYY-MM-DD HH:mm:ss');
                        };
                        return '-'
                        
                    },
                    align: 'center'
                }
                ,{
                    title: '操作',
                    field: 'edit',
                    align: 'center', valign: 'middle',
                    formatter:_.bind(this.functionEvents,this),
                    events:{
                        "click #clearModle":(e,value,row)=>{
                            this.onDelModle(row.id);
                        },
                         "click #eidtModle":(e,value,row)=>{
                            this.onEditeModle(row.id);
                        },
                    }
                }
        ];
        $(this.myTable).bootstrapTable('destroy');
        $(this.myTable).bootstrapTable({
                url: httpreq.PS_queryPageModuleList,
                columns: listTable ,
                sortable: true,//是否启用排序
                sortOrder: "pageModuleSeq",//排序方式
                pagination: true,//是否显示分页
                pageSize: this.rqoptions.pageSize,//每页的记录行数
                queryParams: (params) => {//传递的参数
                    return _.extend({}, this.rqoptions,obj, {
                        pageSize: params.limit,//页面大小
                        pageNo: params.offset / params.limit + 1,
                    });
                },
                responseHandler: (res) => {
                    let resDate = {};
                    if (res.code == "000000") {
                        this.reqFlag = false;
                        _.extend(resDate, {
                            rows: res.data.pojos || [],
                            total: res.data.totalSize
                        });
                    }else if(res.responseCode == '900106'||res.responseCode == '683310'){
                            Dialog.alert(res.msg || res.responseMsg);
                            window.top.location.href = "http://brop.pab.com.cn/portal/login.html";
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
        })
    }
    
    //创建页面模块
    createModle(){
        var createHtml = null;
        var self = this;
        Dialog.show({
            title:'创建页面模块',
            nl2br: false,
            message:() =>{
                createHtml = $(require('tpl/create-modle.tpl'));
                var channel = $("#recList").val(),
                merchantCode = $("#fXList").val(),
                channelName = $("#recList option:selected").text();
                createHtml.find('#myChannel').append( `<p class="form-control-static" filter="parentCode" id="channelID" data-code=${channel}>${channelName}</p>`);
                createHtml.find("#channelID").text(channelName);
                createHtml.find("#merchantCode").html($("#fXList").html());
                createHtml.find("#merchantCode").val(merchantCode);
                createHtml.find("#pageModuleSeq").on('input',function(){
                    var value = $(this).val();
                    value = value==0 ? '' : value;
                    $(this).val(value.replace(/[^0-9]/g,''));
                    value = $(this).val();
                    if(value.length>5){
                        $(this).val(value.substring(0,value.length-1));
                    }
                });
                return createHtml;
            },
            buttons:[{
                label: '创建',
                cssClass: 'btn-primary',
                action:function(dialogRef){
                    let val_flag = self.checkVal();
                    if(!val_flag){
                        return
                    };
                    let obj = {};
                    let filter = this.parents().find(".modal-content").find('[filter]');
                    _.each(filter,(item)=>{
                        let name = $(item).attr('filter');
                        if(name=='parentCode'){
                            obj[name] = $(item).data('code');
                        }else if(name == 'merchantCode'||name == 'remark'){
                            obj[name] = $(item).val();
                        }else{
                            obj[name] = $(item).val() || $(item).text();
                        }
                    });
                    self.doCteate(obj);
                    dialogRef.close();
                }
            }]
        })
    }
    
     //删除页面模块
    onDelModle(id) {
        var self = this;
         Dialog.show({
            title:'删除页面模块',
            nl2br: false,
            message:() =>{
                return "确认删除此页面模块及其所有的页面区域配置"
            },
            buttons:[
                {
                label: '删除',
                cssClass: 'btn-primary',
                action:function(dialogRef){
                    self.deleteModle(id);
                    dialogRef.close();
                }
                }
            ]
         })
    }
    
    deleteModle(id){
        var self = this;
        $.get(httpreq.PS_deletePageModule,{id:id}, (response) => {
                if (response.code == '000000') {
                    $(self.myTable).bootstrapTable('refresh');
                }else {
                    if (response.responseCode == '900106') {
                        Dialog.alert(response.msg || response.responseMsg);
                        window.top.location.href = "http://bcoms.paic.com.cn/bcoms/login";
                        return;
                    } else {
                        Dialog.alert(response.msg || response.responseMsg);
                    }
                }
            })
    }
    
    //编辑页面模块
    onEditeModle(id){
        var createHtml = null;
        var self = this;
        Dialog.show({
            title:'编辑页面模块',
            nl2br: false,
            message:() =>{
                createHtml = $(require('tpl/create-modle.tpl'));
                var channel = $("#recList").val(),
                merchantCode = $("#fXList").val(),
                channelName = $("#recList option:selected").text();
                createHtml.find('#myChannel').append( `<p class="form-control-static" filter="parentCode" id="channelID" data-code=${channel}>${channelName}</p>`);
                createHtml.find("#channelID").text(channelName);
                createHtml.find("#merchantCode").html($("#fXList").html());
                createHtml.find("#pageModuleCode").attr("disabled", true);
                createHtml.find("#merchantCode").val(merchantCode);
                self.querySignModle(id,createHtml);
                createHtml.find("#pageModuleSeq").on('input',function(){
                    var value = $(this).val();
                    value = value==0 ? '' : value;
                    $(this).val(value.replace(/[^0-9]/g,''));
                    value = $(this).val();
                    if(value.length>5){
                        $(this).val(value.substring(0,value.length-1));
                    }
                });
                return createHtml;
            },
            buttons:[{
                label: '保存',
                cssClass: 'btn-primary',
                action:function(dialogRef){
                    let val_flag = self.checkVal();
                    if(!val_flag){
                        return
                    };
                    let obj = {};
                    let filter = this.parents().find(".modal-content").find('[filter]');
                    _.each(filter,(item)=>{
                        let name = $(item).attr('filter');
                        if(name=='parentCode'){
                            obj[name] = $(item).data('code');
                        }else if(name == 'merchantCode'||name == 'remark'){
                            obj[name] = $(item).val();
                        }else{
                            obj[name] = $(item).val() || $(item).text();
                        }
                    });
                    obj['id'] = id;
                    self.doCteate(obj);
                    dialogRef.close();
                }
            }]
        })
    }
    
    checkVal() {
        var pageModuleSeq = $('.modal-content #pageModuleSeq').val();
        var pageModuleCode = $('.modal-content #pageModuleCode').val();
        var pageModuleName = $('.modal-content #pageModuleName').val();
        if(pageModuleSeq==''){
            Dialog.alert("页面区域顺序不能为空");
            return false;
        }else if(pageModuleCode==''){
            Dialog.alert("页面区域代码不能为空");
            return false;
        }else if(pageModuleName==''){
            Dialog.alert("页面区域名称不能为空");
            return false;
        };
        return true;
    }
    
    doCteate(obj) {
         var self = this;
         var url = '';
         url = obj.id?httpreq.PS_updatePageModule :httpreq.PS_addPageModule;
         obj.ModleType = null;
        $.get(url,obj, (response) => {
            if (response.code == '000000') {
                 $(self.myTable).bootstrapTable('refresh');
            } else {
                if (response.responseCode == '900106') {
                    Dialog.alert(response.msg || response.responseMsg);
                    window.top.location.href = "http://bcoms.paic.com.cn/bcoms/login";
                    return;
                } else {
                    Dialog.alert(response.msg || response.responseMsg);
                }
            }
        });
    }
    
    //查询单个页面模块
    querySignModle(id,createHtml) {
        var self = this;
        $.get(httpreq.PS_getPageModuleInfo,{id:id}, (response) => {
            if (response.code == '000000') {
               var modleData = response.data;
               let filter = createHtml.find('[filter]');
                    _.each(filter,(item)=>{
                        let name = $(item).attr('filter');
                        if(name!='parentCode'||name!='merchantCode'){
                            if(name=='remark'){
                                $(item).text(modleData[name]);
                            }else{
                                $(item).val(modleData[name]);
                            }
                        }
                    });
            } else {
                if (response.responseCode == '900106') {
                    Dialog.alert(response.msg || response.responseMsg);
                    window.top.location.href = "http://bcoms.paic.com.cn/bcoms/login";
                    return;
                } else {
                    Dialog.alert(response.msg || response.responseMsg);
                }
            }
        });
    }
    
     //查接入渠道
    queryChannel() {
        var self = this;
        $.get(httpreq.PS_QryAccChannelAuth, (response) => {
            if (response.code == '000000') {
                let channelList = response.data;
                $(self.node.dom).find('#recList').html('');
                for (let index = 0; index < channelList.length; index++) {
                    let element = channelList[index];
                    if (element.accessChannelCode == 'C0003') {
                        $(self.node.dom).find('#recList').append(`<option value=${element.accessChannelCode} selected>${element.accessChannelName}</option>`);
                    } else {
                        $(self.node.dom).find('#recList').append(`<option value=${element.accessChannelCode}>${element.accessChannelName}</option>`);
                    }
                }
                self.queryFenXiao();
            } else {
                if (response.responseCode == '900106') {
                    Dialog.alert(response.msg || response.responseMsg);
                    window.top.location.href = "http://bcoms.paic.com.cn/bcoms/login";
                    return;
                } else {
                    Dialog.alert(response.msg || response.responseMsg);
                }
            }
        });
    }
    
    //查商户合作
    queryFenXiao(){
        var self = this;
        $.get(httpreq.QueryAccessMechantList, (response) => {
            if (response.code == '000000') {
                let fenXiaoList = response.data;
                for (let index = 0; index < fenXiaoList.length; index++) {
                    let element = fenXiaoList[index];
                    if (element.merchantCode == 'C0003') {
                        $(self.node.dom).find('#fXList').append(`<option value=${element.merchantCode} selected>${element.merchantName}</option>`);
                    } else {
                        $(self.node.dom).find('#fXList').append(`<option value=${element.merchantCode}>${element.merchantName}</option>`);
                    }
                }
                var pageModule = localStorage.getItem('pageModule');
                localStorage.removeItem('pageModule');
                if(pageModule){
                    this.showBack(JSON.parse(pageModule));
                }else{
                    var obj = self.getParams();
                    self.initTable(obj);
                }
            } else {
                //Dialog.alert(response.msg || response.responseMsg);

                if (response.responseCode == '900106') {
                    Dialog.alert(response.msg || response.responseMsg);
                    window.top.location.href = "http://bcoms.paic.com.cn/bcoms/login";
                    return;
                } else {
                    Dialog.alert(response.msg || response.responseMsg);
                }
            }
        });
        
    }
    
    //操作事件
    functionEvents(value,row,index) {
        let html= `<a class='del' style='text-decoration:none;cursor: pointer' uuid="${row.id}" id='clearModle'><b>删除</b></a>
                   <a class='del' style='text-decoration:none;cursor: pointer' uuid="${row.id}" id='eidtModle'><b>编辑</b></a>
                   <a class='del' style='text-decoration:none;cursor: pointer' href="page-RegionList.html?pageModuleCode=${row.pageModuleCode}&id=${row.id}"><b>管理区域</b></a>`;
        return html;  
    }
    
    
   
}
module.exports = ProPageManager;