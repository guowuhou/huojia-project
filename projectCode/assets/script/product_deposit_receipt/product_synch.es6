/**同步**/
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const moment = require('lib/moment.js');
require('lib/bootstrap-table.js');
const prosynchro = require('plugins/deposit-synch.es6');

class depositSynch extends uu.Component {
    properties() {
        return {
            synchProList: {
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
      $('#deposit_synch').on("click",()=>{
          this._synchEvent();
      });
     
  }
  _synchEvent(){
            let list = $("#table").bootstrapTable('getAllSelections'),
                self = this;
            if (list.length <= 0) {
                Dialog.alert("请勾选要同步的产品");
                return;
            }else if(list.length > 10){  
                Dialog.alert("勾选同步的产品不能超过10条");
                return;
            }
            else if(list.selector){
                Dialog.alert("没有选择可同步的产品");
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
             this.synchProList.getComponent('deposit_receipt_list.es6').getproshelflist({});
        });
  }
};


module.exports = depositSynch;