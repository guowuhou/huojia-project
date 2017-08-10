/**操作查询条件**/
const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const utils = require('utils');

class conditionOper extends uu.Component {

    properties() {
        return {
            proshelflist: {
                defaultValue: null,
                type: uu.Node
            },
            mohuFlag:{
                defaultValue: null,
                type: uu.Node
            }
        };
    }

    onLoad() {
        this.bindEvents();
    }
    //绑定事件（清空条件、搜索）
    bindEvents() {
        let self = this;
        // let ulDom = $(this.node.dom).parents("ul");
        // ulDom.find("#prdTy").change(
        //     () => {
        //         if(ulDom.find("#prdTy").val()=="1"){
        //             ulDom.find(".no_des").hide()
        //         }else{
        //             ulDom.find(".no_des").show()
        //         }
        //     }
        // )
        $(this.node.dom).on('click', '#cleanIterm', function () {
            self.clearItem();
        }).on('click', '#search', function () {
            self.searchFun(true);
        });
    } 
    //清空条件
    clearItem() {
        let formAll = $('#deposit').find("form.form-inline");
        for (let index = 0; index < formAll.length; index++) {
            let itemform = formAll[index];
            itemform.reset();
            $(itemform).find("[filter=prdCode]").attr('real-value','');
        };      
    }
    //搜索
    searchFun(searchflag) {
        var self=this;
        let productCodeName;
        let filter = $('#deposit').find('[filter]');
        let requireoptions = { pageNo: 1 };
        for (let i = 0; i < filter.length; i++) {
            var element = filter[i];
            if(element.nodeName.toLowerCase()==='input'&& $(element).attr('filter')==='prdCode'){
                var lastmohuFlag = self.mohuFlag.getComponent("product_code.es6").getMohuFlag();
                if (utils.url.get()['backPage']=='1'){
                    if (lastmohuFlag) {
                        if($("#prdCode").val()!=''){
                            requireoptions[$(element).attr('filter')] = $(element).attr('real-value') || $(element).val();
                        }else{
                            requireoptions[$(element).attr('filter')] = '';
                        }
                        
                    }else{
                        if($("#prdCode").val()!='' &&  $("#prdCode").val()==window.localStorage.getItem('productCodeName')){
                             requireoptions[$(element).attr('filter')] =window.localStorage.getItem('prdCode');
                        }else{
                            requireoptions[$(element).attr('filter')] = $(element).val();
                        }
                    }
                } else {
                    if (lastmohuFlag) {
                        requireoptions[$(element).attr('filter')] = $(element).attr('real-value') || $(element).val();
                    } else {
                        if($("#prdCode").val()!=''){
                            requireoptions[$(element).attr('filter')] = $(element).val();
                        }else{
                            requireoptions[$(element).attr('filter')] = "";
                        }
                    }
                }
            }else if(element.nodeName.toLowerCase()==='input'&& $(element).attr('filter')==='productSeries'){//产品系列
                 requireoptions[$(element).attr('filter')] =$(element).attr('proSeried')||'';
            }else{
                 requireoptions[$(element).attr('filter')] = $(element).val() || '';
            }   
        }
        if (searchflag === true) {//是否在获取到筛选条件后直接查询
            this.proshelflist.getComponent('deposit_receipt_list.es6').getproshelflist(requireoptions); 
        } else {
            return requireoptions;//单纯只获取筛选条件
        }
        requireoptions['productCodeName']=$("#prdCode").val();
        this.localStorageFun(requireoptions);
    }
    //本地存储参数
    localStorageFun(requireoptions){
        window.localStorage.clear();
        var depositdata;
        let filter = $('#deposit').find('[filter]');
        for(var i=0;i < filter.length;i++){
            depositdata=$(filter[i]).attr('filter');
            window.localStorage.setItem(depositdata,requireoptions[depositdata]);
        }
        depositdata='productCodeName';
        window.localStorage.setItem(depositdata,requireoptions.productCodeName);
    }
};
module.exports = conditionOper;