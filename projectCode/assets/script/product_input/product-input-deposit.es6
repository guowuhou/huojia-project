const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const utils=require("utils");
class productInputdeposit extends uu.Component {
    properties() {
        return {
            prdCode: {
                defaultValue: null,
                type: uu.Dom
            },
            prdId: {
                defaultValue: null,
                type: uu.Dom
            },
            prdType: {
                defaultValue: null,
                type: uu.Dom
            },
            prdDeadline: {
                defaultValue: null,
                type: uu.Dom
            },
            prodepositTable: {
                defaultValue: null,
                type: uu.Node
            },
            prdTransition: {
                defaultValue: null,
                type: uu.Dom
            },
            onState: {
                defaultValue: null,
                type: uu.Dom
            }
        }
    }
    onLoad() {
        this._initprdType();
        this._initprdDeadline();
        this._initprdTransition();
        this._initonState();
        this.bindEvents();
        
    }
     //产品类型-请求后台数据-展示
    _initprdType() {
        utils.xhr.post(httpreq.PS_GetDictionaryType, { ddType: "55" }, (res, event) => {
            this._data = res.data || [];
            if (this._data.length > 0) {
                let html = '';
                let len = this._data.length;
                for (let i = 0; i < len; i++) {
                    if (this._data[i].ddName) {
                        html += `<option value=${this._data[i].ddCode}>${this._data[i].ddName}</option>`
                    }
                }
                $(this.prdType).append(html);
            }
        });
    }
    //构建 '产品期限' 下拉列表
    _initprdDeadline(){
        utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:"65"},(res, event)=>{
                this._data = res.data||[];
                if (this._data.length > 0) {
                let html = '';
                let len = this._data.length;
                for (let i = 0; i < len; i++) {
                    if (this._data[i].ddName) {
                        html += `<option value=${this._data[i].ddCode}>${this._data[i].ddName}</option>`
                    }
                }
                $(this.prdDeadline).append(html);
            }
        });
    }
    _initprdTransition(){
        utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:"57"},(res, event)=>{
                this._data = res.data||[];
          if (this._data.length > 0) {
                let html = '';
                let len = this._data.length;
                for (let i = 0; i < len; i++) {
                    if (this._data[i].ddName) {
                        html += `<option value=${this._data[i].ddCode}>${this._data[i].ddName}</option>`
                    }
                }
                $(this.prdTransition).append(html);
            }
        });
    }    
    _initonState(){
        this._data = [
            {key:'ON_SALE',name:'上架中'},
            {key:'WAIT_SALE',name:'待上架'},
            {key:'OFF_SALE',name:'已下架'}
        ];
        if (this._data.length > 0) {
                let html = '';
                let len = this._data.length;
                for (let i = 0; i < len; i++) {
                    if (this._data[i].key) {
                        html += `<option value=${this._data[i].key}>${this._data[i].name}</option>`
                    }
                }
                $(this.onState).append(html);
            }
    }
    
    
    bindEvents() {
       let self = this;
        $(this.node.dom).find("#prdTy").change(() => {
            if($(this.node.dom).find("#prdTy").val()=="1"){
                $(this.node.dom).find(".no_des").hide();
            }else{
                $(this.node.dom).find(".no_des").show();
            }
        })
        $(this.node.dom).on('click', '#cleanIterm', function () {
            self.clearItem();
        }).on('click', '#search', function () {
            self.searchFun(true);
        });
    }
    clearItem() {
        let formAll = $('#deposit').find("form.form-inline");
        for (let index = 0; index < formAll.length; index++) {
            let itemform = formAll[index];
            itemform.reset();
        };      
    }
    searchFun(searchflag) {
        let filter = $('#deposit').find('[filter]');
        let requireoptions = { pageNo: 1};
        requireoptions.channelId = $("#channelId").val();
        for (let i = 0; i < filter.length; i++) {
            var element = filter[i];
            requireoptions[$(element).attr('filter')] = $(element).val() || '';
        };
        this.prodepositTable.getComponent('product-deposit-table.es6').showTableList(requireoptions);  
    }
};
module.exports = productInputdeposit