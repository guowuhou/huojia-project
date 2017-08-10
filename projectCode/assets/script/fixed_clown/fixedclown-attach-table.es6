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
          seeFlagInfoAttach: {
              defaultValue: null,
              type: uu.Node
          }
      }
    }
    onLoad() {
      window.$ = $;
    } 
    start() {
      this.getAttachList();
    }
    //查询附件信息
    getAttachList(_qparam) {
        if(this.reqFlag){
           return;
        }else{
           this.reqFlag = true;   //防止重复提交
        };
        if(!_qparam){
           let urlParams=urlMethod.get();
            this.queryData={
                prdCode:urlParams.prdCode,
                prdType:"09"
            };
        }
        else{
            this.queryData=_qparam;
        }
        //清除表格
        var productData=this.seeFlagInfoAttach.getComponent('fixed-clown.es6')._getSeeFlag(); 
        $("#attachListContainer").bootstrapTable('destroy');
        var columnList=[
              {
                field: 'attachName',
                title: '附件名称',
                align: 'center'
            }, {
                field: 'attachType',
                title: '附件类型',
                align: 'center',
                formatter:(value,row,index)=>{
                    var typeMap={
                        "0001":"产品资讯",
                        "0002":"产品公告",
                        "0003":"图片",
                        "9999":"其它"
                    };
                    return typeMap[value];
                }
            }, {
                field: 'url',
                title: 'URL',
                align: 'center'
            }, {
                field: 'remark',
                title: '备注',
                align: 'center'
            }, {
                field: 'createBy',
                title: '创建人',
                align: 'center'
            }, {
                field: 'createTime',
                title: '创建时间',
                align: 'center',
                formatter:(value,row,index)=>{
                    var date=moment(new Date(value)).format("YYYY-MM-DD HH:mm");
                    return date;
                }
            },{
                field: '',
                title: '<span style="padding:0px 47px">操作</span>',
                align: 'center',
                events:{
                    "click #edit":(e,value,row)=>{
                        row.prdType=this.queryData.prdType;
                        row.operateType=1;
                        this._editAttach(row);
                    },
                    "click #delete":(e,value,row)=>{
                       this._deleteAttach(row);
                    }
                },
                formatter:_.bind(this.operateHtml,this)
            }];
        if(productData.editFlag==false){
            columnList.pop();
        }
        $('#attachListContainer').bootstrapTable({
            url: httpreq.Search,
            columns: columnList,
            queryParams: (params) => {
                return this.queryData;
            },
            responseHandler: (res) => {
                let resDate = {};
                if (res.code == "000000"&&res.data) {
                    this.reqFlag = false;
                    this.fileDTOlist =res.data.fileDTOlist;// res.data.fileDTOlist;
                    _.extend(resDate, {
                        rows: this.fileDTOlist || []
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
    //增加、修改产品附件信息
    _editAttach(row){
        var self=this,url="";
        if(row.operateType==0){
          url=httpreq.attach_add;  //新增的url
        }else{
          url=httpreq.attach_update;  //删除的url
        }
        AddAttachDialog.show(row,(data)=>{
            var params={
              attachId:data.attachId,
              prdCode:data.prdCode,
              attachName:data.attachName,
              url:data.url,
              remark:data.remark,
              //如下两个参数待补充
              prdType:row.prdType,
              attachType:data.attachType,
            };
            utils.xhr.post(url,params,(res)=>{
              self.getAttachList({
                prdType:row.prdType,
                prdCode:row.prdCode
              });
            });
        });
    }
    //删除产品附件信息
    _deleteAttach(row){
        var self=this;
        var data={
            attachId:row.attachId
        };
        utils.xhr.post(httpreq.attach_delete,data,(res)=>{
            Dialog.alert("删除成功");
            self.getAttachList({
                prdType:row.prdType,
                prdCode:row.prdCode
            });
        });
    }
};


module.exports = attachTableClass;


