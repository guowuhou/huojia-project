const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
const TagSelector = require('plugins/tag-selector.es6');
const httpreq = require('httpreq.es6');
const utils = require('utils');
require('lib/bootstrap-table.js');


class productSeriesEdit extends uu.Component {

    // show properties in Editor, you can use this.xxx directly
    properties() {
        return {
            btnAdd: {
                defaultValue: null,
                type: uu.Dom
            },
            btnDel: {
                defaultValue: null,
                type: uu.Dom
            },
            saveBtn: {
                defaultValue: null,
                type: uu.Dom
            },
            gridWrap: {
                defaultValue: null,
                type: uu.Dom
            }
        };

    }

    // init
    onLoad() {
        this.tagCode = utils.url.get()['tagCode'];
        this.bindEvent();
        this.getTagGroupData();
    }
    
    getTagGroupData(){
        // const url = httpreq.TagGroup_GetByTagCode;
        // utils.xhr.post(url, {tagCode: this.tagCode}, (res)=>{
        //     $('*[tagCode]').text(res.data.tagCode);
        //     $('*[tagCodeName]').text(res.data.name);
        //     $('*[dept]').text(res.data.dept);
        //     $('*[remark]').text(res.data.remark);
        //     this.tagGroupData = res.data;
        //     this.initTable();
        // })
        this.initTable();
    }

    bindEvent() {
        const self = this;
        //增加组合标签
        $(this.btnAdd).on('click', () => {
            this.onAddTag();
        });
        //删除按钮
        $(this.btnDel).on('click', () => {
            this.onDelTag();
        });
        //保存按钮
        $(this.saveBtn).on('click', ()=>{
            this.onSave();
        })
    }

    onAddTag() {
        TagSelector.show({
            type: 'tag',
            typechange: false,
            btnLabel: '添加'
        }, (list) => {
          const existList =$(this.gridWrap).bootstrapTable('getData');
          if(list.length>0){
              //var list1=[];
             for(var j=0;j<existList.length;j++){
                 //var flag=true;
                  for(var i=0;i<list.length;i++){
                    if(list[i].tagCode==existList[j].tagCode){
                        Dialog.alert('添加的标签'+`${existList[j].tagCode}`+'重复了');
                        return;
                    }
                  };
             };
          };
            $(this.gridWrap).bootstrapTable('append', list);
        });
    }

    onDelTag() {
        var selectList = $(this.gridWrap).bootstrapTable('getAllSelections');
        if(selectList.length <= 0) {
            Dialog.alert("请勾选要操作的标签");
            return;
        };
        var deleteList=$(this.gridWrap).bootstrapTable('getData');
        for (let i = 0, len1 = selectList.length; i < len1; i++) {
            for (let j = 0, len2 = deleteList.length; j < len2; j++) {
                if (selectList[i].tagCode == deleteList[j].tagCode) {
                    deleteList.splice(j, 1);
                    //j--;
                    len2--;
                }
            };
        }
        this.initTable(deleteList);
    }
    
    onSave(){
        const list = $(this.gridWrap).bootstrapTable('getData');
        const tagChildren = [];
        for (let i = 0; i < list.length; i++) {
            tagChildren.push({
                tagCode: list[i].tagCode
            });
        }
        const url = httpreq.TagGroup_Update;
        utils.xhr.post(url, {
            tagCode: this.tagCode,
            remark: $('*[remark]').val(),
            tagChildren: JSON.stringify(tagChildren)
        }, (res)=>{
            Dialog.alert('保存成功!');
        })
    }

    initTable(deleteList) {
        $(this.gridWrap).bootstrapTable('destroy');
        $(this.gridWrap).bootstrapTable({
            //data: this.tagGroupData.tagChildren,
            data:deleteList||[],
            pagination: false,
            uniqueId: 'tagCode',
            columns: [
                {
                    title: '',
                    field: '_isChecked',
                    align: 'center',
                    valign: 'middle',
                    checkbox: true
                },
                {
                    title: '标签名称',
                    field: 'name',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    title: '标签分类',
                    field: 'classification',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    title: '所属部门',
                    field: 'dept',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    title: '产品分类',
                    field: 'productClassification',
                    align: 'center',
                    valign: 'middle'
                }
            ]
        });
    }

};

module.exports = productSeriesEdit;