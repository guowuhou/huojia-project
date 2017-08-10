/**角色名称**/
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const httpreq = require('httpreq.es6')

class roleName extends uu.Component{
    onLoad(){
        this.rolename();
    }
    rolename(){
        const vm = new uu.ViewModel({
            container: "#name",
            view: `<label for="name" class="inline p_r10">角色名称</label>
                   <input type='text'  id="roleName" filter="roleName" class="form-control" value='{{data}}'>`,  
            model: {
                data: {
                    type: String,
                    value:''
                },
                content: ''
            }
        });
    }
};
module.exports = roleName;