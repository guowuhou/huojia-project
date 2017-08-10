const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
const _ = require('lib/underscore.js');
require('lib/bootstrap-table.js');
const httpreq = require('httpreq.es6');
const moment = require('lib/moment.js');
const utils = require('utils');

class productTemplet extends uu.Component {

    // show properties in Editor, you can use this.xxx directly
    properties() {
        return {
            btnAdd: {
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
        //定义新模板
        $(this.btnAdd).on('click', () => {
            this.defineTemplet();
        });
        $("#a_cleanterm").on('click', () => {
            let formAll = $('#productTem').find("form.navbar-form");
            for (let index = 0; index < formAll.length; index++) {
                let itemform = formAll[index];
                itemform.reset();
            };
        });
        $("#group_search").on('click',()=>{
             self.deptList=self.vm.get("deptCode");
             self.name=$("#productTemplet").val();
            $(self.tableList).bootstrapTable('refresh');
        });
        //编辑按钮
        $(this.node.dom).on('click', 'button[uuid]', function () {
            const btn = $(this);
            const uuid = btn.attr('uuid');
            //location.href = `product-series-edit.html?tagCode=${uuid}`;
            const row = $(self.tableList).bootstrapTable('getRowByUniqueId', uuid);
        })
    }
    strlen(str) {//判断文字个数公共方法
        str = str.replace(/(^\s*)|(\s*$)/g, "");
        let strlength = str.length;
        return strlength;
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
                    title: '<span style="padding:0px 47px">操作</span>',
                    align: 'center',
                    events: {
                        'click #forbidden': (e, value, row, index) => {
                            this.forbiddenTemp(row);
                        },
                        'click #startUse': (e, value, row, index) => {
                            this.startUseTemp(row);
                        },
                        'click #DelProduct': (e, value, row, index) => {
                            this.delProduct(row);
                        },
                        'click #editTemplet': (e, value, row, index) => {
                            this.editProductTemplet(row);
                        }
                        
                    },
                    //  formatter: function (value, row, index) {
                    //     return `<button type="button" class="btn btn-default btn-sm" uuid="${row.tagCode}">编辑</button>`;
                    // }
                    formatter:_.bind(this.functionEvents, this) 
                }
            ]
        });
    }
     functionEvents(value,row,index) {
            let insertHtml="";
            if(row.saleStatus=="禁用"){
                 insertHtml=`<li id="startUse">a href="#">启用</a></li>
                       `;
            }else{
                insertHtml=`<li id="forbidden"><a href="#">禁用</a></li>
                       `;
            }
        let html = `<div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">操作<span class="caret"></span></button>
                   <ul class="dropdown-menu dropdown-menu-right" role="menu">
                        <li id="editTemplet"><a>编辑</a></li>
                        <li id="DelProduct"><a href="#">删除</a></li>
                        <li><a href="#">复制成新模板</a></li>
                        ${insertHtml}
                  </ul>
          </div>
        `;
        return html;  
    }
    //定义新模板
    defineTemplet(){
        var romateHtml = null;
        var self=this;
        //启动窗口
        Dialog.show({
            title: '定义新模板',
            nl2br: false,
            message: ()=>{
                romateHtml = $(require('./tpl-defineTemplet-add.tpl'));
                self.productType(romateHtml);
                return romateHtml;
            },
            buttons: [{
                label: '保存',
                cssClass: 'btn-primary',
                action: (dialogRef) => {
                    const data = {
                        name: romateHtml.find('#templetName').val(),
                        productType: romateHtml.find('#productType').val(),
                        //dept: utils.array.find( vm.get('deptlist'), 'code', vm.get('deptCode'), 'name' ),
                        desc:romateHtml.find('#templetDesc').val(),
                    };
                    if (!data.name || data.name.length <= 1){
                        Dialog.alert('名称太短!');
                        return false;
                    };
                    self.doAddTagGroup(dialogRef, data);
                }
            }]
        });
        $(romateHtml.find('#templetName')).on('input', (event) => { 
              self.addTempletName();
        });
         $(romateHtml.find('#templetName')).on('blur', (event) => { 
              self.templetNamecheck();
        });
         $(romateHtml.find('#templetDesc')).on('input', (event) => { 
              self.addTempletDesc();
            })
    }
    //产品模板名称输入字数的控制
     addTempletName(){
        let productTempletName = $("#templetName").val();
        let strlength = this.strlen(productTempletName);
        $("#productTempletName").text(50 - strlength);
        if (strlength > 50) {
            $("#productTempletName").val(productTempletName.slice(0, 50));
            $("#productTempletName").text(0);
        }
    }
    //产品名称唯一性的校验
    templetNamecheck(){
        utils.xhr.post(httpreq.findAllDept,{ddType:32}, (res, event) => {
                var dep_data = res.data.dataList || [];
                if(dep_data.length != '0'){
                   Dialog.alert("该模板产品名称已经存在，请重新命名。")
                }
            });
    }
    //备注输入字数的控制
    addTempletDesc(){
        let productTempletDesc = $("#templetDesc").val();
        let descstrlength = this.strlen(productTempletDesc);
        $("#productTempletDesc").text(200 - descstrlength);
        if (descstrlength > 200) {
            $("#productTempletDesc").val(productTempletDesc.slice(0,200));
            $("#productTempletDesc").text(0);
        }
    }
    //获取产品类型
    productType(romateHtml){
          var self = this;
            utils.xhr.post(httpreq.findAllDept,{ddType:32}, (res, event) => {
                var dep_data = res.data.dataList || [];
                romateHtml.find("#productType").html="";
                if(dep_data.length > 0){
                    for(let i = 0;i < dep_data.length;i++){
                        romateHtml.find("#productType").append(`<option value=${dep_data[i].deptNo}>${dep_data[i].deptName}</option>`)
                    }
                }
            });
    }
     //保存向后台发送增加组合标签的请求
    doAddTagGroup(dialogRef, data) {
        const url = httpreq.TagGroup_Add;
        utils.xhr.post(url, data, (res) => {
            dialogRef.close();
            $(this.tableList).bootstrapTable('refresh');
        });
    }
    //编辑模板接口查询
    editProductTemplet(row){
        utils.xhr.post(httpreq.TagGroup_AllPages,{
            prdCode: row.prdCode
        },(res)=>{
            if (res.templetStatus !== "1") {
                var dialog3 = Dialog.show({
                    title: '',
                    nl2br: false,
                    cssClass: 'ts-dialog',
                    message: () => {
                        return `${'因为此模板正在被产品使用，任何字段的编辑都可能影响渠道页面。确认继续进行编辑模板？'}`;
                    },
                    buttons: [{
                        label: '确定',
                        cssClass: 'btn btn btn-primary',
                        action: () => {
                            window.location.href = "product-templet-detailinfo.html?prdCode=${row.prdCode}";
                        }
                    }]
                })
            } else {
                window.location.href = "product-templet-detailinfo.html?prdCode=${row.prdCode}";
            }
        })
    }
    //禁用
    forbiddenTemp(row){
         utils.xhr.post(httpreq.PS_FinancialDelete, {
                                       prdCode: row.prdCode
                                   }, (res) => {
                                       Dialog.alert('禁用成功');
                                       $(this.tableList).bootstrapTable('refresh');
                                   });
    }
    //启用
    startUseTemp(row){
         utils.xhr.post(httpreq.PS_FinancialDelete, {
                                       prdCode: row.prdCode
                                   }, (res) => {
                                       Dialog.alert('启用成功');
                                       $(this.tableList).bootstrapTable('refresh');
                                   });
    }
    //删除
    delProduct(row){
         var dialog1 = Dialog.show({
                    title: '',
                    nl2br: false,
                    cssClass: 'ts-dialog',
                    message: () => {
                        return `${'是否确定删除此模板？'}`;
                    },
                    buttons: [{
                        label: '确定',
                        cssClass: 'btn btn btn-primary',
                        action: () => {
                            utils.xhr.post(httpreq.TagGroup_AllPages,{
                                prdCode:row.prdCode
                            },(res) =>{
                                if (!res.use) {
                                    var dialog2=Dialog.show({
                                        title: '',
                                        nl2br: false,
                                        cssClass: 'ts-dialog',
                                        message: () => {
                                            return `${'因为此模板正在被产品使用，不可以删除。'}`;
                                        },
                                        buttons:[{
                                            label: '知道了',
                                            cssClass: 'btn btn btn-primary',
                                             action: () => {
                                                 dialog1.close();
                                                 dialog2.close();
                                             }
                                        }]
                                    })
                                } else {
                                   utils.xhr.post(httpreq.PS_FinancialDelete, {
                                       prdCode: row.prdCode
                                   }, (res) => {
                                       Dialog.alert('删除成功');
                                       $(this.tableList).bootstrapTable('refresh');
                                       dialog1.close();
                                   });
                               }
                           });
                        }
                    }]
                });
    }

};

module.exports = productTemplet;