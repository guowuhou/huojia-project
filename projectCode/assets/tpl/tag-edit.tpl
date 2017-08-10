<form class="form-horizontal" role="form">
    <div class="form-group">
        <label class="col-sm-2 control-label">标签ID</label>
        <div class="col-sm-10">
            <p class="form-control-static" id="tagCode"></p>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-2 control-label">标签名称</label>
        <div class="col-sm-10">
            <input type="text" class="form-control" name disabled>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-2 control-label">标签分类</label>
        <div class="col-sm-3">
            <select class="form-control"id="dept">
               
            </select>
        </div>
        <div class="col-sm-3">
            <select class="form-control" id="productClassification">
                
            </select>
        </div>
        <div class="col-sm-4">
            <select class="form-control" id="classification">
                
            </select>
        </div>

    </div>
    <div class="form-group">
        <label class="col-sm-2 control-label"></label>
        <div class="col-sm-10">
            <label class="control-label">
               <input type="checkbox" _check>
            </label>
            <span>不限分类</span>
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