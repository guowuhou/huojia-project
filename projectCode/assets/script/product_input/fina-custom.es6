const $ = require("lib/jquery.js");
const ejs = require("lib/ejs.js");
const _ = require("lib/underscore.js");
const typeSelector = require('plugins/type-selector.es6');
const urlMethod = require('utils/url.es6');
const Dialog = require("plugins/dialog.es6");
const httpreq = require('httpreq.es6');

class productCustomClass extends uu.Component{

    onload() {
        this.getPageType();
    }
    start() {
        this.bindEvents();
        window.$ = $;
        //查询产品或模板信息
        this.queryCustomInfo();
    }
    //定义页面，0：产品，1：模板
    getPageType () {
        this.pageType = 0;
        this.prdCode = "";
        if (urlMethod.get()["prdCode"]) {
            this.pageType = 0;
            this.prdCode = urlMethod.get()["prdCode"];
        } else {
            Dialog.alert("请输入产品代码或模板代码");
        }
    }
    bindEvents () {
        var self = this;
        $(this.node.dom).on('click', '.saveIcon', function () {
            self.updateCustomizedInfo();
        });
        $(this.node.dom).on('click', '.editIcon', function () {
            self.editCustomizedInfo();
        });
        $(this.node.dom).on('change', '#fileField', function (e) {
            self.uploadFile();
        });

        //绑定文件上传之后iframe的响应事件
        $(this.node.dom).find("#upload_iframe").on("load", function () {
            self._onLoad();
        });
        //附件删除事件绑定
        $(this.node.dom).on("click", "#deletAttachTpl", function (e) {
            self.deleteAttach(e);
        });
        //附件下载事件绑定
        $(this.node.dom).on("click", "#downLoadAttachTpl", function (e) {
            self.downLoadAttach(e);
        });
    }
    //编辑自定义信息
    editCustomizedInfo () {
        $(this.node.dom).find("#editDiv [type=radio]").attr("disabled", false);
        $(this.node.dom).find("#editDiv [type=checkbox]").attr("disabled", false);
        $(this.node.dom).find("#managerName").attr("readonly", false);
        $(this.node.dom).find(".saveIcon").addClass("btn-primary").removeClass("btn-default");
        this.editFlag = true;
    }
    //查询产品自定义信息	
    queryCustomInfo () {
        var url = "",
            data = {},
            self = this;
        //查询产品自定义信息
        url = httpreq.getFinancialCustom;
        data.prdCode = this.prdCode;

        $.post(url, data, function (response) {
            if (response.code == "000000") {
                self.showPageInfo(response.data);
                self.productInfo = response.data;
            } else {
                Dialog.alert(response.msg);
            }
        });
    }
    updateCustomizedInfo () {
        if (!this.editFlag) {
            Dialog.alert("请先点击编辑按钮");
            return;
        }

        var managerName = $("#managerName").val();
        var investmentDirectionList = $("#investmentDirection").find("input");
        var investmentDirection = this.findCheckedValue(investmentDirectionList);
        var customerAssetClassificationList = $("#customerAssetClassification").find("input");
        var customerAssetClassification = this.findCheckedValue(customerAssetClassificationList);
        var marketingStatusList = $("#marketingStatus").find("input");
        var marketingStatus = this.findCheckedValue(marketingStatusList);
        var customersLabelList = $("#customersLabel").find("input");
        var customersLabel = this.findCheckedValue(customersLabelList);
        var salesChannelsList = $("#salesChannels").find("input");
        var salesChannels = this.findCheckedValue(salesChannelsList);

        var url = "",
            self = this;
        var data = {
            prdCode: self.prdCode,
            prdManagerName: managerName,
            investmentDirection: investmentDirection,
            customerAsset: customerAssetClassification,
            marketingStatus: marketingStatus,
            customersLabel: customersLabel,
            salesChannels: salesChannels
        };
        //编辑自定义信息
        url = httpreq.setFinancialCustom;

        $.post(url, data, function (response) {
            if (response.code == "000000") {
                Dialog.alert("保存成功");
                self.editFlag = false;
                self._initEditBtn();
            } else {
                Dialog.alert(response.msg);
            }
        });
    }
    findCheckedValue (list) {
        let result = "";
        for (let i = 0; i < list.length; i++) {
            if (list[i].checked) {
                result += list[i].value + ',';
            }
        }
        result = result.substring(0, result.length - 1);
        return result;
    }
    //显示上部分模板或产品自定义信息
    showPageInfo (data) {
        //初始化为不可编辑状态
        if (!this.editFlag) {
            this._initEditBtn();
        }
        if (_.isEmpty(data)) {
            return;
        }
        $(this.node.dom).find("#attachListTable").empty(); //从新渲染附件列表时先清除所有附件信息
        var customInfo = data.customInfo || {};
        $(this.node.dom).find("#managerName").val(customInfo.prdManagerName);
        $(this.node.dom).find("#investmentDirection").find(`input[value="${customInfo.investmentDirection}"]`).prop("checked", true);
        $(this.node.dom).find("#customerAssetClassification").find(`input[value="${customInfo.customerAsset}"]`).prop("checked", true);
        $(this.node.dom).find("#prdLabel").val(customInfo.productSeries);

        this.showCheckbox("#marketingStatus", customInfo.marketingStatus);
        this.showCheckbox("#customersLabel", customInfo.customersLabel);
        this.showCheckbox("#salesChannels", customInfo.salesChannels);

        if (data.attachInfos) {
            this.showAttachInfos(data.attachInfos);
        }
    }
    showCheckbox (id, value) {
        if (value) {
            var list = value.split(','),
                targetId = "";
            for (let i = 0; i < list.length; i++) {
                targetId = id + ` input[value=${list[i]}]`;
                $(targetId).prop("checked", true);
            }
        }
    }
    _initEditBtn() {
        $(this.node.dom).find("#editDiv [type=radio]").attr("disabled", true);
        $(this.node.dom).find("#editDiv [type=checkbox]").attr("disabled", true);
        $(this.node.dom).find("#managerName").attr("readonly", true);
        $(this.node.dom).find(".saveIcon").addClass("btn-default").removeClass("btn-primary");
    }
    //展示附件列表信息
    showAttachInfos (data) {
        var listHTML = '',
            self = this;
        if (_.isEmpty(data)) {
            return;
        }
        for (let i = 0; i < data.length; i++) {
            listHTML += `<li class="list-group-item" data-id="${data[i].attachId}"><a id="downLoadAttachTpl">${data[i].attachName}`;
            listHTML += '</a><div style="float: right;" id="deletAttachTpl"><span class="glyphicon glyphicon-remove" style="color:red;font-size: 20px;">';
            listHTML += '</span></div></li>';
        }
        $(this.node.dom).find("#attachListTable").append(listHTML);
    }
    //删除附件
    deleteAttach (e) {
        var self = this,
            data = {},
            target = $(e.currentTarget),
            url = "";
        //产品
        data.attachId = target.parent().attr("data-id");
        data.prdCode = self.prdCode;
        url = httpreq.PS_FileDelete;

        $.post(url, data, function (data) {
            if (data.code == "000000") {
                self.queryCustomInfo();
            } else {
                Dialog.alert(data.msg);
            }
        });
    }
    //下载附件
    downLoadAttach (e) {
        var self = this,
            data = {},
            target = $(e.currentTarget),
            url = "";
        //产品
        data.attachId = target.parent().attr("data-id");
        //  data.prdCode=self.prdCode;
        url = httpreq.PS_FileDownload;
        url += '?attachId=' + data.attachId;
        let adownLoad = $(this.node.dom).find('#downLoadAttach')[0];
        adownLoad.href = url;
        adownLoad.click();

    }
    uploadFile () {
        var self = this;
        //产品上传附件
        $(this.node.dom).find("#prdCodeId").val(this.prdCode);
        $(this.node.dom).find("#prdTypeId").val("1");

        // 判断文件格式
        var filePath = $("#fileField").val();
        if (!/\.(pdf||doc||docx||xls||xlsx||jpg||png||rtf)$/i.test(filePath) && filePath) {
            Dialog.alert("请上传pdf、doc、docx、xls、xlsx、jpg、png或rtf格式的文件");
            return;
        }
        $('#uploadForm').attr('action', httpreq.PS_FileUpload);
        $("#uploadForm").submit();
    }
    _onLoad () {
        var self = this;
        var iframe = $(this.node.dom).find("#upload_iframe").get(0);
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        var text = $(doc.documentElement).text();
        if (text == "") return;
        var _json = $.parseJSON(text).body;
        if (_json.code == "000000") {
            self.showAttachInfos(_json.data);
        } else {
            Dialog.alert(_json.msg);
        }
    }

};

module.exports = productCustomClass;