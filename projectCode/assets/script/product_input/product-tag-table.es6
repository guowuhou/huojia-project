const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const ejs = require('lib/ejs.js');
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
const Dialog = require('plugins/dialog.es6');
const AddAttachDialog=require("plugins/add-attach.es6");
const urlMethod = require('utils/url.es6');
const utils = require('utils');

class attachTableClass extends uu.Component {
    properties() {
      return {
          seeFlagInfoTag: {
              defaultValue: null,
              type: uu.Node
          }
      }
    }
    onLoad() {
      window.$ = $;
    } 
    start() {
      //  this.getTagList();
       var pageType= urlMethod.get().type,
           pageSeeflage=urlMethod.get().seeFlag,
           pageSeeprdCode=urlMethod.get().prdCode;
       if(pageType=="02"||pageType=="01"||pageType=="04"){
           this.getPageList(0);
       }; 
       if(pageType=="03"){
          this.getTagList();
       }
    }
    //本行和代销添加标签页面操作
    onAddTag(addlist) {
          const list =$("#tagListContainer").bootstrapTable('getData');
          if(list.length>0){
              //var list1=[];
             for(var j=0;j<addlist.length;j++){
                 //var flag=true;
                  for(var i=0;i<list.length;i++){
                    if(list[i].tagCode==addlist[j].tagCode){
                        Dialog.alert('添加的标签'+`${addlist[j].tagCode}`+'重复了');
                       // flag=false;
                        return;
                    }
                  };
                //   if(flag){
                //       list1.push(addlist[j]);
                //   }
             };
           //$("#tagListContainer").bootstrapTable('append', list1);
             $("#tagListContainer").bootstrapTable('append', addlist);
          }else{
              $("#tagListContainer").bootstrapTable('append', addlist);
          }
       }
    //本行和代销删除标签页面操作
     onDelTag(deletelist) {
         var userAuth=$("#tagListContainer").bootstrapTable('getData');
        for (let i = 0, len1 = deletelist.length; i < len1; i++) {
            for (let j = 0, len2 = userAuth.length; j < len2; j++) {
                if (userAuth[j].tagCode == deletelist[i].tagCode) {
                    userAuth.splice(j, 1);
                    //j--;
                    len2--;
                }
            };
        }
        this.getPageList(userAuth);
    }   
    // onDelTag(deletelist) {
    //     const ids = utils.array.pick(deletelist, 'tagCode');
    //     $("#tagListContainer").bootstrapTable('remove', { field: 'tagCode', values: ids });//tagCode对应table的uniqueId: 'tagCode'
    // }
    //修改后最终的标签数
    lastlist(){
        const list =$("#tagListContainer").bootstrapTable('getData');
        var taglastlist='';
        for (let i = 0; i < list.length; i++) {
            taglastlist+=list[i].tagCode+(i+1 < list.length?",":"");
        };
       return taglastlist;
    };
    getPageList(param){
        this.labellist = [];
        if(param == 0){
            this.labellist = [];
            
        }else{
            if(!param.customInfo){
                this.labellist = param ;
            }else{
               this.labellist = param.customInfo.prdTagDetail ; 
            }
            
        }
         var productData=this.seeFlagInfoTag.getComponent('new-public-custom.es6')._getSeeFlag();
        $("#tagListContainer").bootstrapTable('destroy');
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
                field: 'status',
                title: '状态',
                align: 'center',
                formatter:(value,row)=>{
                    if(row.status=='1'){
                        return '有效';
                    }else{
                        return '无效';
                    }
                }
            }]; 
            if(productData.seeFlag){
            columnList.shift();
            };
         
        $('#tagListContainer').bootstrapTable({
            data:this.labellist,
            uniqueId: 'tagCode',
            columns: columnList,
            formatNoMatches: () => {
                return '查无记录';
            }
        });
    }
    getselectTag(){
        var self = this,selectList=[];
         selectList = $("#tagListContainer").bootstrapTable('getAllSelections');
         return selectList;
    }
    //查询标签信息
    getTagList(_qparam) {
        if(this.reqFlag){
           return;
        }else{
           this.reqFlag = true;   //防止重复提交
        }

        if(!_qparam){
            let urlParams=urlMethod.get();
            this.queryData={
                prdCode:urlParams.prdCode
            };
        }
        else{
            this.queryData=_qparam;
        }
        //清除表格
        var productData=this.seeFlagInfoTag.getComponent('new-public-custom.es6')._getSeeFlag(); 
        $("#tagListContainer").bootstrapTable('destroy');
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
                field: 'status',
                title: '状态',
                align: 'center',
                formatter:(value,row)=>{
                    if(value=='1'){
                        return '有效';
                    }else{
                        return '无效';
                    }
                }
            }];
        if(productData.seeFlag){
            columnList.shift();
        }
        $('#tagListContainer').bootstrapTable({
            
            url:httpreq.getConsumerFinanceTag,//httpreq.attach_search
            columns: columnList,
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
    operateHtml(value,row,index){
        var html='<a class="mr_25" id="edit">编辑</a><a class="mr_25" id="delete">删除</a>';
        return html;
    }
};


module.exports = attachTableClass;


