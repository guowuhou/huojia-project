const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const ejs = require('lib/ejs.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const TagSelector = require('plugins/tag-selector.es6');
require('lib/bootstrap-table.js');
const utils=require('utils');

class removeApplyClass extends uu.Component {
    properties() {
        return {
            removeApplyList: {
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
      $('#removeApply').on("click",()=>{
          this._removeApply();
      });
  }
  _removeApply() {
      let url = httpreq.Check_verifyProduct;
      let list = $("#tableList").bootstrapTable('getAllSelections'),
          cancelApplyList = "";
      if (list.length <= 0) {
          Dialog.alert("请勾选要操作的产品");
          return;
      } else if (list.length > 0) {
          for (var i = 0; i < list.length; i++) {
              if (list[i].reviewStatus == '01') {
                  cancelApplyList += list[i].reviewId + (i + 1 < list.length ? '|' : '');
              } else {
                  Dialog.alert('只有在待审批状态下才可以撤销申请')
                  return
              }
          }

      }
      utils.xhr.post(url, {
          verifyOperateType: 'CANCEL',
          reviewId: cancelApplyList
      }, (res) => {
              Dialog.alert("撤销申请成功!");
              $("#tableList").bootstrapTable('refresh');
      });
  }
};


module.exports = removeApplyClass;