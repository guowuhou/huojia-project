const ejs = require('lib/ejs.js');
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
const prosynchro = require('plugins/bank-synchro.es6');
require('lib/bootstrap-table.js');
const offSaleInfoHTML = require('tpl/product-offsale.tpl');//对应的tpl后期应该删掉
const EditRemark = require('plugins/edit-remark.es6');
const utils=require('utils');

class TreeGridClass extends uu.Component {
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
        this.showHistoryPage();
    }
    showHistoryPage(){
        var self=this;
        var requireoptionDate={pageSize:25,pageNo:1};
        if(utils.url.get()['backPage']=='1'){
            requireoptionDate['prdCode']=window.localStorage.getItem('prdCode');
            requireoptionDate['cycleMode']=window.localStorage.getItem('cycleMode');
            requireoptionDate['currency']=window.localStorage.getItem('currency');
            requireoptionDate['productSeries']=window.localStorage.getItem('productSeries');
            requireoptionDate['riskLevel']=window.localStorage.getItem('riskLevel');
            requireoptionDate['prdTag']=window.localStorage.getItem('prdTag');
            requireoptionDate['saleStatus']=window.localStorage.getItem('saleStatus');
            requireoptionDate['productStatus']=window.localStorage.getItem('productStatus');
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
        $("#bankTable").bootstrapTable('destroy');
        $('#bankTable').bootstrapTable({
            url: httpreq.PS_GetFinancialList,
            columns: [
                {
                title: '',
                field: '_isChecked',
                align: 'center',
                valign: 'middle',
                checkbox: true
                },
                {
                    field: 'prdCode',
                    footerFormatter: (val) => {
                        return parseInt(val, 10);
                    },
                    title: '产品代码',
                    align: 'center'
                }, {
                    field: 'prdName',
                    title: '中文名称',
                    align: 'center'
                }, {
                    field: 'currency',
                    title: '币种',
                    align: 'center'
                }, {
                    field: 'cycleModeShow',
                    title: '滚动模式',
                    align: 'center'
                }, {
                    field: 'riskLevel',
                    title: '风险等级',
                    formatter: function (value, row, index) {
                        // const map = { '1': '低风险', '2': '中低风险', '3': '中风险', '4': '中高风险', '5': '高风险' };
                        // return map[value];
                        return value;
                    },
                    align: 'center'
                },
                //  {
                //     field: 'salesChannels',
                //     title: '接入渠道',
                //     formatter: (salesChannels) => {
                //         let channelsString = salesChannels.replace(/\s/g, '');
                //         let channels = channelsString.split(',');
                //         const map = {
                //             'C0001': '营业柜台',
                //             'C0002': '网上银行',
                //             'C0003': '手机银行',
                //             'C0004': '爱客',
                //             'C0005': '橙E网',
                //             'C0006': '其它',
                //         };
                //         const ret = [];
                //         for (let i = 0; i < channels.length; i++) {
                //             ret.push(map[channels[i]]);
                //         }
                //        return ret.join(',');
                //     },
                //     align: 'center'
                // }, 
                {
                    field: 'productSeries',
                    title: '产品系列',
                    align: 'center'
                }, {
                    field: 'productStatus',
                    title: '产品状态',
                    formatter: (value) => {
                        const productStatusMap = {
                            'FOR_SALE': '在售',
                            'SELL_OUT': '售罄',
                            'RESERVATION_PERIOD': '预约期',
                            'COLLECTION_PERIOD_END': '募集期结束',
                            'PRODUCT_SHELF': '产品下架',
                            "NEW_PRODUCT":'新产品'
                        };
                       return productStatusMap[value];
                    },
                    align: 'center'
                },  {
                    field: 'planRate',
                    title: '收益率',
                    align: 'center'
                },{
                    field: 'minAmount',
                    title: '购买起点',
                    align: 'center'
                },{
                    field: 'saleStatus',
                    title: '上架状态',
                    formatter: (value) => {
                        const statusMap = {
                            "INIT":"初始",
                            "WAIT_SALE":"待上架",
                            "NEW_SALE":"新品上架",
                            "FAIL_SALE":"上架失败",
                            "ON_SALE": "上架中",
                            "OFF_SALE": "已下架"
                        };
                       return statusMap[value];
                    },
                    align: 'center'
                },  {
                    title: '<span style="padding:0px 47px">操作</span>',
                    align: 'center',
                    events: {
                        'click #newProOff': (e, value, row, index) => {
                            this.newProputaway(row);
                        },
                        'click #DelProduct': (e, value, row, index) => {
                            this.delProduct(row);
                        }
                        
                    },
                    // formatter: _.bind(this.funformatter, this)
                    formatter:_.bind(this.functionEvents, this) 
                }
            ],
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
                } else if (res.responseCode == '900106' || res.responseCode == '683310') {
                    Dialog.alert(res.responseMsg || res.msg, () => {
                        if (/pop-stg\.paic/.test(location.hostname) || /pop-stg2\.paic/.test(location.hostname)) {
                            window.top.location.href = "http://pop-stg.paic.com.cn/portal/login.html";
                        } else {
                            window.top.location.href = "http://brop.pab.com.cn/portal/login.html";
                        }
                    });
                } else {
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
    // //操作列表显示的dome
    // funformatter(value, row, index) {
    //     let html = `
    //     <a class="editor" href="product-basicinfo-bank.html?prdCode=${row.prdCode}">编辑</a>
    //     <a class="synch" >同步</a>
    //     `;
    //     return html;
    // }
    //操作功能事件
    functionEvents(value,row,index) {
            let insertHtml="";
        if(row.saleStatus=="ON_SALE" || row.saleStatus=="WAIT_SALE"){
          insertHtml=`<li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=01">编辑产品信息</a></li>
                       <li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=01&seeFlag=1">查看产品信息</a></li>
                       `;
        }
        else if(row.saleStatus=="NEW_SALE"){
           insertHtml=`<li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=01">编辑产品信息</a></li>
                       <li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=01&seeFlag=1">查看产品信息</a></li>
                       <li  id='newProOff'><a href="#">新产品下架</a></li>`;
        }else if(row.saleStatus=="FAIL_SALE"){
           insertHtml=`<li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=01">编辑产品信息</a></li>
                       <li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=01&seeFlag=1">查看产品信息</a></li>
                       <li   id='DelProduct'><a href="#">删除上架失败产品</a></li>`; 
        }else if(row.saleStatus=="OFF_SALE" || row.saleStatus=="INIT"){
           insertHtml=`<li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=01&seeFlag=1">查看产品信息</a></li>`;
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
    //删除理财产品
    delProduct(row){
           var dialog1 = Dialog.show({
                    title: '',
                    nl2br: false,
                    cssClass: 'ts-dialog',
                    message: () => {
                        return `${'是否确定删除“上架失败”产品？'}`;
                    },
                    buttons: [{
                        label: '确定',
                        cssClass: 'btn btn btn-primary',
                        action: () => {
                            utils.xhr.post(httpreq.PS_FinancialDelete,{
                                prdCode:row.prdCode
                            },(res) =>{
                             Dialog.alert('删除成功');
                             $("#bankTable").bootstrapTable('refresh');
                             dialog1.close();
                });
                        }
                    }]
                });
    }
    //新产品下架
    newProputaway(row) {
        EditRemark.show({
            verifyType: "0005",
            btnLabel: '提交审批',
        }, (data) => {
            var addData = _.extend({}, data, { prdCode: row.prdCode });
            this.Recommended(addData);
        }

        )
    }
    Recommended(addData) {
        utils.xhr.post(httpreq.Check_QueryVerifyStatus, {
            verifyType: "0005",
            businessType: addData.businessType,
            prdType: "01",
            prdCode: addData.prdCode
        }, (response) => {
                if (response.data.result == true) {
                    Dialog.alert("该产品已提交过待审核");
                } 
                else {
                    utils.xhr.post(httpreq.PS_FinancialOffSale, addData, (response) => {
                            Dialog.alert("提交审批成功");
                            $("#bankTable").bootstrapTable('refresh');
                    });
                }
        });
    }         
    //更新查询的记录条数和更新的时间
    showQryTimeOrRedCount(totalSize) {
        let total = parseInt(totalSize, 10);
        total = isNaN(total) ? 0 : total;
        let thistime = moment().format('YYYY-MM-DD HH:mm:ss');
        $(this.node.dom).parent().find("#recordtext").text(`共有 ${total} 条记录`);
        $(this.node.dom).parent().find("#qrytimeshow").text(`更新时间：${thistime}`);
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
    //同步
    // showsynchroinfo(ckobj) {
    //     ckobj.changeTime = moment(ckobj.updateTime).format('YYYY-MM-DD HH:mm:ss');
    //     prosynchro.show(ckobj, () => {
    //         this.getproshelflist({});
    //     });
    // }
};
module.exports = TreeGridClass;