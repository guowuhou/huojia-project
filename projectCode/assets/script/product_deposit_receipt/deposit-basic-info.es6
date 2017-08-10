const $ = require("lib/jquery.js");
const _ = require("lib/underscore.js");
const artTemplate = require("lib/artTemplate.js");
const httpreq = require('httpreq.es6');
const urlMethod = require('utils/url.es6');
const moment = require('lib/moment.js');
const keyMap = require('./keyMap/basicInfo-map.js');
const Dialog = require("plugins/dialog.es6");
const utils=require('utils');

class productInfoClass extends uu.Component {

    onLoad() {
        this.productId = urlMethod.get()['productId'];
        this.render = artTemplate.compile( require("tpl/deposit-basic-info.tpl") );
        this.getProductInfoData();
    }

    //获取产品信息
    getProductInfoData() {
       utils.xhr.post( httpreq.getDepositDetail, {
                productId: this.productId
            }, (res) => {
                   this._data = res.data;   //this.getPrdStatus(res.data);
                   this.renderProductInfo();
            },(res) => {
                   alert('服务器忙!');
            }
        );
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
                case 'qixian':
                    if(val.charAt(val.length-1)=='M'){
                        return `${val.charAt(0)}个月`;
                    }else if(val.charAt(val.length-1)=='Y'){
                        return `${val.charAt(0)}年`; //可能还有周
                    } 
                case 'money':
                    var list=val.split('E+');
                    if(list.length==2){
                        return  list[0]*(Math.pow(10,list[1]));
                    }
                    return val;
                default:
                    return val;
            }
        };
        var _baseinfoMap=keyMap.baseinfo;
        if(this._data.productType=="发售"){
            _baseinfoMap=_.filter(keyMap.baseinfo,(i)=>{
                return i.type!="zhuanrang";
            });
        }
        if(this._data.rateType=="固定利率"){
            _baseinfoMap=_.filter(_baseinfoMap,(i)=>{
                return i.type!="fudong";
            });
        }
        const html = this.render({
            valueFormar: valueFormar,
            //1,基本信息
            baseinfo: this._data,
            baseinfoList: _baseinfoMap
        });
        $(this.node.dom).find("#tableContainer").append(html);
        //更新时间
        const updateTime = this._data.updateTime;
        const updateTimeStr = '更新时间：' + moment(updateTime).format('YYYY-MM-DD HH:mm');
        $('*[updateTime]').text(updateTimeStr);
    }

    getPrdStatus(data){
       const statusMap0={
           "01":"新建",
           "02":"删除",
           "03":"复核中",
           "04":"复核通过",
           "05":"募集中",
           "06":"募集结束",
           "07":"到期结清"
       };
       const statusMap1={
           "01":"转让中",
           "02":"已转让",
           "03":"已撤"
       };
       if(data.productType=="0"){
           data.statusName=statusMap0[data.status];
           data.productTypeName="发售";
       }
       if(data.productType=="1"){
           data.statusName=statusMap1[data.status];
           data.productTypeName="转让";
       }
       return data;
    }
};
module.exports = productInfoClass;

