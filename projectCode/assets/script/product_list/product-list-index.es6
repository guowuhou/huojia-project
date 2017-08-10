const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const ejs = require('lib/ejs.js');
const httpreq = require('httpreq.es6');

class productIndexList extends uu.Component {
  onLoad() {
    window.$ = $;
  }
  start() {
    this.showProListTable();
    this.bindEvents();
  }
 
  bindEvents() {
    $("#proTypeList").on("change", (e) => {
      this.showProListTable(e);
    });
  }
  showProListTable(e) {
    var targetVal = e ? $(e.currentTarget).val() : "bank";
    let prdListHtml = '';
    if (targetVal == "proxy") {
      $("#list_proxy").show();
      $("#list_bank").hide();
      return;
    }
    if (targetVal == "bank") {
      $("#list_proxy").hide();
      $("#list_bank").show();
      return;
    }

  }
};


module.exports = productIndexList;