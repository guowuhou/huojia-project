const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const ejs = require('lib/ejs.js');

class selecStausClass extends uu.Component {
    properties() {
        return {
            selectType: {
                defaultValue: null,
                type: uu.Node
            },
        };
    }
  onLoad() {
    window.$ = $;
  }
//   start(){//绑定的change事件去掉
    //   this.bindEvents();
    //   this.showSelectTable();
//   }
//   bindEvents(){
//       $('#applyType').on("change",(e)=>{
//           this.showSelectTable(e);
//       });
//   }
//   showSelectTable(e){
//       let  paramObj = {};
//       var targetVal=e ? $(e.currentTarget).val():"ALL";
//       paramObj.verifyStatus=targetVal;
//       this.selectType.getComponent('checkList.es6').getproshelflist(paramObj); 
//   }
};


module.exports = selecStausClass;