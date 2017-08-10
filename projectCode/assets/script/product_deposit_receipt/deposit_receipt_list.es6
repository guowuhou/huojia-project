const ejs = require('lib/ejs.js');
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
const prosynchro = require('plugins/bank-synchro.es6');
require('lib/bootstrap-table.js');
const utils=require('utils');

class depositClass extends uu.Component {
    properties() {
        return {
            producttype: {
                defaultValue: null,
                type: uu.Node
            },
        };
    }
    onLoad() {
        this.rqoptions = { pageSize: 25, pageNo: 1 };
        this.showDepositHistoryPage();
    }
    //返回列表历史页面
    showDepositHistoryPage(){
        var self=this;
        var requireoptionDate={pageSize:25,pageNo:1};
        if(utils.url.get()['backPage']=='1'){
            requireoptionDate['prdCode']=window.localStorage.getItem('prdCode');
            requireoptionDate['productId']=window.localStorage.getItem('productId');
            requireoptionDate['productType']=window.localStorage.getItem('productType');
            requireoptionDate['resellType']=window.localStorage.getItem('resellType');
            requireoptionDate['saleStatus']=window.localStorage.getItem('saleStatus');
            requireoptionDate['salesChannels']=window.localStorage.getItem('salesChannels');
            requireoptionDate['saveDeadline']=window.localStorage.getItem('saveDeadline');
            self.getproshelflist(requireoptionDate); 
        };
    }
    //根据筛选条件rqoptions查询产品列表
    getproshelflist(rqoptions) {
        for (let v in rqoptions) {
            this.rqoptions[v] = rqoptions[v];
        }
        //防重复提交
        if (this.reqFlag) return;
        this.reqFlag = true;
        let listTable = [ 
                 {
                title: '',
                field: '',
                align: 'center',
                valign: 'middle',
                checkbox: true
                },
                // {
                //     field: 'productClass',
                //     title: '产品种类',
                //     formatter: function (value) {
                //         const map={
                //             '0':'大额存单',
                //             '1':'定活宝-大额存单'
                //         }
                //         return map[value]; 
                //     },
                //     align: 'center'
                // },
                {
                    field: 'productId',
                    title: '产品ID',
                    align: 'center'
                }, {
                    field: 'prdCode',
                    title: '产品Code',
                    align: 'center'
                }, {
                    field: 'prdName',
                    title: '产品名称',
                    align: 'center'
                }, {
                    field: 'saveDeadline',
                    title: '产品期限',
                    formatter: function (saveDeadline, row, index) {
                        if(saveDeadline.charAt(saveDeadline.length-1)=='M'){
                            return `${saveDeadline.charAt(0)}个月`
                        }else if(saveDeadline.charAt(saveDeadline.length-1)=='Y'){
                            return `${saveDeadline.charAt(0)}年` //可能还有周
                        } 
                    },
                    align: 'center'
                }, {
                    field: 'productType',
                    title: '存款类型',
                    formatter:function(value){
                        const map={
                            '0':'发售',
                            '1':'转让'
                        }
                        return map[value];   
                    },
                    align: 'center'
                }, {
                    field: 'resellType',
                    title: '转让类型',
                    formatter: function (value, row, index) {
                        const map = { '0': '指定转让', '1': '挂网转让'};
                        return map[value]
                    },
                    align: 'center'
                },
                // {
                //     field: 'status',
                //     title: '产品状态',
                //     formatter:function(value, row, index){
                //         if(row.productType=='0'){
                //              const map={'01':'新建','02':'删除','03':'复核中','04':'复核通过','05':'募集中','06':'募集结束','07':'到期结清'};
                //              return map[value];
                //         }else if(row.productType=='1'){
                //             const map={'01':'转让中','02':'已转让','03':'已撤'};
                //             return map[value];
                //         }    
                //     },
                //     align: 'center'
                // }, 
                {
                    field: 'salesChannels',
                    title: '接入渠道',
                    formatter: function (salesChannels, row, index) {
                        let channelsList=salesChannels.replace(/\s/g,"");
                        let channelsVal=channelsList.split(',');
                        const map = {'C0001': '营业柜台','C0002': '网上银行','C0003': '口袋银行','C0004': '爱客','C0005': '橙E网','C0006': '智能投顾','C0007': '千人千面','C0008': '橙子银行','C0009': '口袋插件','C0010': '厅堂','C0011': '银保通','C0012':'新口袋银行','C9999': '其它'};
                        if(channelsVal){
                            let result="";
                            for(let i=0;i<channelsVal.length;i++){
                                result+=','+map[channelsVal[i]]
                            }
                            return result.slice(1);
                        }
                    },
                    align: 'center'
                },{
                    field: 'saleStatus',
                    title: '上架状态',
                    align: 'center'
                },{
                    title: '<span style="padding:0px 47px">操作</span>',
                    align: 'center',
                    formatter:_.bind(this.functionEvents, this) 
                }
            ];
             let newListTable = [ 
                 {
                title: '',
                field: '',
                align: 'center',
                valign: 'middle',
                checkbox: true
                },
                {
                    field: 'productClass',
                    title: '产品种类',
                    formatter: function (value) {
                        const map={
                            '0':'大额存单',
                            '1':'定活宝-大额存单'
                        }
                        return map[value]; 
                    },
                    align: 'center'
                },
                {
                    field: 'productId',
                    title: '产品ID',
                    align: 'center'
                }, {
                    field: 'prdCode',
                    title: '产品Code',
                    align: 'center'
                }, {
                    field: 'prdName',
                    title: '产品名称',
                    align: 'center'
                }, {
                    field: 'saveDeadline',
                    title: '产品期限',
                    formatter: function (saveDeadline, row, index) {
                        if(saveDeadline.charAt(saveDeadline.length-1)=='M'){
                            return `${saveDeadline.charAt(0)}个月`
                        }else if(saveDeadline.charAt(saveDeadline.length-1)=='Y'){
                            return `${saveDeadline.charAt(0)}年` //可能还有周
                        } 
                    },
                    align: 'center'
                }, {
                    field: 'productType',
                    title: '存款类型',
                    formatter:function(value){
                        const map={
                            '0':'发售',
                            '1':'转让'
                        }
                        return map[value];   
                    },
                    align: 'center'
                },
                // {
                //     field: 'status',
                //     title: '产品状态',
                //     formatter:function(value, row, index){
                //         if(row.productType=='0'){
                //              const map={'01':'新建','02':'删除','03':'复核中','04':'复核通过','05':'募集中','06':'募集结束','07':'到期结清'};
                //              return map[value];
                //         }else if(row.productType=='1'){
                //             const map={'01':'转让中','02':'已转让','03':'已撤'};
                //             return map[value];
                //         }    
                //     },
                //     align: 'center'
                // }, 
                {
                    field: 'salesChannels',
                    title: '接入渠道',
                    formatter: function (salesChannels, row, index) {
                        let channelsList=salesChannels.replace(/\s/g,"");
                        let channelsVal=channelsList.split(',');
                        const map = {'C0001': '营业柜台','C0002': '网上银行','C0003': '口袋银行','C0004': '爱客','C0005': '橙E网','C0006': '智能投顾','C0007': '千人千面','C0008': '橙子银行','C0009': '口袋插件','C0010': '厅堂','C0011': '银保通','C0012':'新口袋银行','C9999': '其它'};
                        if(channelsVal){
                            let result="";
                            for(let i=0;i<channelsVal.length;i++){
                                result+=','+map[channelsVal[i]]
                            }
                            return result.slice(1);
                        }
                    },
                    align: 'center'
                },{
                    field: 'saleStatus',
                    title: '上架状态',
                    align: 'center'
                },{
                    title: '<span style="padding:0px 47px">操作</span>',
                    align: 'center',
                    formatter:_.bind(this.functionEvents, this) 
                }
            ];
        $("#table").bootstrapTable('destroy');
        // rqoptions.productClass=="1"?newListTable:listTable
        $('#table').bootstrapTable({
            url: httpreq.PS_getDepositList,
            columns: listTable ,
            sortable: true,//是否启用排序
            sortOrder: "prdCode",//排序方式
            pagination: true,//是否显示分页
            pageSize: this.rqoptions.pageSize,//每页的记录行数
            queryParams: (params) => {//传递的参数
                return _.extend({}, this.rqoptions, {
                    pageSize: params.limit,//页面大小
                    pageNo: params.offset / params.limit + 1,
                });
            },
            responseHandler: (res) => {
                let resDate = {};
                if (res.code == "000000") {
                    this.reqFlag = false;
                    this.showQryTimeOrRedCount(res.data.totalSize);
                    this.productInfoList = res.data.list;
                    _.extend(resDate, {
                        rows: res.data.list || [],
                        total: res.data.totalSize
                    });
                }else if(res.responseCode == '900106'||res.responseCode == '683310'){
                         Dialog.alert(res.msg || res.responseMsg);
                         window.top.location.href = "http://brop.pab.com.cn/portal/login.html";
                }else {
                        Dialog.alert(res.msg || res.responseMsg);
                        this.reqFlag = false;
                        this.showQryTimeOrRedCount(0);
                        this.productInfoList = res.data.list;
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
    }
    //操作功能事件
    functionEvents(value,row,index) {
            let insertHtml="";
        if(row.saleStatus=="上架中" || row.saleStatus=="待上架"){
           insertHtml=`<li><a href="new-public-custom.html?productId=${row.productId}&prdCode=${row.prdCode}&type=04">编辑产品信息</a></li>
                      <li><a href="new-public-custom.html?productId=${row.productId}&prdCode=${row.prdCode}&type=04&seeFlag=1">查看产品信息</a></li>`;
        }
        else if(row.saleStatus=="已下架"){
           insertHtml=`<li><a href="new-public-custom.html?productId=${row.productId}&prdCode=${row.prdCode}&type=04&seeFlag=1">查看产品信息</a></li>`;
        };
        let html = `<div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">操作<span class="caret"></span></button>
                   <ul class="dropdown-menu dropdown-menu-right" role="menu">
                       ${insertHtml}
                  </ul>
          </div>
        `;
        return html;  
    }       
    //更新查询的记录条数和更新的时间
    showQryTimeOrRedCount(totalSize) {
        let total = parseInt(totalSize, 10);
        total = isNaN(total) ? 0 : total;
        let thistime = moment().format('YYYY-MM-DD HH:mm:ss');
        $(this.node.dom).parent().find("#recordtext").text(`共有 ${total} 条记录`);
        $(this.node.dom).parent().find("#qrytimeshow").text(`数据更新时间：${thistime}`);
    }
    //返回查询产品列表的上送的参数
    getqryparamdatas() {
        return this.rqoptions || {};
    }
    //返回查询产品列表的的数据
    getqrydatas() {
        return this.productInfoList || [];
    }
    //格式化时间
    getshelfDate(time, format) {
        if (time > 0) {
            return moment(time).format(format);
        } else {
            return '';
        }
    }
};
module.exports = depositClass;