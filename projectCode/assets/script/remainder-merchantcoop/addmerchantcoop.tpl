<form class="form-horizontal" role="form" id="addDialog">
    <div class="form-group">
        <label class="col-sm-3 control-label">接入渠道:</label>
        <div class="col-sm-8">
           <select class="form-control" id="incomeChannel" filter="accessChannelCode" style="width:135px">
              
           </select>
         </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">商户合作:</label>
        <div class="col-sm-8">
         <select class="form-control" id="businessCooper" filter="accessMerchantCode" style="width:135px">
                
         </select>
         </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label"><span class="star">*</span>钱包名字:</label>
        <div class="col-sm-8">
            <input type="text" class="form-control" id="purseName" filter="purseName" placeholder="请输入">
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label"><span class="star">*</span>服务协议:</label>
        <div class="col-sm-8">
            <input type="text" class="form-control" id="prdLinkUrl" filter="protocolUrl" placeholder="请输入文件链接">
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label"><span class="star">*</span>颜色模板:</label>
        <div class="col-sm-8">
         <select class="form-control" id="colorTemplate" filter="colorTemplate" style="width:135px">
                
         </select>
         </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">备注:</label>
        <div class="col-sm-8">
            <textarea class="form-control" id="describe" filter="remark" placeholder="请输入"></textarea>
        </div>
    </div>
</form>