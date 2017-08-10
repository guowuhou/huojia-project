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
const dialogLib1= require('plugins/productes-select/product-to-lib.es6');
require("lib/bootstrap-datetimepicker.js");



class fixedclownClass extends uu.Component {
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
    this.showPage(); //编辑页面可以编辑，查看页面不可编辑    
    this.getFixedHistoryDrawRate();//获取定活通产品利率
    this.getUserChannel(); //获取货架渠道接入
    this.queryCustomInfo(); //渲染页面
    window.$ = $;
  }
  start() {
    this.bindEvents();
    this.initDateTimePicker();
  }
  showPage() {
    $(this.node.dom).find("#prdName").prop("disabled", true);
    if (utils.url.get()['seeFlag'] == '1') {
      this.vm.set("uploadFlag", false);
      this.vm.set("editFlag", false);
      $(this.node.dom).find("input[type=text]").prop("readonly", true);
      $(this.node.dom).find("input[type=checkbox]").prop("disabled", true);
      $(this.node.dom).find("#salesChannels [type=checkbox]").prop("disabled", true);
      $(this.node.dom).find("textarea").prop("disabled", true);
      $(this.node.dom).find("select").prop("disabled", true);
    } else {
      this.vm.set("uploadFlag", true);
      this.vm.set("editFlag", true);
    }
    
  }
  dataEvents() {
    const vm = this.vm = new uu.ViewModel({
      container: ".fixedclown",
      view: require("./fixed-clown.tpl"),
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
        saleStatus: "",
        updateBy: "",
        updateTime: "",
        ccy: "",
        amtMin: "",
        saveDeadline: "",
        planRate: "",
        payStyle: "",
        drawControlType: "",
        preDrawType: "",
        transactChannel: "",
        appliedCustomer: "",
        customersLabel: [],
        majorFeatures: "",
        salesChannelsList: [],
        intRateList:[],
        salesChannels: [],
        onSaleTime: "",
        offSaleTime: "",
        editFlag:{
          type:Boolean,
          value:utils.url.get()['seeFlag']=="1"?false:true   //判断为编辑页面
        },
        seeFlag:{
          type:Boolean,
          value:utils.url.get()['seeFlag']=="1"?true:false   //判断为查看页面
        },
        uploadFlag: {
          type: Boolean,
          value: "" //判断为查看页面的添加标签
        },
        configureIntel:{
         type: Boolean,
         value: "" //判断为产品货架接入页面
       }
      },
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
  
  //获取定活通产品利率
  getFixedHistoryDrawRate(){
    var self = this,
    prdCode = utils.url.get()['prdCode'];
    utils.xhr.post(httpreq.PS_getFixedHistoryDrawRate,{
      prdCode:prdCode,
      effectDate:moment().format('YYYYMMDD')
    },(res)=>{
      let list = res.data.acctList;
      self.vm.set("intRateList",list);
      self.vm.set("planRate", list[list.length-1].intRate+'%' || "");
    })
  }
  
    //获取货架渠道接入
  getUserChannel() {
    var self = this;
    utils.xhr.post(httpreq.PS_QryEditAccChannel, {
      ddType: 36
    }, (res) => {
      let list = res.data;
      self.vm.set("salesChannelsList", list);
      if(utils.url.get()['seeFlag'] == '1'){
          $("#salesChannels [type=checkbox]").prop("disabled", true);
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
  queryCustomInfo() {
      var url = httpreq.PS_getFixedCurrentLinkDetail,
          prdCode = utils.url.get()['prdCode'],
        data = {
          prdCode: prdCode,
          prdType: '09'
        },
        self = this;
      utils.xhr.post(url, data, function (response) {
        //self.dataList=response.data;
        var customersLabel, salesChannels ,drawControlType;
        self.tradingTypeList = response.data.tradingTypeDetail;
        let customInfo = response.data; //本行、代销、消费金融返回的是字符串
        customersLabel = customInfo.customersLabel;
        var saleStatusMap={"ON_SALE":"上架中","OFF_SALE":"已下架"};
        let len = customInfo.saveDeadlineArray.length;
        let saveDeadline=customInfo.saveDeadlineArray[len-1].saveDeadline;
        if(saveDeadline.charAt(saveDeadline.length-1)=='Y'){
                 saveDeadline=`${saveDeadline.charAt(0)}年`
                        };
        salesChannels = customInfo.salesChannels;
        drawControlType = customInfo.drawControlType;
        customInfo.customersLabel = customersLabel || []; //-----数据格式转换
        customInfo.salesChannels = salesChannels || []; //-----数据格式转换
        self.vm.set("prdType", "本行存款产品");
        self.vm.set("prdCode", customInfo.prdCode || "");
        self.vm.set("prdName", customInfo.prdName || "");
        self.vm.set("prdDesc", customInfo.prdDesc || "");
        self.vm.set("productManName", customInfo.productManName || "");
        self.vm.set("saleStatus", saleStatusMap[customInfo.saleStatus] || "");
        self.vm.set("updateBy", customInfo.updateBy || "");
        self.vm.set("updateTime", moment(customInfo.updateTime).format("YYYY-MM-DD HH:mm:ss") || "");
        self.vm.set("ccy",(function(){
          const ccyMap = {'USD':'美元','RMB':'人民币','HKD':'港币'};
          return ccyMap[customInfo.ccy] || ''
        })());
        self.vm.set("amtMin", (function(){
          return Number(customInfo.amtMin).toFixed(2) || ''
        })());
        self.vm.set("saveDeadline", saveDeadline || ""); 
        self.vm.set("payStyle", customInfo.payStyle || "");
        self.vm.set("drawControlType", (function(){
          let mapDrawControlType = {'0':'不控制','1':'控制最小金额','2':'控制最大金额','3':'控制金额范围'};
          return mapDrawControlType[drawControlType]
        })());
        self.vm.set("preDrawType", customInfo.preDrawType|| "");
        self.vm.set("transactChannel", customInfo.transactChannel|| "");
        self.vm.set("appliedCustomer", customInfo.appliedCustomer || "");
        self.vm.set("customersLabel", customInfo.customersLabel || "");
        self.vm.set("majorFeatures", customInfo.majorFeatures || "");
        self.vm.set("salesChannels", customInfo.salesChannels || "");
        self.vm.set("onSaleTime", customInfo.onSaleTime || "");
        self.showPageInfo(response.data);
        //self.tableNode.getComponent("product-tag-table.es6").getPageList(response.data)//查询详情页时本行、理财、大额存单添加标签页的数据
      });

    }
    //显示上部分模板或产品自定义信息
  showPageInfo(data) {
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
  }
  _queryVerifyStatus(customInfo) {
      var prdType = "",
      prdCode, self = this;
      prdType = "09";
      prdCode = utils.url.get()['prdCode'];
      var data = {
        prdCode: prdCode,
        prdType: prdType,
        businessType: "012"
      };
      utils.xhr.post(httpreq.QueryVerifyStatus, data, (res) => {
        if (res.data.result) {
           self.vm.set("uploadFlag", false);
           self.vm.set("editFlag", false);
           $("#operation").css('display', 'none');
           $(self.node.dom).find("input[type=text]").prop("readonly", true);
           $(self.node.dom).find("input[type=checkbox]").prop("disabled", true);
           $(self.node.dom).find("#salesChannels [type=checkbox]").prop("disabled", true);
           $(self.node.dom).find("textarea").prop("disabled", true);
           $(self.node.dom).find("select").prop("disabled", true);
        }
      });
  }
  updateCustomizedInfo() {
    var self = this;
    var prdName = $("#prdName").val();
    var data = this.getInputData();
    var prdType = '09';
    //消费金融检验必填项
    if ((prdType == "09") && !(data.salesChannels)) {
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
      '07': '011', //黄金份额产品
      '09': '012'  //本行存款产品
    };
    var businessType = businessTypeMap[prdType];
    EditRemark.show({
      verifyType: "0002",
      businessType: "012"
    }, _.bind(self.submitINfo, self));
  }
  getInputData() {
    var offSaleTime = $("#noEndDate").prop("checked") ? "" : $("#offSaleTime").val();
    var data;
    data = {
      prdCode: utils.url.get()['prdCode'],
      prdName: $("#prdName").val(),
      prdDesc: $("#prdDesc").val(),
      productManName: $("#productManName").val(),
      salesChannels: this.vm.get("salesChannels").join(),
      preDrawType:$("#preDrawType").val(),
      transactChannel: $("#transactChannel").val(),
      appliedCustomer: $("#appliedCustomer").val(),
      customersLabel: this.vm.get("customersLabel").join(),
      majorFeatures: $("#majorFeatures").val(),
      onSaleTime: $("#onSaleTime").val(),
      offSaleTime: $("#offSaleTime").val(),
    };
    return data;
  }
  submitINfo(vertifyData) {
    var url = "",
      self = this;
    var data = this.getInputData();
    data.prdType = "09";
    url = httpreq.SetDhtCustomInfo;
    var realData = _.extend({}, data, vertifyData);
    utils.xhr.post(url, realData, function (response) {
        Dialog.alert("保存成功",function(){
            location.href = "fixed-clown.html?prdCode="+ utils.url.get()['prdCode'];
        })
    });
  }
  _addAttach() {
    var prdCode = $("#prdCode").val();
    var prdName = $("#prdName").val()
    var data = this.getInputData();
    var prdType = "09";
    this.attachNode.getComponent("fixedclown-attach-table.es6")._editAttach({
      operateType: 0,
      prdType: prdType,
      prdCode: utils.url.get()['prdCode']
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
        prdType = '09';
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
          prdCode: utils.url.get()['prdCode'],
          tagCode: tagCodeList
        };
        utils.xhr.post(httpreq.SetDhtProductTag, data, (res) => {
          Dialog.alert("标签添加成功");
          self.tableNode.getComponent("fixedclown-tag-table.es6").getTagList();
        });
      });
    }
    //删除标签
  _deleteTag() {
    var self = this,
      prdType = '09';
    var selectList = self.tableNode.getComponent("fixedclown-tag-table.es6").getselectTag();
    if (selectList.length <= 0) {
      Dialog.alert("请勾选要操作的标签");
      return;
    }
    var tagCodeList = _.map(selectList, (item) => {
      return item.tagCode;
    });
    var data = {
      prdCode: utils.url.get()['prdCode'],
      tagCode: tagCodeList.join()
    };
    utils.xhr.post(httpreq.DelDhtProductTag, data, (res) => {
      Dialog.alert("标签删除成功", () => {
        self.tableNode.getComponent("fixedclown-tag-table.es6").getTagList();
      });
    });
  }

};

module.exports = fixedclownClass;