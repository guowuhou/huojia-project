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

class pageRegionList extends uu.Component {
    
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
        var id = utils.url.get()['id'];
        this.getModuleInfo(id);
        this.rqoptions = { pageSize: 10, pageNo: 1 };
        this.bindEvents();
    }
    
    bindEvents(){
        $("#goBackPageRegionList").on('click',() =>{
            location.href = "product-page-manager.html"
        });
        $("#page_search").on('click',() =>{
             var obj = {};
             obj['parentCode'] = decodeURI(utils.url.get()['pageModuleCode']);
             var val = $("#pageRegionCode").val() ,data = $("#pageRegionCode").attr("real-value") , noOrName = '';
             if(data!=val) $("#pageRegionCode").attr("real-value",'');
             if(data == val){
                noOrName = data.split("-")[0]
             }else{
                noOrName = val
             }
             obj['pageRegionCode'] = noOrName;
             this.initTable(obj);
        });
         $("#page_create").on('click',() =>{
             var obj = {};
             obj['parentCode'] = decodeURI(utils.url.get()['pageModuleCode']);
             obj['pageCode'] = $("#pageRegionCode").val();
             this.createPage(obj);
        });
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
                    field: 'pageRegionSeq',
                    title: '页面区域顺序',
                    align: 'center'
                }, {
                    field: 'pageRegionCode',
                    title: '页面区域Code',
                    align: 'center'
                }, {
                    field: 'pageRegionName',
                    title: '页面区域名称',
                    align: 'center'
                }, {
                    field: 'recommendCount',
                    title: '已推荐产品数量',
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
                            this.onDelPage(row.id);
                        },
                         "click #eidtModle":(e,value,row)=>{
                            this.onEditePage(row.id);
                        },
                    }
                }
        ];
        $(this.myTable).bootstrapTable('destroy');
        $(this.myTable).bootstrapTable({
                url: httpreq.PS_queryPageRegionList,
                columns: listTable ,
                sortable: true,//是否启用排序
                sortOrder: " pageRegionSeq",//排序方式
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
    
    createPage(obj){
        var createHtml = null;
        var self = this;
        Dialog.show({
            title:'创建页面区域',
            nl2br: false,
            message:() =>{
                createHtml = $(require('tpl/create-page.tpl'));
                createHtml.find("#channelCode").html($("#pageChannel").text());
                createHtml.find("#merchantCode").html($("#merchantCode").text());
                createHtml.find("#pageModule").html($("#pageModuleName").text());
                createHtml.find("#pageModule").attr("parentCode",$("#copyModuleCode").text())
                createHtml.find("#RegionSeq").on('keyup',function(){
                    var value = $(this).val();
                    value = value==0 ? '' : value;
                    $(this).val(value.replace(/[^0-9]/g,''));
                    value = $(this).val();
                    if(value.length>5){
                        $(this).val(value.substring(0,value.length-1));
                    }
                });
                // createHtml.find("#RegionCode").on('input',function(){
                //     var reg  = /^[A-Za-z0-9]+$/;
                //     var value = $(this).val();
                //     $(this).val(value.replace(/[^0-9a-zA-Z]/g,''));
                // })
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
                            obj[name] = $(item).attr(name)
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
    
    checkVal() {
        var RegionSeq = $('.modal-content #RegionSeq').val();
        var RegionName = $('.modal-content #RegionName').val();
        var RegionCode = $('.modal-content #RegionCode').val();
        if(RegionSeq==''){
            Dialog.alert("页面区域顺序不能为空");
            return false;
        }else if(RegionName==''){
            Dialog.alert("页面区域名称不能为空");
            return false;
        };
         return true;
    }
    
    doCteate(obj) {
         var self = this;
         var url = '';
         url = obj.id?httpreq.PS_updatePageRegion :httpreq.PS_addPageRegion;
         obj.ModleType = null;
        $.get(url,obj, (response) => {
            if (response.code == '000000') {
                self.initTable(obj);
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
    
    onEditePage(id) {
         var createHtml = null;
        var self = this;
        Dialog.show({
            title:'编辑页面区域',
            nl2br: false,
            message:() =>{
                createHtml = $(require('tpl/create-page.tpl'));
                createHtml.find("#channelCode").html($("#pageChannel").text());
                createHtml.find("#merchantCode").html($("#merchantCode").text());
                createHtml.find("#pageModule").html($("#pageModuleName").text());
                createHtml.find("#pageModule").attr("parentCode",$("#copyModuleCode").text());
                var parent = createHtml.find("#RegionCode").parent();
                parent.find("#RegionCode").remove();
                parent.html('<p class="form-control-static" id="RegionCode" filter ="pageRegionCode"></p>');
                self.querySignRegion(id,createHtml);
                createHtml.find("#RegionSeq").on('keyup',function(){
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
                            obj[name] = $(item).attr('parentCode')
                        }else if(name == 'remark'){
                            obj[name] = $(item).val();
                        }
                        else{
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
    
    onDelPage(id) {
         var self = this;
         Dialog.show({
            title:'删除页面区域',
            nl2br: false,
            message:() =>{
                return "确认删除此页面区域及其所有的页面区域配置产品"
            },
            buttons:[
                {
                label: '删除',
                cssClass: 'btn-primary',
                action:function(dialogRef){
                    self.deleteRegoin(id);
                    dialogRef.close();
                }
                }
            ]
         })
    }
    
    deleteRegoin(id){
        var self = this;
        $.get(httpreq.PS_deletePageRegion,{id:id}, (response) => {
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
    
    getModuleInfo(id){
        var self = this;
        $.get(httpreq.PS_getPageModuleInfo,{id:id}, (response) => {
            if (response.code == '000000') {
                var modleData = response.data;
                let channelCode = modleData.parentCode;
                let merchantCode = modleData.merchantCode;
                var mapChannel = {
                                "C0001":"营业柜台",
                                "C0002":"网上银行",
                                "C0003":"口袋银行",
                                "C0004":"爱客",
                                "C0005":"橙E网",
                                "C0006":"智能投顾",
                                "C0009":"口袋插件",
                                "C0010":"厅堂",
                                "C0011":"银保通",
                                "C0012":"新口袋银行",
                                "C0013":"其它"
                };
                var mapMerchantCode = {
                    "ChannelSelf":"渠道内部",
                    "B20170426001001":"橙e财富（理财产品）"
                };
                var channelName = mapChannel[channelCode];
                var merchantName = mapMerchantCode[merchantCode];
                $("#pageChannel").text(channelName);
                $("#pageChannel").attr('channel',channelCode);
                $("#merchantCode").text(merchantName);
                let filter = $('.row').find('[filter]');
                _.each(filter,(item)=>{
                    let name = $(item).attr('filter');
                    if(name=="updateTime"||name=="createTime"){
                        let time = modleData[name];
                        if(time){
                            time = moment(time).format('YYYY-MM-DD HH:mm:ss');
                        }
                        $(item).text(time);
                    }else {
                        $(item).text(modleData[name]);
                    };
                });
                var obj = {};
                obj['parentCode'] = decodeURI(utils.url.get()['pageModuleCode']);
                obj['pageRegionCode'] = $("#pageRegionCode").val();
                self.initTable(obj);
            }else {
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
    
    querySignRegion(id,createHtml) {
        var self = this;
        $.get(httpreq.PS_getgetPageRegionInfo,{id:id}, (response) => {
            if (response.code == '000000') {
               var modleData = response.data;
               let filter = createHtml.find('[filter]');
                    _.each(filter,(item)=>{
                        let name = $(item).attr('filter');
                        if(name!='parentCode'){
                            if(name=='remark'||name=='pageRegionCode'){
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
    
     //操作事件
    functionEvents(value,row,index) {
        let html= `<a class='del' style='text-decoration:none;cursor: pointer' uuid="${row.id}" id='clearModle'><b>删除</b></a>
                   <a class='del' style='text-decoration:none;cursor: pointer' uuid="${row.id}" id='eidtModle'><b>编辑</b></a>`;
        return html;  
    }
}

module.exports = pageRegionList;