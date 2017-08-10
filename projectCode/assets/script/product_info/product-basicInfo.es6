const $ = require("lib/jquery.js");
const ejs = require("lib/ejs.js");
const httpreq = require('httpreq.es6');
const urlMethod = require('utils/url.es6');
const moment = require('lib/moment.js');
const keyMap = require('./keyMap/cn.js');
const Dialog = require("plugins/dialog.es6");

class productInfoClass extends uu.Component {

    onLoad() {
        let urlParams=urlMethod.get();
        this.prdCode = urlMethod.get()['prdCode'];
        if (urlParams["prdCode"]&&urlParams["type"]=="01") {
             $(".caihui").hide();
        }
        this.getProductInfoData();
    }

    //获取产品信息
    getProductInfoData() {
        $.ajax({
            url: httpreq.PS_QueryProductDetail,
            data: {
                prdCode: this.prdCode
            },
            type: "POST",
            dataType: "JSON",
            success: (res) => {
                if (res.code == '000000') {
                    this._data = res.data;
                    this.renderProductInfo();
                }
                else {
                    Dialog.alert(res.msg);
                }
            },
            error: () => {
                alert('服务器忙!');
            }
        });
    }

    //渲染输出
    renderProductInfo() {
        const tpl = require("tpl/product-basicinfo.tpl");
        const valueFormar = (d, map) => {
            const val = map[d.key];
            switch (d.type) {
                case 'date':
                    return moment(val).format(d.format);
                case 'time':
                    let s = ('00'+val).slice(-6, -2);
                    return s==0?"0":`${s[0]}${s[1]}:${s[2]}${s[3]}`;
                default:
                    return val;
            }
        };
        const html = new ejs({ text: tpl }).render({
            valueFormar: valueFormar,
            //1,基本信息
            baseinfo: this._data,
            baseinfoList: keyMap.baseinfo,
            //2,产品控制
            ctrlinfo: this._data,
            ctrlinfoList: keyMap.ctrlinfo,
            //9,额外信息
            additioninfo: this._data,
            additioninfoList: keyMap.additioninfo,
            //基金折扣率
            funddisconut:this._data.agioList||"",        
        });
        $(this.node.dom).find("#tableContainer").append(html);
        //更新时间
        const updateTime = this._data.updateTime;
        const updateTimeStr = '更新时间：' + moment(updateTime).format('YYYY-MM-DD HH:mm');
        $('*[updateTime]').text(updateTimeStr);
    }
};

module.exports = productInfoClass;


