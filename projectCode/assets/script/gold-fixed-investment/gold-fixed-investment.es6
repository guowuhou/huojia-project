const $ = require("lib/jquery.js");
const ejs = require("lib/ejs.js");
const _ = require("lib/underscore.js");
const typeSelector = require('plugins/type-selector.es6');
const utils = require('utils');
const Dialog = require("plugins/dialog.es6");
const httpreq = require('httpreq.es6');
const moment = require('lib/moment.js');
const TagSelector = require('plugins/tag-selector.es6');
const EditRemark = require('plugins/edit-remark.es6');
require("lib/bootstrap-datetimepicker.js");



class goldfixedinvestment extends uu.Component {
  properties() {
    return {
      tableNode: {
        defaultValue: null,
        type: uu.Node
      },
      attachNode: {
        defaultValue: null,
        type: uu.Node
      }
    }
  }
  onLoad() {
    this.dataEvents(); //数据绑定，初始化视图
    this.showPage(); //初始页面不可编辑    
    this.getUserChannel(); //获取货架渠道接入
    this.getCurrencyType(); //获取币种
    this.queryCustomInfo(); //渲染页面
    window.$ = $;
  }
  start() {
    this.bindEvents();
    this.initDateTimePicker();
  }
  showPage() {
    $(this.node.dom).find("input[type=text]").prop("readonly", true);
    $(this.node.dom).find("input[type=checkbox]").prop("disabled", true);
    $(this.node.dom).find("textarea").prop("disabled", true);
    $(this.node.dom).find("select").prop("disabled", true);
    if (utils.url.get()['seeFlag'] == '1') {
      $("#operation").css('display', 'none');
      this.vm.set("uploadFlag", true);
    } else {
      this.vm.set("uploadFlag", false);
    }
    this.vm.set("editFlag", false);
  }
  dataEvents() {
    const vm = this.vm = new uu.ViewModel({
      container: ".goldFixedInvestment",
      view: require("./gold-fixed-investment.tpl"),
      model: {
        //attachFlag:false,   
        prdType: "",
        prdCode: {
          type: String,
          value: utils.url.get()['prdCode'] || '',
          notify: '_setPrdCode'
        },
        prdName: "",
        prdDesc: "",
        productManName: "",
        prdSaleStatusList: [{
          ddCode: "ON_SALE",
          ddName: "上架中"
        }, {
          ddCode: "OFF_SALE",
          ddName: "下架"
        }],
        saleStatus: "ON_SALE",
        updateBy: "",
        updateTime: "",
        currencyList: [],
        currency: "000",
        quoteUnit: "",
        tradingUnit: "",
        investmentStyle: "",
        agreedPeriod: "",
        tradingDay: "",
        tradingHour: "",
        transactChannel: "",
        appliedCustomer: "",
        customersLabel: [],
        majorFeatures: "",
        riskWarning: "",
        attention: "",
        handlingProcedures: "",
        chargeStyle1: "",
        chargeStyle2: "",
        handlingFeeStandard1:"",
        handlingFeeStandard2:"",
        salesChannelsList: [],
        salesChannels: [],
        onSaleTime: "",
        offSaleTime: "",
        editFlag: {
          type: Boolean,
          value: "" //判断为编辑页面
        },
        uploadFlag: {
          type: Boolean,
          value: "" //判断为查看页面的添加标签
        },

      },
      //  _setTagFlag:function(){
      //    var prdType=this.get("prdType");
      //    return prdType=="03";    //prdType="03" 消费金融，显示标签
      //  },
      _setPrdCode: function (val) {
        val = val.replace(/[^0-9a-zA-Z]/g, '');
        vm.set('prdCode', val);
        return val;
      },
    });
    window.vm = this.vm;
  }

  bindEvents() {
    var self = this;
    $(this.node.dom).on('click', '#edit', function () {
      self.editPage();
    });
    //提交审核
    $(this.node.dom).on('click', '#submitBtn', function () {
      self.updateCustomizedInfo();
    });
    //新增附件
    $(this.node.dom).on('click', '#uploadAttach', function () {
      self._addAttach();
    });
    //添加标签
    $(this.node.dom).on("click", "#addTag", function () {
      self._addTag();
    });
    //删除标签
    $(this.node.dom).on("click", "#deleteTag", function () {
      self._deleteTag();
    });
    //勾选无结束时间
    $(this.node.dom).on("click", "#noEndDate", function (e) {
      var target = $(e.currentTarget);
      if (target.prop("checked")) {
        self.vm.set("offSaleTime", "");
      }
    });
    //切换下架时间变换事件
    $(this.node.dom).on("change", "#offSaleTime", function (e) {
      $("#noEndDate").prop("checked", false)
    });
  }
  editPage() {
      $(this.node.dom).find("input[type=text]").prop("readonly", false);
      $(this.node.dom).find("input[type=checkbox]").prop("disabled", false);
      $(this.node.dom).find("textarea").prop("disabled", false);
      $(this.node.dom).find("select").prop("disabled", false);
      $(this.node.dom).find("#editTime").css("display", "block");
      $(this.node.dom).find("#showTime").css("display", "none");
      $(this.node.dom).find("#submitBtn").removeClass(".btn-info[disabled]");
      $(this.node.dom).find("#submitBtn").addClass("btn-info");
      $(this.node.dom).find("#channels [type=checkbox]").prop("disabled", false);
      this.vm.set("editFlag", true);
      this.vm.set("uploadFlag", true);
      $(this.node.dom).find("#submitBtn").prop("disabled", false);
      this.tableNode.getComponent("fixedInvestment-tag-table.es6").getTagList();
      this.attachNode.getComponent("fixedInvestment-attach-table.es6").getAttachList();
    }
    //获取货架渠道接入
  getUserChannel() {
    var self = this;
    utils.xhr.post(httpreq.PS_getUserChannel, {
      ddType: 36
    }, (res) => {
      let list = res.data;
      self.vm.set("salesChannelsList", list);
      $(self.node.dom).find("#channels [type=checkbox]").prop("disabled", true);
    });
  }
  getCurrencyType() {
    var self = this;
    utils.xhr.post(httpreq.PS_GetDictionaryType, {
      ddType: 1
    }, (res) => {
      let list = res.data;
      self.vm.set("currencyList", list);
      $(self.node.dom).find("#channels [type=checkbox]").prop("disabled", true);
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
  queryCustomInfo() {
      var url = httpreq.GetGoldPrdDetail,
        data = {
          prdCode: 'GOLD_DT',
          prdType: '06'
        },
        self = this;
      utils.xhr.post(url, data, function (response) {
        //self.dataList=response.data;
        var customersLabel, salesChannels;
        self.tradingTypeList = response.data.tradingTypeDetail;
        let customInfo = response.data; //本行、代销、消费金融返回的是字符串
        customersLabel = customInfo.customersLabel;
        salesChannels = customInfo.salesChannels;
        customInfo.customersLabel = customersLabel || []; //-----数据格式转换
        customInfo.salesChannels = salesChannels || []; //-----数据格式转换
        self.vm.set("prdType", "黄金定投产品");
        self.vm.set("prdCode", customInfo.prdCode || "");
        self.vm.set("prdName", customInfo.prdName || "");
        self.vm.set("prdDesc", customInfo.prdDesc || "");
        self.vm.set("productManName", customInfo.productManName || "");
        self.vm.set("updateBy", customInfo.updateBy || "");
        self.vm.set("updateTime", customInfo.updateTime || "");
        self.vm.set("saleStatus", customInfo.saleStatus || "");
        self.vm.set("currency",customInfo.currency|| "");
        self.vm.set("quoteUnit", customInfo.quoteUnit || "");
        self.vm.set("tradingUnit", customInfo.tradingUnit || "");
        self.vm.set("investmentStyle", customInfo.investmentStyle || "");
        self.vm.set("agreedPeriod", customInfo.agreedPeriod || "");
        self.vm.set("tradingDay", customInfo.tradingDay || "");
        self.vm.set("tradingHour", customInfo.tradingHour|| "");
        self.vm.set("transactChannel", customInfo.transactChannel|| "");
        self.vm.set("appliedCustomer", customInfo.appliedCustomer || "");
        self.vm.set("customersLabel", customInfo.customersLabel || "");
        self.vm.set("majorFeatures", customInfo.majorFeatures || "");
        self.vm.set("riskWarning", customInfo.riskWarning || "");
        self.vm.set("attention", customInfo.attention || "");
        self.vm.set("handlingProcedures", customInfo.handlingProcedures || "");
        self.vm.set("chargeStyle1", customInfo.tradingTypeDetail[0].chargeStyle || "");
        self.vm.set("chargeStyle2", customInfo.tradingTypeDetail[1].chargeStyle || "");
        self.vm.set("handlingFeeStandard1", customInfo.tradingTypeDetail[0].handlingFeeStandard || "");
        self.vm.set("handlingFeeStandard2", customInfo.tradingTypeDetail[1].handlingFeeStandard || "");
        self.vm.set("salesChannels", customInfo.salesChannels || "");
        self.vm.set("onSaleTime", customInfo.onSaleTime || "");
        self.showPageInfo(response.data);
        //self.tableNode.getComponent("product-tag-table.es6").getPageList(response.data)//查询详情页时本行、理财、大额存单添加标签页的数据
      });

    }
    //显示上部分模板或产品自定义信息
  showPageInfo(data) {
    // if (_.isEmpty(data)) {
    //   return;
    // }
    var self=this;
    var customInfo = data;
    //产品为初始、下架状态不可编辑
    if (!customInfo.offSaleTime) {
      $("#noEndDate").prop("checked", true);
      $("#noEndDate1").prop("checked", true);
    }else{
      self.vm.set("offSaleTime", customInfo.offSaleTime || "");
    };
    //若有待审核的记录，则页面也不能编辑
    this._queryVerifyStatus(data);
    // const saleStatusMap = {
    //   "INIT": "初始",
    //   "NEW_SALE": "新产品上架",
    //   "WAIT_SALE": "待上架",
    //   "ON_SALE": "上架中",
    //   "OFF_SALE": "下架",
    //   "FAIL_SALE": "上架失败"
    // };
    // $(this.node.dom).find("#saleStatusText").text(saleStatusMap[customInfo.saleStatus]);
  }
  _queryVerifyStatus(customInfo) {
    var prdType = "",
      prdCode, self = this;
    prdType = "06";
    prdCode = "GOLD_DT";
    var data = {
      prdCode: prdCode,
      prdType: prdType,
      businessType: "010"
    };
    utils.xhr.post(httpreq.QueryVerifyStatus, data, (res) => {
      if (res.data.result) {
        self.showPage(); //有待审核控制页面不可编辑（查看）
        $("#operation").css('display', 'none');
      }
    });
  }
  updateCustomizedInfo() {
    var self = this;
    var prdName = $("#prdName").val();
    var data = this.getInputData();
    var prdType = '06';

    //消费金融检验必填项
    if ((prdType == "06") && !(data.prdName && data.salesChannels)) {
      Dialog.alert("请输入必填信息");
      return;
    }

    //产品类型prdType和业务类型businessType对应关系
    const businessTypeMap = {
      '01': '001', //产品工厂-本行理财产品
      '02': '002', //产品工厂-代销理财产品
      '03': '006', //产品工厂-消费金融产品
      '04': '007', //产品工厂-大额存单产品
      '06': '010', //黄金定投
      '07': '011' //黄金份额产品
    };
    var businessType = businessTypeMap[prdType];
    EditRemark.show({
      verifyType: "0002",
      businessType: "010"
    }, _.bind(self.submitINfo, self));
  }
  getInputData() {
    var offSaleTime = $("#noEndDate").prop("checked") ? "" : $("#offSaleTime").val();
    var chargeStyleOne = this.vm.get("chargeStyle1");
    var chargeStyleTwo = this.vm.get("chargeStyle2");
    var handlingFeeStandardList=$("#handlingFeeStandard1").val()+ "|" +$("#handlingFeeStandard2").val();
    var chargeStyleList = $("#chargeStyle1").val() + "|" + $("#chargeStyle2").val();
    var tradingTypeList = this.tradingTypeList;
    var tradingTypeCodeList = '';
    for (var i = 0; i < tradingTypeList.length; i++) { //交易类型参数
      tradingTypeCodeList += tradingTypeList[i].tradingTypeCode + (i + 1 < tradingTypeList.length ? "|" : '');
    };
    var data;
    data = {
      prdCode: "GOLD_DT",
      prdName: $("#prdName").val(),
      prdDesc: $("#prdDesc").val(),
      productManName: $("#productManName").val(),
      saleStatus: $("#saleStatus option:selected").val(),
      currency: $("#currency option:selected").val(),
      quoteUnit: $("#quoteUnit").val(),
      tradingUnit: $("#tradingUnit").val(),
      investmentStyle: $("#investmentStyle").val(),
      agreedPeriod: $("#agreedPeriod").val(),
      tradingDay: $("#tradingDay").val(),
      tradingHour: $("#tradingHour").val(),
      transactChannel: $("#transactChannel").val(),
      appliedCustomer: $("#appliedCustomer").val(),
      customersLabel: this.vm.get("customersLabel").join(),
      salesChannels: this.vm.get("salesChannels").join(),
      majorFeatures: $("#majorFeatures").val(),
      riskWarning: $("#riskWarning").val(),
      attention: $("#attention").val(),
      handlingProcedures: $("#handlingProcedures").val(),
      tradingTypeCode: tradingTypeCodeList,
      chargeStyle: chargeStyleList,
      handlingFeeStandard:handlingFeeStandardList,
      onSaleTime: $("#onSaleTime").val(),
      offSaleTime: $("#offSaleTime").val(),
    };
    return data;
  }
  submitINfo(vertifyData) {
    var url = "",
      self = this;
    var data = this.getInputData();
    data.prdType = "06";
    url = httpreq.SetGoldCustomInfo;
    var realData = _.extend({}, data, vertifyData);
    utils.xhr.post(url, realData, function (response) {
      Dialog.alert("保存成功");
      document.location.reload(); //已经提交重新刷新页面（查看）
      $("#operation").css('display', 'none');
    });
  }
  _addAttach() {
    var prdCode = $("#prdCode").val();
    var prdName = $("#prdName").val()
    var data = this.getInputData();
    if (!(data.prdName)) {
      Dialog.alert("请输入产品名称");
      return;
    }
    var prdType = "06";
    this.attachNode.getComponent("fixedInvestment-attach-table.es6")._editAttach({
      operateType: 0,
      prdType: prdType,
      prdCode: 'GOLD_DT'
    });
  }
  _getSeeFlag() {
      return {
        editFlag: this.vm.get("editFlag"),
        uploadFlag: this.vm.get("uploadFlag"),
        prdCode: this.vm.get("prdCode")
      }
    }
    //添加标签
  _addTag(targetList) {
      var self = this,
        prdCode = this.vm.get("prdCode"),
        prdType = '06';
      TagSelector.show({
        type: "group",
        singleSelect: false,
        isProduct: 0
      }, (list) => {
        var data;
        if (list.length === 0) {
          Dialog.alert('您没有勾选标签!');
          return;
        };
        var tagCodeList = '';
        for (var i = 0; i < list.length; i++) {
          tagCodeList += list[i].tagCode + (i + 1 < list.length ? "," : '');
        }
        data = {
          prdCode: "GOLD_DT",
          tagCode: tagCodeList
        };
        utils.xhr.post(httpreq.SetGoldProductTag, data, (res) => {
          Dialog.alert("标签添加成功");
          self.tableNode.getComponent("fixedInvestment-tag-table.es6").getTagList();
        });
      });
    }
    //删除标签
  _deleteTag() {
    var self = this,
      prdType = '06';
    var selectList = self.tableNode.getComponent("fixedInvestment-tag-table.es6").getselectTag();
    if (selectList.length <= 0) {
      Dialog.alert("请勾选要操作的标签");
      return;
    }
    var tagCodeList = _.map(selectList, (item) => {
      return item.tagCode;
    });
    var data = {
      prdCode: "GOLD_DT",
      tagCode: tagCodeList.join()
    };
    utils.xhr.post(httpreq.DelGoldProductTag, data, (res) => {
      Dialog.alert("标签删除成功", () => {
        self.tableNode.getComponent("fixedInvestment-tag-table.es6").getTagList();
      });
    });
  }

};

module.exports = goldfixedinvestment;