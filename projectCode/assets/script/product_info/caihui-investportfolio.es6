const $ = require("lib/jquery.js");
const httpreq = require('httpreq.es6');
const utils = require('utils');
require('lib/bootstrap-table.js');

class productInfoClass extends uu.Component{
    
    properties(){
        return {
            StockPortfolioWrap: {
                defaultValue: null,
                type: uu.Dom
            },
            BondPortfolioWrap: {
                defaultValue: null,
                type: uu.Dom
            },
            BondInfoWrap: {
                defaultValue: null,
                type: uu.Dom
            }
        };
    }
    
    onLoad(){
        const gets = utils.url.get();
        this.prdCode = gets.prdCode;
        this.serachDate = '';
        this.getFindDate();
        this.bindEvent();
    }
    
    bindEvent(){
        const self = this;
        $('#finddates').on('change', function () {
            this.serachDate = $(this).val();
            self.getData();
        });
    }
    
    //获取日期
    getFindDate(){
        const url = httpreq.PS_FindDates;
        utils.xhr.post(url, { prdCode: this.prdCode }, (res) => {
            const select = $('#finddates');
            for (let i = 0; i < res.data.length; i++) {
                let date = res.data[i];
                select.append(`<option>${date.reportDateString}</option>`);
            }
            if (res.data.length) {
                this.serachDate = res.data[0].reportDateString;
                this.getData();
            } else {
                this.showEmpty();
            }
        },(res) => {
            this.showEmpty();
        })
    }
    
    showEmpty(){
        this.renderStockPortfolio([]);
        this.renderBondPortfolio([]);
        this.renderBondInfo([]);
    }
    
    //从服务器获取数据
    getData(){
        utils.xhr.post(httpreq.PS_Caihui_Investportfolio, {
            prdCode: this.prdCode,
            date: this.serachDate
        }, (res) => {
            this.renderStockPortfolio(res.data.StockPortfolio);
            this.renderBondPortfolio(res.data.BondPortfolio);
            this.renderBondInfo(res.data.BondInfo);
        })
    }
    
    //股票投资组合
    renderStockPortfolio(_data){
        $(this.StockPortfolioWrap).bootstrapTable({
            data: _data,
            pagination: false,
            columns: [
                {
                    title: '序号',
                    field: '',
                    align: 'center', valign: 'middle',
                    formatter: function(value, row, index){
                        return index+1;
                    }
                },
                {
                    title: '证券代码',
                    field: 'securityCode',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '证券简称',
                    field: 'securityName',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '市值(万元)',
                    field: 'marketValue',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '占基金净值比(%)',
                    field: 'navRatio',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '持股数',
                    field: 'shareHolding',
                    align: 'center', valign: 'middle'
                } 
            ]
        });
    }
    
    //债券投资组合
    renderBondPortfolio(_data){
        $(this.BondPortfolioWrap).bootstrapTable({
            data: _data,
            pagination: false,
            columns: [
                {
                    title: '序号',
                    field: '',
                    align: 'center', valign: 'middle',
                    formatter: function(value, row, index){
                        return index+1;
                    }
                },
                {
                    title: '证券代码',
                    field: 'bondTradeCode',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '证券简称',
                    field: 'bondName',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '市值(万元)',
                    field: 'marketValue',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '占基金净值比(%)',
                    field: 'navRatio',
                    align: 'center', valign: 'middle'
                } 
            ]
        });

    }
    
    //债券分类明细
    renderBondInfo(_data){
        //重新整理数据
        const ret = [];
        if( _data ){
            const d = _data;
            //国债
            ret.push({name:'国债', value:d.treasuryMarketValue, nav:d.treasuryNAVRatio});
            //央行票据
            ret.push({name:'央行票据', value:d.convertibleMarketValue, nav:d.convertibleNAVRatio});
            //可转换债券
            ret.push({name:'可转换债券', value:d.centralBankBillMarketValue, nav:d.centralBankBillNAVRatio});
            //企业债
            ret.push({name:'企业债', value:d.corporateBondMarketValue, nav:d.corporateBondNAVRatio});
            //金融债
            ret.push({name:'金融债', value:d.finacialBondMarketValue, nav:d.finacialBondNAVRatio});
            //其他债券
            ret.push({name:'其他债券', value:d.otherBondsMarketValue, nav:d.otherBondsNAVRatio});
        }
        //输出表格
        $(this.BondInfoWrap).bootstrapTable({
            data: ret,
            pagination: false,
            columns: [
                {
                    title: '序号',
                    field: '',
                    align: 'center', valign: 'middle',
                    formatter: function(value, row, index){
                        return index+1;
                    }
                },
                {
                    title: '债券类别简称',
                    field: 'name',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '市值(万元)',
                    field: 'value',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '占基金净值比(%)',
                    field: 'nav',
                    align: 'center', valign: 'middle'
                } 
            ]
        });
    }
};

module.exports = productInfoClass;


