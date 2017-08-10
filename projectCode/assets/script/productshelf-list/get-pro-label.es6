/**搜索产品标签**/
const $ = require('lib/jquery.js');
const TagSelector = require('plugins/tag-selector.es6');
require('lib/bootstrap-table.js');
const utils=require('utils');

class ProLabelClass extends uu.Component{
    onLoad() {
        this.bindEvent();
    }
    bindEvent() {
        let self = this;
        $(this.node.dom).on('click', '#btn_prdLabel,#prdLabel', function () {
            TagSelector.show({
                type: "tag",
                typechange: true,
                btnLabel: "确认",
                singleSelect: false,
                isProduct:0
            }, (list) => {
                let prdLabelList="";
                let tagLabelList="";
                for (let i = 0; i < list.length; i++) {
                        prdLabelList +=list[i].name+(i+1 < list.length?"|":"");
                        tagLabelList +=list[i].tagCode+(i+1 < list.length?",":"")    
                }
                $("#prdLabel").val(prdLabelList);
                $("#prdLabel").attr('proLabelid', tagLabelList);
            })
        })
        this.showProductLabel();
    }
    showProductLabel(){
        if(utils.url.get()['backPage']=='1'){
            var prdLabelData=window.localStorage.getItem('productLabel');
            $("#prdLabel").val(prdLabelData)
        }
    }
};
module.exports = ProLabelClass;