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
            this.queryData={
                prdCode:"GOLD_DT",
                prdType:"06"
            };
        //清除表格
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
            }];
        $('#attachListContainer').bootstrapTable({
            url: httpreq.attach_search,//httpreq.PS_GetFinancialList,
            columns: columnList,
            queryParams: (params) => {
                return this.queryData;
            },
            responseHandler: (res) => {
                let resDate = {};
                if (res.code == "000000"&&res.data) {
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
                    resDate = {};
                }
                return resDate;
            },
            formatNoMatches: () => {
                return '查无记录';
            }
        });
    }
};


module.exports = attachTableClass;


