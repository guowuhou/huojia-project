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

/*
 使用方法：
1、查询，传参数prdCode，type（01：理财，02：代销，03：消费金融，04：大额存单），seeFlag(1:查询)
2、编辑，传参数prdCode，type（01：理财，02：代销，03：消费金融，04：大额存单）
3、定义新产品，传type（01：理财，02：代销，03：消费金融）
*/
class newProductCustomClass extends uu.Component{
  properties() {
      return {
          tableNode: {
              defaultValue: null,
              type: uu.Node
          },
          attachNode:{
              defaultValue: null,
              type: uu.Node
          },
          addlevelprofitNode:{
              defaultValue: null,
              type: uu.Node
          }
      }
  }
  onLoad () {
     this.dataBind();       //数据绑定，初始化视图
     this.getPrdType();     //获取产品类型列表
     this.tradeData();      //获取产品类型列表
     this.getTemplateId();  //获取产品模板下拉框
     this._getUserChannel();    //获取货架渠道接入
     this.getPageType();     //分析页面类型：新增、编辑、查看
     window.$=$;
  }
  start () {
    this.bindEvents();
    this.initDateTimePicker();
  }
  dataBind(){
     const vm = this.vm = new uu.ViewModel({
       container:".productCustomLess",
       view:require("./new-public-custom.tpl"),
       model:{
           //attachFlag:false,   
           prdTypeList:[{ddCode:"01",ddName:"本行理财产品"},{ddCode:"02",ddName:"代销理财产品"},{ddCode:"03",ddName:"消费金融"},{ddCode:"04",ddName:"大额存单"}], 
           tradeDateList:[],
           templateIdList:[],
           prdType: utils.url.get()['type'] || '01',
           templateId:'',
           prdCode: {
             type: String,
             value: utils.url.get()['prdCode'] || '',
             notify: '_setPrdCode'
           },
           salesChannelsList:[{accessChannelCode:"01",accessChannelName:"网银"},{accessChannelCode:"02",accessChannelName:"口袋"},{accessChannelCode:"03",accessChannelName:"千人千面"}],
           prdName:"",
           productSeries:"",//后端分类
           productSeriesFontName:"",//前端分类
           productSeriesId:"",//后端分类tagcode
           productSeriesFontId:"",//前端分类tagcode
           productManName:"",
           productSeriesRealName:"",//产品系列名称
           productSeriesReal:"",//产品系列
           prdManagerName:"",
           cusAssetClass:"",
           marketingStatus:"",
           customersLabel:[],
           salesChannels:[],
           onSaleTime:"",
           offSaleTime:"",
           collectBeginTime2:"",
           collectEndTime2:"",
           estabDate2:"",
           endDate2:"",
           prdIntr:"",
           preDrawType:"",
           prdDesc:"",
           updateBy:"",
           channelPrdName:"",//渠道产品名称
           prdFeature:"",//产品特色
           publishTime:"",//发布时间
           breakEven:"0",//保本属性
           netValuePro:"0",//净值属性
           wealthPrd:"1",//是否财富产品
           incomeTargetName:"",//收益指标名称
           paSelective:"",//平安优选
           incomeTargetVal:"",//收益指标值
           tradeCalendar:"1",//交易日历
           isLevelProFit:"",//分档收益
           redeemByDay:"",
           pminInvestAmt2:"",
           accrualByDay:"",
           purchaseRule:"",
           redeemRule:"",
           enchashmentRule:"",
           incomeRule:"",
           proxyFlag:{
             type:Boolean,
             value:utils.url.get()['type']=="02"?true:false
           },
           isDes:{
             type:Boolean,
             value:utils.url.get()['prdClass']?true:false
           },
           isprdClass:{
             type:Boolean,
             value:utils.url.get()['prdClass']=="1"?true:false  
           },
           updateTime:"",
           synchroTime:"",//本行或代销的数据同步时间
           holdingCosts:"",
           inletMode:"",
           isNewProduct:{
             type: Boolean,
             value: false,
             computed: '_isNewProduct'  //控制是否必输
           }, 
           attachFlag: {
             type: Boolean,
             value: false,
             computed: '_setAttachFlag'  //控制附件是否显示
           },
          //  tagFlag:{
          //    type:Boolean,
          //    value:false,
          //    computed:'_setTagFlag'  //控制标签表格是否显示
          //  },
           editFlag:{
             type:Boolean,
             value:utils.url.get()['seeFlag']=="1"?false:true   //判断为编辑页面
           },
           seeFlag:{
             type:Boolean,
             value:utils.url.get()['seeFlag']=="1"?true:false   //判断为查看页面
           },
           consumeFinaFlagTrue:{
             type:Boolean,
             value:utils.url.get()['type']=="03"?true:false   //判断是消费金融产品
           },
           consumeFinaFlagFalse:{
             type:Boolean,
             value:(utils.url.get()['type']=="03"||utils.url.get()['type']=="04")?false:true   //判断不是消费金融产品
           },
           depositFlagTrue:{
             type:Boolean,
             value:utils.url.get()['type']=="04"?true:false   //判断是大额存单
           },
           prodcutTradeRule:{
             type:Boolean,
             value:(utils.url.get()['type']=="01"||utils.url.get()['type']=="02")?true:false //判断是否是本行和代销显示产品分类和交易规则等等
           },
           bankshowInfo:{
              type:Boolean,
              value:utils.url.get()['type']=="01"?true:false //判断是否是本行以显示本行的更新时间
           },
           fundupdataTime:{
              type:Boolean,
              value:utils.url.get()['type']=="02"?true:false //判断是否是基金代销以显示本行的更新时间
           }
       },
       _setAttachFlag: function(){
         var prdType=this.get("prdType");
         return (prdType=="01"||prdType=="02"||prdType=="04");   //prdType=01或02,本行、代销理财、大额存单，显示附件
       },
      //  _setTagFlag:function(){
      //    var prdType=this.get("prdType");
      //    return prdType=="03";    //prdType="03" 消费金融，显示标签
      //  },
       _setPrdCode: function(val){
         val = val.replace(/[^0-9a-zA-Z]/g, '');
         vm.set('prdCode', val);
         return val;
       },
       _isNewProduct:function(){
         return (!utils.url.get()["prdCode"] || utils.url.get()["type"]=="03")?true:false;
       }
     });
     window.vm=this.vm;
   }
   //定义页面，pageType  0：新产品，1：理财，2：基金
  getPageType () {
    this.pageType = 0;this.prdCode = "";  //默认为新产品
    //编辑已有产品--理财    
    let urlParams=utils.url.get();
    this.seeFlag=urlParams["seeFlag"]||"";  //1：查询 
    //本行理财产品type=01
    if (urlParams["prdCode"]&&urlParams["type"]=="01") {
      this.pageType = 1;
      this.queryCustomInfo();    //查询产品信息
    }
    //代销理财产品 type=02 
    else if (urlParams["prdCode"]&&urlParams["type"]=="02") {
      this.pageType = 2;
      this.queryCustomInfo();  //查询产品信息 
    }
    //消费金融 type=03  
    else if (urlParams["prdCode"]&&urlParams["type"]=="03") {
      this.pageType = 3;
      this.queryCustomInfo();  //查询产品信息 
    }
    //大额存单 type=04
    else if (urlParams["prdCode"]&&urlParams["type"]=="04") {
      this.pageType = 4;
      this.queryCustomInfo();  //查询产品信息 
    }
  }
  bindEvents () {
    var self = this;
    //新增产品添加下列事件
    if(this.pageType==0){
       //校验产品id唯一性      
        $(this.node.dom).on('blur', '._check', function (e) {
            self._checkProperty(e);
        });
    }
    $(this.node.dom).on('click', '#submitBtn', function () {
      if(self.vm.get("salesChannels").length>0){
        self.updateCustomizedInfo();
      }else{
        Dialog.alert("请勾选接入渠道")
      }
      
    });
    //新增附件
    $(this.node.dom).on('click', '#uploadAttach', function () {
        self._addAttach();  
    });
    //选择后端分类
    $(this.node.dom).on("click", ".backClassify", function () {
      self._showbackFlag();
    });
    //选择前端分类
    $(this.node.dom).on("click", ".frontClassify", function () {
      self._showfrontFlag();
    });
    //选中产品系列
    $(this.node.dom).on("click", ".productSeriesReal", function () {
      self._showProductSeriesReal();
    });
     //清除产品模板
    $(this.node.dom).on("click", "#cleanTemplate", function () {
      self.vm.set("templateId","");
    });
    //清除前端分类
    $(this.node.dom).on("click", "#cleanfront", function () {
      self.vm.set("productSeriesFontName","");
      self.vm.set("productSeriesFontId","");
    });
    //清除后端分类
    $(this.node.dom).on("click", "#cleanback", function () {
       self.vm.set("productSeries","");
       self.vm.set("productSeriesId","")
    });
     //清除产品系列
    $(this.node.dom).on("click", "#cleanprdseries", function () {
       self.vm.set("productSeriesRealName","");
       self.vm.set("productSeriesReal","")
    });
    $(this.node.dom).on("change","#prdTypeSelect",function(){
      self.clearInfo();
    });
    //添加标签
    $(this.node.dom).on("click","#addTag",function(){
      self._addTag();
    });
    //删除标签
    $(this.node.dom).on("click","#deleteTag",function(){
      self._deleteTag();
    });
     //净值属性勾选不区分收益指标不显示
    $(":radio[name='netWorthRadio']").on("click",function(){
       if($("#netWorthRadio1").is(':checked')==true){
               $("#showFlag").css("display","none")
           }else{
               $("#showFlag").css("display","block")
           }
           self.vm.set("incomeTargetName","");
           self.vm.set("incomeTargetVal","");
     })
     //添加档位
     $(this.node.dom).on("click","#addGear",function(){
         self.addlevelProfit();
    });
     
     //分档收益为是时显示列表
     $(":radio[name='isbracketProfit']").on("click",function(){
       if($("#bracketProfit").is(':checked')==true){
               $("#leavelProfit").css("display","block")
           }else{
               $("#leavelProfit").css("display","none")
           }
        })
    //  $(":radio[name='netWorthRadio']").on("click",function(e){
    //    var curTarget=$(e.currentTarget);
    //    var index = $(":radio[name='netWorthRadio']").index(curTarget);
    //    if(index=='0'){
    //            $("#showFlag").css("display","none")
    //        }else{
    //            $("#showFlag").css("display","block")
    //        }
    //    })
    //勾选无结束时间
    $(this.node.dom).on("click","#noEndDate",function(e){
       var target=$(e.currentTarget);
       if(target.prop("checked")){
           self.vm.set("offSaleTime","");
       }
    });
    //渠道产品名称勾选默认
     $(this.node.dom).on("click","#defaultName",function(e){
       var target=$(e.currentTarget);
       if(target.prop("checked")){
           self.vm.set("channelPrdName",self.vm.get("prdName"));
           $("#channelPrdName").attr("disabled",true);
       }else{
          $("#channelPrdName").attr("disabled",false);
       }
    });
    //切换下架时间变换事件
    $(this.node.dom).on("change","#offSaleTime",function(e){
       $("#noEndDate").prop("checked",false)
    });
  }
  //获取产品类型下拉列表
  getPrdType(type) {
    var self = this;
    utils.xhr.post(httpreq.PS_getDictionaryType, {ddType:51}, (res) => {
        let list = res.data,
          selectHtml = "";
        self.vm.set("prdTypeList",list);
        self.vm.set("prdType",utils.url.get()['type'] || '01');   //初始化设置为传送过来的产品类型
    });
  }
  //获取产品模板下拉框
  getTemplateId(){
    var self = this;
    var paramData;
    if(utils.url.get()['type']=='01'){
      paramData={ddType:73};
    }else if(utils.url.get()['type']=='02'){
      paramData={ddType:74};
    }
    if(utils.url.get()['type']=='01'||utils.url.get()['type']=='02'){
      utils.xhr.post(httpreq.PS_getDictionaryType, paramData, (res) => {
        let listData = res.data;
        self.vm.set("templateIdList",listData);
        self.vm.set("templateId",'')
      });
    }
  }
  //获取交易日历下拉表
  tradeData() {
    var self = this;
    var param;
    if(utils.url.get()['type']=='01'){
       param={ddType:72};
    }else if(utils.url.get()['type']=='02'){
       param={ddType:76};
    }
    if(utils.url.get()['type']=='01'||utils.url.get()['type']=='02'){
        utils.xhr.post(httpreq.PS_getDictionaryType, param, (res) => {
        let dataList = res.data;
        self.vm.set("tradeDateList",dataList);
    });
    }
  }
  //获取货架渠道接入
  _getUserChannel(){
    var self=this;
    utils.xhr.post(httpreq.PS_QryEditAccChannel,{},(res)=>{
      let list = res.data;
      self.vm.set("salesChannelsList",list);
      if(self.vm.get("seeFlag")){
        $(self.node.dom).find("#editDiv [type=checkbox]").prop("disabled", true);
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
    $('.up_datetime2').datetimepicker({
      language: 'zhcn',
      format:"yyyy-mm-dd",
      todayBtn: true,
      autoclose: true,
      todayHighlight: true,
      startDate: curDateTime.toDate(),
      forceParse: false,
      pickerPosition: "bottom-left",
      startView: 2,
      minView: 2, //时间精确到某个单位，2表示天
      maxView: 'decade'
    });
  }
  //查询产品自定义信息	
  queryCustomInfo () {
    var url = "",data = {},self = this;
    if(this.pageType==1){
       url = httpreq.getFinancialCustom;//----理财
    }
    if(this.pageType==2){
       url = httpreq.showFundCustom; //---基金
    }
    if(this.pageType==3){
       url = httpreq.getConsumerFinanceCustom; //---消费金融
    }
    if(this.pageType==4){
       url = httpreq.GetShelfDepositCustom; //---大额存单
    }
    if(this.pageType==4){
       data.productId = utils.url.get()['productId'] ;//大额存单的查询参数是productId
       data.prdClass = utils.url.get()['prdClass'];//大额存单产品种类productClass
    }else{
       data.prdCode = this.vm.get("prdCode");
    };
    utils.xhr.post(url, data, function (response) {
        //self.dataList=response.data;
        var customersLabel,salesChannels,updateTimeMap,synchroTimeMap,publishTimeMap;
        let customInfo=response.data.customInfo;
        customInfo.prdClass = data.prdClass;
        self.pminInvestAmt=customInfo.pminInvestAmt;
        if(self.pageType==4){//大额存单返回的是数组
          salesChannels=customInfo.salesChannels;
          customersLabel=customInfo.customersLabel;
        }else{//本行、代销、消费金融返回的是字符串
          customersLabel=customInfo.customersLabel.split(',');
          salesChannels=customInfo.salesChannels.split(',')
        };
        if(customInfo.netValuePro!="0" && customInfo.netValuePro){
            $("#showFlag").css("display","block");
        };
        if(customInfo.isLevelProFit=="1"){//如果分档收益为是则显示详细信息
           $("#leavelProfit").css("display","block");
        };
        if(self.pageType==1||self.pageType==2){//本行基本信息页面更新时间的转换
           if(customInfo.updateTime){
             updateTimeMap=moment(customInfo.updateTime).format('YYYY-MM-DD HH:mm:ss');
           }else{
             updateTimeMap='';
           };
           if(customInfo.synchroTime){
              synchroTimeMap=moment(customInfo.synchroTime).format('YYYY-MM-DD HH:mm:ss');
           }else{
              synchroTimeMap='';
           };
           if(customInfo.publishTime){
              publishTimeMap=moment(customInfo.publishTime).format('YYYY-MM-DD HH:mm:ss');
           }else{
              publishTimeMap='';
           }
        }else{
           updateTimeMap=customInfo.updateTime;
        };
        customInfo.customersLabel=customersLabel||[];//-----数据格式转换
        customInfo.salesChannels=salesChannels||[]; //-----数据格式转换
        self.vm.set("prdName",customInfo.prdName||"");
        self.vm.set("prdDesc",customInfo.prdDesc||"");
        self.vm.set("productSeries",customInfo.productSeries||"");
        self.vm.set("productSeriesId",customInfo.productSeriesId||"");
        self.vm.set("productSeriesFontId",customInfo.productSeriesFont||"");
        self.vm.set("productSeriesFontName",customInfo.productSeriesFontName||"");
        self.vm.set("productSeriesRealName",customInfo.productSeriesRealName||"");
        self.vm.set("productSeriesReal",customInfo.productSeriesReal||"");
        self.vm.set("templateId",customInfo.templateId||"");
        self.vm.set("prdManagerName",customInfo.prdManagerName||"");
        self.vm.set("productManName",customInfo.productManName||"");
        self.vm.set("updateBy",customInfo.updateBy||"system");
        self.vm.set("updateTime",updateTimeMap||"");
        self.vm.set("cusAssetClass",customInfo.cusAssetClass||"");
        self.vm.set("marketingStatus",customInfo.marketingStatus||"");
        self.vm.set("customersLabel",customInfo.customersLabel);
        self.vm.set("salesChannels",customInfo.salesChannels);
        self.vm.set("onSaleTime",customInfo.onSaleTime||"");
        self.vm.set("offSaleTime",customInfo.offSaleTime||"");
        self.vm.set("collectBeginTime2",customInfo.collectBeginTime2||"");
        self.vm.set("collectEndTime2",customInfo.collectEndTime2||"");
        self.vm.set("estabDate2",customInfo.estabDate2||"");
        self.vm.set("endDate2",customInfo.endDate2||"");
        self.vm.set("channelPrdName",customInfo.channelPrdName||"");
        self.vm.set("prdFeature",customInfo.prdFeature||"");
        self.vm.set("breakEven",customInfo.breakEven||"");
        self.vm.set("publishTime",publishTimeMap||"");
        self.vm.set("synchroTime",synchroTimeMap||"");
        self.vm.set("netValuePro",customInfo.netValuePro||"");
        self.vm.set("wealthPrd",customInfo.wealthPrd||"");
        self.vm.set("paSelective",customInfo.paSelective||"");
        self.vm.set("isLevelProFit",customInfo.isLevelProFit||"");
        self.vm.set("incomeTargetName",customInfo.incomeTargetName||"");
        self.vm.set("incomeTargetVal",customInfo.incomeTargetVal||"");
        self.vm.set("tradeCalendar",customInfo.tradeCalendar||"");
        self.vm.set("redeemByDay",customInfo.redeemByDay||"");
        self.vm.set("pminInvestAmt2",customInfo.pminInvestAmt2||"");
        self.vm.set("accrualByDay",customInfo.accrualByDay||"");
        self.vm.set("purchaseRule",customInfo.purchaseRule||"");
        self.vm.set("redeemRule",customInfo.redeemRule||"");
        self.vm.set("enchashmentRule",customInfo.enchashmentRule||"");
        self.vm.set("incomeRule",customInfo.incomeRule||"");
        self.vm.set("holdingCosts",customInfo.holdingCosts||"");
        self.vm.set("prdIntr",customInfo.prdIntr||"");
        self.vm.set("preDrawType",customInfo.preDrawType||"");
        self.vm.set("inletMode",customInfo.inletMode||"");
        self.showPageInfo(response.data);
        if(self.pageType==4||self.pageType==2||self.pageType==1){
             self.tableNode.getComponent("product-tag-table.es6").getPageList(response.data);//查询详情页时本行、理财、大额存单添加标签页的数据
             self.addlevelprofitNode.getComponent("product-levelProfit-table.es6").getLevelProList(response.data);
        }
    });
    
  }
  // nextPageData() {
  //   return this.dataList || [];
  // }
  //显示上部分模板或产品自定义信息
  showPageInfo (data) {
    if (_.isEmpty(data)) {
      return;
    }
    var customInfo = data.customInfo || {};
    this.customInfo=customInfo;
    //产品为初始、下架状态不可编辑
    if(customInfo.saleStatus=="INIT"||customInfo.saleStatus=="OFF_SALE"||this.seeFlag=="1"){
       this._initEditBtn(data.customInfo);
       this.vm.set("seeFlag",true);
       this.vm.set("editFlag",false);
    }
    //如果渠道产品名称与产品名称一致则默认按钮显示选中
    if(customInfo.channelPrdName==customInfo.prdName){
       $("#defaultName").prop("checked",true);
    }
    if(!customInfo.offSaleTime){
       $("#noEndDate").prop("checked",true);
       $("#noEndDate1").prop("checked",true);
    }
    if(!customInfo.offSaleTime){
       $("#noEndDate").prop("checked",true);
       $("#noEndDate1").prop("checked",true);
    }
    //若有待审核的记录，则页面也不能编辑
    this._queryVerifyStatus(data);
    const saleStatusMap = {
      "INIT": "初始",
      "NEW_SALE": "新产品上架",
      "WAIT_SALE": "待上架",
      "ON_SALE": "上架中",
      "OFF_SALE": "已下架",
      "FAIL_SALE": "上架失败"
    };
    const salePrdMap = {
      "0": "大额存单",
      "1": "定活宝-大额存单"
    };
    $(this.node.dom).find("#saleStatus").show();
    $(this.node.dom).find("#saleStatusText").text(saleStatusMap[customInfo.saleStatus]);
    $(this.node.dom).find("#prdTySelect").val(salePrdMap[data.customInfo.prdClass]);
    //编辑页面，产品类型、id、名称三者不可修改
    $(this.node.dom).find(".3noEdit").prop("disabled",true);
  }
  //控制页面不可编辑（查看）
  _initEditBtn(customInfo) {
      $(this.node.dom).find("#editDiv [type=radio]").prop("disabled", true);
      $(this.node.dom).find("#editDiv [type=checkbox]").prop("disabled", true);
      $(this.node.dom).find("#editDiv [type=text]").prop("disabled", true);
      $(this.node.dom).find("#tradRule [type=text]").prop("readonly", true);
      $(this.node.dom).find("#tradeCalendar").prop("disabled", true);
      $(this.node.dom).find("#tradRule textarea").prop("readonly", true);
      $(this.node.dom).find("#basicInfo select").prop("disabled", true);
      $(this.node.dom).find("#prdTySelect select").prop("disabled", true);
      $(this.node.dom).find("#productTemplet").prop("disabled", true);
      $(this.node.dom).find("#tradeDate").prop("disabled", true);
      $(this.node.dom).find(".nowrite").attr("readonly", true);
      $(this.node.dom).find(".flTime").prop("disabled", true);
      $(this.node.dom).find(".flTime").siblings('span').hide();
      // $("#editDateDiv").hide();
      // $("#readDateDiv").show();
     // $(".noedit").hide();
      if(!customInfo.offSaleTime){
          $("#noEndDate1").prop("checked",true);
      }
  }
  _queryVerifyStatus(resData){
    var businessType="",prdType="",prdCode,self=this;  
    if(this.pageType==1){
        businessType="001";prdType="01";prdCode=this.vm.get("prdCode");
    }else if(this.pageType==2){
        businessType="002";prdType="02";prdCode=this.vm.get("prdCode");
    }else if(this.pageType==4){
        businessType="007";prdType="04";prdCode=utils.url.get()['productId'];
    };
    var data={
        businessType:businessType,
        verifyType:"0002",
        prdCode:prdCode,
        prdType:prdType
    };
    utils.xhr.post(httpreq.queryVerifyStatus,data,(res)=>{
        if(res.data.result){
            self._initEditBtn(resData.customInfo);
            self.vm.set("seeFlag",true);
            self.vm.set("editFlag",false);
            self.tableNode.getComponent("product-tag-table.es6").getPageList(resData)//查询详情页时本行、理财、大额存单添加标签页的数据
            self.attachNode.getComponent("public-attach-table.es6").getAttachList();
            self.addlevelprofitNode.getComponent("product-levelProfit-table.es6").getLevelProList();
        }
    });
  }
  //检验产品id、产品代码的唯一性
   _checkProperty(e){
    let target=$(e.currentTarget),url="";
    if(!target.val()){
        return;
    };
    let data={
        property:target.attr("id"),
        value:target.val()
    };
    //定义新产品
    if(this.pageType==0){
        if(this.vm.get("prdType")=="01"){
          url=httpreq.checkFinaProperty;  //--理财
        }else{
          url = httpreq.checkFundProperty; //---基金
        }
    }
    utils.xhr.post(url,data,(res)=>{
        target.data("checkResult",res.data.result);
        if(res.data.result){
            target.siblings(".glyphicon-ok").show();
            target.siblings(".glyphicon-remove").hide();
        }else{
            Dialog.alert("唯一性验证不通过，请重新输入");
            target.siblings(".glyphicon-remove").show();
            target.siblings(".glyphicon-ok").hide();
        }
    });
  }
  updateCustomizedInfo () {
    var self=this;
    var prdCode = $("#prdCode").val(),prdCodeCheck=$("#prdCode").data("checkResult");
    var prdName = $("#prdName").val(),prdNameCheck=$("#prdName").data("checkResult");
    var prdSeriesFontName= $("#frontClassify").val()
    var data=this.getInputData();
    var isNewProduct=this.vm.get("isNewProduct");
    var prdType=this.vm.get("prdType");
    //校验时间
    var statusFlag = self.checkTime('onSaleTime','offSaleTime');
    if(!statusFlag){
      Dialog.alert("下架时间必须大于上架时间");
      return;
    };
    if($("#pminInvestAmt2").val()!=''){
        var pminInvestAmt;
        if(this.pminInvestAmt==''){
             pminInvestAmt==0;
        }else{
             pminInvestAmt=this.pminInvestAmt;
        };
        if($("#pminInvestAmt2").val()<pminInvestAmt){
           Dialog.alert("自定义渠道个人最低定投金额必须大于等于"+`${pminInvestAmt}`+"元");
           return;
      };
    };
    var proxyFlag = this.vm.get('proxyFlag');
    if(proxyFlag){
      var mjFlag = self.checkTime('collectBeginTime2','collectEndTime2');
      var prdFlag = self.checkTime('estabDate2','endDate2');
      if(!mjFlag){
        Dialog.alert("募集结束时间必须大于募集开始时间");
        return;
      };
      if(!prdFlag){
        Dialog.alert("产品到期日必须大于产品起息日");
        return;
      };
    }
    //新产品定义
    if(isNewProduct){
        //本行、代销理财检验必填项
       if ((prdType=="01"||prdType=="02") && !(data.prdCode && data.prdName && data.cusAssetClass && data.marketingStatus && data.salesChannels && data.productSeriesFont && data.tradeCalendar)) {
          Dialog.alert("请输入必填信息");
          return;
       }
      //  if ((prdType=="01"||prdType=="02") && (prdSeriesFontName=='')) {
      //     Dialog.alert("请输入必填信息");
      //     return;
      //  }
    }
    //编辑已有产品
    else{
        if ((prdType=="01"||prdType=="02") && !(data.prdCode && data.prdName && data.salesChannels && data.productSeriesFont && data.tradeCalendar)) {
          Dialog.alert("请输入必填信息");
          return;
        }
      //   if ((prdType=="01"||prdType=="02") && (prdSeriesFontName=='')) {
      //     Dialog.alert("请输入必填信息");
      //     return;
      //  }
    }
    //消费金融检验必填项
    if ((prdType=="03") && !(data.prdCode && data.prdName  && data.customersLabel && data.salesChannels && data.prdIntr && data.inletMode && data.holdingCosts)) {
      Dialog.alert("请输入必填信息");
      return;
    }
    // //消费金融检验必填项
    // if ((this.pageType==3) && !(data.prdCode && data.prdName  && data.customersLabel && data.salesChannels && data.inletMode && data.prdIntr && data.holdingCosts)) {
    //   Dialog.alert("请输入必填信息");
    //   return;
    // }
    if(this.pageType==0&&!(prdCodeCheck&&prdNameCheck)){
        Dialog.alert("唯一性校验不通过，请重新输入");
        return;
    }
    //产品类型prdType和业务类型businessType对应关系
    const businessTypeMap = {
        '01': '001', //产品工厂-本行理财产品
        '02': '002', //产品工厂-代销理财产品
        '03': '006', //产品工厂-消费金融产品
        '04': '007' //产品工厂-大额存单产品
    };
    var prdType=this.vm.get("prdType");
    var businessType=businessTypeMap[prdType],verifyType="";  
    if(this.pageType==0){
        verifyType="0001";  //新增
    }else {
        verifyType="0002";  //编辑
    }
    EditRemark.show({verifyType:verifyType,businessType:businessType}, _.bind(self.submitINfo, self));
  }
  getInputData(){
    var offSaleTime = $("#noEndDate").prop("checked") ? "" : $("#offSaleTime").val();
    var data;
    if(utils.url.get()['type']=='04'){//大额存单编辑保存上传参数
      data={
        prdCode: this.vm.get("prdCode"),
        prdName: this.vm.get("prdName"),
        productId:utils.url.get()['productId'],
        productClass:utils.url.get()['prdClass'],
        prdDesc:this.vm.get("prdDesc"),
        customersLabelString:this.vm.get("customersLabel").join(),
        salesChannelsString:this.vm.get("salesChannels").join(),
        onSaleTime:$("#onSaleTime").val(),
        offSaleTime: offSaleTime,
        prdIntr:this.vm.get("prdIntr"),
        preDrawType:this.vm.get("preDrawType"),
        productManName: this.vm.get("productManName"),
        updateBy: this.vm.get("updateBy"),
        updateTime: this.vm.get("updateTime"),
      }
    }else{
      data = {
      prdCode: this.vm.get("prdCode"),
      prdName: this.vm.get("prdName"),
      prdDesc: this.vm.get("prdDesc"),
      productSeriesId:this.vm.get("productSeriesId"),
      productSeriesFont:this.vm.get("productSeriesFontId"),
      productSeriesReal:this.vm.get("productSeriesReal"),
      cusAssetClass: this.vm.get("cusAssetClass"),
      templateId:this.vm.get("templateId"),
      prdFeature:this.vm.get("prdFeature"),
      publishTime:this.vm.get("publishTime"),
      // synchroTime:this.vm.get("synchroTime"),
      breakEven:this.vm.get("breakEven"),
      netValuePro:this.vm.get("netValuePro"),
      wealthPrd:this.vm.get("wealthPrd"),
      paSelective:this.vm.get("paSelective"),
      isLevelProFit:this.vm.get("isLevelProFit"),
      incomeTargetName:$("#incomeTargetName").val(),
      incomeTargetVal:$("#incomeTargetVal").val(),
      tradeCalendar:self.vm.get("tradeCalendar"),
      prdManagerName: this.vm.get("prdManagerName"),
      redeemByDay:self.vm.get("redeemByDay"),
      pminInvestAmt2: $("#pminInvestAmt2").val(),
      accrualByDay:self.vm.get("accrualByDay"),
      purchaseRule:self.vm.get("purchaseRule"),
      redeemRule:self.vm.get("redeemRule"),
      enchashmentRule:self.vm.get("enchashmentRule"),
      incomeRule: self.vm.get("incomeRule"),
      channelPrdName:this.vm.get("channelPrdName"),
      marketingStatus: this.vm.get("marketingStatus"),
      customersLabel: this.vm.get("customersLabel").join(),
      salesChannels: this.vm.get("salesChannels").join(),
      onSaleTime: $("#onSaleTime").val(),
      offSaleTime: offSaleTime,
      collectBeginTime2:$("#collectBeginTime").val(),
      collectEndTime2:$("#collectEndTime").val(),
      estabDate2:$("#estabDate").val(),
      endDate2:$("#endDate").val(),
      prdIntr:this.vm.get("prdIntr"),
      holdingCosts:this.vm.get("holdingCosts"),
      inletMode:this.vm.get("inletMode")
     };
    }
    return data;
  }
  submitINfo (vertifyData) {
    var url = "",self = this;
    var data=this.getInputData();
    data.prdType=this.vm.get("prdType");
   
    //新增产品
    if(this.pageType==0){
      if(data.prdType=="01"){
          url=httpreq.addFinancial;   //新增理财产品
      }
      if(data.prdType=="02"){
          url=httpreq.addFundProduct;  //新增基金产品
      }
    }else if(this.pageType==1){
          url = httpreq.setFinancialCustom;     //编辑理财产品
    }else if(this.pageType==2){
          url=httpreq.setFundProduct;    //编辑基金产品
    }
    else if(this.pageType==3){
          url=httpreq.setConsumerFinanceCustom;    //编辑消费金融产品
    }else if(this.pageType==4){
          url=httpreq.UpdateDepositCustomData;    //编辑大额存单
    }
    //var realData=_.extend({},data,vertifyData);
    var realData;
    var paramData=self.tableNode.getComponent("product-tag-table.es6").lastlist();
    var levelProfitData=self.addlevelprofitNode.getComponent("product-levelProfit-table.es6").upLoadDatalist();
    if(data.prdType=="03"){
      realData=_.extend({},data,vertifyData);
    };
    if(data.prdType=="02"){
      realData=_.extend({},data,vertifyData,{prdTag:paramData});
    };
    if(data.prdType=="01"){
      realData=_.extend({},data,vertifyData,{prdTag:paramData},{ levelProFitList: levelProfitData});
    };
    if(data.prdType=="04"){
      realData=_.extend({},data,vertifyData,{productSeriesIdString:paramData});
    };
    utils.xhr.post(url, realData, function (response) {
        Dialog.alert("保存成功",function(){
          window.location.reload();
        });      
    });
  }
  _showbackFlag() {
    var self = this;
    var prdType=this.vm.get("prdType")=="01"?"pro0002":"pro0003";  //理财:pro0002，基金：pro0003----------------------------todo
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
      self.vm.set("productSeries",tagNameString.substring(0, tagNameString.length - 1));
      self.vm.set("productSeriesId",tagData.substring(0, tagData.length - 1));
    });
  }
  _showfrontFlag() {
    var self = this;
    var prdType=this.vm.get("prdType")=="01"?"pro0002":"pro0003";  //理财:pro0002，基金：pro0003----------------------------todo
    TagSelector.show({
      type: "group",
      productClassificationCode: prdType,
      typechange: false,
      singleSelect: true
    }, (list) => {
      var tagFrontNameString = "",
        tagData = "";
      _.each(list, (i) => {
        tagFrontNameString += (i.name + ',');
        tagData += (i.tagCode + '|');
      });
     self.vm.set("productSeriesFontName",tagFrontNameString.substring(0, tagFrontNameString.length - 1));
     self.vm.set("productSeriesFontId",tagData.substring(0, tagData.length - 1));
    });
  }
  _showProductSeriesReal(){
     var self = this;
     var prdType=this.vm.get("prdType")=="01"?"pro0002":"pro0003";  //理财:pro0002，基金：pro0003----------------------------todo
     TagSelector.show({
      type: "group",
      productClassificationCode: prdType,
      typechange: false,
      singleSelect: true
     }, (list) => {
      var productSeriesRealNameList = "",
          productSeriesRealList = "";
      _.each(list, (i) => {
        productSeriesRealNameList += (i.name + ',');
        productSeriesRealList += (i.tagCode + '|');
      });
     self.vm.set("productSeriesRealName",productSeriesRealNameList.substring(0, productSeriesRealNameList.length - 1));
     self.vm.set("productSeriesReal",productSeriesRealList.substring(0, productSeriesRealList.length - 1));
    });
  }
  clearInfo(){
    $(this.node.dom).find("#prdCode").val("").removeData();
    $(this.node.dom).find("#prdCode").siblings(".gc").hide();
    $(this.node.dom).find("#prdName").val("").removeData();
    $(this.node.dom).find("#prdName").siblings(".gc").hide();
  }
  addlevelProfit(){
      this.addlevelprofitNode.getComponent("product-levelProfit-table.es6").editLevelProfit({
         operateType:0,
         prdType:'01',
         prdCode:utils.url.get()["prdCode"]
      });
  }
  _addAttach(){
      var prdCode = $("#prdCode").val(),prdCodeCheck=$("#prdCode").data("checkResult");
      var prdName = $("#prdName").val(),prdNameCheck=$("#prdName").data("checkResult");
      var data=this.getInputData();
      if (!(data.prdCode && data.prdName)) {
        Dialog.alert("请输入产品名称和产品代码");
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
      }else if(this.pageType==4){
         prdType="04";  //代销产品
      }
      this.attachNode.getComponent("public-attach-table.es6")._editAttach({
         operateType:0,
         prdType:prdType,
         prdCode:prdCode
      });
  }
  _getSeeFlag(){
      return {
         seeFlag:this.vm.get("seeFlag"),
         prdCode:this.vm.get("prdCode"),
      }
  }
   //添加标签
  _addTag(targetList) {
        var self = this,prdCode = this.vm.get("prdCode"),prdType = this.vm.get("prdType");
        TagSelector.show({
            type: "tag",
            singleSelect: (prdType=='01'|| prdType=='02'||prdType=='04')?false:true,//本行、理财支持标签多选
            isProduct: 0
        }, (list) => {
            var data;
            if (list.length === 0) {
                Dialog.alert('您没有勾选标签!');
                return;
            };
            if(prdType=='03'){//消费金融添加标签只做单选
               var tagData = list[0];
               data = {
               prdCode:prdCode,
               tagCode:tagData.tagCode
              };
              utils.xhr.post(httpreq.setConsumerFinanceTag, data, (res) => {
                 Dialog.alert("标签添加成功");
                 self.tableNode.getComponent("product-tag-table.es6").getTagList();
              });
            };
            if(prdType=='01'||prdType=='02'||prdType=='04'){//本行和代销支持多选
              self.tableNode.getComponent("product-tag-table.es6").onAddTag(list);
            };
        });
    }
  //删除标签
  _deleteTag(){
        var self=this,prdType = this.vm.get("prdType");
        var selectList=self.tableNode.getComponent("product-tag-table.es6").getselectTag();
        if(selectList.length <= 0) {
            Dialog.alert("请勾选要操作的标签");
            return;
        }
        if(prdType=='01'||prdType=='02'||prdType=='04'){
           self.tableNode.getComponent("product-tag-table.es6").onDelTag(selectList);
        };
        if(prdType=='03'){
           var tagCodeList=_.map(selectList,(item)=>{
            return item.tagCode;
        });
        var data={
           prdCode:this.vm.get("prdCode"),
           tagCode:tagCodeList.join()
        };
        utils.xhr.post(httpreq.delConsumerFinanceTag, data, (res) => {
            Dialog.alert("标签删除成功",()=>{
                self.tableNode.getComponent("product-tag-table.es6").getTagList();
            });
        });
      } 
  }
  
  //校验开始结束日期规则
  checkTime(start,end) {
    var start = $("#"+start).val();
    start = new Date(start).getTime();
    var end = $("#"+end).val();
    end = new Date(end).getTime();
    var checkFlag = start - end >= 0 ?false:true;
    return checkFlag ;
  }
};
  

module.exports=newProductCustomClass;