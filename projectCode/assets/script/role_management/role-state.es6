/**角色状态**/
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6')

class roleState extends uu.Component{
   
    onLoad(){
        this.rolestate();
    }
    rolestate(){
        const vm = new uu.ViewModel({
            container: "#states",
            view: `     <label for="creator" class="inline p_r10">角色状态:</label>  
                        <select class="form-control" id="status" filter="status" uu-model="{{ddCode}}">
                           <option uu-for="item of data" value="{{item.ddCode}}">{{item.ddName}}</option>
                        </select>
                    `,  
            model: {
                data: {
                    type: Array,
                    value: [
                        { ddCode: '', ddName: '全部' },
                        { ddCode: '1', ddName: '启用' },
                        { ddCode: '0', ddName: '禁用' }
                        ]
                },
                ddCode: ''//此ddCode为被选中的
            }
        });
    }
};
module.exports = roleState;