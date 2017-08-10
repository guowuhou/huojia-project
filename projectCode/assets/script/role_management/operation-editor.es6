const $ = require("lib/jquery.js");
const _ = require("lib/underscore.js");
const utils = require('utils');
const Dialog = require("plugins/dialog.es6");
const httpreq = require('httpreq.es6');
const moment = require('lib/moment.js');
const TagSelector = require('plugins/tag-selector.es6');
const EditRemark = require('plugins/edit-remark.es6');
require('lib/bootstrap-table.js');

class roleOperationsClass extends uu.Component {
    properties() {
        return {
            roleList: {
                defaultValue: null,
                type: uu.Node
            }
        }
    }
    onLoad(){   //数据绑定，初始化视图
         this.roleNo = utils.url.get()['roleNo']; 
         this.getDepList();
         this.dataEvents();     //获取所属部门的下拉  
         //this.getPageType();     //分析页面类型：创建、编辑、查看
         window.$=$;
    }
    //创建角色时获取下拉列表
   getDepList(){
    var self = this;
    utils.xhr.post(httpreq.QryAllDept, {},(res) => {
        self._data = res.data.dataList; 
        self.vm.set('departmentList',self._data);
        self.initTable(); //初始化表格
    });
    this.getPageType();
   }
   dataEvents(){
       var self=this;
       const vm = this.vm = new uu.ViewModel({
       container:"#rolemanager",
       view:require("./operation-editor.tpl"),
       model:{
           attachFlag:false,
           title:'创建角色', 
           operation:'创建',
           departmentList:[], //因为返回的是数组所以要用[]声明
           roleName:'',
           roleNo:'',
           deptNo:'dpt0002',
           remark:'',
           status:'',
       },
     });
     window.vm=this.vm;
     self.bindEvents();
   }
   
 
   //查询或编辑页面
   getPageType () {    
    if (this.roleNo){
      this.queryroleInfo();
      this.getDataList(0);//此0表示的是一个参数，并无实际意义
    }
   }
   queryroleInfo(){
    var self=this;
    utils.xhr.post(httpreq.EditRole, {roleNo:this.roleNo}, function (response) {
        let customInfo=response.data.roleInfo;
        self.customInfoList=response.data.roleInfo;
          self.vm.set("title",'编辑角色');
          self.vm.set("operation",'保存');
          self.vm.set("roleName",customInfo.roleName||'');
          //self.vm.set("departmentList",customInfo.departmentList||'');
          self.vm.set("remark",customInfo.remark||'');
          self.vm.set("roleNo",customInfo.roleNo||'');
          self.vm.set("deptNo",customInfo.roleDept||'');
          self.showPageInfo(customInfo);
    });
  }
  showPageInfo(infodata){
      if(infodata.status=='1'){
         $("#radioOne").prop("checked",true);
      }else{
         $("#radioTwo").prop("checked",true);
      };
  }


  bindEvents() {
      var self = this;
      if (this.roleNo) {
          $("#roleCode").css('display', 'block');
          $("#departmentSelect").attr('disabled', 'disabled');
          $("#departmentSelect").css({'background': '#F1F1F1','cursor':'not-allowed'});
          $("#inputRoleCode").attr('readonly', 'readonly');
          $("#inputRoleCode").css({'background': '#F1F1F1','cursor':'not-allowed'});
      } else {
          $("#departmentSelect").on("change", function () {
              self.initTable();
          });
      };
      $("#inputroleName").on('blur', function () {
          self.blurEvents();
      });
      $("#btn_create").on('click', function () {
          self.creatEvents();
      })
  }
   //初始化表格
   initTable(){
       let initparam=$("#departmentSelect option:selected").val();
       this.getDataList(initparam)
   }
   //父子表
   getDataList(data){
       var self=this;
       var roleListUrl,
           param;
       if(this.roleNo){
           roleListUrl=httpreq.EditRole;
           param={roleNo:this.roleNo};
       }else{
           roleListUrl=httpreq.RoleQryMenuAuth;
           param={deptNo:data};
       }
       $("#operationTable").bootstrapTable('destroy');
       $("#operationTable").bootstrapTable({
                url: roleListUrl,
                method: 'get',
                detailView: true,//父子表
                queryParams: param,
                //加载后展开子表
                onLoadSuccess:function(){
                    $("#operationTable").bootstrapTable("expandAllRows");
                },
                columns: [{
                    field: 'authName',
                    title: '一级菜单',
                    align: 'center'
                },{
                    field: '',
                    title: '允许操作',  
                    align: 'center'
                },  ],
                //注册加载子表的事件。注意下这里的三个参数！
                onExpandRow: function (index, row, $detail) {
                    self.InitSubTable(index, row, $detail);
                },
                responseHandler: (res) => {
                    let resDate = {};
                    if (res.code == "000000") {
                        var FirstList = res.data.FirstList;
                        var secondList = res.data.SecondList;
                        _.each(FirstList, (first) => {
                            first.submenu = _.where(secondList, {
                                parentAuthNo:first.authNo
                            })
                        });
                        _.extend(resDate, {
                            rows: res.data.FirstList || []
                        });
                    }else if(res.responseCode == '900106'||res.responseCode == '683310'){
                         Dialog.alert(res.msg || res.responseMsg);
                         window.top.location.href = "http://brop.pab.com.cn/portal/login.html";
                    } else {
                            Dialog.alert(res.msg || res.responseMsg);
                            this.productInfoList = res.data.FirstList;
                            resDate = {};
                    }
                    return resDate;
                },    
            });
   }
   InitSubTable(index, row, $detail){
       var self=this;
        var cur_table = $detail.html('<table subTable></table>').find('table');
        //$(cur_table).bootstrapTable('destroy');
        $(cur_table).bootstrapTable({
            data:row.submenu,
            method: 'get',
            queryParams: {
                    ddType: 68,
                    parentCode: '',
                },
            columns: [{
                field: 'authName',
                title: '二级菜单',
                align: 'center'
            }, {
                checkbox: true,
                title:"允许操作",
                field:'isSelect',
                formatter:(isSelect)=>{
                    if(isSelect=='1'){
                        return true
                    }
                }
            }, ],  
        })
   }
   //失去焦点事件,校验角色名称
   blurEvents(){
     var roleName=$("#inputroleName").val();
     utils.xhr.post(httpreq.IsRoleExist, {roleName:roleName}, (res) => {
       $("#right").css('display','inline');
       $("#error").css('display','none');
    },(res)=>{
         $("#error").css('display','inline'); 
         $("#right").css('display','none'); 
    });  
   }
   creatEvents(){
       var self=this,
           checkedList=[],
           changeList=[];
       $("#operationTable").bootstrapTable("expandAllRows");//展开所有子表格为了获取子表中选中的行数据
       const tableList = $('table[subTable]');//获取属性为subTable的所有table
       //获取所有table中被选中的行
       for(let i=0; i<tableList.length; i++){
           const list = $(tableList[i]).bootstrapTable('getAllSelections');
           checkedList.push(list)  
       };
       for(var i=0;i<checkedList.length;i++){
           for(var j=0;j<checkedList[i].length;j++){
               const a=checkedList[i][j];
               changeList.push(a);
           }
       }
       var allCheckedList=[];
       for(var i=0;i<changeList.length;i++){
           const b=changeList[i].authNo;
           allCheckedList.push(b);
       };
       var newObjectList=allCheckedList.join(',');
       $("#operationTable").bootstrapTable("collapseAllRows");//获取所有子表选中的数据后，关闭表格。
       if($("#inputroleName").val()==''){
           Dialog.alert("角色名称不能为空");
           return;
       };
       if(!$('input[name="status"]:checked').val()){
           Dialog.alert("请勾选状态");
           return;
       };
       if(allCheckedList.length==0){
           Dialog.alert("请选择菜单权限");
           return;
       }
       var objParam={};
       objParam.roleDept=$("#departmentSelect").val();
       objParam.roleName=$("#inputroleName").val();
       objParam.remark=$("#roleDesc").val();
       objParam.status=$('input[name="status"]:checked').val();
       objParam.roleAuth=newObjectList;
       if(this.roleNo){
            objParam.roleNo=utils.url.get()['roleNo'];
       };
       if(this.roleNo){
           utils.xhr.post(httpreq.SaveRole, objParam, (res) => {
               let DoalongOne = Dialog.show({
                    title: '提示',
                    nl2br: false,
                    message: () => {
                        return `保存成功`;
                    },
                    buttons: [{
                        label: '知道了',
                        cssClass: 'btn-primary',
                        action: (dialogRef) => {
                            DoalongOne.close();
                            window.location.href="role-management.html";
                        }
                    }]
               })
       }); 
       }else{ 
           utils.xhr.post(httpreq.AddRoleAuth, objParam, (res) => {
               let DoalongTwo= Dialog.show({
                    title: '提示',
                    nl2br: false,
                    message: () => {
                        return `角色创建成功`;
                    },
                    buttons: [{
                        label: '知道了',
                        cssClass: 'btn-primary',
                        action: (dialogRef) => {
                            DoalongTwo.close();
                            window.location.href="role-management.html";
                        }
                    }]
               })
       }); } 
   }
};
module.exports =roleOperationsClass;

