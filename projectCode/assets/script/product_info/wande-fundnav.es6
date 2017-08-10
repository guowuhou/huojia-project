const $ = require("lib/jquery.js");
const httpreq = require('httpreq.es6');
const utils = require('utils');
require('lib/bootstrap-table.js');

class productInfoClass extends uu.Component{
    
    properties(){
        return {
            historyprofile: {
                defaultValue: null,
                type: uu.Dom
            }
        };
    }
    
    onLoad(){
        const gets = utils.url.get();
        this.prdCode = gets.prdCode;
        this.dateSource = '';
        this.bindEvent();
        this.getData();
    }
    
    bindEvent(){
        const self = this;
        $('#dataSource').on('change', function () {
            var dateSource = $('#dataSource').val();
            self.getData(dateSource);
        });
    }
    
    
    showEmpty(){
        this.renderStockPortfolio([]);
    }
    
    //从服务器获取数据
    getData(data){
        this.fundType='5';
        var realdata="";
        if(data=='1'){
           realdata='2016-09-30';
        }else{
           realdata='2016-08-30';
        }
        utils.xhr.post(httpreq.PS_Caihui_Investportfolio, {
            prdCode: this.prdCode,
            date:realdata,//realdata
        }, (res) => {
            this.renderStockPortfolio(res.data.StockPortfolio);
        })
    }
   
    renderStockPortfolio(_data){
        var realclumns=[];
        if(this.fundType=='4'){
            realclumns=[
                {
                    title: '公告日期',
                    field: 'bondTradeCode',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '起始日',
                    field: 'bondName',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '截止日',
                    field: 'marketValue',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '万分收益',
                    field: 'navRatio',
                    align: 'center', valign: 'middle'
                },
                 {
                    title: '七日年化收益率（%）',
                    field: 'bondTradeCode',
                    align: 'center', valign: 'middle'
                }
            ]
        }else{
             realclumns=[
                {
                    title: '公告日期',
                    field: 'bondTradeCode',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '截止日期',
                    field: 'bondName',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '单位净值',
                    field: 'marketValue',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '累计净值',
                    field: 'navRatio',
                    align: 'center', valign: 'middle'
                },
                 {
                    title: '累计分红',
                    field: 'bondTradeCode',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '复权因子',
                    field: 'marketValue',
                    align: 'center', valign: 'middle'
                },
                {
                    title: '货币代码',
                    field: 'navRatio',
                    align: 'center', valign: 'middle'
                },
                 {
                    title: '跌幅（%）',
                    field: 'bondTradeCode',
                    align: 'center', valign: 'middle'
                }
            ]
        };
        $(this.historyprofile).bootstrapTable('destroy');
        $(this.historyprofile).bootstrapTable({
            data: _data,
            pagination: false,
            columns: realclumns, 
        });

    }
  
};

module.exports = productInfoClass;


