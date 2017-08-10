const $ = require('lib/jquery.js');
const artTemplate = require('lib/artTemplate.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const utils = require('utils');
class groupConfig extends uu.Component {

    properties() {
        return {
            addClass: {
                defaultValue: null,
                type: uu.Dom
            }
        }
    }

    onLoad() {
        
        this.initPage();
        $(this.addClass).on('click', () => {
            this.onAddClass();
        })
    }

    onAddClass() {      //新增大类
        let _this = this;
        let romateHtml = null;
        Dialog.show({
            title: '新增产品大类',
            message: () => {
                romateHtml = $(require('tpl/product-group-addClass.tpl'));
                return romateHtml;
            },
            buttons: [{
                label: '保存',
                cssClass: 'btn-primary',
                action: (dialogRef) => {
                    let prdArrName = romateHtml.find('#daleiName').val();
                    if (prdArrName) {
                        _this.addDaleiFn({ prdArrName: prdArrName }, dialogRef);
                    } else {
                        Dialog.alert('大类类型名称不能为空！');
                    }
                }
            }]
        });
    }

    initPage() {      //加载页面
        // let url = "http://10.14.217.17:8090/product/brop/pop/fsm/combine/getCombProductArrInfoList.do";
        let url = httpreq.queryCombProductArrInfoList;
        utils.xhr.post(url, {}, (res) => {
                let daleiContentRender = artTemplate.compile(require('tpl/product-group-daleiContent.tpl'));
                $('#daleiContentDiv').html(daleiContentRender(res.data));
                this.initEvent();
            
        })
    }

    initEvent() {     //加载事件   
        $('.ravampDalei-btn').on('click', (e) => {  //修改
            let el = $(e.target);
            let romateHtml = null;
            let thisName = el.attr('prdArrName');
            let prdArr = el.attr('prdArr');
            Dialog.show({
                title: '修改产品大类',
                message: () => {
                    romateHtml = $(require('tpl/product-group-addClass.tpl'));
                    romateHtml.find('#daleiName').val(thisName);
                    return romateHtml;
                },
                buttons: [{
                    label: '修改',
                    cssClass: 'btn-primary',
                    action: (dialogRef) => {
                        let prdArrName = romateHtml.find('#daleiName').val();
                        if (prdArrName) {
                            this.updataFn({ prdArrName: prdArrName, prdArr: prdArr, operType: "1" });
                            dialogRef.close();
                        } else {
                            Dialog.alert('大类类型名称不能为空！');
                        }
                    }
                }]
            });
        })

        $('.deleteDalei-btn').on('click', (e) => {  //删除
            let el = $(e.target);
            Dialog.confirm({
                closable: true,
                message: '确认删除该大类？',
                btnCancelLabel: '取消',
                btnOKLabel: '确认',
                callback: (res) => {
                    if (res) {
                        this.updataFn({
                            operType: "2",
                            prdArr: el.attr('prdArr')
                        })
                    }
                }
            })
        })
    }

    updataFn(opt) {    //更新大类 operType 1:修改 2:删除 
        // let url = "http://10.14.217.17:8090/product/brop/pop/fsm/combine/updateCombProductArrInfo.do";
        let url = httpreq.updateCombProductArrInfo;
        utils.xhr.post(url, opt, (res) => {       
                this.initPage();
            }
        )
    }

    addDaleiFn(opt, dialogDiv) {   //新增大类 prdArrName
        // let url = "http://10.14.217.17:8090/product/brop/pop/fsm/combine/addCombProductArrInfo.do";
        let url = httpreq.addCombProductArrInfo;
        utils.xhr.post(url, opt, (res) => {
                this.initPage();
                dialogDiv && dialogDiv.close();
            }
        )
    }

};

module.exports = groupConfig;  //hello 