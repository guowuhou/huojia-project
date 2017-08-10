const $ = require("lib/jquery.js");
const artTemplate = require("lib/artTemplate.js");
const httpreq = require('httpreq.es6');
const urlMethod = require('utils/url.es6');
const moment = require('lib/moment.js');
const keyMap = require('./keyMap/bank-basicinfo.js');
const Dialog = require("plugins/dialog.es6");
const utils=require("utils");

class productInfoClass extends uu.Component {

    onLoad() {
        this.prdCode = urlMethod.get()['prdCode'];
        this.render = artTemplate.compile( require("tpl/bank-basicinfo.tpl") );
        this.getProductInfoData();
    }

    //获取产品信息
    getProductInfoData() {
        var data={
            prdCode: this.prdCode
        };
        utils.xhr.post(httpreq.PS_GetFinancialDetail,data,(res) => {
            this._data = res.data;
            this.renderProductInfo();
        });
    }

    //渲染输出
    renderProductInfo() {
        const valueFormar = (d, map) => {
            const val = map[d.key];
            if( !val || !val.length ){
                return '';
            }
            switch (d.type) {
                case 'date':
                    if(val.length==8){
                      return val.substring(0,4)+"-"+val.substring(4,6)+"-"+val.substring(6,8);
                    }else{
                      return moment(val).format(d.format);  
                    }
                case 'time':
                    let s = val;
                    return s == 0 ? "00:00" : `${s[0]}${s[1]}:${s[2]}${s[3]}`;
                case 'whether':
                    let y=val;
                    return y==1? `${'是'}`:`${'否'}`;
                default:
                    return val;
            }
        };
        const html = this.render({
            valueFormar: valueFormar,
            //1,基本信息
            baseinfo: this._data,
            baseinfoList: keyMap.baseinfo,
            //2,产品控制
            ctrlinfo: this._data,
            ctrlinfoList: keyMap.ctrlinfo,
            
        });
        $(this.node.dom).find("#tableContainer").append(html);
        //更新时间
        const updateTime = this._data.updateTime;
        const updateTimeStr = '更新时间：' + moment(updateTime).format('YYYY-MM-DD HH:mm');
        $('*[updateTime]').text(updateTimeStr);
    }

};
module.exports = productInfoClass;


