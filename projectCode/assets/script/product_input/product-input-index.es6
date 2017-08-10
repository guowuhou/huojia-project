const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const ejs = require('lib/ejs.js');
const httpreq = require('httpreq.es6');
const utils=require("utils")
class productIndexClass extends uu.Component {
  onLoad() {
    window.$ = $;
  }
  start() {
    this.initSelector();
    this.showProductTable();
  }
  initSelector() { 
    let typeParam = {
      ddType: "51"
  //    parentCode: "C0006"
    };
    let channelParam = {
      ddType: "36"
    };
    this.getPrdType(typeParam, "productType");
    this.getPrdType(channelParam, "channelId");
  }
  getPrdType(options, id) {
    var self = this,realUrl;
    if(options.ddType =='36'){
        realUrl=httpreq.PS_QryAccChannelAuth;
    }else{
        realUrl=httpreq.PS_getDictionaryType;
    };
    utils.xhr.post(realUrl, options, (res) => {
        let list = res.data,
          selectHtml = "";
        if (options.ddType == "51") {
           _.each(list, (item) => {
              selectHtml += `<option value=${item.ddCode}>${item.ddName}</option>`;
          });
          $("#" + id).html(selectHtml);
          self.bindEvents();
        }else{
           _.each(list, (item) => {
              selectHtml += `<option value=${item.accessChannelCode}>${item.accessChannelName}</option>`;
          });
          $("#" + id).html(selectHtml);
        }
         
    });
  } 
  bindEvents() {
    $("#productType").on("change", (e) => {
      this.showProductTable(e);
    });
  }
  showProductTable(e) {
    var targetVal = e ? $(e.currentTarget).val() : "01";
    let prdTableHtml = '';
    if (targetVal == "01") {
      $("#input_bank").show();
      $("#input_proxy").hide();
      $("#input_deposit").hide();
      $("#gold_fixed_investment").hide();
      $("#gold_quotient_investment").hide();
      $("#bank_deposit").hide();
      return;
    }
    if (targetVal == "02") {
      $("#input_bank").hide();
      $("#input_proxy").show();
      $("#input_deposit").hide();
      $("#gold_fixed_investment").hide();
      $("#gold_quotient_investment").hide();
      $("#bank_deposit").hide();
      return;
    }
    if (targetVal == "04") {
      $("#input_bank").hide();
      $("#input_proxy").hide();
      $("#input_deposit").show();
      $("#gold_fixed_investment").hide();
      $("#gold_quotient_investment").hide();
      $("#bank_deposit").hide();
      return;
    }
    if (targetVal == "06") {
      $("#input_bank").hide();
      $("#input_proxy").hide();
      $("#input_deposit").hide();
      $("#gold_fixed_investment").show();
      $("#gold_quotient_investment").hide();
      $("#bank_deposit").hide();
      //location.href="gold-fixed-investment.html?seeFlag=1";
      return;
    }
     if (targetVal == "07") {
      $("#input_bank").hide();
      $("#input_proxy").hide();
      $("#input_deposit").hide();
      $("#gold_fixed_investment").hide();
      $("#gold_quotient_investment").show();
      $("#bank_deposit").hide();
      return;
    } 
    if (targetVal == "09") {
      $("#input_bank").hide();
      $("#input_proxy").hide();
      $("#input_deposit").hide();
      $("#gold_fixed_investment").hide();
      $("#gold_quotient_investment").hide();
      $("#bank_deposit").show();
      return;
    }       
  }
};
module.exports = productIndexClass;