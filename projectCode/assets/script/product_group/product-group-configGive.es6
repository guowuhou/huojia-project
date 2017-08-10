const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const artTemplate = require('lib/artTemplate.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const moment = require('lib/moment.js');
const utils = require('utils');
require('lib/bootstrap-table.js');

class groupList extends uu.Component {

    onLoad() {
        console.log('产品配置审核');
        this.initTable();
        this.initEvent();
    }

    initTable() {
        $("#configGiveTable").bootstrapTable('destroy');
        $("#configGiveTable").bootstrapTable({
            //url: "http://10.14.217.17:8090/product/brop/pop/fsm/combine/searchCombPrdList.do",
            url: httpreq.searchCombPrdList,
            columns: [
                {
                    field: 'sourceCode',
                    title: '所属部门',
                    align: 'cneter',
                    formatter: (value) => {
                        return value == "W" ? "智能投顾" : value
                    }
                },
                {
                    field: 'combProductId',
                    title: '组合产品代码',
                    align: 'center'
                },
                {
                    field: 'combProductName',
                    title: '组合名称',
                    align: 'center'
                },
                {
                    field: 'prdRiskLevel',
                    title: '组合风险等级',
                    align: 'center',
                    formatter: (value) => {
                        return value == "1" ? "低" :
                            value == "2" ? "中低" :
                                value == "3" ? "中" :
                                    value == "4" ? "中高" :
                                        value == "5" ? "高" : value
                    }
                },
                {
                    field: 'updateTime',
                    title: '最近修改时间',
                    align: 'center',
                    formatter: (value) => {
                        return moment(value).format('YYYY-MM-DD HH:mm');
                    }
                },
                /*{
                    field: 'combProdType',
                    title: '组合状态',
                    align: 'center',
                    formatter: (value) => {
                        return value == "1"?"待上架":
                               value == "2"?"上架":
                               value == "3"?"下架":
                               value == "4"?"已拒绝": value
                    }
                },*/
                {
                    field: 'reviewStatus',
                    title: '审批状态',
                    align: 'center',
                    formatter: (value) => {
                        return value == "01" ? "待审批" :
                            value == "02" ? "审批成功" :
                                value == "03" ? "审批不通过" : value
                    }
                },
                {
                    field: 'reviewTaskName',
                    title: '审批任务',
                    align: 'center',
                    formatter: (value) => {
                        return value.slice(0, 2);
                    }
                },
                {
                    title: '操作',
                    align: 'center',
                    formatter: _.bind(this.initEventFn, this)
                }
            ],
            queryParams: (params) => {
                return _.extend({ pageSize: "10", pageNum: "1", sourceCode: "W", combProdType: "1" }, {
                    pageSize: params.limit,
                    pageNum: params.offset / params.limit + 1,
                });
            },
            responseHandler: (res) => {
                let pageData = {};
                if (res.code == '000000') {
                    _.extend(pageData, {
                        rows: res.data.comProductList || [],
                        total: res.data.totalRows
                    })
                }
                else {
                    if (res.responseCode == "683310" || res.responseCode == "900106") {
                        Dialog.alert(res.responseMsg || res.msg, () => {
                            window.top.location.href = "http://brop.pab.com.cn/portal/login.html";
                        });
                    }
                }
                return pageData;
            },
            pagination: true,
            sortName: 3,
            sortStable: true,
            pageSize: "10"
        });
    }

    initEventFn(value, row) {
        let html = `<div class="btn-group">
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">操作<span class="caret"></span></button>
                        <ul class="dropdown-menu dropdown-menu-right" role="menu">
                            <li><a class="agree-pro-btn" reviewId=${row.reviewId} href="#">同意</a></li>
                            <li><a class="refuse-pro-btn" reviewId=${row.reviewId} href="#" >拒绝</a></li>
                            <li><a href="product-group-detail.html?reviewId=${row.reviewId}&combProductId=${row.combProductId}">查看组合详情</li>
                        </ul>
                    </div>`;
        return html;
    }

    initEvent() {
        $("body").on('click', ".agree-pro-btn", (e) => {    //同意
            let el = $(e.target);
            this.showDialogFn(1, el.attr('reviewId'));
        })

        $("body").on('click', ".refuse-pro-btn", (e) => {   //拒绝
            let el = $(e.target);
            this.showDialogFn(0, el.attr('reviewId'));
        })
    }

    showDialogFn(type, reviewId) {
        Dialog.show({
            title: "审批意见",
            message: () => {
                return `<textarea id="reasonArea" class="form-control" rows="4" maxlength="1000" name="describe"></textarea>`;
            },
            buttons: [{
                label: '提交',
                cssClass: 'btn-primary',
                action: (dialogRef) => {
                    let reviewReason = $('#reasonArea').val();
                    if (reviewReason) {
                        utils.xhr.post(httpreq.verifyCombProduct, {
                            reviewId: reviewId,
                            sourceCode: "W",
                            reviewResult: type,
                            reviewReason: reviewReason
                        }, () => {
                            Dialog.alert("提交成功！", () => {
                                dialogRef.close();
                                this.initTable();
                            })
                        })
                    } else {
                        Dialog.alert('审批意见不能为空');
                    }
                }
            }]
        });
    }

};

module.exports = groupList;  //hello 