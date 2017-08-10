const $ = require('lib/jquery.js');
const utilsString = require('utils/string.es6');
const utils = require('utils');
class TreeGridClass extends uu.Component {

    // init
    onLoad() {
        const self = this;
        this.name = false;
        const btn = $(this.node.dom).find('button[confirm]');
        //输入名字
        $(this.node.dom).on('keyup', 'input', function () {
            const val = utilsString.trim($(this).val());
            if (val.length >= 2) {
                btn.removeAttr('disabled');
                self.name = val;
            }
            else {
                btn.attr('disabled', 'disabled');
                self.name = false;
            }
        });
        //点击确定
        $(this.node.dom).on('click', 'button[confirm]', function () {
            if ($(this).attr('disabled') || !self.name) {
                return;
            }
            self.callback(self.name);
            $(self.node.dom).modal('hide');
        });
    }

    show(callback, defaultName = '', title = "请输入分类名称") {
        this.callback = callback;
        const inputUI = $(this.node.dom).find('input');
        const titleUI = $(this.node.dom).find('*[type-title-string]');
        const btn = $(this.node.dom).find('button[confirm]');
        inputUI.val(defaultName);
        titleUI.text(title);
        btn.attr('disabled', 'disabled');
        $(this.node.dom).modal();
    }

};

module.exports = TreeGridClass;