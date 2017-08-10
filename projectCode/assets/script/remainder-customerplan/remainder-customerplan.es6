const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const ejs = require("lib/ejs.js");
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
const Dialog = require('plugins/dialog.es6');
const urlMethod = require('utils/url.es6');
require('lib/bootstrap-table.js');
require('lib/bootstrap.autocomplete.js');
const utils = require('utils');
require("lib/bootstrap-datetimepicker.js");

class customerPlanClass extends uu.Component {
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
      this.bindEvent();
      this.queryBusCoop();
      this.imageSearch();
      this.getCustomerPlanList();
    } 
    start() {
        this.initDateTimePicker();
    }
    imageSearch() {
        var self=this;
        $("#prdCode").autocomplete({
           source:function(query,process){
                var matchCount = this.options.items;//返回结果集最大数量
                 var data ={
                   "prdCode":query,
                   "matchCount":matchCount,
                    operateType:'channelProductInfo',
                }
                 utils.xhr.post(httpreq.PS_CodeblurSel, data, function (res) {
                         var list=res.data.selectedLibList;
                         if(list&&list.length>0){
                            self.mohuFlag=true;
                         }else{
                            self.mohuFlag=false;
                         }
                         return process(res.data.selectedLibList);
                 });
            },
            formatItem:function(item){
                return item["prdCode"]+item["prdName"];
            },
            setValue:function(item){
                return {'data-value':item["prdCode"]+item["prdName"],'real-value':item["prdCode"]};
            },
      })
    }
    //查询商户合作
    queryBusCoop(){
        var self = this;
        $.get(httpreq.QueryAccessMechantList,{}, (response) => {
            if (response.code == '000000') {
                let BusCoopList = response.data;
                for (let index = 0; index < BusCoopList.length; index++) {
                    let element = BusCoopList[index];
                    $(self.node.dom).find('#businessCoop').append(`<option value=${element.merchantCode}>${element.merchantName}</option>`);
                }
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
    //时间控件
   initDateTimePicker() {
    let curDateTime = moment(new Date());
    $('.up_datetime').datetimepicker({
      language: 'zhcn',
      todayBtn: true,
      autoclose: true,
      todayHighlight: true,
      //startDate: curDateTime.toDate(),
      forceParse: false,
      startView: 2,
      minView: 0, //时间精确到某个单位，2表示天
      maxView: 'decade'
    });
  }
    bindEvent(){
        $("#cleanSearchIterm").on("click",(event)=>{
            this.clearSearchItem();
        });
        $("#customerPlanSearch").on("click",(event)=>{
            this.getSearchList();
        });
        $("#btnLeadingout").on("click",(event)=>{
            this.leadingoutFun();
        })
    }
      //批量导出
    leadingoutFun(){
        let qrydata = this.getCustomerList;
        if(!qrydata){
            Dialog.alert('请先搜索列表');
            return;
        }
        if(qrydata.length>0){
            let urlhref = httpreq.DownloadRemainingMoneyShelfPlan+'?';
            let data = this.requireoptions;
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    let datacs = key+'='+data[key]+'&';
                    urlhref+=datacs;
                }
            }
            urlhref = urlhref.replace(/&$/,'');
            let adownLoad = $(this.node.dom).find('#adownLoad')[0];
            adownLoad.href = urlhref;
            adownLoad.click();
        }else{
            Dialog.alert('无数据可导出');
        }
    }
    clearSearchItem() {
        $("#ecifNo").val("");
        $("#planId").val("");
        $("#planType").val(" ");
        $("#tradeType").val(" ");
        $("#prdCode").attr('real-value','');
        $("#prdCode").val('');
        $("#startDate").val("");
        $("#endDate").val("");
        $("#planStatus").val(" ");
        $("#businessCoop").val(" ");
    }
    getSearchList(){
        let prdCodeName;
        let filter = $('#checkStaus').find('[filter]');
        let requireoptions = { pageNo: 1,pageSize: 25};
        for (let i = 0; i < filter.length; i++) {
            var element = filter[i];
            if(element.nodeName.toLowerCase()==='input'&& $(element).attr('filter')==='prdCode'){
                var lastmohuFlag = this.mohuFlag;
                    if (lastmohuFlag) {
                        requireoptions[$(element).attr('filter')] = $(element).attr('real-value') || $(element).val();
                    } else {
                        if($("#prdCode").val()!=''){
                            requireoptions[$(element).attr('filter')] = $(element).val();
                        }else{
                            requireoptions[$(element).attr('filter')] = "";
                        }
                    }
                
            }else{
                 requireoptions[$(element).attr('filter')] = $(element).val() || '';
            }  
        }
        this.getCustomerPlanList(requireoptions);
    }
    //查询附件信息
    getCustomerPlanList(queryParamData) {
        var self=this,requireoptions;
        if(queryParamData){
            requireoptions=queryParamData;
        }else{
            requireoptions = { pageNo: 1,pageSize: 25};
            var filters = $('#checkStaus').find('[filter]');
            for (let i = 0; i < filters.length; i++) {
                var element = filters[i];
                requireoptions[$(element).attr('filter')] = $(element).val() || '';
            }
        };
        this.requireoptions=requireoptions;
        //清除表格
        $("#tableList").bootstrapTable('destroy');
        var columnList=[
              {
                field: 'planId',
                title: '计划号',
                align: 'center'
            },{
                field: 'prdCode',
                title: '计划名字',
                align: 'center'
            }, {
                field: 'ecifNo',
                title: '客户号',
                align: 'center'
            }, {
                field: 'planType',
                title: '计划类型',
                align: 'center',
                formatter:(value)=>{
                    if(value=='0'){
                        return `自动存`
                    }else{
                         return `存工资`
                    }
                }
            }, {
                field: 'channelId',
                title: '接入渠道',
                align: 'center',
                formatter: (value) => {
                    const map = {'C0001': '营业柜台',
                                 'C0002': '网上银行',
                                 'C0003': '口袋银行',
                                 'C0004': '爱客',
                                 'C0005': '橙E网',
                                 'C0006': '智能投顾',
                                 'C0007': '千人千面',
                                 'C0008': '橙子银行',
                                 'C0009': '口袋插件',
                                 'C0010': '厅堂',
                                 'C0011': '银保通',
                                 'C0012':'新口袋银行',
                                 'C9999': '其它'};
                    return map[value];
                }
            }, {
                title: '商户合作',
                field: 'businessCoop',
                align: 'center'
            },{
                field: 'createdDate',
                title: '开始时间',
                align: 'center'
            },{
                field: 'endDate',
                title: '结束时间',
                align: 'center'
            },
            {
                field: 'tradeType',
                title: '交易类型',
                align: 'center'
            },{
                field: 'prdType',
                title: '挂钩产品类型',
                align: 'center',
                formatter:(value)=>{
                     const prdTypeMap = {
                        "0": "代销理财",
                        "1": "本行理财",
                        "2": "存款"
                    };
                  return prdTypeMap[value];
                }
            },{
                field: 'prdCode',
                title: '挂钩产品代码',
                align: 'center'
            },{
                field: 'prdName',
                title: '挂钩产品名字',
                align: 'center'
            },{
                field: 'accountType',
                title: '交易账户类型',
                align: 'center',
                // formatter:(value)=>{
                //      const prdTypeMap = {
                //         "0": "申购",
                //         "1": "赎回",
                //         "2": "申购冻结"
                //     };
                //   return prdTypeMap[value];
                // }
            },{
                field: 'account',
                title: '交易账户',
                align: 'center'
            },{
                field: 'investAmt',
                title: '交易金额',
                align: 'center'
            },{
                field: 'amountRemain',
                title: '保留余额',
                align: 'center'
            },{
                field: 'laseExecuteTime',
                title: '上次执行时间',
                align: 'center'
            },{
                field: 'planStatus',
                title: '状态',
                align: 'center',
                formatter:(value)=>{
                    if(value=='0'){
                        return `有效`
                    }else{
                         return `无效`
                    }
                }
            },{
                field: 'createdDate',
                title: '创建时间',
                align: 'center'
            },{
                field: 'createdBy',
                title: '创建人',
                align: 'center'
            },{
                field: 'updatedBy',
                title: '更新人',
                align: 'center'
            },{
                field: 'updatedDate',
                title: '更新时间',
                align: 'center'
            },{
                field: '',
                title: '<span style="padding:0px 47px">操作</span>',
                align: 'center',
                formatter:_.bind(this.functionEvents, this)
            }];
        $('#tableList').bootstrapTable({
            url: httpreq.QueryRemainingMoneyShelfPlan,
            columns: columnList,
            singleSelect: true, //设置是否强制单选，默认false
            pagination: true,//是否显示分页
            pageSize: requireoptions.pageSize,//每页的记录行数
            queryParams: (params) => {//传递的参数
                return _.extend({}, requireoptions, {
                    pageSize: params.limit,//页面大小
                    pageNo: params.offset / params.limit + 1,
                });
            },
            responseHandler: (res) => {
                let resDate = {};
                if (res.code == "000000"&&res.data) {
                    var rowdata =res.data.dataList;
                    self.getCustomerList=res.data.dataList;
                    _.extend(resDate, {
                        rows: rowdata || [],
                        total: res.data.totalSize
                    });
                    self.showQryTimeOrRedCount(res.data.totalSize);
                } else if(res.responseCode=="683310"||res.responseCode=="900106"){
                    Dialog.alert(res.responseMsg||res.msg,()=>{
                        window.top.location.href="http://brop.pab.com.cn/portal/login.html";
                    });
                }else {
                    Dialog.alert(res.msg || res.responseMsg);
                    self.showQryTimeOrRedCount(res.data.totalSize);
                    resDate = {};
                }
                return resDate;
            },
            formatNoMatches: () => {
                return '查无记录';
            },
            formatShowingRows: (pageFrom, pageTo, totalRows) => {
                return '展示' + pageFrom + ' 到 ' + pageTo + ' 条，共 ' + totalRows + ' 条记录';
            },
            formatRecordsPerPage: (pageNumber) => {
                return '每页 ' + pageNumber + ' 条';
            }
        });
        $("#tableContainer").find('.fixed-table-container').css('overflow','auto');//表格表头过长，设置表格显示滚动条
    }
    //操作功能事件
    functionEvents(value,row,index) {
        let addInsertHtml=`<li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=02">修改计划</a></li>
                          <li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=02&seeFlag=1">终止计划</a></li>
                           <li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=02&seeFlag=1">开始计划</a></li>
                       `;
        let html = `<div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">操作<span class="caret"></span></button>
                   <ul class="dropdown-menu dropdown-menu-right" role="menu">
                       ${addInsertHtml}
                  </ul>
          </div>
        `;
        return html; 
    } 
    showQryTimeOrRedCount(data){
        let total = parseInt(data, 10);
        total = isNaN(total) ? 0 : total;
        $("#recordtext").text(`共有 ${total} 条记录`);
    }
};


module.exports = customerPlanClass;


