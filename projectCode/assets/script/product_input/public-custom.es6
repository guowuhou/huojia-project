const $ = require("lib/jquery.js");
const ejs = require("lib/ejs.js");
const _ = require("lib/underscore.js");
const typeSelector = require('plugins/type-selector.es6');
const urlMethod = require('utils/url.es6');
const Dialog = require("plugins/dialog.es6");
const httpreq = require('httpreq.es6');
const moment = require('lib/moment.js');
const TagSelector = require('plugins/tag-selector.es6');
const EditRemark = require('plugins/edit-remark.es6');
require("lib/bootstrap-datetimepicker.js");
class productCustomClass extends uu.Component{
   properties() {
      return {
          attachNode: {
              defaultValue: null,
              type: uu.Node
          }
      }
  }
  onLoad () {
    this.getPageType();
  }
  start () {
    this.bindEvents();
    //初始化时间控件
    this.initDateTimePicker();
    window.$ = $;
  }
  //定义页面，pageType  0：新产品，1：理财，2：基金
  getPageType () {
    this.pageType = 0;  //默认为新产品
    this.prdCode = "";
    //编辑已有产品--理财    
    let urlParams=urlMethod.get();
    if (urlParams["prdCode"]&&urlParams["type"]=="01") {
      this.pageType = 1;
      this.prdCode = urlParams["prdCode"];
      //查询产品信息
      this.queryCustomInfo();
      $("#prdTypeInput").val("本行理财产品");
    }
    //编辑已有产品---基金    
    else if (urlParams["prdCode"]&&urlParams["type"]=="02") {
      this.pageType = 2;
      this.prdCode = urlParams["prdCode"];
      //查询产品信息
      this.queryCustomInfo();
      $("#prdTypeInput").val("代销理财产品");
      $("#detailUrl").attr("href","product-basicinfo-proxy.html"+window.location.search);
    }
    else{
      //获取产品类型下拉列表
      this.getPrdType();
      this._getUserChannel();
      $("#editDateDiv").show();
      $("#readDateDiv").hide();
    }
  }
  bindEvents () {
    var self = this;
    $(this.node.dom).on('click', '#submitBtn', function () {
      self.updateCustomizedInfo();
    });
    //新增产品添加下列事件
    if(this.pageType==0){
       //校验产品id唯一性      
        $(this.node.dom).on('blur', '._check', function (e) {
            self._checkProperty(e);
        });
    }
    //新增附件
    $(this.node.dom).on('click', '#uploadAttach', function () {
        self._addAttach();  
    });
    //选择标签信息
    $(this.node.dom).on("click", ".searchFlagBtn", function () {
      self._showPrdFlag();
    });
    $(this.node.dom).on("change","#prdTypeSelect",function(){
      self.clearInfo();
    });
  }
  _getUserChannel(productInfo){
    var self=this;
    $.post(httpreq.PS_getUserChannel,{ddType:36},(res)=>{
       if(res.code=="000000"){
           let list = res.data;
           _.each(list, (item) => {
              let itemhtml=`<label class="checkbox-inline m20"><input type="checkbox" name="salesChannelsRadio" 
                     value=${item.ddCode}>${item.ddName}</label>`;
              $("#salesChannels").append(itemhtml);
           });  
           if(productInfo){
              self.showPageInfo(productInfo);
           }
       }else{
          Dialog.alert(res.msg);
       }
    });
  }
  clearInfo(){
    $("#prdCode").val("").removeData();
    $("#prdCode").siblings(".gc").hide();
    $("#prdName").val("").removeData();
    $("#prdName").siblings(".gc").hide();    
  }
  _initEditBtn(customInfo) {
      $(this.node.dom).find("#editDiv [type=radio]").prop("disabled", true);
      $(this.node.dom).find("#editDiv [type=checkbox]").prop("disabled", true);
      $(this.node.dom).find(".nowrite").attr("readonly", true);
      $("#editDateDiv").hide();
      $("#readDateDiv").show();
      $(".noedit").hide();
      $(this.node.dom).find("#onSaleTime1").val(customInfo.onSaleTime=="0"?"":customInfo.onSaleTime);
      if(!customInfo.offSaleTime){
          $("#noEndDate1").prop("checked",true).prop("disabled", true);
      }else{
          $(this.node.dom).find("#offSaleTime1").val(customInfo.offSaleTime=="0"?"":customInfo.offSaleTime);
      }
  }
  _addAttach(){
      var prdCode = $("#prdCode").val(),prdCodeCheck=$("#prdCode").data("checkResult");
      var prdName = $("#prdName").val(),prdNameCheck=$("#prdName").data("checkResult");
      var data=this.getInputData();
      if (!(data.prdCode && data.prdName && data.productSeries && data.cusAssetClass && data.marketingStatus && data.customersLabel && data.salesChannels)) {
        Dialog.alert("请输入必填信息");
        return;
      }
      if(this.pageType==0&&!(prdCodeCheck&&prdNameCheck)){
         Dialog.alert("唯一性校验不通过，请重新输入");
         return;
      }
      var prdType="01"; //默认为理财产品
      if(this.pageType==0){
         prdType=$("#prdTypeSelect").val();  //新增的时候取产品类型下拉框的值
      }
      else if(this.pageType==2){
         prdType="02";  //代销产品
      }
      this.attachNode.getComponent("public-attach-table.es6")._editAttach({
         operateType:0,
         prdType:prdType,
         prdCode:prdCode
      });
  }
  _checkProperty(e){
    let target=$(e.currentTarget),url="";
    if(!target.val()){
        return;
    };
    let data={
        property:target.attr("id"),
        value:target.val()
    };
    if(this.pageType==0){
        if($("#prdTypeSelect").val()=="01"){
          url=httpreq.checkFinaProperty;
        }else{
          url = httpreq.checkFundProperty; //---基金
        }
    }
    if(this.pageType==1){
       url = httpreq.checkFinaProperty;//----理财
    }
    if(this.pageType==2){
       url = httpreq.checkFundProperty; //---基金
    }
    $.post(url,data,(res)=>{
        if(res.code="000000"){
           target.data("checkResult",res.data.result);
           if(res.data.result){
               target.siblings(".glyphicon-ok").show();
               target.siblings(".glyphicon-remove").hide();
           }else{
               Dialog.alert("唯一性验证不通过，请重新输入");
               target.siblings(".glyphicon-remove").show();
               target.siblings(".glyphicon-ok").hide();
           }
        }
    });
  }
  getPrdType(type) {
    var self = this;
    $("#prdTypeSelect").show();
    $("#prdTypeInput").hide();
    $.post(httpreq.PS_getDictionaryType, {ddType:51}, (res) => {
      if (res.code == "000000") {
        let list = res.data,
          selectHtml = "";
        _.each(list, (item) => {
          selectHtml += `<option value=${item.ddCode}>${item.ddName}</option>`;
        });
        $("#prdTypeSelect").html(selectHtml);
      }
    });
  }
  
  initDateTimePicker() {
    let curDateTime = moment(new Date());
    $('.up_datetime').datetimepicker({
      language: 'zhcn',
      todayBtn: true,
      autoclose: true,
      todayHighlight: true,
      startDate: curDateTime.toDate(),
      forceParse: false,
      pickerPosition: "bottom-left",
      startView: 2,
      minView: 0, //时间精确到某个单位，2表示天
      maxView: 'decade'
    });
  }
  //查询产品自定义信息	
  queryCustomInfo () {
    var url = "",
      data = {},
      self = this;
    //查询产品自定义信息
    if(this.pageType==1){
       url = httpreq.getFinancialCustom;//----理财
    }
    if(this.pageType==2){
       url = httpreq.showFundCustom; //---基金
    }
    data.prdCode = this.prdCode;

    $.post(url, data, function (response) {
      if (response.code == "000000") {
        self._getUserChannel(response.data);
        self.productInfo = response.data;
      } else {
        Dialog.alert(response.msg);
      }
    });
  }
  _showPrdFlag() {
    var self = this,prdType="";
    if(this.pageType==0){
        prdType=$("#prdTypeSelect").val()=="01"?"pro0002":"pro0003";
    }else if(this.pageType==1){
        prdType="pro0002";
    }else if(this.pageType==2){
        prdType="pro0003";
    }
    TagSelector.show({
      type: "group",
      productClassificationCode: prdType,
      typechange: false,
      singleSelect: true
    }, (list) => {
      var tagNameString = "",
        tagData = "";
      _.each(list, (i) => {
        tagNameString += (i.name + ',');
        tagData += (i.tagCode + '|');
      });
      $("#productSeries").data("tagData", tagData.substring(0, tagData.length - 1));
      $("#productSeries").val(tagNameString.substring(0, tagNameString.length - 1));
    });
  }
  getInputData(){
    var prdCode = $("#prdCode").val();
    var prdName = $("#prdName").val();
    var prdDesc = $("#prdDesc").val();
    var onSaleTime = $("#onSaleTime").val();
    var offSaleTime = $("#noEndDate").prop("checked") ? "" : $("#offSaleTime").val();
    var prdManagerName = $("#prdManagerName").val();
    var productSeries = $("#productSeries").data("tagData");
    var customerAssetClassificationList = $("#cusAssetClass").find("input");
    var customerAssetClassification = this.findCheckedValue(customerAssetClassificationList);
    var marketingStatusList = $("#marketingStatus").find("input");
    var marketingStatus = this.findCheckedValue(marketingStatusList);
    var customersLabelList = $("#customersLabel").find("input");
    var customersLabel = this.findCheckedValue(customersLabelList);
    var salesChannelsList = $("#salesChannels").find("input");
    var salesChannels = this.findCheckedValue(salesChannelsList);
    var data = {
      prdCode: prdCode,
      prdName: prdName,
      prdDesc: prdDesc,
      productSeries: productSeries,
      prdManagerName: prdManagerName,
      cusAssetClass: customerAssetClassification,
      marketingStatus: marketingStatus,
      customersLabel: customersLabel,
      salesChannels: salesChannels,
      onSaleTime: onSaleTime,
      offSaleTime: offSaleTime
    };
    return data;
  }
  submitINfo (vertifyData) {
    var url = "",self = this;
    var data=this.getInputData();
    if(this.pageType==0){
      //新增产品
      if($("#prdTypeSelect").val()=="01"){
          url=httpreq.addFinancial;   //新增理财产品
          data.prdType="01";
      }else{
          url=httpreq.addFundProduct;  //新增基金产品
          data.prdType="02";
      }
    }else if(this.pageType==1){
      url = httpreq.setFinancialCustom;     //编辑理财产品
      data.prdType="01";
    }else if(this.pageType==2){
      url=httpreq.setFundProduct;    //编辑基金产品
      data.prdType="02";
    }
    var realData=_.extend({},data,vertifyData);

    $.post(url, realData, function (response) {
      if (response.code == "000000") {
        Dialog.alert("保存成功",()=>{
            if(data.prdType=="01"){
               window.location.href='product-list-bank.html';  //本行理财
            }
            if(data.prdType=="02"){
               window.location.href='product-list-proxy.html';  //代销理财
            }
        });
      } else {
        Dialog.alert(response.msg);
      }
    });
  }
  updateCustomizedInfo () {
    var self=this;
    var prdCode = $("#prdCode").val(),prdCodeCheck=$("#prdCode").data("checkResult");
    var prdName = $("#prdName").val(),prdNameCheck=$("#prdName").data("checkResult");
    var data=this.getInputData();
    if (!(data.prdCode && data.prdName && data.productSeries && data.cusAssetClass && data.marketingStatus && data.customersLabel && data.salesChannels)) {
        Dialog.alert("请输入必填信息");
        return;
      }
    if(this.pageType==0&&!(prdCodeCheck&&prdNameCheck)){
        Dialog.alert("唯一性校验不通过，请重新输入");
        return;
    }
    var verifyType="0002",businessType="";  
    if(this.pageType==0){
        verifyType="0001";
        businessType=$("#prdTypeSelect").val()=="01"?"001":"002";
    }else if(this.pageType==1){
        businessType="001";
    }else if(this.pageType==2){
        businessType="002";
    }
    EditRemark.show({verifyType:verifyType,businessType:businessType}, _.bind(self.submitINfo, self));
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
    if (_.isEmpty(data)) {
      return;
    }
    var customInfo = data.customInfo || {};   
    this.customInfo=customInfo;
    //产品为初始、下架状态不可编辑
    if(customInfo.saleStatus=="INIT"||customInfo.saleStatus=="OFF_SALE"){
       this.pageReadonly=true;
       this._initEditBtn(data.customInfo);
    }
    else{
       $("#editDateDiv").show();
       $("#readDateDiv").hide();
    }
    //若有待审核的记录，则页面也不能编辑
    this._queryVerifyStatus(data.customInfo);

    $(this.node.dom).find("#attachListTable").empty(); //从新渲染附件列表时先清除所有附件信息
    $(this.node.dom).find(".gc").hide();
    $(this.node.dom).find("#prdCode").val(customInfo.prdCode).attr("readonly",true);
    $(this.node.dom).find("#prdName").val(customInfo.prdName).attr("readonly",true);
    $(this.node.dom).find("#prdDesc").val(customInfo.prdDesc);
    $(this.node.dom).find("#onSaleTime").val(customInfo.onSaleTime=="0"?"":customInfo.onSaleTime);
    if(!customInfo.offSaleTime){
       $("#noEndDate").prop("checked",true);
    }else{
       $(this.node.dom).find("#offSaleTime").val(customInfo.offSaleTime=="0"?"":customInfo.offSaleTime);
    }
    $(this.node.dom).find("#prdManagerName").val(customInfo.prdManagerName||customInfo.productManName);
    $(this.node.dom).find("#productSeries").val(customInfo.productSeries).data("tagData",customInfo.productSeriesId);

    $(this.node.dom).find("#cusAssetClass").find(`input[value="${customInfo.cusAssetClass}"]`).prop("checked", true);
    $(this.node.dom).find("#marketingStatus").find(`input[value="${customInfo.marketingStatus}"]`).prop("checked", true);

    this.showCheckbox("#customersLabel", customInfo.customersLabel);
    this.showCheckbox("#salesChannels", customInfo.salesChannels);

    const saleStatusMap = {
      "INIT": "初始",
      "NEW_SALE": "新产品上架",
      "WAIT_SALE": "待上架",
      "ON_SALE": "上架中",
      "OFF_SALE": "已下架",
      "FAIL_SALE": "上架失败"
    };
    $(this.node.dom).find("#saleStatus").show();
    $(this.node.dom).find("#saleStatusText").text(saleStatusMap[customInfo.saleStatus]);
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
  _queryVerifyStatus(customInfo){
    var businessType="",prdType="",self=this;  
    if(this.pageType==1){
        businessType="001";prdType="01";
    }else if(this.pageType==2){
        businessType="002";prdType="02";
    }
    var data={
        businessType:businessType,
        verifyType:"0002",
        prdCode:this.prdCode,
        prdType:prdType
    };
    $.post(httpreq.queryVerifyStatus,data,(res)=>{
        if(res.code="000000"){
           if(res.data.result){
               self._initEditBtn(customInfo);
               $("#editDateDiv").hide();
               $("#readDateDiv").show();
           }
           else{
               $("#editDateDiv").show();
               $("#readDateDiv").hide();
           }
        }
    });
  }
  getPrdInfo(){
    var data={
       prdCode:$("#prdCode").val(),
       pageType:this.pageType
    };
    if(this.pageType==1){
       data.prdType="01";   //理财
    }
    else if(this.pageType==2){
       data.prdType="02";   //基金
    }
    return data;
  }

};

module.exports = productCustomClass;