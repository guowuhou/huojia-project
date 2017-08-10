/**操作查询条件**/
const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const utils=require('utils');

class TaCodeClass extends uu.Component{
    
    properties() {
        return {
            proshelflist: {
                defaultValue: null,
                type: uu.Node
            },
            mohuSearchFlag:{
                defaultValue: null,
                type: uu.Node
            },
            taSearchFlag:{
                defaultValue: null,
                type: uu.Node
            }
        }    
    }
    
    onLoad () {
        this.bindEvent();
    }
    
    //绑定事件（清空条件、搜索、批量导出）
    bindEvent(){
        let self = this;
        $(this.node.dom).on('click', '#a_cleanterm', function(){
            self.cleantermFun();
        }).on('click','#btn_search',function(){
            self.searchFun(true);
        }).on('click','#btn_leadingout',function() {
            self.leadingoutFun();
        }).on('click','#btn_leadingupdate',function(){
            self.leadingupdateFun();
        });
    }
    
    //清空条件
    cleantermFun(){
        let formAll = $('#list_proxy').find("form.form-inline");
        for (let index = 0; index < formAll.length; index++) {
            let itemform = formAll[index];
            itemform.reset();
            $(itemform).find("[filter=proSerial]").attr('proseriesid','');
            $(itemform).find("[filter=prdCode]").attr('real-value','');
            $(itemform).find("[filter=tACode]").attr('real-value','');
            $(itemform).find("[filter=prdTag]").attr('proLabelid','');
        }
    }
    
    //搜索
    searchFun(searchflag){
        let proxyTaCode,proxyCodeName,productLabel,backClassify;
        let filter = $('#list_proxy').find('[filter]');
        let requireoptions = {pageNo:1};
        for (let i = 0; i < filter.length; i++) {
            var element = filter[i];
            if(element.nodeName.toLowerCase()==='input'&&$(element).attr('filter')==='tACode'){
                 var tasearchFlag=this.taSearchFlag.getComponent("get-ta-code.es6").getsearchFlag(); 
               if (utils.url.get()['backPage']=='1'){
                    if(tasearchFlag) {
                         if($("#taCode").val()!=''){
                            requireoptions[$(element).attr('filter')] = $(element).attr('real-value') || $(element).val();
                        }else{
                            requireoptions[$(element).attr('filter')] = '';
                        }
                    }else{
                        if($("#taCode").val()==window.localStorage.getItem('proxyTaCode')){
                             requireoptions[$(element).attr('filter')] =window.localStorage.getItem('tACode');
                        }else{
                            requireoptions[$(element).attr('filter')] = $(element).val();
                        }
                    };
                } else {
                    if (tasearchFlag) {
                        if($("#taCode").val()!=''){
                            requireoptions[$(element).attr('filter')] = $(element).attr('real-value') || $(element).val();
                        }else{
                            requireoptions[$(element).attr('filter')] = '';
                        }
                    } else {
                        if($("#taCode").val()!=''){
                            requireoptions[$(element).attr('filter')] = $(element).val();
                        }else{
                            requireoptions[$(element).attr('filter')] = "";
                        }
                    };
                } 
            }else if(element.nodeName.toLowerCase()==='input'&&$(element).attr('filter')==='prdCode'){
                 var SearchFlag=this.mohuSearchFlag.getComponent("get-pro-name.es6").getmohuoFlag();
                 if (utils.url.get()['backPage']=='1'){
                     if(SearchFlag){
                        if($("#prductCode").val()!=''){
                            requireoptions[$(element).attr('filter')] = $(element).attr('real-value') || $(element).val();
                        }else{
                            requireoptions[$(element).attr('filter')] = '';
                        }
                    }else{
                         if($("#prductCode").val()==window.localStorage.getItem('proxyCodeName')){
                             requireoptions[$(element).attr('filter')] =window.localStorage.getItem('prdCode');
                        }else{
                            requireoptions[$(element).attr('filter')] = $(element).val();
                        }
                    };
                 }else{
                     if (SearchFlag) {
                          if($("#prductCode").val()!=''){
                            requireoptions[$(element).attr('filter')] = $(element).attr('real-value') || $(element).val();
                        }else{
                            requireoptions[$(element).attr('filter')] = '';
                        }
                     } else {
                         if ($("#prductCode").val() != '') {
                             requireoptions[$(element).attr('filter')] = $(element).val();
                         } else {
                             requireoptions[$(element).attr('filter')] = "";
                         }
                     };
                 }
                  
            }else  if(element.nodeName.toLowerCase()==='input'&&$(element).attr('filter')==='prdSerial'){  //产品系列
                 if (utils.url.get()['backPage'] == '1') {
                    if ($(element).attr('proSerieid')) {
                        requireoptions[$(element).attr('filter')] = $(element).attr('proSerieid');
                    } else {
                        if ($("#proSeries").val() != '') {
                            requireoptions[$(element).attr('filter')] = window.localStorage.getItem('prdSerial');
                        } else {
                            requireoptions[$(element).attr('filter')] = '';
                        }
                    }
                }else{
                    requireoptions[$(element).attr('filter')] = $(element).attr('proSerieid')||'';
                }
            }else if( element.nodeName.toLowerCase()==='input'&&$(element).attr('filter')==='prdTag'){//产品标签
                if (utils.url.get()['backPage'] == '1') {
                    if ($(element).attr('proLabelid')) {
                        requireoptions[$(element).attr('filter')] = $(element).attr('proLabelid');
                    } else {
                        if ($("#prdLabel").val() != '') {
                            requireoptions[$(element).attr('filter')] = window.localStorage.getItem('prdTag');
                        } else {
                            requireoptions[$(element).attr('filter')] = 'ALL';
                        }
                    }
                }else{
                    requireoptions[$(element).attr('filter')] =$(element).attr('proLabelid')||'ALL';
                }
            }else if(element.nodeName.toLowerCase()==='div'&&$(element).attr('filter')==='status'){ //产品状态
                let checkboxlist = $(element).find('input[type=checkbox]');
                let checkedstr = '';
                for (var j = 0; j < checkboxlist.length; j++) {
                    let checkbox = checkboxlist[j];
                    if (checkbox.checked) {
                        checkedstr+=checkbox.value+',';
                    }
                }
                checkedstr = checkedstr.replace(/,$/,'');
                requireoptions['status'] = checkedstr;
            }else{
                requireoptions[$(element).attr('filter')] = $(element).val()||'';
            }
        }
        if(searchflag===true){//是否在获取到筛选条件后直接查询
            this.proshelflist.getComponent('productshelf.es6').getproshelflist(requireoptions);
        }else{
            return requireoptions;//单纯只获取筛选条件
        };
        requireoptions['proxyTaCode']=$("#taCode").val();
        requireoptions['proxyCodeName']=$("#prductCode").val();
        requireoptions['productLabel']=$("#prdLabel").val();
        requireoptions['backClassify']=$("#proSeries").val();
        this.localStorageFun(requireoptions);
    }
     //本地存储搜索条件
    localStorageFun(requireoptions){
        window.localStorage.clear();
        var proxydata;
        let filter = $('#list_proxy').find('[filter]');
        for(var i=0;i < filter.length;i++){
            proxydata=$(filter[i]).attr('filter');
            window.localStorage.setItem(proxydata,requireoptions[proxydata]);
        }
        proxydata='proxyTaCode';
        window.localStorage.setItem(proxydata,requireoptions.proxyTaCode);
        proxydata='proxyCodeName';
        window.localStorage.setItem(proxydata,requireoptions.proxyCodeName);
        proxydata='productLabel';
        window.localStorage.setItem(proxydata,requireoptions.productLabel);
        proxydata='backClassify';
        window.localStorage.setItem(proxydata,requireoptions.backClassify);
    }
    //批量导出
    leadingoutFun(){
        let qrydata = this.proshelflist.getComponent('productshelf.es6').getqrydatas();
        if(qrydata.length>0){
            let urlhref = httpreq.PS_DownLoadFundList+'?';
            let data = this.proshelflist.getComponent('productshelf.es6').getqryparamdatas();
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
        Dialog.show({
            title:'批量更新产品信息',
            nl2br: false,
            message:() => {
                var uploadHtml = $(require('tpl/upload.tpl'));
                var url = httpreq.PS_improtProductList;
                var seat = url.indexOf('?');
                seat = seat >0 ? '&prdType=fundProductInfo' : '?prdType=fundProductInfo';
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

module.exports = TaCodeClass;