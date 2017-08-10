/**操作查询条件**/
const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const utils = require('utils');

class searchCondition extends uu.Component {

    properties() {
        return {
            proshelflist: {
                defaultValue: null,
                type: uu.Node
            },
            proChannel:{
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
        this.bindEvent();
    }
    //绑定事件（清空条件、搜索、批量导出）
    bindEvent() {
        let self = this;
        $(this.node.dom).on('click', '#a_cleanterm', function () {
            self.clearItem();
        }).on('click', '#btn_bankSearch', function () {
            self.searchFun(true);
        }).on('click', '#btn_leadingout', function () {
            self.leadingoutFun();
        }).on('click', '#btn_leadingupdate', function () {
            self.leadingupdateFun();
        });
    } 
    //清空条件
    clearItem() {
        let formAll = $('#list_bank').find("form.form-inline");
        for (let index = 0; index < formAll.length; index++) {
            let itemform = formAll[index];
            itemform.reset();
            $(itemform).find("[filter=productSeries]").attr('proSeried','');
            $(itemform).find("[filter=prdCode]").attr('real-value','');
            $(itemform).find("[filter=prdTag]").attr('proLabelList','');
        };
        //  let proassList = this.proChannel.getComponent('shelfUp-Staus.es6').ms;
        //     if (proassList) {
        //     proassList.clear();
        // }      
    }
    //本地存储收索条件
    localStorageFun(requireoptions){
        window.localStorage.clear();
        var bankdata;
        let filter = $('#list_bank').find('[filter]');
        for(var i=0;i < filter.length;i++){
            bankdata=$(filter[i]).attr('filter');
            window.localStorage.setItem(bankdata,requireoptions[bankdata]);
        }
        bankdata='currencyOptionVal';
        window.localStorage.setItem(bankdata,requireoptions.currencyOptionVal);
        bankdata='prdCodeName';
        window.localStorage.setItem(bankdata,requireoptions.prdCodeName);
        bankdata='prdSeries';
        window.localStorage.setItem(bankdata,requireoptions.prdSeries);
        bankdata='productLabel';
        window.localStorage.setItem(bankdata,requireoptions.productLabel);
    }
    //搜索
    searchFun(searchflag) {
        let currencyOptionVal,prdCodeName,prdSeries,productLabel;
        //let proassList = this.proChannel.getComponent('shelfUp-Staus.es6').getShelvesValues();//接入渠道参数
        let filter = $('#list_bank').find('[filter]');
        let requireoptions = { pageNo: 1 };
        for (let i = 0; i < filter.length; i++) {
            var element = filter[i];
            if(element.nodeName.toLowerCase()==='input'&& $(element).attr('filter')==='prdCode'){
                var lastmohuFlag = this.mohuFlag.getComponent("prdcode-name.es6").getMohuFlag();
                if (utils.url.get()['backPage']=='1'){
                    if (lastmohuFlag) {
                         if($("#prdCode").val()!=''){
                            requireoptions[$(element).attr('filter')] = $(element).attr('real-value') || $(element).val();
                        }else{
                            requireoptions[$(element).attr('filter')] = '';
                        }
                    }else{
                        if($("#prdCode").val()!='' &&  $("#prdCode").val()==window.localStorage.getItem('prdCodeName')){
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
                
            }else if(element.nodeName.toLowerCase()==='select'&& $(element).attr('filter')==='currency'){//币种
                if($("#Currencies option:selected").text()=="全部"){
                     requireoptions[$(element).attr('filter')] ="";
                }else{
                     requireoptions[$(element).attr('filter')] = $("#Currencies option:selected").text()||'';
                } 
            }else if(element.nodeName.toLowerCase()==='input'&& $(element).attr('filter')==='productSeries'){//产品系列
                if (utils.url.get()['backPage']=='1'){
                     if($(element).attr('proSeried')){
                         requireoptions[$(element).attr('filter')] =$(element).attr('proSeried');
                     }else{
                         if($("#bank_proSer").val()!=''){
                             requireoptions[$(element).attr('filter')] =window.localStorage.getItem('productSeries');
                         }else{
                             requireoptions[$(element).attr('filter')] ='';
                         }
                     }
                }else{
                     requireoptions[$(element).attr('filter')] =$(element).attr('proSeried')||'';
                }
            }else if(element.nodeName.toLowerCase()==='input'&& $(element).attr('filter')==='prdTag'){//产品标签
                if (utils.url.get()['backPage']=='1'){
                    if($(element).attr('proLabelList')){
                         requireoptions[$(element).attr('filter')] =$(element).attr('proLabelList');
                     }else{
                         if($("#proLabel").val()!=''){
                             requireoptions[$(element).attr('filter')] =window.localStorage.getItem('prdTag');
                         }else{
                             requireoptions[$(element).attr('filter')] ='ALL';
                         }
                     }
                }else{
                    requireoptions[$(element).attr('filter')] =$(element).attr('proLabelList')||'ALL';
                }
            }else{
                 requireoptions[$(element).attr('filter')] = $(element).val() || '';
            }  
        }
        if (searchflag === true) {//是否在获取到筛选条件后直接查询
            //requireoptions['salesChannels'] = proassList;
            this.proshelflist.getComponent('Product-List.es6').getproshelflist(requireoptions); 
        } else {
            return requireoptions;//单纯只获取筛选条件
        }
        requireoptions['currencyOptionVal']=$("#Currencies option:selected").val();
        requireoptions['prdCodeName']=$("#prdCode").val();
        requireoptions['prdSeries']=$("#bank_proSer").val();
        requireoptions['productLabel']=$("#proLabel").val();
        this.localStorageFun(requireoptions);
    }
    //批量导出
    leadingoutFun(){
        let qrydata = this.proshelflist.getComponent('Product-List.es6').getqrydatas();
        if(qrydata.length>0){
            let urlhref = httpreq.PS_DownLoadFinaList+'?';
            let data = this.proshelflist.getComponent('Product-List.es6').getqryparamdatas();
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    let datacs = key+'='+data[key]+'&';
                    urlhref+=datacs;
                }
            }
            urlhref = urlhref.replace(/&$/,'');
            let adownLoad = $(this.node.dom).find('#adownLoad')[0];
            adownLoad.href = urlhref;
            adownLoad.click();
        }else{
            Dialog.alert('无数据可导出');
        }
    }
    
    //批量更新产品信息
    leadingupdateFun() {
        var uploadHtml = null;
         var self = this;
        Dialog.show({
            title:'批量更新产品信息',
            nl2br: false,
            message:() => {
                uploadHtml = $(require('tpl/upload.tpl'));
                var url = httpreq.PS_improtProductList;
                var seat = url.indexOf('?');
                seat = seat >0 ? '&prdType=financialDetail' : '?prdType=financialDetail';
                url = url + seat;
                $(uploadHtml[6]).attr("action",url).attr("action",url);
                $(uploadHtml[2]).on('click',()=> {
                    uploadHtml.find(".upfiles").trigger('click')
                });
                $(uploadHtml[4]).on('click',()=> {
                    var name = uploadHtml.find("#textFiled1").val();
                    if(name==''){
                        Dialog.alert("请选择要上传的文件文件",function(){return})
                    }else{
                        if(/\.csv$/i.test(name)){
                            uploadHtml.find(".submit").trigger('click')
                        }else{
                            Dialog.alert("请上传文件格式为csv的文件")
                        }
                    }
                    
                });
                return uploadHtml;
            },
            buttons:[
                {
                    label:'取消',
                    cssClass: 'btn-primary',
                     action:function(dialogRef){
                        dialogRef.close();    
                     }
                }
            ]
        })
    }
};
module.exports = searchCondition;