const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const utils=require("utils");
class productInputProxy extends uu.Component {
    properties() {
        return {
            proCode: {
                defaultValue: null,
                type: uu.Dom
            },
            riskLevel: {
                defaultValue: null,
                type: uu.Dom
            },
            fundType: {
                defaultValue: null,
                type: uu.Dom
            },
            fundNet: {
                defaultValue: null,
                type: uu.Dom
            },
            fundCompany: {
                defaultValue: null,
                type: uu.Dom
            },
            selPro: {
                defaultValue: null,
                type: uu.Dom
            },
            fundTable: {
                defaultValue: null,
                type: uu.Node
            },
            fundSearchBtn: {
                defaultValue: null,
                type: uu.Dom
            },
            clearConditionBtn: {
                defaultValue: null,
                type: uu.Dom
            }
        }
    }
    onLoad() {
        this._initFundType();
        this._initRiskLevel();
        this._initFundCompany();
        this.bindEvents();
    }
    bindEvents() {
        $(this.fundNet).on('change', (e) => {
            let val = $(e.target).val();
            val = val.replace(/[^\d.]/g, "");
            val = val.replace(/^\./g, "");
            val = val.replace(/\.{2,}/g, ".");
            val = val.replace(/\./, "$#$").replace(/\./g, "").replace("$#$", ".");
            val = val.replace(/\.\d{2,}$/, val.substr(val.indexOf("."), 3));
            $(e.target).val(val);
        });
        $(this.fundSearchBtn).on('click', _.bind(this._searchHandle, this));
        $(this.clearConditionBtn).on('click', _.bind(this._clearCondition, this));
    }
    _clearCondition() {
        $('#prdCode',this.node.dom).val('');
        $('#riskLevel',this.node.dom).val('ALL');
        $('#fundType',this.node.dom).val('ALL');
        $('#fundNet',this.node.dom).val('');
        $('#selPro',this.node.dom).val('ALL');
        $("#saleStatus2",this.node.dom).val('ALL')
        if (this.ms) {
            this.ms.clear();
            this.ms.setValue(['全部']);
        }
    }
    _searchHandle() {
            let prdCode = $('#prdCode',this.node.dom).val(); //产品代码
            let riskLevel = $('#riskLevel',this.node.dom).val(); //风险等级
            let fundType = $('#fundType',this.node.dom).val(); //基金类型
            let fundNet = $('#fundNet',this.node.dom).val(); //基金净值
            let saleStatus = $("#saleStatus2",this.node.dom).val(); //上架状态
            let fundCompany = '';
            let isSelected = $('#selPro',this.node.dom).val(); //精选产品
            let channelId = $("#channelId").val(); //上架状态
            var params = {
                type: '02', //产品类型
                riskLevel: riskLevel, //风险等级
                fundType: fundType, //基金类型
                isSelected: isSelected, //是否精选产品
                saleStatus: saleStatus, //上架状态
                channelId: channelId //接入渠道
            };
            if (this.ms) {
                let sel = this.ms.getSelection()[0]
                if (sel && sel.name !== '全部') {
                    fundCompany = this.ms.getSelection()[0].name; //基金公司
                }
            }
            (prdCode !== '') && (params['prdCode'] = prdCode);
            (fundNet !== '') && (params['fundNav'] = fundNet);
            (fundCompany !== '') && (params['fundCom'] = fundCompany);
            this.fundTable.getComponent('product-fund-table.es6').showTableList(params);
        }
        //风险等级列表-请求后台数据-展示
    _initRiskLevel() {
            // const url = httpreq.remove_from_selected_lib;
            // $.post(url, (res) => {
            //     //成功则刷新列表
            // });
            let list = [{
                proStatus: '1',
                proStatusName: '低风险'
            }, {
                proStatus: '2',
                proStatusName: '中低风险'
            }, {
                proStatus: '3',
                proStatusName: '中风险'
            }, {
                proStatus: '4',
                proStatusName: '中高风险'
            }, {
                proStatus: '5',
                proStatusName: '高风险'
            }]
            if (list.length > 0) {
                let html = '';
                let len = list.length;
                for (let i = 0; i < len; i++) {
                    if (list[i].proStatusName) {
                        html += `<option value=${list[i].proStatus}>${list[i].proStatusName}</option>`
                    }
                }
                $(this.riskLevel).append(html);
            }
        }
        //基金类型列表-请求后台数据-展示
    _initFundType() {
            let list = [{
                proArr: '1',
                proArrName: '股票型'
            }, {
                proArr: '2',
                proArrName: '混合型'
            }, {
                proArr: '3',
                proArrName: '债券型'
            }, {
                proArr: '4',
                proArrName: '货币型'
            }, {
                proArr: '5',
                proArrName: '保本型'
            }, {
                proArr: '6',
                proArrName: 'QDII'
            }, {
                proArr: '7',
                proArrName: '其他'
            }]
            if (list.length > 0) {
                let html = ''
                let len = list.length;
                for (let i = 0; i < len; i++) {
                    if (list[i].proArrName) {
                        html += `<option value=${list[i].proArr}>${list[i].proArrName}</option>`
                    }
                }
                $(this.fundType).append(html);
            }
        }
        //基金公司列表-请求后台数据-展示
    _initFundCompany() {
        const url = httpreq.qr_fund_company_list;
        let self = this;
        utils.xhr.post(url, {
            ddType: 3
        }, (res) => {
            let info = res.data,
                fundComName = [],
                list = {};
            for (let item in info) {
                // list[info[item].ddName] = info[item].ddCode;
                fundComName.push(info[item].ddName);
            }
            // self.fundComlist = list;
            fundComName.unshift('全部')
            self.ms = $(self.fundCompany).magicSuggest({
                data: fundComName,
                value: ['全部'],
                maxSelection: 1,
                resultAsString: true
            });
        });
    }
};
module.exports = productInputProxy