/**部门**/
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const utils=require('utils');

class department extends uu.Component{
        onLoad(){
        //this.statusList()
        this.departmentData();
        this.departmentList();
    }
    departmentData(){
       utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:"32"},(res, event)=>{
                this._data = res.data||[];
                this.departmentList()
        });
    }
    departmentList(){
        const vm = new uu.ViewModel({
            container: "#department",
            view: `     <label for="department" class="inline p_r10">部门:</label>  
                        <select class="form-control" filter="roleDept"  uu-model="{{ddCode}}">
                           <option uu-for="item of data" value="{{item.ddCode}}">{{item.ddName}}</option>
                        </select>
                    `,
            model: {
                data: {
                    type: Array,
                    value: [{ddCode:'',ddName:'全部'}]
                },
                ddCode: ''//此ddCode为select选中的要上传的参数
            }
        });
        
        vm.splice.apply(vm, ['data', 1, 0, ...this._data]);
    }
    
};
module.exports = department;