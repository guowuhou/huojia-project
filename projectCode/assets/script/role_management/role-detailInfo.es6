const $ = require("lib/jquery.js");
const _ = require("lib/underscore.js");
const utils = require('utils');
const httpreq = require('httpreq.es6');
const urlMethod = require('utils/url.es6');
const artTemplate = require("lib/artTemplate.js");
const Dialog = require("plugins/dialog.es6");
require('lib/bootstrap-table.js');

class roleDetailClass extends uu.Component {
    onLoad(){
         this.roleNo = utils.url.get()['roleNo'];       
         this.render = artTemplate.compile( require("./role-detailInfo.tpl") );      
         this.getRoleInfoData();
         window.$=$;
    }
    getRoleInfoData(){
        var self=this;
        utils.xhr.post(httpreq.EditRole,{roleNo:this.roleNo},(res, event)=>{
                this.data=self.deptNameShow(res.data.roleInfo)
                this.renderRoleInfo( this.data);
        });
     }
     deptNameShow(data){
          const map = {
                          'dpt0001': '通用',
                          'dpt0002': '理财产品部',
                          'dpt0003': '口袋渠道',
                          'dpt0004': '千人千面',
                          'dpt0005': '大额存款产品部',
                          'dpt0006': '消费信贷产品部',
                          'dpt0007': '口袋插件渠道',
                          'dpt0008': '厅堂渠道',
                          'dpt0009': '黄金产品部'
                        };
         const statusMap={
             '0':'禁用',
             '1':'启用',
         };            
        data.deptRoleName=map[data.roleDept];
        data.stateMap=statusMap[data.status];
        return data;                 
     }
     renderRoleInfo(data) {
        const html = this.render(data);
       $(this.node.dom).find("#roleDetail").append(html);
       this.getRoleDetailInfo();
      // this.InitSubTable();
    }
   //绑定表格事件
   getRoleDetailInfo(){
       var self=this;
       $("#detailInfoTable").bootstrapTable('destroy');
       $("#detailInfoTable").bootstrapTable({
                url:httpreq.EditRole,
                method: 'get',
                detailView: true,//父子表
                queryParams: {roleNo:this.roleNo},
                //加载后展开子表
                onLoadSuccess:function(){
                    $("#detailInfoTable").bootstrapTable("expandAllRows");
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
                    }else {
                            Dialog.alert(res.msg || res.responseMsg);
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
            },],    
        });
        $(":checkbox").attr("disabled",true);
         
   }
};
module.exports =roleDetailClass;

  