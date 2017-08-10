<form class="form-horizontal" role="form">
    <div class="form-group">
        <label class="col-sm-4 control-label">接入渠道：</label>
        <div class="col-sm-6" id="myChannel">
            
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-4 control-label">商户合作ID：</label>
        <div class="col-sm-6">
            <select class="form-control"id="merchantCode" filter="merchantCode">
               
            </select>
            
        </div>
    </div>
    <div class="form-group">
        
        <label class="col-sm-4 control-label"><span class="star">*</span>页面模块代码：</label>
        <div class="col-sm-6">
            <input type="text" class="form-control" id="pageModuleCode" filter ="pageModuleCode">
            <!--<label class="control-label">
               <input type="checkbox" _check>
            </label>
            <span>随机</span>-->
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-4 control-label"><span class="star">*</span>页面模块顺序：</label>
        <div class="col-sm-6">
            <input type="text" class="form-control" id="pageModuleSeq" filter ="pageModuleSeq">
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-4 control-label"><span class="star">*</span>页面模块名称：</label>
        <div class="col-sm-6">
            <input type="text" class="form-control" id="pageModuleName" filter ="pageModuleName">
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-4 control-label">图片链接：</label>
        <div class="col-sm-6">
            <input type="text" class="form-control" filter ="pictureUrl">
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-4 control-label">跳转链接：</label>
        <div class="col-sm-6">
            <input type="text" class="form-control" filter ="redirectUrl">
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-4 control-label">营销Source：</label>
        <div class="col-sm-6">
            <input type="text" class="form-control" filter ="marketingSource">
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-2 control-label">备注</label>
        <div class="col-sm-8">
            <textarea class="form-control" style="resize:none" rows="3" filter ="remark"></textarea>
        </div>
    </div>
    
</form>