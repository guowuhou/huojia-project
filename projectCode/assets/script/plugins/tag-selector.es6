const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
require('lib/bootstrap-table.js');
require('css/tag-selector.css');
const httpreq = require('httpreq.es6');
const utils = require('utils');

/**
 * 用法:
 * const TagSelector = require(此文件);
 * 
 * TagSelector.show({
 *      type: 'tag'//设置默认展示的标签类型，可选项tag, group
 *      typechange: true //设置是否可以改变标签类型，默认true，可选false
 *      btnLabel: '添加' //设置按钮的文字，默认【添加】
 *      singleSelect: false //设置是否强制单选，默认false，
 *      isProduct：1 //设置查询的是否是产品系列，默认为1
 *      productClassificationCode:***   //传入产品类型
 *      canalsCode:***   //传入渠道号
 * }, (list)=>{
 *      //TODO
 * });
 */

class TagSelector {

    constructor() {
        this.bindEvent();
    }

    bindEvent() {
        const self = this;
        $('body').on('change', 'select[tagtype]', function () {
            const val = $(this).val();
            self.options.type = val;
            self.showTable();
        });;
        $('body').on('click', '*[tagsearchbtn]', () => {
            const val = $('*[tagsearchfield]').val();
            this.name = val;
            this.showTable();
        })
    }

    initHtml() {
        const options = this.options;
        //标签/组合标签
        const $type = this.romateHtml.find('select[tagtype]');
        $type.val(options.type);
        if (options.typechange === false) {
            $type.attr('disabled', 'disabled');
        } else {
            $type.removeAttr('disabled');
        }
    }

    show(options = {}, callback = null) {
        this.name = '';
        this.table = null;
        this.romateHtml = $(require('./tag-selector.tpl'));
        this.options = options;
        this.isProduct = (options.isProduct === undefined ? 1 : options.isProduct);
        this.productClassificationCode = (options.productClassificationCode == undefined) ? "" : options.productClassificationCode;
        this.canalsCode = (options.canalsCode == undefined) ? "" : options.canalsCode;
        this.callback = callback;
        this.initHtml();
        this.showDialog();
    }

    showDialog() {
        const self = this;
        let showTitle;
        if(this.options.type=='tag'){
            showTitle='选择标签';
        }else{
            showTitle='选择系列';
        }
        Dialog.show({
            title: showTitle,
            nl2br: false,
            cssClass: 'ts-dialog',
            message: () => {
                return this.romateHtml;
            },
            onshown: () => {
                this.showTable();
            },
            buttons: [{
                label: (this.options.btnLabel || '添加'),
                cssClass: 'btn-primary',
                action: (dialogRef) => {
                    const list = this.table.bootstrapTable('getAllSelections');
                    this.callback && this.callback(list);
                    dialogRef.close();
                }
            }]
        });
    }

    showTable() {
        //数据
        const url = (this.options.type == 'tag' ? httpreq.Tag_AllPages : httpreq.TagGroup_AllPages);
        const table = this.table = $('#tag-selector-table');
        //整理
        var columns = [];
        if (this.options.type == 'tag') {
            columns = [{
                title: '',
                field: '',
                align: 'center',
                valign: 'middle',
                checkbox: true
            }, {
                title: '标签名称',
                field: 'name',
                align: 'center',
                valign: 'middle'
            }, {
                title: '标签分类',
                field: 'classification',
                align: 'center',
                valign: 'middle'
            }, {
                title: '所属部门',
                field: 'dept',
                align: 'center',
                valign: 'middle'
            }, {
                title: '产品分类',
                field: 'productClassification',
                align: 'center',
                valign: 'middle'
            }];
        } else if (this.options.type == 'group') {
            columns = [{
                title: '',
                field: '',
                align: 'center',
                valign: 'middle',
                checkbox: true
            }, {
                title: '组合标签名称',
                field: 'name',
                align: 'center',
                valign: 'middle'
            }, {
                title: '所属部门',
                field: 'dept',
                align: 'center',
                valign: 'middle'
            }, {
                title: '所含标签',
                field: 'tagChildren',
                align: 'center',
                valign: 'middle',
                formatter: function (value, row, index) {
                    return utils.array.pick(value || [], 'name').join(', ');
                }
            }];
        } else {
            console.error('标签类型错误!');
            return false;
        }
        //容器
        try {
            table.bootstrapTable('destroy');
        } catch (err) {
            //TODO
        }
        //展示表格
        table.bootstrapTable({
            url: url,
            pagination: true,
            pageList: [5, 10, 25, 50, 100],
            pageSize: 5,
            pageNumber: 1,
            singleSelect: (this.options.singleSelect === true ? true : false),
            queryParams: (params) => {
                return {
                    // productClassificationCode: this.productClassificationCode,
                    isProduct: this.isProduct,
                    pageSize: params.limit,
                    pageNo: (params.offset / params.limit) + 1,
                    name: this.name,
                    type: this.options.type == 'tag' ? 1 : 2,
                    canalsCode:this.canalsCode
                };
            },
            responseHandler: (res) => {
                if (res.code == "000000") {
                    return {
                        rows: res.data.list,
                        total: res.data.count
                    };
                } 
                else if(res.responseCode=="683310"||res.responseCode=="900106"){
                    Dialog.alert(res.responseMsg||res.msg,()=>{
                        window.top.location.href="http://brop.pab.com.cn/portal/login.html";
                    });
                }
                else {
                    Dialog.alert(res.msg);
                    return {};
                }
            },
            uniqueId: 'tagCode',
            columns: columns
        });
    }

};

module.exports = new TagSelector();