const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const ejs = require('lib/ejs.js');
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
const Dialog = require('plugins/dialog.es6');
const addlevelProDialog=require("plugins/add-levelProfit.es6");
const urlMethod = require('utils/url.es6');
const utils = require('utils');

class profitTableClass extends uu.Component {
    properties() {
      return {
          seeFlagInfoProfit: {
              defaultValue: null,
              type: uu.Node
          }
      }
    }
    onLoad() {
      window.$ = $;
    } 
    start() {
      this.getLevelProList();
    }
    //查询分档收益信息
    getLevelProList(_qparam) {
        var self=this;
        if(_qparam){
            self.labellist = _qparam.customInfo.levelProFitInfoList;
        }
        else{
            self.labellist =[];
        }
        //清除表格
        var productData=this.seeFlagInfoProfit.getComponent('new-public-custom.es6')._getSeeFlag(); 
        $("#leavelProfitContainer").bootstrapTable('destroy');
        var columnList=[
              {
                field: 'order',
                title: '顺序',
                align: 'center'
            }, {
                field: 'proFitnName',
                title: '收益名称',
                align: 'center'
            },{
                field: 'targetRange',
                title: '指标范围',
                align: 'center'
            }, {
                field: 'proceeds',
                title: '收益值',
                align: 'center'
            },{
                field: '',
                title: '<button type="button" class="btn btn-info fw_b" id="addGear">添加档位</button>',
                align: 'center',
                events:{
                    "click #edit":(e,value,row)=>{
                        //  row.prdType=this.queryData.prdType;
                         row['rowIndex']=$(e.target).parents('tr').data('index');
                        this.reEditLevelProfit(row);
                    },
                    "click #delete":(e,value,row)=>{
                       row['rowIndex']=$(e.target).parents('tr').data('index');
                       this.onDelList(row);
                    }
                },
                formatter:_.bind(this.operateHtml,this)
            }];
        
        if(productData.seeFlag){
             columnList.pop();
        }
        
        $('#leavelProfitContainer').bootstrapTable({
            // url: httpreq.GetLevelProFitInfoList,
            data:this.labellist||[],
            columns: columnList,
            formatNoMatches: () => {
                return '查无记录';
            }
        });
    }
    operateHtml(value,row,index){
        var html='<button type="button" class="btn btn-info fw_b mr_25" id="edit">编辑</button><button type="button" class="btn btn-info fw_b" id="delete">删除</button>';
        return html;
    }
    //修改产品分档收益信息
     reEditLevelProfit(row){
        var self=this;
        var editDefineInfo;
        addlevelProDialog.show(row,(data)=>{
            editDefineInfo = {
                order: data.order,
                prdCode: row.prdCode,
                proFitnName: data.proFitnName,
                targetRange: data.targetRange,
                prdType: row.prdType,
                proceeds: data.proceeds,
            };
            $("#leavelProfitContainer").bootstrapTable('updateRow', {index:row.rowIndex, row: editDefineInfo});
        });
    }
    //删除行
    onDelList(row) {
        // row.rowIndex
        var userAuthList=$("#leavelProfitContainer").bootstrapTable('getData');
            userAuthList.splice(row.rowIndex, 1);  
        this.getPageList(userAuthList);
    }
    //增加产品分档收益信息
    editLevelProfit(row){
        var self=this,param;
        addlevelProDialog.show(row,(data)=>{
            var defineInfo;
            var defineInfoList=[];
            defineInfo = {
                order: data.order,
                prdCode: row.prdCode,
                proFitnName: data.proFitnName,
                targetRange: data.targetRange,
                prdType: row.prdType,
                proceeds: data.proceeds,
            };
            defineInfoList.push(defineInfo);
            $("#leavelProfitContainer").bootstrapTable('append', defineInfoList);
        });
    }
    //删除一行是重新加载列表不能用refresh，删除表格一行也不能用jquery的remove()方法
    getPageList(param){
        $("#leavelProfitContainer").bootstrapTable('destroy');
         var columnList=[
              {
                field: 'order',
                title: '顺序',
                align: 'center'
            }, {
                field: 'proFitnName',
                title: '收益名称',
                align: 'center'
            },{
                field: 'targetRange',
                title: '指标范围',
                align: 'center'
            }, {
                field: 'proceeds',
                title: '收益值',
                align: 'center'
            },{
                field: '',
                title: '<button type="button" class="btn btn-info fw_b" id="addGear">添加档位</button>',
                align: 'center',
                events:{
                    "click #edit":(e,value,row)=>{
                        // row.prdType=this.queryData.prdType;
                         row['rowIndex']=$(e.target).parents('tr').data('index');
                        this.reEditLevelProfit(row);
                    },
                    "click #delete":(e,value,row)=>{
                       row['rowIndex']=$(e.target).parents('tr').data('index');
                       this.onDelList(row);
                    }
                },
                formatter:_.bind(this.operateHtml,this)
            }];
         
        $('#leavelProfitContainer').bootstrapTable({
            data:param,
            columns: columnList,
            formatNoMatches: () => {
                return '查无记录';
            }
        });
    }
    //修改后最终的标签数
    upLoadDatalist(){
        const list =$("#leavelProfitContainer").bootstrapTable('getData');
        var taglastlist='';
        for (let i = 0; i < list.length; i++) {
            taglastlist+=list[i].order+','+list[i].proFitnName+','+list[i].targetRange+','+list[i].proceeds+(i+1 < list.length?"|":"");
        };
        return taglastlist;
    };
};


module.exports = profitTableClass;


