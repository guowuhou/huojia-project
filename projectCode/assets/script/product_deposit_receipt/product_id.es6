/**产品ID**/
const $ = require('lib/jquery.js');
const utils=require('utils');

class prdIdline extends uu.Component{
    onLoad(){
        this. productIdData();
    }
   productIdData(){
        if(utils.url.get()['backPage']=='1'){
           var prdIdDate=window.localStorage.getItem('productId');
           $("#productId").val(prdIdDate) ;
        }
    }
};
module.exports = prdIdline;