const ejs = require('lib/ejs.js');
const $ = require('lib/jquery.js');
const httpreq = require('httpreq.es6');
const tsHTML = require('tpl/type-selector.tpl');

//为了兼容IE，不使用ES6的class
const TypeSelector = function(){
    this.id = 'type-selector-' + Math.ceil(Math.random()*100000);
    this.callback = function(){};
    this.bindEvent();
};

TypeSelector.prototype = {
    
    //显示选择UI框
    show: function(options, callback){
        
        this.minLevel = 4;   
        this.clId = null;
        this.returnFinalTemplate = false;
     
        for(let v in options){
            this[v] = options[v];
        }

        this.getDataFromServer((data)=>{
            this._data = data;
            //生成level1数据
            const dataLevel1 = this.getDataLevel1(data);
            //编辑模板
            const html = new ejs({text:tsHTML}).render({
                id: this.id,
                dataLevel1: dataLevel1
            });
            $('body').append(html);
            $(`#${this.id}`).modal({});
            //domcache
            this.okBtn = $(`#${this.id}`).find(`button[callbackbtn="${this.id}"]`);
            this.roleError = $(`#${this.id}`).find(`*[role="error"]`);
            this.roleMsg = $(`#${this.id}`).find(`*[role="alert"]`);
        });
        
        const data = [
            {clName:"111", clId:1, pClId: 0}
        ];
        
        //回调注册
        if( callback && typeof callback == 'function' ){
            this.callback = callback;
        }
    },
    
    //从服务器获取数据
    getDataFromServer(callback){
        const url = httpreq.PS_GetProductType;
        $.post(url, {productType:1}, (data, event) => {
            if (data.code == '0') {
                callback( data.data );
            }
            else {
                alert(data.msg);
            }
        });
    },
    
    //获取顶层
    getDataLevel1(data){
        const ret = [];
        for(let i=0; i<data.length; i++){
            const d = data[i];
            if( !d.pClId || !d.pClId.length ){
                ret.push(d);
            }
        }
        return ret;
    },
    
    //根据pClId获取数据
    getDataBypClId(id){
        const ret = [];
        const data = this._data;
        for(let i=0; i<data.length; i++){
            const d = data[i];
            if( d.pClId == id ){
                ret.push(d);
            }
        }
        return ret;
    },
    
    //获取直接模板的id
    getReturnTemplate(){
        const list = this.getDataBypClId(this.clId);
        if( list && list.length ){
            this.clId = list[0].clId;
        }
        else{
            this.roleError.show().text('该分类下没有找到子模板数据');
            this.okBtn.attr('disabled', 'disabled');
        }
    },
    
    // 显示层级数据
    renderLevel(id, level){
        // 获取数据
        const data = this.getDataBypClId(id);
        // 渲染
        const wrapSelect = $(`#${this.id}`).find(`select[level="${level+1}"]`);
        wrapSelect.html('');
        for(let i = 0; i < data.length; i++){
            const d2 = data[i];
            wrapSelect.append( `<option value="${d2.clId}">${d2.clName}</option>` );
        }
        // 清空其他的
        for(let i=level+2; i<=4; i++){
            const s = $(`#${this.id}`).find(`select[level="${i}"]`);
            s.html('');
        }
    },
    
    //事件代理
    bindEvent: function(){
        const self = this;
        //确认按钮 
        $('body').on('click', `#${this.id} button[callbackbtn="${this.id}"]`, ()=>{
            this.onClickOk();
        });
        //点击select
        $('body').on('click', `#${this.id} select`, function(){
            const val = $(this).val();
            if( !val ){
                return;
            }
            $(this).val(val[0]);
        });
        //层级点击
        $('body').on('click', `#${this.id} select[level]`, function(){
            const valarr = $(this).val();
            if( !valarr ){
                return;
            }
            self.roleError.hide();
            const val = valarr[0];
            const level = parseInt( $(this).attr('level'), 10);
            if( level < 4 ){
                //显示下一级
                self.renderLevel(val, level);
            }
            //按钮设置
            const okBtn = self.okBtn;
            if( level >= self.minLevel ){
                okBtn.removeAttr('disabled');
                self.clId = val;
                if( level == 4 && self.returnFinalTemplate ){
                    self.getReturnTemplate();
                }
            }
            else{
                okBtn.attr('disabled', 'disabled');
            }
            //显示内容
            const strArr = [];
            for(let i=1; i <= 4 ; i++){
                const s = $(`#${self.id}`).find(`select[level="${i}"]`);
                const v = s.val();
                if( v && v[0] ){
                    const txt = s.find(`option[value="${v[0]}"]`).text();
                    strArr.push(txt);
                }
            }
            const str = self._str = strArr.join(' > ');
            self.roleMsg.text(`您现在选择的是: ${str}`);
        });
    },
    
    //点击确认按钮
    onClickOk: function(){
        this.callback(this.clId, this._str);
        $(`#${this.id}`).modal('hide');
    }
    
};


module.exports = new TypeSelector();