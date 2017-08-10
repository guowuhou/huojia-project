/**搜索产品标签**/
const $ = require('lib/jquery.js');
const TagSelector = require('plugins/tag-selector.es6');
require('lib/bootstrap-table.js');
const utils=require('utils');

class ProLabelClass extends uu.Component {
    onLoad() {
        this.bindEvent();
    }
    bindEvent() {
            let self = this;
            $(self.node.dom).on('click', '#proLabel,#bank_proLabel', function () {
                TagSelector.show({
                    type: "tag",
                    typechange: true,
                    btnLabel: "确认",
                    isProduct:0,
                    singleSelect: false //设置是否强制单选，默认false
                }, (list) => {
                    let checkedLabelList="";
                    let labelList="";
                    for (let i = 0; i < list.length; i++) {
                            checkedLabelList +=list[i].name+(i+1 < list.length?"|":"");
                            labelList +=list[i].tagCode+(i+1 < list.length?",":"")    
                    }
                    $("#proLabel").val(checkedLabelList);
                    $("#proLabel").attr('proLabelList', labelList);
                })
            })
            this.showPrdLabel();
    };
    showPrdLabel(){
        if(utils.url.get()['backPage']=='1'){
            var PrdLabelData=window.localStorage.getItem('productLabel');
            $("#proLabel").val(PrdLabelData) 
        }
    }
}
module.exports = ProLabelClass;

  