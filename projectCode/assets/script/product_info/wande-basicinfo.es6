const $ = require("lib/jquery.js");
const artTemplate = require("lib/artTemplate.js");
const httpreq = require('httpreq.es6');
const urlMethod = require('utils/url.es6');
const moment = require('lib/moment.js');
const keyMap = require('./keyMap/wande-basicinfo.js');
const Dialog = require("plugins/dialog.es6");
const utils=require("utils");

class wandeBasicInfoClass extends uu.Component {
    
     onLoad() {
        this.wandeBasidInfoRender = artTemplate.compile( require("tpl/wande-basicinfo.tpl") );
        this.managerRender = artTemplate.compile( require("tpl/wande-manager.tpl") );
        this.getPrdCode();
    }
    start() {
        window.$ = $;
        //查询产品财汇信息
        this.queryWandeSummary();
        this.queryWandeFeedetail();
    }

    //获取产品代码
    getPrdCode() {
        this.pageType = 0;
        this.prdCode = "";
        if (utils.url.get()["prdCode"]) {
            this.pageType = 0;
            this.prdCode = utils.url.get()["prdCode"];
        }
    }
    // 查询万得财汇基本信息
    queryWandeSummary() {
        var self = this;
        let url = httpreq.PS_Caihui_Summary;
        let data = {
            prdCode: self.prdCode
        };
        utils.xhr.post(url, data, (res) => {
            self.showWandeInfo(res.data);
        },(res) => {
            Dialog.alert(res.msg || '此产品无更多信息!');
        });
    }

    // 查询产品财汇基金费率详情	
    queryWandeFeedetail() {
        var self = this;
        let url = httpreq.PS_Caihui_Feedetail;
        let data = {
            prdCode: self.prdCode
        };
        utils.xhr.post(url, data, (res) => {
            self.showWandeFeedetail(res.data.resultList);
        },(res) => {
            Dialog.alert(res.msg || '此产品无更多信息!');
        });
    }
    
    showWandeInfo(data){
        const caihuiBasicInfo = data.caihuiBasicInfo || "";
        //data.Portfolio = data.caihuiFundInvestmentPortfolio || "";
        const basidInfoTable = this.managerRender(caihuiBasicInfo);
        
        $(this.node.dom).find("#fundmanager").after(basidInfoTable);
        $(this.node.dom).find("#investObj").html(caihuiBasicInfo.investObj);
        $(this.node.dom).find("#investConcept").html(caihuiBasicInfo.investConcept);
        $(this.node.dom).find("#policydepend").html(caihuiBasicInfo.riskReturn);
        $(this.node.dom).find("#investRange").html(caihuiBasicInfo.investRange);
        //$(this.node.dom).find("#fundManager").html(caihuiBasicInfo.fundManager);
        $(this.node.dom).find("#updateTimeId").text("更新时间：" + moment(caihuiBasicInfo.updateDate).format('YYYY-MM-DD HH:mm'));
        
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
        const detailhtml = this.wandeBasidInfoRender({
            valueFormar: valueFormar,
            //1,基本信息
            baseinfo: data,
            baseinfoList: keyMap.baseinfo,
            //2,发行情况
            ctrlinfo: data,
            ctrlinfoList: keyMap.ctrlinfo,
            
        });
        $(this.node.dom).find("#basicInfoDiv").append(detailhtml);
        
    }
    showWandeFeedetail(data){
        var feedetailtableHtml = "";
        for (let i = 0; i < data.length; i++) {
            var item = '<tr><td>' + data[i].feeName + '</td><td>' + data[i].feeStartDateString + '</td><td>' + data[i].feeEndDateString + '</td><td>'+data[i].holdingPeriodString+'</td>';
                item+= '<td>' + data[i].feeName + '</td><td>' + data[i].holdingPeriodString + '</td><td>' + data[i].holdingPeriodString + '</td><td>' + data[i].holdingPeriodString+'</td>';
                item+='<td>' + data[i].feeName + '</td><td>' + data[i].holdingPeriodString + '</td><td>' + data[i].holdingPeriodString + '</td><td>' + data[i].holdingPeriodString +'</td>';
                item+= '<td>' + data[i].feeName+ '</td><td>' + data[i].holdingPeriodString + '</td></tr>';
            var $item = $(item); 
           
            var achieveItem = '<tr><td>' + data[i].feeName + '</td><td>' + data[i].feeStartDateString +'</td></tr>';
            var $achieveItem = $(achieveItem);
            
            var rangListItem= '<tr><td>' + data[i].feeName + '</td><td>' + data[i].feeStartDateString + '</td><td>' + data[i].feeEndDateString + '</td><td>'+data[i].holdingPeriodString+'</td>';
                rangListItem += '<td>' + data[i].feeName + '</td></tr>';
            var $rangListItem = $(rangListItem);
            
            var historyItem= '<tr><td>' + data[i].feeName +'</td><td>' + data[i].feeEndDateString + '</td><td>'+data[i].holdingPeriodString+'</td>';
                historyItem += '<td>' + data[i].amountString + '</td></tr>';
            var $historyItem = $(historyItem);
            //$item.find("#feeId").text(data[i].feeString);
            $(this.node.dom).find("#feeDetailTable tbody").append($item);
            $(this.node.dom).find("#fundachiexpress tbody").append($achieveItem);
            $(this.node.dom).find("#range tbody").append($rangListItem);
            $(this.node.dom).find("#incomehistory tbody").append($historyItem);
        };
    }
    
}
module.exports = wandeBasicInfoClass;