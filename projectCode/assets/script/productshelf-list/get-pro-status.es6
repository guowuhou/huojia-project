/**产品状态**/
const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const utils=require('utils');

class ProStatusClass extends uu.Component {

    onLoad() {
        this.getProStatusListData();
    }

    //获取 '产品状态' 数据
    getProStatusListData() {
        utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:"16"},(res, event) => {
                this._data = res.data || [];
                this.createProStatus();
        });
    }

    //构建 '产品状态' 下拉列表
    createProStatus() {
        $(this.node.dom).innerHTML = '';
        if (this._data.length > 0) {
            for (let index = 0; index < this._data.length; index++) {
                let element = this._data[index];
                $(this.node.dom).append(`<label class="inline p_r5" ><input type="checkbox" name="${element.ddName}" value="${element.ddCode}">${element.ddName}</label>`);
            }
        };
        this.showprdType();
    }
    //产品状态多选框返显
   showprdType(){
        if(utils.url.get()['backPage']=='1'){
            var prdTypeData=window.localStorage.getItem('status');
            var prdTypeList=prdTypeData.split(',');
            var checkboxList=$('#list_proxy').find('input[type=checkbox]');
            for(var i=0;i < prdTypeList.length;i++){
                for(var j=0;j < checkboxList.length;j++){
                    if(prdTypeList[i]==checkboxList[j].value){
                        $(checkboxList[j]).attr("checked",true)
                    }
                }
            }
        }
   }
};

module.exports = ProStatusClass;