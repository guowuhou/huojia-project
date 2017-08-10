const $ = require("lib/jquery.js");
const httpreq = require('httpreq.es6');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const utils = require('utils');

class tagDept extends uu.Component {
    properties() {
        return {
            sel_prd: {
                defaultValue: null,
                type: uu.Dom
            },
            sel_dep: {
                defaultValue: null,
                type: uu.Dom
            }
        }
    }

    onLoad() {
        this.findALLProducts();
        this.findALLDepts();
    }
    findALLProducts() {
        var deptCode = $(this.sel_dep).val();
        utils.xhr.post(httpreq.findAllProduct, {deptCode:""},(res) => {
            var prd_data = res.data.list || [];
            this.createProductClassification(prd_data);
        });
    }
    findALLDepts() {
        utils.xhr.post(httpreq.findAllDept,{ddType:32}, (res, event) => {
            var dep_data = res.data.dataList || [];
            this.getDept(dep_data);
        });
    }
    createProductClassification(_data) {
        $(this.sel_prd).innerHTML = '';
        if (_data.length > 0) {
            for (let i = 0; i < _data.length; i++) {
                // productClassificationCode  productClassification
                $(this.sel_prd).append(
                    `<option value=${_data[i].code}>${_data[i].name}</option>`);
            }
        }
    }
    getDept(_data) {
        $(this.sel_dep).innerHTML = '';
        if (_data.length > 0) {
           for (let i = 0; i < _data.length; i++) {
                $(this.sel_dep).append(
                    `<option value=${_data[i].deptNo}>${_data[i].deptName}</option>`);
            }
        }
    }

    getSelectValues() {
        var tableParams = { deptCode: $(this.sel_dep).val(),
             productClassificationCode: $(this.sel_prd).val(),
             status: $("#status").val() };
        return tableParams;
    }

    getSelectDom() {
        var sel_dom = {
            sel_prd: $(this.sel_prd),
            sel_dep: $(this.sel_dep)
        };
        return sel_dom;
    }
    _Validation(str) {
        str = /\s/.test(str) ? str.replace(/\s/g, ""):str;//去掉全部空格
        var reg  = /^[\u4E00-\u9FA5][\u4E00-\u9FA50-9a-zA-Z\-\_\.\）\（\)\(]{0,8}[\）\)\u4E00-\u9FA50-9a-zA-Z]$/;
        if (!reg.test(str)) {
            Dialog.alert("必须以中文开头，可以包含-_.且不能以此结尾长度为2-10位以内的字符串");
            return false;
        } else {
            return true;
        };
    }
}

module.exports = tagDept;