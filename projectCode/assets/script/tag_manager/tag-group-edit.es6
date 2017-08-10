const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
const TagSelector = require('plugins/tag-selector.es6');
const httpreq = require('httpreq.es6');
const utils = require('utils');
require('lib/bootstrap-table.js');


class TagGroupEdit extends uu.Component {

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
        this.flag = utils.url.get()['check'];
        this.bindEvent();
        this.getTagGroupData();
    }
    
    getTagGroupData(){
        const url = httpreq.TagGroup_GetByTagCode;
        utils.xhr.post(url, {tagCode: this.tagCode}, (res)=>{
            var isProductMap={
                "0":'否',
                "1":'是',
            };
            if(this.flag != 'undefined'){
                $("textarea").attr('disabled',true);
                $("select").attr('disabled',true);
                $("textarea").attr('disabled',true);
                $(this.btnAdd).hide();
                $(this.btnDel).hide();
                $(this.saveBtn).hide();
            };
            var statusMap = {"0":"失效","1":"有效"};
            $('*[tagCode]').text(res.data.tagCode);
            $('*[status]').val(res.data.status);
            $('*[tagCodeName]').text(res.data.name);
            $('*[dept]').text(res.data.dept);
            $('*[remark]').text(res.data.remark);
            $('*[isprdSeries]').text(isProductMap[res.data.isProduct]);
            this.tagGroupData = res.data;
            this.initTable();
        })
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
        var self =this;
        var existlist =$(this.gridWrap).bootstrapTable('getData');
        TagSelector.show({
            type: 'tag',
            typechange: false,
            btnLabel: '添加'
        }, (list) => {
            if(existlist.length>0){
                 for(var j=0;j<existlist.length;j++){
                  for(var i=0;i<list.length;i++){
                    if(list[i].tagCode==existlist[j].tagCode){
                        Dialog.alert('添加的标签'+`${list[i].tagCode}`+'重复了');
                        list.splice(i,1);
                    }
                  };
             };
            }
            $(self.gridWrap).bootstrapTable('append', list);
        });
    }
    onDelTag() {
        const list = $(this.gridWrap).bootstrapTable('getAllSelections');
        const ids = utils.array.pick(list, 'tagCode');
        $(this.gridWrap).bootstrapTable('remove', { field: 'tagCode', values: ids });
    }
    
    onSave(){
        const list = $(this.gridWrap).bootstrapTable('getData');
        var tagList = "";
        for (let i = 0; i < list.length; i++) {
            if(i<list.length-1){
                tagList += list[i].tagCode + ",";
            }else{
                tagList += list[i].tagCode
            }
        }
        const url = httpreq.TagGroup_Update;
        utils.xhr.post(url, {
            tagCode: this.tagCode,
            status:$('*[status]').val(),
            remark: $('*[remark]').val(),
            tagList: tagList
        }, (res)=>{
            Dialog.alert('保存成功!');
        })
    }

    initTable() {
        $(this.gridWrap).bootstrapTable({
            data: this.tagGroupData.tagChildren,
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

module.exports = TagGroupEdit;