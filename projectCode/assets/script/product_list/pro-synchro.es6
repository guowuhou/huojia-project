const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const moment = require('lib/moment.js');
require('lib/bootstrap-table.js');
const synchroHTML = require('tpl/bank-synchro.tpl');
const prosynchro = require('plugins/bank-synchro.es6');

class synchFunction extends uu.Component {
    properties() {
        return {
            synchApplyList: {
                defaultValue: null,
                type: uu.Node
            },
        };
    }
  onLoad() {
    window.$ = $;
  }
  start(){
      this.bindEvents();
  }
  bindEvents(){
      $('#bank_synch').on("click",()=>{
          this._synchEvents();
      });
     
  }
  _synchEvents(){
            let list = $("#bankTable").bootstrapTable('getAllSelections'),
                cancelApplyList = "",
                self = this;
            if (list.length <= 0) {
                Dialog.alert("请勾选要同步的产品");
                return;
            }else if(list.length > 10){  
                Dialog.alert("勾选同步的产品不能超过10条");
                return;
            }
            else if(list.selector){
                return;
            }else {
                for(var i=0;i<list.length;i++){
                   if(!list[i].productId){
                    Dialog.alert(list[i].prdCode+'不能手工同步')
                    return;
                  } 
                }
                
            }
             prosynchro.show(list, () => {
             this.synchApplyList.getComponent('Product-List.es6').getproshelflist({});
        });
  }
};


module.exports = synchFunction;