<form class="form-horizontal" role="form">
    <div class="form-group">
        <label class="col-sm-2 control-label">分类ID</label>
        <div class="col-sm-8">
            <p class="form-control-static" id="classificationCode">${classificationCode}</p>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-2 control-label">分类名称</label>
        <div class="col-sm-8">
            <input id="classification" type="text" class="form-control" disabled="disabled">
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-2 control-label">产品分类</label>
        <div class="col-sm-8">
            <select class="form-control" id="productClassification">
            </select>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-2 control-label">所属部门</label>
        <div class="col-sm-8">
            <select class="form-control" id="dept">
               
            </select>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-2 control-label">状态</label>
        <div class="col-sm-8">
            <select class="form-control" id="status">
                <option value="0">失效</option>
                <option value="1">有效</option>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-2 control-label">备注</label>
        <div class="col-sm-8">
            <textarea class="form-control" style="resize:none" rows="3" desc></textarea>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-2 control-label">创建时间</label>
        <div class="col-sm-10" style="boder:none">
            <p class="form-control-static" createTime><p>
        </div>
    </div>
    <div class="form-group">
         <label class="col-sm-2 control-label">更新时间</label>
        <div class="col-sm-10" style="boder:none">
            <p class="form-control-static" updateTime><p>
        </div>
    </div>
    
</form>