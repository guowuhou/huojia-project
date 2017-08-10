const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
require('lib/bootstrap-table.js');
const httpreq = require('httpreq.es6');
const utils = require('utils');
const moment = require('lib/moment.js');
const _ = require('lib/underscore.js');
const ejs = require('lib/ejs.js');
const DetailInfoHTML = require('./check-apply.tpl');

class checkApply extends uu.Component {

    // show properties in Editor, you can use this.xxx directly
    properties() {
        return {
            btnYes: {
                defaultValue: null,
                type: uu.Dom
            },
            btnNo: {
                defaultValue: null,
                type: uu.Dom
            },
            choiceOption: {
                defaultValue: null,
                type: uu.Dom
            },
            gridWrap: {
                defaultValue: null,
                type: uu.Dom
            }
        };
    }
    // init
    onLoad() {
        this.bindEvent();
        this.initTable();
        this.getUserId();
    }
    
    bindEvent() {
        //审核通过
        $(this.btnYes).on('click', () => {
            this.checkAction('AGREE');
        });
        //审核不通过
        $(this.btnNo).on('click', () => {
            this.checkAction('REFUSE');
        });
        $("#cleanIterm").on('click', () => {
            this.cleanCondition();
        });
        $("#btn_Search").on('click', () => {
            this.searchList();
        });
    }
    //清除搜索条件
    cleanCondition(){
        let formAll = $('#searchCondition').find("select");
        for (let index = 0; index < formAll.length; index++) {
            let itemform = formAll[index];
            $(itemform).val("ALL");
        };
        $("#prdCode").val("");
    }
    //搜索条件列表
    searchList(){
        let filter = $('#searchCondition').find('[filter]');
        let requireoptions = { pageSize: 20,pageNo: 1 };
        for (let i = 0; i < filter.length; i++) {
            var element = filter[i];
            requireoptions[$(element).attr('filter')] =  $(element).val();
         }
        this.initTable(requireoptions); 
    }
    getUserId() {
        $.post(httpreq.getVerifyType).then((res) => {
            if (res.code === '000000') {
                this.reviewBy = res.data.applicant
            } else if (res.responseCode == "683310" || res.responseCode == "900106") {
                Dialog.alert(res.responseMsg || res.msg, () => {
                    window.top.location.href = "http://brop.pab.com.cn/portal/login.html";
                });
            } else {
                Dialog.alert(res.msg || res.responseMsg);
            }
        })
    }

    //审核操作
    checkAction(verifyOperateType) {
        const list = $(this.gridWrap).bootstrapTable('getAllSelections');
        if (list.length > 0) {
            let reviewId = '', flag = true;
            for (var i = 0, len = list.length; i < len; i++) {
                reviewId += list[i].reviewId + (i + 1 < len ? '|' : '');
                if (list[i].reviewStatus !== '01') flag = false;
            }
            if (flag) {
                this.checkQuery(verifyOperateType, reviewId, false);
            } else {
                Dialog.alert('只有在待审批状态下才可以进行操作，请检查您的选项!');
            }
        } else {
            Dialog.alert('请至少选择一条记录!');
        }
    }
    //verifyOperateType:'AGREE',verifyOperateType:'REFUSE'，拒绝申请,verifyOperateType:'CANCEL'，撤销申请
    checkQuery(verifyOperateType, reviewId, reviewReason) {
        const url = httpreq.Check_verifyProduct;
        let params = {
            verifyOperateType,
            reviewId,
        };
        reviewReason && (params['reviewReason'] = reviewReason);
        $.post(url, params, (data) => {
            if (data.code == "000000") {
                const alertConent = (verifyOperateType === 'AGREE' ? '批准申请成功' : (verifyOperateType === 'REFUSE' ? '拒绝申请成功' : '撤销申请成功'))
                Dialog.alert(alertConent);
                $(this.gridWrap).bootstrapTable('refresh');
            } else {
                Dialog.alert(data.msg);
                $(this.gridWrap).bootstrapTable('refresh');
            }
        });
    }
    initTable(paramObj) {
        // verifyStatus
        var ConditionParma;
        if(paramObj){
            ConditionParma=paramObj;
        }else{
            ConditionParma={
                pageSize:"20",
                pageNo:"1",
                verifyStatus:"01",
                prdCode:"",
                businessType:"ALL",
                operationType:"ALL",
            }
        };
        $(this.gridWrap).bootstrapTable('destroy');
        $(this.gridWrap).bootstrapTable({
            // checkboxHeader: false,
            pagination: true,
            // uniqueId: 'prdCode',
            pageSize: 10,
            pageNumber: 1,
            queryParams: (params) => { //传递的参数
                return _.extend({}, ConditionParma, {
                    pageSource: '002',
                    pageSize: params.limit, //页面大小
                    pageNo: params.offset / params.limit + 1,
                });
            },
            url: httpreq.Check_QueryVerifyList,
            columns: [{
                title: '操作',
                field: '_isChecked',
                align: 'center',
                valign: 'middle',
                checkbox: true
            }, {
                    title: '审核状态',
                    field: 'reviewStatus',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        const map = {
                            '01': '待审核',
                            '02': '审核成功',
                            '03': '审核不通过',
                            '04': '失效'
                        };
                        return map[value];
                    }
                }, {
                    title: '审核ID',
                    field: 'reviewId',
                    align: 'center',
                    valign: 'middle',
                    events: {
                        'click .id': (e, value, row, index) => {
                            console.log(row)
                            this.showDetail(value);
                        }
                    },
                    formatter: function (value, row, index) {
                        let html = `<a class="id" >${value}</a>`;
                        return html;
                    }
                }, {
                    title: '业务类型',
                    field: 'businessType',
                    align: 'center',
                    valign: 'middle',
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
                    title: '审核类型',
                    field: 'operationType',
                    align: 'center',
                    valign: 'middle',
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
                    title: '产品代码',
                    field: 'prdCode',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '申请标题',
                    field: 'reviewTaskName',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '优先级',
                    field: 'priorityLevel',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        const map = {
                            '01': '低',
                            '02': '中',
                            '03': '高'
                        };
                        return map[value];
                    }
                }, {
                    title: '申请人',
                    field: 'createBy',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '申请时间',
                    field: 'createTime',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return moment(value).format('YYYY-MM-DD HH:mm:ss');
                    }
                }, {
                    title: '审核人',
                    field: 'reviewBy',
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: '审核时间',
                    field: 'reviewTime',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (reviewTime) {
                        if(!reviewTime){
                            return '-';
                        }else{
                            return moment(reviewTime).format('YYYY-MM-DD HH:mm:ss');
                        }
                    }
                }],
            responseHandler: (res) => {
                let resDate = {};
                if (res.code == "000000") {
                    _.extend(resDate, {
                        rows: res.data.dataList || [],
                        total: res.data.totalSize
                    });
                } else if(res.responseCode=="683310"||res.responseCode=="900106"){
                    Dialog.alert(res.responseMsg||res.msg,()=>{
                        window.top.location.href="http://brop.pab.com.cn/portal/login.html";
                    });
                } else {
                    Dialog.alert(res.msg || res.responseMsg);
                    resDate = {};
                }
                return resDate;
            },
        });
    }
    showDetail(reviewId) {
        $.post(httpreq.Check_QueryDetail, {
            reviewId: reviewId
        }).then((res) => {
            console.log(res)
            if (res.code === '000000') {
                let info = res.data;
                let detail = {
                    describe: '',
                    createBy: '',
                    priorityLevel: '',
                    reviewTaskName: '',
                    reviewReason:''
                }
                _.extend(detail, info);
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
                };
                detail.operationTypeMap = operationTypeMap[detail.operationType];
                detail.businessTypeMap = businessTypeMap[detail.businessType];
                detail.reviewStatusMap = reviewStatusMap[detail.reviewStatus];
                detail.priorityLevelMap = priorityLevelMap[detail.priorityLevel];
                let buttons = [];
                if (detail.reviewStatus === '01' && detail.createBy !== this.reviewBy) {
                    buttons = [{
                        label: '批准',
                        cssClass: 'btn btn-success',
                        action: (dialogRef) => {
                            const reviewReason = $('#reviewReason').val();
                            this.checkQuery('AGREE', reviewId, reviewReason);
                            dialogRef.close();
                        }
                    }, {
                            label: '拒绝',
                            cssClass: 'btn btn-warning',
                            action: (dialogRef) => {
                                const reviewReason = $('#reviewReason').val();
                                this.checkQuery('REFUSE', reviewId, reviewReason);
                                dialogRef.close();
                            }
                        }];
                } else if (detail.reviewStatus === '01' && detail.createBy === this.reviewBy) {
                    buttons = [{
                        label: '撤销',
                        cssClass: 'btn btn-success',
                        action: (dialogRef) => {
                            const reviewReason = $('#reviewReason').val();
                            this.checkQuery('CANCEL', reviewId, reviewReason);
                            dialogRef.close();
                        }
                    }];
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
};

module.exports = checkApply;