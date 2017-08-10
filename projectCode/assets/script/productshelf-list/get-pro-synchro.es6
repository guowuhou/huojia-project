const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const moment = require('lib/moment.js');
require('lib/bootstrap-table.js');
const synchroHTML = require('tpl/product-synchro.tpl');
const prosynchro = require('plugins/product-synchro.es6');

class ProsynchFunction extends uu.Component {
    properties() {
        return {
            synchProxyList: {
                defaultValue: null,
                type: uu.Node
            },
        };
    }
  onLoad() {
    window.$ = $;
  }
  start(){
      this.bindEvent();
  }
  bindEvent(){
      $('#proxy_synch').on("click",()=>{
          this._synchProEvents();
      });
  }
  _synchProEvents(){
            let list = $("#proxyTable").bootstrapTable('getAllSelections'),
                self = this;
            if (list.length <= 0) {
                Dialog.alert("请勾选要同步的产品");
                return;
            }else if(list.length > 10){
                Dialog.alert("勾选同步的产品不能超过10条");
                return;
            }else if(list.selector){
                return;
            }
             prosynchro.show(list, () => {
             this.synchProxyList.getComponent('productshelf.es6').getproshelflist({});
        });
  }
};


module.exports = ProsynchFunction;