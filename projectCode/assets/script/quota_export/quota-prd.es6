/**产品数据**/
const $ = require('lib/jquery.js');
const httpreq = require('httpreq.es6');
const utils = require('utils');
class QuotaPrd extends uu.Component {
    onLoad() {
        this.getPrdDate();              
    }
    getPrdDate() {
        //查找产品信息   
        //  $.post(httpreq.Quotaprd, (res) => {
        //     if (res.code === '000000') {
        //         this.prd_data = res.data || [];
        //         this.creatPrdList(); 
        //     } else {
        //        this.prd_data = [];                                                       
        //        this.creatPrdList(); 
        //     }
        // })               
       utils.xhr.post(httpreq.Quotaprd, {},(res) => {//成功之后的回调函数        
                this.prd_data = res.data || []; 
                this.creatPrdList();        
        })
    }
    
    //产品的下拉列表
    creatPrdList() {
        let prd = $('#bco-sel01');
        prd.innerHTML = ' ';  //设为空用什么用呢?
        if (this.prd_data.length > 0) { 
            for (let index = 0; index < this.prd_data.length; index++) {
                let element = this.prd_data[index];           
                $('#bco-sel01').append(`<option value='${element.code}'>${element.name}</option>`);
            }
        }
    }
};
module.exports = QuotaPrd;
