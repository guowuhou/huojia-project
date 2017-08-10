const $ = require("lib/jquery.js");
const artTemplate = require('lib/artTemplate.js');
const utils = require('utils');
const Dialog = require("plugins/dialog.es6");
const httpreq = require('httpreq.es6');
const moment = require('lib/moment.js');

class productCustomClass extends uu.Component {

    onLoad() {
        this.basidInfoTableRender = artTemplate.compile( require("tpl/caihui-basicinfo.tpl") );
        this.fundTableRender = artTemplate.compile( require("tpl/caihui-fundTable.tpl") );
        artTemplate.helper('Number', (data)=>{
            return Number(data);
        });
        this.getPrdCode();
    }

    start() {
        window.$ = $;
        //查询产品财汇信息
        this.queryCaihuiSummary();
        this.queryCaihuiFeedetail();
    }

    //获取产品代码
    getPrdCode() {
        this.pageType = 0;
        this.prdCode = "";
        this.tpClId = "";
        if (utils.url.get()["prdCode"]) {
            this.pageType = 0;
            this.prdCode = utils.url.get()["prdCode"];
        }
    }

    // 查询产品财汇基本信息
    queryCaihuiSummary() {
        var self = this;
        let url = httpreq.PS_Caihui_Summary;
        let data = {
            prdCode: self.prdCode
        };
        utils.xhr.post(url, data, (res) => {
            self.showCaihuiInfo(res.data);
        },(res) => {
            Dialog.alert(res.msg || '查询产品财汇基本信息失败!');
        });
    }

    // 查询产品财汇基金费率详情	
    queryCaihuiFeedetail() {
        var self = this;
        let url = httpreq.PS_Caihui_Feedetail;
        let data = {
            prdCode: self.prdCode
        };
        utils.xhr.post(url, data, (res) => {
            self.showCaihuiFeedetail(res.data.resultList);
        },(res) => {
            Dialog.alert(res.msg || '查询产品财汇基金费率详情失败!');
        });
    }

    showCaihuiInfo(data) {
        const caihuiBasicInfo = data.caihuiBasicInfo || "";
        data.Portfolio = data.caihuiFundInvestmentPortfolio || "";
        const basidInfoTable = this.basidInfoTableRender(caihuiBasicInfo);
        
        $(this.node.dom).find("#basicInfoDiv").after(basidInfoTable);
        $(this.node.dom).find("#prdNameId").text(caihuiBasicInfo.prdName);
        $(this.node.dom).find("#investObj").html(caihuiBasicInfo.investObj);
        $(this.node.dom).find("#investConcept").html(caihuiBasicInfo.investConcept);
        $(this.node.dom).find("#riskReturn").html(caihuiBasicInfo.riskReturn);
        $(this.node.dom).find("#investRange").html(caihuiBasicInfo.investRange);
        $(this.node.dom).find("#fundManager").html(caihuiBasicInfo.fundManager);
        $(this.node.dom).find("#updateTimeId").text("更新时间：" + moment(caihuiBasicInfo.updateDate).format('YYYY-MM-DD HH:mm'));
        
        var Portfolio=data.Portfolio;
        if(Portfolio){
             var otherTotal=Number(Portfolio.totalFundAsset)-(Number(Portfolio.stockAsset?Portfolio.stockAsset:0)+Number(Portfolio.currencyAsset?Portfolio.currencyAsset:0)+Number(Portfolio.bondAsset?Portfolio.bondAsset:0));
             data.Portfolio.otherTotal=otherTotal;
             const fundTable = this.fundTableRender(data);
             $(this.node.dom).find("#fundTableDiv").after(fundTable);
        }
       
    }

    showCaihuiFeedetail(data) {
        var feedetailtableHtml = "";
        for (let i = 0; i < data.length; i++) {
            if (i > 0 && data[i].feeName == data[i - 1].feeName) {
                data[i].feeName = "";
            }
            var item = '<tr><td>' + data[i].feeName + '</td><td>' + data[i].feeStartDateString + '</td><td>' + data[i].feeEndDateString + '</td><td id="feeId">';
            item += '</td><td>' + data[i].amountString + '</td><td>' + data[i].holdingPeriodString + '</td></tr>';
            var $item = $(item); $item.find("#feeId").text(data[i].feeString);
            $(this.node.dom).find("#feeDetailTable tbody").append($item);
        }
    }

};

module.exports = productCustomClass;




