<form class="form-horizontal" role="form">
    <div class="form-group">
        <label class="col-sm-4 control-label">接入渠道：</label>
        <div class="col-sm-6">
            <p class="form-control-static" id="channelCode"></p>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-4 control-label">商户合作：</label>
        <div class="col-sm-6">
            <p class="form-control-static" id="merchantCode" filter ="merchantCode"></p>
        </div>
    </div>
    <div class="form-group">
        
        <label class="col-sm-4 control-label">(父级)页面模块：</label>
        <div class="col-sm-6">
            <p class="form-control-static" id="pageModule" filter ="parentCode"></p>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-4 control-label"><span class="star">*</span>页面区域Code：</label>
        <div class="col-sm-6">
            <input type="text" class="form-control" id="RegionCode" filter ="pageRegionCode">
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-4 control-label"><span class="star">*</span>页面区域名称：</label>
        <div class="col-sm-6">
            <input type="text" class="form-control" id="RegionName" filter ="pageRegionName">
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-4 control-label"><span class="star">*</span>页面区域顺序：</label>
        <div class="col-sm-6">
            <input type="text" class="form-control" id="RegionSeq" filter ="pageRegionSeq">
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
        <label class="col-sm-4 control-label">营销Channel_Source：</label>
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