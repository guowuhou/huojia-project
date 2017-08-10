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
        this.getTagList(0);
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
            this.queryData={
                prdCode:"GOLD_DT"
            };
        }
        else{
            this.queryData=_qparam;
        }
        //清除表格
        var productData=this.seeFlagInfoTag.getComponent('gold-fixed-investment.es6')._getSeeFlag(); 
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
            }];
        if(productData.editFlag==false && productData.uploadFlag==false){
            columnList.shift();
        }
        $('#tagListContainer').bootstrapTable({
            url:httpreq.GetGoldProductTag,//httpreq.attach_search
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


