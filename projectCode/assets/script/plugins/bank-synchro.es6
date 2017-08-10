const ejs = require('lib/ejs.js');
const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const synchroHTML = require('tpl/bank-synchro.tpl');
const utils = require('utils');

//为了兼容IE，不使用ES6的class
const Prosynchro = function(){
    this.elid = 'shelf-modal';
};

Prosynchro.prototype = {
    show: function(list,callback){
        this._data = list||{};
        this._data.id = this.elid;
        this.callback = callback;
        $(`#${this.elid}`).remove();
        const html = new ejs({text:synchroHTML}).render(this._data);
        $('body').append(html);
        $(`#${this.elid}`).modal({});
        this.bindEvent();
    },
    bindEvent(){
        //绑定模态框被隐藏（并且同时在 CSS 过渡效果完成）之后被触发 将日历组件datetimepicker删除 
        this.bindBtnEvent();
    },
    //绑定同步按钮事件
    bindBtnEvent(){
        let self = this;
        $('#btn_synchro').off('click');
        $('#btn_synchro').on('click',(e)=>{
            let current = $(e.currentTarget);
            if(current.hasClass("btn-primary")){
                self.querysynchro(e.currentTarget);
                $(e.currentTarget).button('loading').delay(1000).queue(()=>{});
            }
        });
    },
    //绑定模态窗体右上角的'X'的事件
    bindClose(){
        $(`#${this.elid}`).on('click','button.close',(e)=>{
            $(`#${this.elid}`).modal('hide');
        });
    },
    //请求数据同步
    querysynchro(currentTarget){
        $(`#${this.elid}`).off('click');
        let dataList='';
        for(var i=0;i<this._data.length;i++){
            dataList += this._data[i].prdCode+(i+1<this._data.length?',':'');
        }
        utils.xhr.post(httpreq.PS_SynchroFinancial, {prdCode:dataList}, (res)=>{
            $(currentTarget).data().resetText = '同步完成';
            $(currentTarget).button('reset').removeClass('btn-primary').addClass('btn-success');
            //同步完成后设置500毫秒自动将模态窗体隐藏并调用回调方法重新查询列表数据
            setTimeout(()=>{
                $(`#${this.elid}`).modal('hide');
                this.callback();
            }, 500);
        },(res)=>{
            Dialog.alert({
                type: Dialog.TYPE_WARNING,
                title:'警告', 
                message:res.msg
            });
            $(currentTarget).button('reset');
            this.bindBtnEvent();
            this.bindClose();
        });
    }
};

module.exports = new Prosynchro();