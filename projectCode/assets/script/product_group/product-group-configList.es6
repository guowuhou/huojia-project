const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const artTemplate = require('lib/artTemplate.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const moment = require('lib/moment.js');
const utils = require('utils');
require('lib/bootstrap-table.js');

class groupList extends uu.Component {

    properties() {
        return {
            sel_prd: {
                defaultValue: null,
                type: uu.Dom
            }
        }
    }

    onLoad() {
        console.log('产品配置列表');
        this.combProdTypeVal = $(this.sel_prd).val() || "5";
        this.initTable();
        this.initPageEvent();
    }

    initTable() {
        $("#configListTable").bootstrapTable('destroy');
        $("#configListTable").bootstrapTable({
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
                {
                    field: 'combProdType',
                    title: '组合状态',
                    align: 'center',
                    formatter: (value) => {
                        return value == "1" ? "待上架" :
                            value == "2" ? "上架" :
                                value == "3" ? "下架" :
                                    value == "4" ? "已拒绝" : value
                    }
                },
                /*{
                    field: 'reviewStatus',
                    title: '审批状态',
                    align: 'center',
                    formatter: (value) => {
                        return value == "01"?"待审批":
                               value == "02"?"审批成功":
                               value == "03"?"审批不通过": value
                    }
                },*/
                {
                    title: '操作',
                    align: 'center',
                    formatter: _.bind(this.initEventFn, this)
                }
            ],
            queryParams: (params) => {
                return _.extend({ pageSize: "10", pageNum: "1", sourceCode: "W", combProdType: this.combProdTypeVal }, {
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
                } else {
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

    initEventFn(value, row) {   //reviewId=${row.reviewId}
        let insertHtml = "";
        if (row.combProdType == "2" && this.combProdTypeVal == "2") {
            insertHtml = `<li><a class="deletePro-btn" combProductId=${row.combProductId} href="#">下架</a></li>
                          <li><a href="product-group-detail.html?type=change&combProductId=${row.combProductId}">修改</li>
                          <li><a href="product-group-detail.html?combProductId=${row.combProductId}">查看组合详情</li`
        } else if (this.combProdTypeVal == "4") {
            insertHtml = `<li><a class="reviewReason-btn" reviewReason=${row.reviewReason} href="#">查看拒绝理由</a></li>
                          <li><a href="product-group-detail.html?reviewId=${row.reviewId}&combProductId=${row.combProductId}">查看组合详情</li>`
        } else if (this.combProdTypeVal == "1") {
            insertHtml = `<li><a href="product-group-detail.html?reviewId=${row.reviewId}&combProductId=${row.combProductId}">查看组合详情</li>`
        } else {
            insertHtml = `<li><a href="product-group-detail.html?combProductId=${row.combProductId}">查看组合详情</li>`
        }
        let html = `<div class="btn-group">
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">操作<span class="caret"></span></button>
                        <ul class="dropdown-menu dropdown-menu-right" role="menu">
                            ${insertHtml}
                        </ul>
                    </div>`;
        return html;
    }

    initPageEvent() {
        $(this.sel_prd).change(() => {
            this.combProdTypeVal = $(this.sel_prd).val();
            this.initTable();
        })

        $('body').on('click', '.deletePro-btn', (e) => {
            let el = $(e.target);
            Dialog.confirm({
                closable: true,
                message: '确认下架该组合？',
                btnCancelLabel: '取消',
                btnOKLabel: '确认',
                callback: (res) => {
                    if (res) {
                        utils.xhr.post(httpreq.offSaleCombProduct, { sourceCode: "W", combProductId: el.attr('combProductId') }, (res) => {

                            Dialog.alert("提交成功!");
                            this.initTable();

                        })
                    }
                }
            })
        })

        $('body').on('click', '.reviewReason-btn', (e) => {
            let el = $(e.target);
            let reviewReason = el.attr('reviewReason');
            Dialog.show({
                title: "审批意见",
                message: () => {
                    return `<textarea id="reasonArea" disabled="true" class="form-control" rows="4" maxlength="1000" name="describe">${reviewReason}</textarea>`;
                },
                buttons: [{
                    label: '确认',
                    cssClass: 'btn-primary',
                    action: (dialogRef) => {
                        dialogRef.close();
                    }
                }]
            });
        })
    }

};

module.exports = groupList;  //hello 