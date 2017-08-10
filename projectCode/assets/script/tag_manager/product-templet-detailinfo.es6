const $ = require("lib/jquery.js");
const _ = require("lib/underscore.js");
const utils = require('utils');
const Dialog = require("plugins/dialog.es6");
const httpreq = require('httpreq.es6');
const moment = require('lib/moment.js');
const EditRemark = require('plugins/edit-remark.es6');
require("lib/bootstrap-datetimepicker.js");


class productTempletInfo extends uu.Component {
    properties() {
        return {
            proListNode: {
                defaultValue: null,
                type: uu.Node
            },
            proDetailNode: {
                defaultValue: null,
                type: uu.Node
            }
        }
    }
   onLoad(){
      this.dataEvents(); //数据绑定,初始化视图
      this.queryCustomInfo(); //渲染页面
      window.$ = $; 
   } 
   start() {
    this.bindEvents();//绑定事件
   } 
   dataEvents(){
       const vm = this.vm = new uu.ViewModel({
           container:".productTemplet",
           view: require("./product-templet-detailinfo.tpl"),
           model:{
               templetCode:utils.url.get()['templetCode']||"",
               templetName:"",
               prdType:"",
               creatBy:"",
               creatTime:"",
               templetDesc:"",
               updateBy:"",
               updateTime:"",
               
           }
    //        setPrdCode: function (val) {
    //         val = val.replace(/[^0-9a-zA-Z]/g, '');
    //         vm.set('prdCode', val);
    //         return val;
    //        },
       });
    window.vm = this.vm;
   } 
   queryCustomInfo(){
       var url = httpreq.TagGroup_AllPages,
        data = {
          templetCode:utils.url.get()['templetCode'],
        },
        self = this;
        utils.xhr.post(url, data, function (response){
            let customInfo = response.data;
            self.vm.set("templetName", customInfo.templetName||"");
            self.vm.set("updateTime", customInfo.updateTime||"");
            self.vm.set("prdType", customInfo.prdType||"");
            self.vm.set("creatBy", customInfo.creatBy||"");
            self.vm.set("creatTime", customInfo.creatTime||"");
            self.vm.set("templetDesc", customInfo.templetDesc||"");
            self.vm.set("updateBy", customInfo.updateBy||"");
        })
   }
   bindEvents() {
       var self = this;
       //添加系统字段
       $(this.node.dom).on('click', '#list_addSystem', function () {
           self.addSystemField(1);
       });
       //添加自定义字段
       $(this.node.dom).on('click', '#list_addDefine', function () {
           self.addDefineField(1);
       });
       //删除
       $(this.node.dom).on('click', '#list_delete', function () {
           self._delete(1);
       });
        $(this.node.dom).on('click', '#detail_delete', function () {
            self._delete(2);
       });
       //添加自定义字段
       $(this.node.dom).on('click', '#detail_addDefine', function () {
           self.addDefineField(2);
       });
       //删除
       $(this.node.dom).on('click', '#detail_addSystem', function () {
           self.addSystemField(2);
       });
   }
   //添加系统字段
   addSystemField(param){
       var self=this;
       var addlistTitle='';
       var realUrl='';
       var checkedId;
       var editHtml = null;
       if(param=='1'){
           addlistTitle='产品卡片和列表-添加系统字段';
           realUrl= httpreq.findAllDept;
       }else{
           addlistTitle='产品详情-添加系统字段';
           realUrl= httpreq.findAllDept;
       }
        Dialog.show({
            title: addlistTitle,
            nl2br: false,
            message: () => {
                editHtml = $(require('./tpl-addsystemfield.tpl'));
                var DeptParams = {
                    editTag:true,
                };
                //self.productFieldType(editHtml,DeptParams);
                //self.useScene(editHtml,DeptParams);
                return editHtml;
            },
            buttons: [{
                label: '确认',
                cssClass: 'btn-primary',
                action: (dialogRef) => {
                    var classificationCode = editHtml.find("#classification").val();
                    
                        var _params = {
                            // productfieldType: editHtml.find('#productfieldType').val(),
                            // useScene:editHtml.find('#useScene').val(),
                            // descName: editHtml.find('#descName').val(),
                            // descContent: editHtml.find('#descContent').val(),
                            // useDescName: editHtml.find('#useDescName').val(),
                            // useDescContent: editHtml.find('#useDescContent').val(),
                            // realUrl:realUrl,
                        };
                       // this.doEditTag(_params);
                    dialogRef.close();
                }
            }]
        }); 
        $(editHtml.find('#fieldlist li')).on('click', (e) => {
            var $li = $(e.target);
            var rgb = $li.css("background");
            //var rrr=rgb.match(/^rgb((d+),s*(d+),s*(d+))$/); 
            if(!$li){
                
            }else{
                $(editHtml.find('li')).css("background","");
                $li.css("background","blue");
                checkedId=$li.attr('id');
            }
        });
        $(editHtml.find('#addfield')).on('click', (event) => {
           if(!checkedId){
               Dialog.alert("请选择要添加的系统字段")
           }else{
               self.addFieldList(checkedId);
           }
        });
        $(editHtml.find('#deletefield')).on('click', (event) => {
            
        });
       
   }
   addFieldList(checkedId){
      $("#1").remove();
      var lihtml= '<li style="list-style-type:none;">'+888+'</li>';
      $("#addBasicInfo").append(lihtml);
   }
   addDefineField(param){
       var self=this;
       var listTitle='';
       var realUrl='';
       var romateHtml = null;
       if(param=='1'){
           listTitle='产品卡片和列表-编辑系统字段';
           realUrl= httpreq.findAllDept;
       }else{
           listTitle='产品详情-编辑系统字段';
           realUrl= httpreq.findAllDept;
       }
        Dialog.show({
            title: listTitle,
            nl2br: false,
            message: () => {
                romateHtml = $(require('./tpl-definefield-add.tpl'));
                var DeptParams = {
                    editTag:true,
                };
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
                            realUrl:realUrl,
                        };
                        this.doEditTag(_params);
                    dialogRef.close();
                }
            }]
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
   doEditTag(_params){
       var self = this;
       utils.xhr.post(_params.realUrl, _params, (res) => {
            $("#ListContainer").bootstrapTable('refresh');
            $("#cardListContainer").bootstrapTable('refresh');
        });
   }
   _delete(param){
       var self=this;
       if(param=="1"){
         var selectList=self.proListNode.getComponent("product-templet-cardlist.es6").getselectTag();
         if(selectList.length <= 0) {
            Dialog.alert("请勾选要操作的标签");
            return;
         };
         var checkedlength=selectList.length;
          Dialog.show({
            title: '',
            nl2br: false,
            message: () => {
                return `${'确定删除'}`+checkedlength+`${'个字段'}`;
            },
            buttons: [{
                label: '确定',
                cssClass: 'btn-primary',
                action: (dialogRef) => {
                    var tagCodeList = _.map(selectList, (item) => {
                        return item.tagCode;
                    });
                    var data = {
                        tagCode: tagCodeList.join()
                    };
                    utils.xhr.post(httpreq.TagGroup_AllPages, data, (res) => {
                        Dialog.alert("标签删除成功", () => {
                            self.proListNode.getComponent("product-templet-cardlist.es6").getTagList();
                        });
                    });
                    dialogRef.close();
                }
            }]
        });
       }; 
       if(param=="2"){
           var selectList = self.proListNode.getComponent("product-templet-list.es6").getselectTag();
           if (selectList.length <= 0) {
               Dialog.alert("请勾选要操作的标签");
               return;
           };
           var selesctedlength=selectList.length;
            Dialog.show({
            title: '',
            nl2br: false,
            message: () => {
                return `${'确定删除'}`+selesctedlength+`${'个字段'}`;
            },
            buttons: [{
                label: '确定',
                cssClass: 'btn-primary',
                action: (dialogRef) => {
                    var tagCodeList = _.map(selectList, (item) => {
                        return item.tagCode;
                    });
                    var data = {
                        tagCode: tagCodeList.join()
                    };
                    utils.xhr.post(httpreq.TagGroup_AllPages, data, (res) => {
                        Dialog.alert("标签删除成功", () => {
                            self.proListNode.getComponent("product-templet-cardlist.es6").getTagList();
                        });
                    });
                    dialogRef.close();
                }
            }]
        });
       }
   }
};
module.exports = productTempletInfo;