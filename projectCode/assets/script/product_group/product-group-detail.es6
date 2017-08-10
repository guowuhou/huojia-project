const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const artTemplate = require('lib/artTemplate.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const moment = require('lib/moment.js');
const utils = require('utils');
require('lib/bootstrap-table.js');
require('css/tag-selector.css');

class groupDetail extends uu.Component {

    onLoad() {
        console.log('组合产品详情');

        this.initEvent();
        this.ifPageInit();
    }

    pushObjFn(oldArr, newObj = {}) {
        var isPush = true;
        $.each(oldArr, function () {
            if (this.name == newObj.name) {
                isPush = false;
                return;
            }
        })
        var newArr = isPush ? oldArr.push(newObj) : oldArr;
        return newArr;
    }

    ifPageInit() {      //判断加载页面
        let urlData = this.getQueryMap();
        let reviewId = urlData.reviewId || "";
        if (urlData.type == "change") {
            this.initChangePage(urlData.combProductId);
        } else if (urlData.combProductId) {
            this.initDetailPage(urlData.combProductId, reviewId);
            $('body').find('input, select, textarea').prop('disabled', true);
            $('#add-submit-btn').hide();
        } else {
            this.initAddPage();
        }
    }

    initTable(initObj = {}) {   //加载弹窗列表
        $("#productListTable").bootstrapTable('destroy');
        $("#productListTable").bootstrapTable({
            //url: "http://10.14.217.17:8090/esa/api/brop_pop.shelf_service.qryFundPrdListInfo",
            url: httpreq.queryProductInfoList,
            columns: [
                {
                    title: '',
                    field: '',
                    align: 'center',
                    checkbox: true
                },
                {
                    field: 'prdCode',
                    title: '产品代码',
                    align: 'center'
                },
                {
                    field: 'prdName',
                    title: '产品名称',
                    align: 'center'
                },
                {
                    field: 'riskLevel',
                    title: '风险等级',
                    align: 'center',
                },
                {
                    field: 'prdState',
                    title: '产品状态',
                    align: 'center'
                },
                {
                    field: 'currency',
                    title: '币种',
                    align: 'center'
                }
            ],
            queryParams: (params) => {
                return _.extend(initObj, { pageSize: "10", pageNum: "1" }, {
                    pageSize: params.limit,
                    pageNum: params.offset / params.limit + 1,
                });
            },
            responseHandler: (res) => {
                let pageData = {};
                if (res.code == '000000') {
                    _.extend(pageData, {
                        rows: res.data.fundPrdListInfo || [],
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
            pageList: [5, 10, 25],
            pagination: true,
            sortName: 3,
            sortStable: true,
            pageSize: "10"
        });
    }

    initEvent() {   //加载事件
        $('body').on('click', '.config-product-btn', (e) => {
            let el = $(e.target);
            let romateHtml = "";
            Dialog.show({
                title: '挑选产品',
                nl2br: false,
                cssClass: 'ts-dialog',
                message: () => {
                    romateHtml = require('tpl/product-group-proListDialog.tpl');
                    return romateHtml;
                },
                onshown: () => {
                    this.initTable();
                },
                buttons: [{
                    label: '确认',
                    align: 'center',
                    cssClass: 'btn-primary',
                    action: (dialogRef) => {
                        let list = $("#productListTable").bootstrapTable('getAllSelections');
                        this.addProList(list, el);
                        dialogRef.close();
                    }
                }]
            });
        })

        $('body').on('click', '#pro-serarch-btn', () => {
            this.initTable({
                prdName: $('#pro-name-int').val(),
                riskLevel: $('#riskLevel-sel').val()
            })
        })

        $('body').on('click', '.delete-pro-btn', (e) => {
            let el = $(e.target);
            let alltr = el.closest('tbody');
            let thisGroup = el.closest('.form-group');
            el.closest('tr').remove();
            let trNum = alltr.find('tr').length;
            trNum == 0 && thisGroup.hide();
        })

        $('body').on('click', '#add-submit-btn', () => {
            this.addSubmitFn();
        })
    }
    initDetailPage(combProductId, reviewId = "") {     //加载详情页
        //let url = "http://10.14.217.17:8090/product/brop/pop/fsm/combine/searchCombProduct.do";
        let url = httpreq.queryCombProductById;
        utils.xhr.post(url, { reviewId: reviewId, combProductId: combProductId, sourceCode: "W" }, (res) => {
            let daleiContentRender = artTemplate.compile(require('tpl/product-group-proDetail.tpl'));
            $('#proListContent-ul').html(daleiContentRender(res.data));
            $('input[name=combProductName]').val(res.data.combProductName);
            $('select[name=prdRiskLevel]').val(res.data.prdRiskLevel);
            $('input[name=prdRate]').val(res.data.prdRate);
            $('textarea[name=describe]').val(res.data.describe);
        }
        )
    }

    initAddPage() {     //加载新增页
        let url = httpreq.queryCombProductArrInfoList;
        utils.xhr.post(url, {}, (res) => {

            let daleiContentRender = artTemplate.compile(require('tpl/product-group-proAdd.tpl'));
            $('#proListContent-ul').html(daleiContentRender(res.data));
        }
        )
    }

    initChangePage(combProductId) {      //加载修改页
        let url = httpreq.queryCombProductArrInfoList;     //大类列表
       utils.xhr.post(url, {}, (result) => {
            this.addChangeDetailFn(combProductId, result)
        })
    }

    addChangeDetailFn(combProductId, result) {
        let detailUrl = httpreq.queryCombProductById;      //组合详情
        utils.xhr.post(detailUrl, { combProductId: combProductId, sourceCode: "W" }, (res) => {
            
                let newObj = { prdArrList: result.data.prdArrList };
                $.each(newObj.prdArrList, (k, v) => {
                    v.prdInfoList = [];
                    $.each(res.data.combPrdArrList, (k2, v2) => {
                        if (v.prdArr == v2.prdArr) {
                            v.prdRatio = v2.prdRatio;
                            v.prdInfoList = v2.prdInfoList;
                        }
                    })
                })
                let daleiContentRender = artTemplate.compile(require('tpl/product-group-proChange.tpl'));
                $('#proListContent-ul').html(daleiContentRender(newObj));
                $('input[name=combProductName]').val(res.data.combProductName);
                $('select[name=prdRiskLevel]').val(res.data.prdRiskLevel);
                $('input[name=prdRate]').val(res.data.prdRate);
                $('textarea[name=describe]').val(res.data.describe);
            }
        )
    }

    addProList(list, el) {      //配置产品
        if (list.length > 0) {
            let nextGroup = el.closest('.form-group').siblings('.form-group');
            let daleiContentRender = artTemplate.compile(require('tpl/product-group-proList.tpl'));
            let trList = nextGroup.find('tbody>tr');
            if (trList.length == 0) {
                nextGroup.find('tbody').html(daleiContentRender({ list: list }));
            } else {
                let fordata = [];
                $.each(list, function () {
                    let _this = this;
                    let isPush = true;
                    $.each(trList, function () {
                        let thisCode = $(this).find('td').first().html();
                        _this.prdCode == thisCode && (isPush = false);
                    })
                    isPush && fordata.push(this);
                })
                nextGroup.find('tbody').append(daleiContentRender({ list: fordata }));
            }
            nextGroup.show();
        }
    }

    getQueryMap(queryString = null) {     //获取url对象参数
        let paramObj = {},
            paramList,
            oneQueryMatch,
            regGlobal = /[\?\&][^\?\&]+=[^\?\&#]+/g,
            regOne = /[\?\&]([^=\?]+)=([^\?\&#]+)/;

        queryString = queryString || location.href;
        paramList = queryString.match(regGlobal);

        if (!paramList) {
            return paramObj;
        }

        for (let i = 0, len = paramList.length; i < len; i++) {
            oneQueryMatch = paramList[i].match(regOne);
            if (null === oneQueryMatch) {
                continue;
            }
            paramObj[oneQueryMatch[1]] = oneQueryMatch[2];
        }
        return paramObj;
    }

    addSubmitFn() {
        let submitData = {
            combProductName: $('input[name=combProductName]').val(),
            prdRiskLevel: $('select[name=prdRiskLevel]').val(),
            prdRate: $('input[name=prdRate]').val(),
            describe: $('textarea[name=describe]').val(),
            sourceCode: "W",
            combPrdArrList: ""
        };
        let arrList = [];
        let groupList = $('#proListContent-ul').find('li');
        let noProIf = false;
        $.each(groupList, function () {
            let thisInput = $(this).find('input[name=proportion]');
            if (thisInput.val() > 0) {
                let proList = $(this).find('table>tbody>tr');
                if (proList.length == 0) {
                    noProIf = true;
                    return;
                }
                let prdObj = {
                    prdRatio: thisInput.val(),
                    prdArr: thisInput.attr('prdArr'),
                    prdArrName: thisInput.attr('prdArrName'),
                    prdInfoList: []
                }
                let proListArr = [];
                $.each(proList, function () {
                    let proListObj = {
                        isDefaultBuy: "Y",
                        prdClass: $(this).find('td').eq(0).attr('prdClass'),
                        prdCode: $(this).find('td').eq(0).html(),
                        prdName: $(this).find('td').eq(1).html()
                    };
                    proListArr.push(proListObj);
                })
                prdObj.prdInfoList = proListArr;
                arrList.push(prdObj);
            }
        })
        submitData.combPrdArrList = JSON.stringify(arrList);
        console.log(submitData);
        if (noProIf) {
            Dialog.alert('请为占比不为0的大类配置产品！');
            return false;
        }

        if (this.checkoutData(submitData, arrList)) {

            let urlData = this.getQueryMap();
            let url = httpreq.addCombProduct;
            if (urlData.type == "change") {
                submitData.combProductId = urlData.combProductId;
                submitData.operationType = "0002";
                url = httpreq.editCombProduct;
            }
            utils.xhr.post(url, submitData, (res) => {
                    Dialog.alert('已提交!', () => {
                        history.back();
                    });
                }
            )
        }
    }

    checkoutData(data, arrList) {
        function whileDataRes(arrayTypesArray) {
            var num = 0;
            $.each(arrayTypesArray, function (k, v) {
                num += (v.prdRatio - 0);
            })
            return num;
        }

        if ($.trim(data.combProductName).length == 0) {
            Dialog.alert('【组合名称】不能为空!');
            return false;
        } else if ($.trim(data.prdRate).length == 0) {
            Dialog.alert('【预期收益率】不能为空!');
            return false;
        } else if (!(/^[0-9]*$/.test($.trim(data.prdRate)) || /^(-)?\d+(\.\d+)?$/.test($.trim(data.prdRate)))) {
            Dialog.alert('【预期收益率】输入错误！请输入数字或小数!');
            return false;
        } else if ($.trim(data.prdRate) > 1000 || $.trim(data.prdRate) < -100) {
            Dialog.alert('【预期收益率】数值不合理！请重新输入!');
            return false;
        } else if (whileDataRes(arrList) > 100.001 || whileDataRes(arrList) < 99.999) {
            Dialog.alert('【组合方案比例】输入有误,总和应为100,请重新输入!');
            return false;
        }
        return true;
    }

};

module.exports = groupDetail;  //hello 