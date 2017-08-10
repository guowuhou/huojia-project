const ejs = require('lib/ejs.js');
const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
require('lib/bootstrap-datetimepicker.js');
const shelfupHTML = require('tpl/shelf-up.tpl');
const utils = require('utils');

const Shelfup = function(){
    this.elid = 'shelf-modal';
};

//  <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>

Shelfup.prototype = {
    
    show: function(options, callback){
        this._data = options||{};
        this._data.id = this.elid;
        this.callback = callback || function(){};
        $(`#${this.elid}`).remove();
        const html = new ejs({text:shelfupHTML}).render(this._data);
        $('body').append(html);
        $(`#${this.elid}`).modal({});
        this.bindEvent();
        this.initDate();
    },
    initDate(){
        this.initOnSaleDate();
        this.initOffSaleDate(true);
    },
    //初始化上架日历
    initOnSaleDate(){
        let curDateTime = moment(this._data.curTime);
        let onSaleTime = this._data.onSaleTime;
        if(onSaleTime>0&&this._data.curTime>=onSaleTime){   //上架中
            $('#uptime_input').attr('disable',true).val(moment(onSaleTime).format('YYYY-MM-DD HH:mm:ss'));
        }else{
            $('#up_datetime').datetimepicker({
                language: 'zhcn',
                todayBtn: true,
                autoclose: true,
                todayHighlight: true,
                startDate: curDateTime.toDate(),
                forceParse: false,
                // minuteStep:5,
                pickerPosition: "bottom-left"
            });
            if(onSaleTime>0){
                $('#uptime_input').val(moment(onSaleTime).format('YYYY-MM-DD HH:mm:ss'));
                $('#up_datetime').datetimepicker("setDate",new Date(onSaleTime));
            }
        }
    },
    //初始化下架日历
    initOffSaleDate(flag){
        let curDateTime = moment(this._data.curTime);
        let offSaleTime = this._data.offSaleTime;
        $('#down_datetime').datetimepicker({
            language: 'zhcn',
            todayBtn: true,
            autoclose: true,
            todayHighlight: true,
            startDate: curDateTime.toDate(),
            forceParse: false,
            // minuteStep:5,
            pickerPosition: "bottom-left"
        });
        if(offSaleTime>0&&flag){
            $('#downtime_input').val(moment(offSaleTime).format('YYYY-MM-DD HH:mm:ss'));
            if(offSaleTime>=this._data.curTime){
                $('#down_datetime').datetimepicker("setDate",new Date(offSaleTime));
            }
        }
    },
    bindEvent(){
        //绑定模态框被隐藏（并且同时在 CSS 过渡效果完成）之后被触发 将日历组件datetimepicker删除
        $(`#${this.elid}`).off('hidden.bs.modal');
        $(`#${this.elid}`).on('hidden.bs.modal', function (e) {
            $('#up_datetime,#down_datetime').datetimepicker("remove");
        });
        this.bindBtnEvent();
    },
    bindBtnEvent(){
        this.bindshelfup();
        this.bindshelfdown();
        //绑定 '无结束日期' 事件
        $('#longtime').off('click');
        $('#longtime input[type=checkbox]').on('click',(e)=>{
            let ckinput = e.currentTarget;
            if(ckinput){
                let ckflag = ckinput.checked;
                if(ckflag){
                    $(`#${this.elid}`).find('#downtime_input').val('');
                    $('#down_datetime').datetimepicker('remove');
                }else{
                    this.initOffSaleDate();
                }
            }
        });
        //绑定 日历控件中的一个清楚日期的 事件.date-time-remove
        $(".date-time-remove").off('click');
        $(".date-time-remove").on('click',(e)=>{
            let currentTarget = e.currentTarget;
            if($(currentTarget).siblings('input').attr('disable')) return ;
            $(currentTarget).siblings('input').val('');
        });
    },
    //绑定上架按钮事件
    bindshelfup(){
        $('#shelfup').off('click');
        $('#shelfup').on('click',(e)=>{
            this.shelfupfun();
        });
    },
    //绑定下架按钮事件
    bindshelfdown(){
        $('#forthwithfromsale').off('click');
        if(this._data.onSaleTime>0&&this._data.curTime>=this._data.onSaleTime){   //上架中
            $('#forthwithfromsale').on('click',(e)=>{
                this.fromsalefun();
            });
        }else{
            $('#forthwithfromsale').removeClass('btn-primary').addClass('disabled');
        }
    },
    //立即下架
    fromsalefun(){
        $(`#${this.elid}`).off('click');
        utils.xhr.post(httpreq.PS_OffSale, {prdCode: this._data.prdCode}, (res)=>{
            this.requiresuccess('下架成功');
        },(res)=>{
            this.requireerror(res.msg);
        });
    },
    //上架
    shelfupfun(){
        let onSaleTime = $(`#${this.elid}`).find('#uptime_input').val(),
            offSaleTime = $(`#${this.elid}`).find('#downtime_input').val();
        if(onSaleTime==""){
              Dialog.alert({title:'警告', message:'上架日期不能为空'});//没有选择时间，报错提示8.31添加
              return  
        }
        if(onSaleTime !==""){
            if($('input[type=checkbox]').is(':checked')==false && offSaleTime==""){
              Dialog.alert({title:'警告', message:'下架日期不能为空'});
              return  
            }
        }
        if(offSaleTime!=="" && onSaleTime.replace(/[-|:|" "]/g,"") > offSaleTime.replace(/[-|:|" "]/g,"")){
             Dialog.alert({title:'警告', message:'下架日期不能小于上架日期'});
              return   
        } 
        else{
            $(`#${this.elid}`).off('click');
            utils.xhr.post(httpreq.PS_OnSale, {prdCode: this._data.prdCode,onSaleTime:this.getTimeStr(onSaleTime),offSaleTime:this.getTimeStr(offSaleTime)}, (res)=>{
                this.requiresuccess('上架成功');
            },(res)=>{
                this.requireerror(res.msg)
            });
        }
    },
    //请求成功
    requiresuccess(title){
        $(`#${this.elid}`).modal('hide');
        Dialog.alert({
            type: Dialog.TYPE_WARNING,
            title:'警告', 
            message:title, 
            callback:()=>{
                this.callback();
            }
        });
    },
    //请求失败
    requireerror(title){
        Dialog.alert({
            type: Dialog.TYPE_WARNING,
            title:'警告', 
            message:title, 
            callback:()=>{
                this.bindBtnEvent();
                this.bindClose();
            }
        });
    },
    //绑定模态窗体右上角的'X'的事件
    bindClose(){
        $(`#${this.elid}`).on('click','button.close',(e)=>{
            $(`#${this.elid}`).modal('hide');
        });
    },
    //转换时间2016-08-16 09:12:33--------20160816091233
    getTimeStr(timedate){
        if(typeof timedate =='string'){
            return timedate.replace(/[-|:|\s]/g,'');
        }else if(typeof timedate =="object"){
            timedate = new Date(timedate);
            if(!isNaN(timedate.getTime())){
                let year = timedate.getFullYear(),
                    month = this.getStr(timedate.getMonth()+1),
                    date = this.getStr(timedate.getDate()),
                    hours = this.getStr(timedate.getHours()),
                    minutes = this.getStr(timedate.getMinutes()),
                    seconds = this.getStr(timedate.getSeconds());
                return year+month+date+hours+minutes+seconds;
            }else{
                return '';
            }
        }
    },
    getStr(tnumber){
        return parseInt(tnumber,10)>=10?''+tnumber:'0'+tnumber;
    }
};

module.exports = new Shelfup();