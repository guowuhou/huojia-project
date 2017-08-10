<form class="form-horizontal" role="form">
    <div class="form-group">
        <label class="col-sm-3 control-label">产品系列名称:</label>
        <div class="col-sm-8">
            <input type="text" class="form-control" value="{{name}}">
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">所属部门:</label>
        <div class="col-sm-8">
            <select class="form-control" uu-model="{{deptCode}}">
                <option uu-for="item of deptlist" value="{{item.deptNo}}">{{item.deptName}}</option>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">是否产品系列:</label>
        <div class="col-sm-8">
            <select class="form-control" disabled>
                <option>是</option>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">备注:</label>
        <div class="col-sm-8">
            <textarea class="form-control" rows="3">{{desc}}</textarea>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">状态:</label>
        <div class="col-sm-8">
            <select class="form-control" uu-model="{{status}}">
                <option uu-for="item of statuslist" value="{{item.deptNo}}">{{item.deptName}}</option>
            </select>
        </div>
    </div>
</form>