const $ = require("lib/jquery.js");
const httpreq = require('httpreq.es6');
const utils = require('utils');
const Dialog = require("plugins/dialog.es6");
require('lib/bootstrap-table.js');

class productInfoClass extends uu.Component {

    onLoad() {
        const gets = utils.url.get();
        this.prdCode = gets.prdCode;

        $('#table').bootstrapTable({
            url: httpreq.PS_Caihui_Fundnav,
            pagination: true,
            pageSize: 25,
            // pageList: [1,2,5,10,25],
            queryParams: (params) => {
                return {
                    prdCode: this.prdCode,
                    pageSize: params.limit,
                    pageNo: params.offset / params.limit + 1,
                    desc: true
                };
            },
            responseHandler: (res) => {
                if (res.code == "000000") {
                    return {
                        rows: res.data.resultList,
                        total: res.data.count
                    };
                } else if(res.responseCode=="683310"||res.responseCode=="900106"){
                    Dialog.alert(res.responseMsg||res.msg,()=>{
                        window.top.location.href="http://brop.pab.com.cn/portal/login.html";
                    });
                } else {
                    Dialog.alert(res.msg || res.responseMsg);
                    return {};
                }
            }
        });
    }
};

module.exports = productInfoClass;


