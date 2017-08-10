require('./deps.js');
const $ = require('lib/jquery.js');
const typeSelector = require('plugins/type-selector.es6');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const utils = require('utils');
class TreeGridClass extends uu.Component {
    // show properties in Editor, you can use this.xxx directly
    properties() {
        return {
            modalTypeName: {
                defaultValue: null,
                type: uu.Node
            }
        };
    }
    // init
    onLoad() {
        this.expandedRows = [];
        this.renderTreeGrid();
        this.bindEvent();
    }
    // all other nodes and components is ready
    start() {
        this.comModalTypeName = this.modalTypeName.getComponent('modal-type-name.es6');
    }

    bindEvent() {
        const self = this;
        const wrap = $(this.node.dom);
        $(this.node.dom).on('click', 'button[uid]', function () {
            const uid = $(this).attr('uid');
            const do1 = $(this).attr('do');
            const row = wrap.jqxTreeGrid('getRow', uid);
            switch (do1) {
                case 'addType':
                    self.addType(row);
                    break;
                case 'delType':
                    self.delType(row);
                    break;
                case 'editType':
                    self.editType(row);
                    break;
                case 'editTpl':
                    location.href = `edit-template.html?tpClId=${row.clId}`;
                    break;
                case 'move1':
                    self.moveType(row, 1);
                    break;
                case 'move2':
                    self.moveType(row, 2);
                    break;
                case 'move3':
                    self.moveType(row, 3);
                    break;
                case 'move4':
                    self.moveType(row, 4);
                    break;
                default:
            }

        });
    }

    //获取所有打开的clId列表
    getAllExpandedRows(list) {
        const wrap = $(this.node.dom);
        list = list || wrap.jqxTreeGrid('getRows');
        var ret = [];
        for (let i = 0; i < list.length; i++) {
            let row = list[i];
            if (row.expanded) {
                ret.push(row.clId);//clName,clId
                if (row.records) {
                    ret = ret.concat(this.getAllExpandedRows(row.records));
                }
            }
        }
        return ret;
    }

    //移动分类
    moveType(row, operation) {
        const wrap = $(this.node.dom);
        this.expandedRows = this.getAllExpandedRows();
        //移动数据
        const url = httpreq.PS_MoveProductType;
        $.post(url, {
            clId: row.clId,
            pClId: row.pClId,
            level: row.level,
            operation: operation
        },
            (res, event) => {
                if (res.code == '0') {
                    this.dataAdapter.dataBind();
                }
                else {
                    alert(res.msg);
                }
            });
    }

    //增加分类
    addType(row) {
        const wrap = $(this.node.dom);
        const level = row.level || 0;
        const title = level < 3 ? '请输入分类名称' : '请输入子模板名称';
        this.comModalTypeName.show((name) => {
            const clName = name;
            const userId = 0;
            const level = (row.level === undefined) ? 0 : row.level + 1;
            const url = httpreq.PS_AddProductType;
            $.post(url, {
                clName: clName,
                userId: userId,
                pClId: row.clId,
                level: level,
                productType: 1
            },
                (res, event) => {
                    if (res.code == '0') {
                        wrap.jqxTreeGrid('expandRow', row.uid);
                        wrap.jqxTreeGrid('addRow', res.data.clId, {
                            clName: name,
                            pClId: row.clId,
                            clId: res.data.clId
                        }, 'last', row.uid);
                    }
                    else {
                        alert(res.msg);
                    }
                });
        }, '', title);
    }

    //编辑名字
    editType(row) {
        const wrap = $(this.node.dom);
        const level = row.level || 0;
        const title = level <= 3 ? '请输入分类名称' : '请输入子模板名称';
        this.comModalTypeName.show((name) => {
            row.clName = name;
            wrap.jqxTreeGrid('updateRow', row.uid, row);
            //提交后台
            const url = httpreq.PS_UpdateProductType;
            $.post(url, {
                clId: row.clId,
                clName: name
            });
        }, row.clName, title);
    }

    //删除分类
    delType(row) {
        if (row.records && row.records.length) {
            Dialog.alert('该分类下存在子类或子模板，无法删除!');
            return;
        }
        if (row.level >= 4) {
            Dialog.confirm({
                type: Dialog.TYPE_WARNING,
                title: '警告',
                message: '该子模板下存在定义字段和文件，确定要删除吗?',
                btnOKLabel: '确定',
                btnCancelLabel: '取消',
                callback: (result) => {
                    result && this._delType(row);
                }
            });
        }
        else {
            this._delType(row);
        }
    }

    _delType(row) {
        const wrap = $(this.node.dom);
        const url = httpreq.PS_RemoveProdutType;
        $.post(url, { clIds: row.clId }, (res) => {
            if (res.code == '0') {
                wrap.jqxTreeGrid('deleteRow', row.uid);
            }
            else {
                alert(res.msg);
            }
        });
    }

    //渲染输出
    renderTreeGrid() {
        const self = this;
        const wrap = $(this.node.dom);
        const source = {
            dataType: "json",
            dataFields: [
                { name: "clName", type: "string" },
                { name: "clId", type: "string" },
                { name: "pClId", type: "string" },
                { name: "createTime", type: "date" }
            ],

            hierarchy:
            {
                keyDataField: { name: 'clId' },
                parentDataField: { name: 'pClId' }
            },
            id: 'clId',
            url: `${httpreq.PS_GetProductType}?productType=1`
        };

        const dataAdapter = this.dataAdapter = new $.jqx.dataAdapter(source, {
            autoBind: true,
            beforeLoadComplete: function (data) {
                if (!(data instanceof Array)) {
                    data = [];
                }
                return data;
            },
            loadComplete: function () {
                setTimeout(function () {
                    for (let i = 0; i < self.expandedRows.length; i++) {
                        let clid = self.expandedRows[i];
                        wrap.jqxTreeGrid('expandRow', clid);
                    }
                }, 0);
            }
        });

        // create jqxTreeGrid.
        wrap.jqxTreeGrid({
            source: dataAdapter,
            width: '96%',
            pageSize: 999,
            columnsResize: false,
            editable: false,
            theme: 'bootstrap',
            ready: function () {
                setTimeout(function () {
                    const span = $(self.node.dom).find('span[id][style]');
                    span.remove();
                }, 100);
            },
            columns: [
                {
                    text: "分类名称", align: "center", dataField: "clName", cellsRenderer: function (row, column, value, rowData) {
                        let icon = '<span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>';
                        if (rowData.level > 3) {
                            icon = '<span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>';
                        }
                        return `${icon}&nbsp;&nbsp;${rowData.clName}`;
                    }
                },
                {
                    text: "移动", cellsAlign: "center", align: "center", width: 180, editable: false, cellsRenderer: function (row, column, value, rowData) {
                        return `
                    <button type="button" class="btn btn-default btn-xs" uid="${rowData.uid}" do="move1"><span class="glyphicon glyphicon-menu-up" aria-hidden="true"></span></button>
                    <button type="button" class="btn btn-default btn-xs" uid="${rowData.uid}" do="move3"><span class="glyphicon glyphicon-triangle-top" aria-hidden="true"></span></button>
                    <button type="button" class="btn btn-default btn-xs" uid="${rowData.uid}" do="move2"><span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span></button>
                    <button type="button" class="btn btn-default btn-xs" uid="${rowData.uid}" do="move4"><span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span></button>
                    `
                    }
                },
                { text: "创建时间", dataField: "createTime", cellsAlign: "center", align: "center", editable: false, cellsFormat: "yyyy-MM-dd", width: 160 },
                {
                    text: "操作", align: "center", cellsAlign: "center", width: 220, editable: false, cellsRenderer: function (row, column, value, rowData) {
                        const addType = rowData.level < 3 ? 'info' : 'primary';
                        const addStr = rowData.level < 3 ? '添加分类' : '添加子模板';
                        let addBtn = `<button type="button" class="btn btn-${addType} btn-xs" uid="${rowData.uid}" do="addType">${addStr}</button>`;
                        if (rowData.level == 3 && rowData.records && rowData.records.length) {
                            addBtn = '';
                        }
                        else if (rowData.level >= 4) {
                            addBtn = `<button type="button" class="btn btn-success btn-xs" uid="${rowData.uid}" do="editTpl">编辑子模板</button>`;
                        }
                        return `
                        <button type="button" class="btn btn-default btn-xs" uid="${rowData.uid}" do="editType">重命名</button>
                        <button type="button" class="btn btn-danger btn-xs" uid="${rowData.uid}" do="delType">删除</button>
                        ${addBtn}
                        `;
                    }
                }
            ]
        });

    }

};

module.exports = TreeGridClass;