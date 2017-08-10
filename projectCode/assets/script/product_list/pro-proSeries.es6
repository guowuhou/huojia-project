/**搜索产品系列**/
const $ = require('lib/jquery.js');
const TagSelector = require('plugins/tag-selector.es6');
require('lib/bootstrap-table.js');
const utils=require('utils');

class ProTypeClass extends uu.Component {
    onLoad() {
        this.bindEvent();
    }
    bindEvent() {
            let self = this;
            $(self.node.dom).on('click', '#bank_proSer,#bank_btnProSer', function () {
                TagSelector.show({
                    type: "group",
                    typechange: false,
                    btnLabel: "确认",
                    singleSelect: true //设置是否强制单选，默认false
                }, (list) => {
                    let checkedList="";
                    let tagCodeList="";
                    for (let i = 0; i < list.length; i++) {
                            checkedList +=list[i].name+(i+1 < list.length?",":"");
                            tagCodeList +=list[i].tagCode+(i+1 < list.length?",":"")    
                    }
                    $("#bank_proSer").val(checkedList);
                    $("#bank_proSer").attr('proSeried', tagCodeList);
                })
            })
         this.showPrdSeries();
    };
    showPrdSeries(){
         if(utils.url.get()['backPage']=='1'){
            var PrdSeriesData=window.localStorage.getItem('prdSeries');
            $("#bank_proSer").val(PrdSeriesData) 
         }
    }
}
module.exports = ProTypeClass;

  