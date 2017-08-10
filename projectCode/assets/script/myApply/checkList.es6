const ejs = require('lib/ejs.js');
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
require('lib/bootstrap-table.js');
const DetailInfoHTML = require('./my-apply.tpl');
const utils=require('utils');

class checkStaus extends uu.Component {
    onLoad() {
        this.getproshelflist();
    }
    //根据筛选条件rqoptions查询产品列表
    
    getproshelflist(paramObj) {
        var pageParamObj;
        if(paramObj){
            pageParamObj=paramObj
        }else{
            pageParamObj={
                pageSize:"20",
                pageNo:"1",
                verifyStatus:"ALL",
                prdCode:"",
                businessType:"ALL",
                operationType:"ALL",
            }
        }
        $("#tableList").bootstrapTable('destroy');
        $('#tableList').bootstrapTable({
            pagination: true,//是否显示分页
            pageSize: pageParamObj.pageSize,//每页的记录行数
            queryParams: (params) => {//传递的参数
                return  _.extend({}, pageParamObj, {
                    pageSource:'001',
                    pageSize: params.limit,//页面大小
                    pageNo: params.offset / params.limit + 1,
               });
            },
            url: httpreq.Check_QueryVerifyList,
            columns: [
                {
                title: '操作',
                field: '_isChecked',
                align: 'center',
                valign: 'middle',
                checkbox: true
                },  
                {
                    field: 'reviewStatus',
                    title: '审核状态',
                    align: 'center',
                    formatter: function(value, row, index) {
                    const map = {
                        'ALL':'所有',
                        '01': '待审核',
                        '02': '审核成功',
                        '03': '审核不通过',
                        '04': '失效'
                    };
                    return map[value];
                }
                }, {
                    field: 'reviewId',
                    title: '审核ID',
                    align: 'center',
                    events: {
                    'click .Id': (e, value, row, index) => {
                        this.showDetail(row);
                    }
                },
                   formatter: function(value, row, index) {
                    let html = `<a class="Id" >${value}</a>`;
                    return html;
                },
                }, {
                    field: 'businessType',
                    title: '业务类型',
                    align: 'center',
                    formatter: function (value, row, index) {
                        const map = {
                            '001': '产品工厂—本行理财产品',
                            '002': '产品工厂—代理理财产品',
                            '003': '产品货架—口袋',
                            '004': '产品货架—千人千面',
                            '005': '产品货架-金管家',
                            '006': '产品工厂-消费金融产品',
                            '007': '产品工厂-大额存单产品',
                            '008': '产品货架-厅堂',
                            '009': '产品货架-新口袋银行',
                            '010': '产品工厂-黄金定投产品',
                            '011': '产品工厂-黄金份额产品',
                            '012': '产品工厂-本行存款产品'
                            
                        };
                        return map[value];
                    }
                }, {
                    field: 'operationType',
                    title: '审核类型',
                    align: 'center',
                    formatter: function (value, row, index) {
                        const map = {
                            '0001': '创建新产品',
                            '0002': '编辑产品信息',
                            '0005': '新产品删除',
                            '0006': '配置智能货架'
                        };
                        return map[value];
                    }
                }, {
                    field: 'prdCode',
                    title: '产品代码',
                    align: 'center'
                }, {
                    field: 'reviewTaskName',
                    title: '申请标题', 
                    align: 'center'
                }, {
                    field: 'priorityLevel',
                    title: '优先级',
                    align: 'center',
                     formatter: function (value, row, index) {
                        const map = {
                            '01': '低',
                            '02': '中',
                            '03': '高'
                        };
                        return map[value];
                    }
                },{
                    field: 'createBy',
                    title: '申请人',
                    align: 'center'
                },{
                    field: 'createTime',
                    title: '申请时间',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return moment(value).format('YYYY-MM-DD HH:mm:ss');
                    }
                }, {
                    field: 'reviewBy',
                    title: '审核人',
                    align: 'center'
                }, {
                    field: 'reviewTime',
                    title: '审核时间',
                    align: 'center',
                    formatter: function (reviewTime) {
                        if(!reviewTime){
                            return '-';
                        }else{
                            return moment(reviewTime).format('YYYY-MM-DD HH:mm:ss');
                        }
                    }
                }, 
            ],
            responseHandler: (res) => {
                let resDate = {};
                if (res.code == "000000") {
                    this.productInfoList = res.data.dataList;
                    _.extend(resDate, {
                        rows: res.data.dataList || [],
                        total: res.data.totalSize
                    });
                }else if(res.responseCode == '900106'||res.responseCode == '683310'){
                         Dialog.alert(res.msg || res.responseMsg);
                         window.top.location.href = "http://brop.pab.com.cn/portal/login.html";
                }else {
                    Dialog.alert(res.msg || res.responseMsg);
                    this.productInfoList = res.data.dataList;
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
    
       showDetail(row) {
        $.post(httpreq.Check_QueryDetail, {
            reviewId: row.reviewId
        }).then((res) => {
            if (res.code === '000000') {
                let info = res.data;
                let detail = {
                    describe:'',
                    createBy:'',
                    priorityLevel:'',
                    reviewTaskName:'',
                    reviewReason:'',
                }
                _.extend(detail,info);
                const businessTypeMap = {
                    '001': '产品工厂-本行理财产品',
                    '002': '产品工厂-代销理财产品',
                    '003': '产品货架—口袋',
                    '004': '产品货架—千人千面',
                    '005': '产品货架-金管家',
                    '006': '产品工厂-消费金融产品',
                    '007': '产品工厂-大额存单产品',
                    '008': '产品货架-厅堂',
                    '009': '产品货架-新口袋银行',
                    '010': '产品工厂-黄金定投产品',
                    '011': '产品工厂-黄金份额产品',
                    '012': '产品工厂-本行存款产品'
                };
                const operationTypeMap = {
                   '0001': '创建新产品',
                   '0002': '编辑产品信息',
                   '0005': '新产品删除',
                   '0006': '配置智能货架'
                };
                const reviewStatusMap = {
                    '01': '待审核',
                    '02': '审核成功',
                    '03': '审核不通过',
                    '04': '失效'
                };
                const priorityLevelMap={
                    '01': '低',
                    '02': '中',
                    '03': '高'
                }
                detail.operationTypeMap = operationTypeMap[detail.operationType];
                detail.businessTypeMap = businessTypeMap[detail.businessType];
                detail.reviewStatusMap = reviewStatusMap[detail.reviewStatus];
                detail.priorityLevelMap = priorityLevelMap[detail.priorityLevel];
                let buttons = [];
                if (detail.reviewStatus === '01') {
                    buttons = [{
                        label: '撤销',
                        cssClass: 'btn btn-success',
                        action: (dialogRef) => {
                            const reviewReason = $('#reviewReason').val();
                            utils.xhr.post(httpreq.Check_verifyProduct, {
                                verifyOperateType: 'CANCEL',
                                reviewId: row.reviewId,
                                reviewReason:reviewReason
                            }, (res) => {
                                    Dialog.alert("撤销申请成功!");
                                    $("#tableList").bootstrapTable('refresh');
                            },(res)=>{
                               $("#tableList").bootstrapTable('refresh');
                            });
                            dialogRef.close();
                        }
                    }];
                } else if (detail.reviewStatus === '02' || detail.reviewStatus === '03' || detail.reviewStatus === '04') {

                }
                Dialog.show({
                    title: '审核详情',
                    nl2br: false,
                    cssClass: 'ts-dialog',
                    message: () => {
                        return new ejs({
                            text: DetailInfoHTML
                        }).render(detail);
                    },
                    buttons: buttons
                });
            } else {
                Dialog.alert(res.msg);
            }
        }, (res) => {
            res && Dialog.alert(res.msg);
        })
    }
    //返回查询产品列表的上送的参数
    getqryparamdatas() {
        return this.paramObj || {};
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
module.exports = checkStaus;