/**信息完整**/
const $ = require('lib/jquery.js');

class InfoComplete extends uu.Component{
    onLoad(){
        this.getinforCompleteDate();
    }
    getinforCompleteDate(){
        this._data = [
            {key:'1',name:'完整'},
            {key:'0',name:'非完整'},
        ];
        this.createInformationList();
    }
    //构建 '信息完整' 下拉列表
    createInformationList(){
        $(this.node.dom).innerHTML='';
        if(this._data.length>0){
            for (let index = 0; index < this._data.length; index++) {
                let element =this._data[index];
                $(this.node.dom).append(`<option value=${element.key}>${element.name}</option>`);
            }
        }
    }
};
module.exports = InfoComplete;