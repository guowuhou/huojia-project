const ejs = require('lib/ejs.js');
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const shelfup = require('plugins/shelf-up.es6');
const Dialog = require('plugins/dialog.es6');
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
const prosynchro = require('plugins/product-synchro.es6');
require('lib/bootstrap-table.js');
const EditRemark = require('plugins/edit-remark.es6');
const utils=require('utils');

class TreeGridClass extends uu.Component {
    properties() {
        return {
            producttype: {
                defaultValue: null,
                type: uu.Node
            },
            productstatus: {
                defaultValue: null,
                type: uu.Node
            },
            assetation: {
                defaultValue: null,
                type: uu.Node
            },
            salestatus: {
                defaultValue: null,
                type: uu.Node
            }
        };
    }

    onLoad() {
        this.rqoptions = { pageSize: 25, pageNo: 1,desc:true};
        this.showProxyHistoryPage();
    }
    showProxyHistoryPage(){
        var self=this;
        var requireoptionDate={pageSize:25,pageNo:1};
        if(utils.url.get()['backPage']=='1'){
            requireoptionDate['tACode']=window.localStorage.getItem('tACode');
            requireoptionDate['prdCode']=window.localStorage.getItem('prdCode');
            requireoptionDate['prdType']=window.localStorage.getItem('prdType');
            requireoptionDate['prdTag']=window.localStorage.getItem('prdTag');
            requireoptionDate['status']=window.localStorage.getItem('status');
            requireoptionDate['cusAssetClass']=window.localStorage.getItem('cusAssetClass');
            requireoptionDate['prdArr']=window.localStorage.getItem('prdArr');
            requireoptionDate['prdSerial']=window.localStorage.getItem('prdSerial');
            requireoptionDate['saleStatus']=window.localStorage.getItem('saleStatus');
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
        $("#proxyTable").bootstrapTable('destroy');
        $('#proxyTable').bootstrapTable({
            url: httpreq.PS_QueryList,
            columns: [
                {
                title: '',
                field: '_isChecked',
                align: 'center',
                valign: 'middle',
                checkbox: true
                },
                //  {
                //     field: 'completeFlag',
                //     title: '信息完整',
                //     'class': 'padding0',
                //     formatter: (completeFlag) => {
                //         if(completeFlag=="1"){
                //             return '<img src="const/jqx/images/bg_check.png">';//引入图标
                //         }else{
                //             return '<img src="const/jqx/images/back_lost.png">';
                //         } 
                //     },
                //     align: 'center'
                // },
                {
                    field: 'prdCode',
                    sortable: true,
                    footerFormatter: (val) => {
                        return parseInt(val, 10);
                    },
                    title: '产品代码',
                    align: 'center'
                }, {
                    field: 'prdName',
                    title: '产品名称',
                    align: 'center'
                }, {
                    field: 'taName',
                    title: 'TA名称',
                    align: 'center'
                }, 
                // {
                //     field: 'prdType',
                //     sortable: true,
                //     title: '产品类型',
                //     align: 'center',
                //     formatter: _.bind(this.getprotypename, this),//因为后端返回的就是中文name，所以无需转换
                // }, 
                {
                    field: 'prdSerialName',
                    title: '后端分类',
                    align: 'center'
                }, {
                    field: 'status',
                    title: '产品状态',
                    formatter: _.bind(this.getprostatusname, this),
                    align: 'center'
                }, {
                    field: 'prdArrName',
                    title: '产品属性',
                    align: 'center',
                    formatter: (val)=>{
                        return val ? val.replace('基金', '') : val;
                    }
                }, {
                    field: 'cusAssetClass',
                    title: '客户资产配置分类',
                    align: 'center',
                     formatter: function (value, row, index) {
                        const map = {'A0001':'现金类','A0002':'固收类','A0003':'权益类','A0004':'另类投资','A0005':'不区分'};
                        return map[value];
                    } 
                },{
                    field: 'saleStatus',
                    title: '上架状态',
                    align: 'center'
                },  
                {
                    title: '<span style="padding:0px 47px">操作</span>',
                    align: 'center',
                     events: {
                        'click #newProdOff': (e, value, row, index) => {
                            this.newProputaway(row);
                        },
                        'click #delProxyPro': (e, value, row, index) => {
                            this.delProduct(row);
                        }
                        
                    },
                    // formatter: _.bind(this.funformatter, this) 
                    formatter:_.bind(this.addEvents, this) 
                }
            ],
            sortable: true,
            sortOrder: "prdCode",
            pagination: true,
            pageSize: this.rqoptions.pageSize,
            queryParams: (params) => {
                return _.extend({}, this.rqoptions, {
                    sort: params.sort,//要排序的字段名 
                    order: params.order,//降序'desc'还是升序'asc',
                    pageSize: params.limit,
                    pageNo: params.offset / params.limit + 1,
                    desc: true
                });
            },
            responseHandler: (res) => {
                let resDate = {};
                if (res.code == "000000") {
                    this.reqFlag = false;
                    this.showQryTimeOrRedCount(res.data.totalSize);
                    this.productInfoList = res.data.productInfoList;
                    _.extend(resDate, {
                        rows: res.data.productInfoList || [],
                        total: res.data.totalSize
                    });
                }else if(res.responseCode == '900106'||res.responseCode == '683310'){
                       Dialog.alert(res.responseMsg || res.msg, () => {
                       if (/pop-stg\.paic/.test(location.hostname) || /pop-stg2\.paic/.test(location.hostname)) {
                            window.top.location.href = "http://pop-stg.paic.com.cn/portal/login.html";
                        } else {
                            window.top.location.href = "http://brop.pab.com.cn/portal/login.html";
                        }
                    });
                }else {
                        Dialog.alert(res.msg || res.responseMsg);
                        this.reqFlag = false;
                        this.showQryTimeOrRedCount(0);
                        this.productInfoList = res.data.productInfoList;
                        resDate = {};
                    }
                return resDate;
            }
        });
    }

    // //操作列表显示的dome
    // funformatter(value, row, index) {
    //     let html = `
    //     <a class="editor" href="product-basicinfo-proxy.html?prdCode=${row.prdCode}">编辑</a>
    //     <a class="synch" >同步</a>
    //     `;
    //     return html;
    // }
    addEvents(value,row,index){
            let addInsertHtml="";
        if(row.saleStatus=="上架中" || row.saleStatus=="待上架"){
           addInsertHtml=`<li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=02">编辑产品信息</a></li>
                          <li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=02&seeFlag=1">查看产品信息</a></li>
                       `;
        }
        else if(row.saleStatus=="新产品上架"){
           addInsertHtml=`<li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=02">编辑产品信息</a></li>
                          <li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=02&seeFlag=1">查看产品信息</a></li>
                       <li id='newProdOff'><a href="#">新产品下架</a></li>`;
        }else if(row.saleStatus=="上架失败"){
           addInsertHtml=`<li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=02">编辑产品信息</a></li>
                          <li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=02&seeFlag=1">查看产品信息</a></li>
                          <li id='delProxyPro'><a href="#">删除上架失败产品</a></li>`; 
        }else if(row.saleStatus=="已下架" ||row.saleStatus=="初始"){
           addInsertHtml=`<li><a href="new-public-custom.html?prdCode=${row.prdCode}&type=02&seeFlag=1">查看产品信息</a></li>`;
        };
        let html = `<div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">操作<span class="caret"></span></button>
                   <ul class="dropdown-menu dropdown-menu-right" role="menu">
                       ${addInsertHtml}
                  </ul>
          </div>
        `;
        return html; 
    }
    //删除理财产品
    delProduct(row) {
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
                    utils.xhr.post(httpreq.PS_DeleteFundProduct, {
                        prdCode: row.prdCode
                    }, (res) => {
                        Dialog.alert('删除成功');
                        $("#proxyTable").bootstrapTable('refresh');
                        dialog1.close();
                    });
                }
            }]
        });
    }
    
     //新产品下架
    newProputaway(row) {
        EditRemark.show({
                    verifyType:"0005",
                    btnLabel: '提交审批',
                },(data)=>{
                    var addData = _.extend({},data,{prdCode:row.prdCode});
                    this.Recommended(addData);
                })
       }
    Recommended(addData) {
        utils.xhr.post(httpreq.Check_QueryVerifyStatus, {
            verifyType: "0005",
            businessType: addData.businessType,
            prdType: "02",
            prdCode: addData.prdCode
        }, (response) => {
                if (response.data.result == true) {
                    Dialog.alert("该产品已提交过待审核");
                } else {
                     utils.xhr.post(httpreq.PS_OffSaleFundProduct, addData, (response) => {
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

    //根据产品类型ID获取name
    getprotypename(protypeid) {
        let protypelist = this.producttype.getComponent('get-pro-type.es6')._data || [];
        let protypeobj = _.findWhere(protypelist, { key: protypeid });
        return !protypeobj ? protypeid : protypeobj.value;
    }

    //根据产品状态ID获取name
    getprostatusname(checkCode) {
        let prostatuslist = this.productstatus.getComponent('get-pro-status.es6')._data || [];
        let proStatusobj = _.findWhere(prostatuslist, {ddCode:checkCode});
        return !proStatusobj ? checkCode : proStatusobj.ddName;
    }
    //格式化时间
    getshelfDate(time, format) {
        if (time > 0) {
            return moment(time).format(format);
        } else {
            return '';
        }
    }
    // //同步
    // showsynchroinfo(ckobj) {
    //     ckobj.proTypeName = this.getprotypename(ckobj.prdType);
    //     ckobj.newupdateTime = moment(ckobj.updateTime).format('YYYY-MM-DD HH:mm:ss');
    //     prosynchro.show(ckobj, () => {
    //         this.getproshelflist({});
    //     });
    // }
};


module.exports = TreeGridClass;