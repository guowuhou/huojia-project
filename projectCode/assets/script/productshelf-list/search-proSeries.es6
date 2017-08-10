/**搜索产品系列**/
const $ = require('lib/jquery.js');
const TagSelector = require('plugins/tag-selector.es6');
require('lib/bootstrap-table.js');
const utils=require('utils');

class ProTypeClass extends uu.Component{
    onLoad() {
        this.bindEvent();
    }
    bindEvent() {
        let self = this;
        $(this.node.dom).on('click', '#proSeries,#btn_proSeries', function () {
            TagSelector.show({
                type: "group",
                typechange: false,
                btnLabel: "确认",
                singleSelect: true
            }, (list) => {
                let checkedList="";
                let tagCodeList="";
                for (let i = 0; i < list.length; i++) {
                        checkedList +=list[i].name+(i+1 < list.length?",":"");
                        tagCodeList +=list[i].tagCode+(i+1 < list.length?",":"")    
                }
                $("#proSeries").val(checkedList);
                $("#proSeries").attr('proSerieid', tagCodeList);
            })
        })
        this.showPrdSeries();  
    }
    showPrdSeries(){
        if(utils.url.get()['backPage']=='1'){
            var prdSeriesData=window.localStorage.getItem('backClassify');
            $("#proSeries").val(prdSeriesData)
        }
    }
};
module.exports = ProTypeClass;