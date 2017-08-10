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



class goldfixedinvestment extends uu.Component{
  properties() {
      return {
          tableNode: {
              defaultValue: null,
              type: uu.Node
          },
          attachNode:{
              defaultValue: null,
              type: uu.Node
          }
      }
  }
  onLoad () {
     this.dataEvents();//数据绑定，初始化视图
     this.showPage();   //初始页面不可编辑    
     this.getUserChannel();    //获取货架渠道接入
     this.getCurrencyType();  //获取币种
     this.queryCustomInfo();     //渲染页面
     window.$=$;
  }
  start () {
    this.bindEvents();
    this.initDateTimePicker();
  }
  showPage(){
     $(this.node.dom).find("input[type=text]").prop("readonly",true);
     $(this.node.dom).find("input[type=checkbox]").prop("disabled",true);
     $(this.node.dom).find("textarea").prop("disabled",true);
     $(this.node.dom).find("select").prop("disabled",true);
  }
   dataEvents(){
     const vm = this.vm = new uu.ViewModel({
       container:".goldquoitentInvestment",
       view:require("./intelligent-gold-quotient.tpl"),
       model:{
           //attachFlag:false,   
           prdType: "",
           prdCode: {
             type: String,
             value: utils.url.get()['prdCode'] || '',
             notify: '_setPrdCode'
           },
           prdName:"",
           prdDesc:"",
           productManName:"",
           prdSaleStatusList:[{
           ddCode: "ON_SALE",
           ddName: "上架中"
           }, {
           ddCode: "OFF_SALE",
           ddName: "下架"
           }],
           saleStatus:"ON_SALE",
           updateBy:"",
           updateTime:"",
           productRate:"",
           currencyList:[],
           currency:"000",
           quoteUnit:"",
           tradingUnit:"",
           investmentStyle:"",
           agreedPeriod:"",
           tradingDay:"",
           tradingHour:"",
           transactChannel:"",
           appliedCustomer:"",
           customersLabel:[],
           majorFeatures:"",
           riskWarning:"",
           attention:"",
           handlingProcedures:"",
           tradeVolumeMin:"",
           chargeStyle:"",
           salesChannelsList:[],
           salesChannels:[],
           onSaleTime:"",
           offSaleTime:"",
           tradeVolumeMin1:"",
           tradingUnit1:"",
           chargeStyle1:"",
           handlingFeeStandard1:"",
           tradeVolumeMin2:"",
           tradingUnit2:"",
           chargeStyle2:"",
           handlingFeeStandard2:"",
           tradeVolumeMin3:"",
           tradingUnit3:"",
           chargeStyle3:"",
           handlingFeeStandard3:"",
         
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
     });
     window.vm=this.vm;
   }
   
   bindEvents () {
    var self = this;
    //添加标签
    $(this.node.dom).on("click","#addTag",function(){
      self._addTag();
    });
    //删除标签
    $(this.node.dom).on("click","#deleteTag",function(){
      self._deleteTag();
    });
    //切换下架时间变换事件
    $(this.node.dom).on("change","#offSaleTime",function(e){
       $("#noEndDate").prop("checked",false)
    });
    //配置智能货架
    $(this.node.dom).on("click","#intelligents",function(){
      self._intelligent();
    });
  }
  //获取货架渠道接入
  getUserChannel(){
    var self=this;
    utils.xhr.post(httpreq.PS_getUserChannel,{ddType:36},(res)=>{
      let list = res.data;
      self.vm.set("salesChannelsList",list);
      $(self.node.dom).find("#channels [type=checkbox]").prop("disabled", true);
    });
  }
  getCurrencyType(){
    var self=this;
    utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:1},(res)=>{
      let list = res.data;
      self.vm.set("currencyList",list);
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
  _intelligent(){
      dialogLib1.show({
          channelName:$("#channelId").find('option:selected').text(),
          channelId:$("#channelId").val(),
          prdCodes:"GOLD_SHARE",
          prdType: "07"   //本行理财
      }); 
  }
  //查询产品自定义信息	
  queryCustomInfo () {
    var url = httpreq.GetGoldPrdDetail,data = {prdCode:'GOLD_SHARE',prdType:'07'},self = this;
    utils.xhr.post(url, data, function (response) {
        var customersLabel,salesChannels;
        let customInfo=response.data;//本行、代销、消费金融返回的是字符串
        customersLabel=customInfo.customersLabel;
        salesChannels=customInfo.salesChannels;
        customInfo.customersLabel=customersLabel||[];//-----数据格式转换
        customInfo.salesChannels=salesChannels||[]; //-----数据格式转换
          
        customInfo.customersLabel=customersLabel||[];//-----数据格式转换
        customInfo.salesChannels=salesChannels||[]; //-----数据格式转换
        self.vm.set("prdType","黄金份额产品");
        self.vm.set("prdCode",customInfo.prdCode||"");
        self.vm.set("prdName",customInfo.prdName||"");
        self.vm.set("prdDesc",customInfo.prdDesc||"");
        self.vm.set("productManName",customInfo.productManName||"");
        self.vm.set("updateBy",customInfo.updateBy||"");
        self.vm.set("updateTime",customInfo.updateTime||"");
        self.vm.set("currency",customInfo.currency|| "");
        self.vm.set("saleStatus", customInfo.saleStatus || "");
        self.vm.set("quoteUnit",customInfo.quoteUnit||"");
        self.vm.set("productRate",customInfo.productRate||"");
        self.vm.set("tradingUnit",customInfo.tradingUnit||"");
        self.vm.set("investmentStyle",customInfo.investmentStyle||"");
        self.vm.set("agreedPeriod",customInfo.agreedPeriod||"");
        self.vm.set("tradingDay",customInfo.tradingDay||"");
        self.vm.set("tradingHour",customInfo.tradingHour);
        self.vm.set("transactChannel",customInfo.transactChannel);
        self.vm.set("appliedCustomer",customInfo.appliedCustomer||"");
        self.vm.set("customersLabel",customInfo.customersLabel||"");
        self.vm.set("majorFeatures",customInfo.majorFeatures||"");
        self.vm.set("riskWarning",customInfo.riskWarning||"");
        self.vm.set("attention",customInfo.attention||"");
        self.vm.set("handlingProcedures",customInfo.handlingProcedures||"");
        self.vm.set("tradeVolumeMin1",customInfo.tradingTypeDetail[0].tradeVolumeMin||"");
        self.vm.set("tradeVolumeMin2",customInfo.tradingTypeDetail[1].tradeVolumeMin||"");
        self.vm.set("tradeVolumeMin3",customInfo.tradingTypeDetail[2].tradeVolumeMin||"");
        self.vm.set("tradingUnit1",customInfo.tradingTypeDetail[0].tradingUnit||"");
        self.vm.set("tradingUnit2",customInfo.tradingTypeDetail[1].tradingUnit||"");
        self.vm.set("tradingUnit3",customInfo.tradingTypeDetail[2].tradingUnit||"");
        self.vm.set("chargeStyle1",customInfo.tradingTypeDetail[0].chargeStyle||"");
        self.vm.set("chargeStyle2",customInfo.tradingTypeDetail[1].chargeStyle||"");
        self.vm.set("chargeStyle3",customInfo.tradingTypeDetail[2].chargeStyle||"");
        self.vm.set("handlingFeeStandard1",customInfo.tradingTypeDetail[0].handlingFeeStandard||"");
        self.vm.set("handlingFeeStandard2",customInfo.tradingTypeDetail[1].handlingFeeStandard||"");
        self.vm.set("handlingFeeStandard3",customInfo.tradingTypeDetail[2].handlingFeeStandard||""); 
        self.vm.set("salesChannels",customInfo.salesChannels||"");
        self.vm.set("onSaleTime",customInfo.onSaleTime||"");
        self.showPageInfo(response.data);
        //self.tableNode.getComponent("product-tag-table.es6").getPageList(response.data)//查询详情页时本行、理财、大额存单添加标签页的数据
    });
    
  }
  //显示上部分模板或产品自定义信息
  showPageInfo (data) {
    // if (_.isEmpty(data)) {
    //   return;
    // }
    var self=this;
    var customInfo = data;
    //产品为初始、下架状态不可编辑
    if(!customInfo.offSaleTime){
       $("#noEndDate").prop("checked",true);
       $("#noEndDate1").prop("checked",true);
    }else{
      self.vm.set("offSaleTime", customInfo.offSaleTime || "");
    };
    const saleStatusMap = {
      "INIT": "初始",
      "NEW_SALE": "新产品上架",
      "WAIT_SALE": "待上架",
      "ON_SALE": "上架中",
      "OFF_SALE": "下架",
      "FAIL_SALE": "上架失败"
    };
    $(this.node.dom).find("#saleStatusText").text(saleStatusMap[customInfo.saleStatus]);
  }
   //添加标签
  _addTag(targetList) {
        var self = this,prdCode = this.vm.get("prdCode"),prdType = "07";
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
             var tagCodeList='';
            for(var i=0;i<list.length;i++){
              tagCodeList+=list[i].tagCode+(i+1<list.length?",":'');
            } 
               data = {
                  prdCode:"GOLD_SHARE",
                  tagCode:tagCodeList
              };
              utils.xhr.post(httpreq.SetGoldProductTag, data, (res) => {
                 Dialog.alert("标签添加成功");
                 self.tableNode.getComponent("quotient-tag-table.es6").getTagList();
              });
        });
    }
    //删除标签
    _deleteTag(){
        var self=this,prdType = "07";
        var selectList=self.tableNode.getComponent("quotient-tag-table.es6").getselectTag();
        if(selectList.length <= 0) {
            Dialog.alert("请勾选要操作的标签");
            return;
        }
        var tagCodeList=_.map(selectList,(item)=>{
            return item.tagCode;
        });
        var data={
           prdCode:"GOLD_SHARE",
           tagCode:tagCodeList.join()
        };
        utils.xhr.post(httpreq.DelGoldProductTag, data, (res) => {
            Dialog.alert("标签删除成功",()=>{
                self.tableNode.getComponent("quotient-tag-table.es6").getTagList();
            });
        });
    }
  
};

module.exports=goldfixedinvestment;