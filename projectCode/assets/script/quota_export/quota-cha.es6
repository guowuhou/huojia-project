const $ = require('lib/jquery.js');
const httpreq = require('httpreq.es6');
const utils = require('utils');
class Quatocha extends uu.Component {
    onLoad() {
        this.getPrdDate();            
    }
    getPrdDate() {
        utils.xhr.post(httpreq.Quotacha,{},(res)=>{
               this.prd_data = res.data || [];
                this.creatPrdList(); 
        })

    } 

    //渠道的下拉列表
    creatPrdList() {
        let prd = $('#bco-sel02');
        prd.innerHTML = ''; 
        if (this.prd_data.length > 0) { 
            for (let index = 0; index < this.prd_data.length; index++) {
                let element = this.prd_data[index];  
                $('#bco-sel02').append(`<option value="${element.code}">${element.name}</option>`);
            }
        }
    }
};
module.exports = Quatocha;