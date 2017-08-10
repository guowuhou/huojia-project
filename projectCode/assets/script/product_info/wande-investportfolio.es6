const $ = require("lib/jquery.js");
const httpreq = require('httpreq.es6');
const utils = require('utils');
require('lib/bootstrap-table.js');

class productInfoClass extends uu.Component{
    
    properties(){
        return {
            propertyconfigure: {
                defaultValue: null,
                type: uu.Dom
            },
            sharesinvestgroup: {
                defaultValue: null,
                type: uu.Dom
            },
            tradeinvestgroup: {
                defaultValue: null,
                type: uu.Dom
            },
            bondinvestgroup: {
                defaultValue: null,
                type: uu.Dom
            },
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
        this.rendertrade([]);
        this.renderbond([]);
    }
    
    //从服务器获取数据
    getData(){
        utils.xhr.post(httpreq.PS_Caihui_Investportfolio, {
            prdCode: this.prdCode,
            date: this.serachDate
        }, (res) => {
            this.renderStockPortfolio(res.data.StockPortfolio);
            this.renderBondPortfolio(res.data.BondPortfolio);
            this.rendertrade(res.data.BondPortfolio);
            this.renderbond(res.data.BondPortfolio);
        })
    }
    
    //资产配置
    renderStockPortfolio(_data){
        $(this.propertyconfigure).bootstrapTable({
            data: _data,
            pagination: false,
            columns: [
                {
                    title: '项目',
                    field: 'securityCode',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '市值（元）',
                    field: 'securityName',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '占资金净值比例(%)',
                    field: 'marketValue',
                    align: 'center', valign: 'middle'
                }
            ]
        });
    }
    
    //股票投资组合
    renderBondPortfolio(_data){
        $(this.sharesinvestgroup).bootstrapTable({
            data: _data,
            pagination: false,
            columns: [
                // {
                //     title: '公告日期',
                //     field: '',
                //     align: 'center', valign: 'middle',
                //     formatter: function(value, row, index){
                //         return index+1;
                //     }
                // },
                {
                    title: '公告日期',
                    field: 'bondTradeCode',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '证券代码',
                    field: 'bondName',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '证券简称',
                    field: 'marketValue',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '货币代码',
                    field: 'navRatio',
                    align: 'center', valign: 'middle'
                },
                 {
                    title: '市值（元）',
                    field: 'bondTradeCode',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '占基金净值比（％）',
                    field: 'bondName',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '持股数',
                    field: 'marketValue',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '占股票市值比例',
                    field: 'navRatio',
                    align: 'center', valign: 'middle'
                },
            ]
        });

    }
    //行业投资组合
    rendertrade(_data){
        $(this.tradeinvestgroup).bootstrapTable({
            data: _data,
            pagination: false,
            columns: [
                {
                    title: '行业编号',
                    field: 'bondTradeCode',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '行业名称',
                    field: 'bondName',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '持有行业市值（元）',
                    field: 'marketValue',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '占净资金比（％）',
                    field: 'navRatio',
                    align: 'center', valign: 'middle'
                }
            ]
        });
    }
    //债券投资组合
    renderbond(_data){
         $(this.bondinvestgroup).bootstrapTable({
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
                    title: '债券名称',
                    field: 'bondTradeCode',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '市值（元）',
                    field: 'bondName',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '持有债券市值（元）',
                    field: 'marketValue',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '占基金净值比（％）',
                    field: 'navRatio',
                    align: 'center', valign: 'middle'
                }
            ]
        });
    }
  
};

module.exports = productInfoClass;


