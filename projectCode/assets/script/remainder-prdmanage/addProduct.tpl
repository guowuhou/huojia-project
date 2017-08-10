<form class="form-horizontal" role="form" id="formDialog">
    <div id="editDetail" style="display:none;">
        <div class="form-group">
            <label class="col-sm-3 control-label">接入渠道:</label>
            <div class="col-sm-8">
                <p style="margin-top:6px;" id="getChannel"></p>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">商户合作:</label>
            <div class="col-sm-8">
                <p style="margin-top:6px;" id="getbusinessCoop"></p>
            </div>
        </div>
    </div>
    <div id="addInfo">
        <div class="form-group">
            <label class="col-sm-3 control-label">接入渠道:</label>
            <div class="col-sm-3">
                <select class="form-control" id="insertChannel" style="width:135px">
                
           </select>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">商户合作:</label>
            <div class="col-sm-3">
                <select class="form-control" id="businessCoop" style="width:135px">
                
         </select>
            </div>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">产品代码:</label>
        <div class="col-sm-3">
            <select class="form-control" id="proType" style="width:135px" disabled="true">
                <option value='02'>代销理财产品</option>
                <option value='01'>本行理财产品</option>
                <option value='04'>大额存单产品</option>
                <option value='06'>黄金定投产品</option>
                <option value='07'>黄金份额认购产品</option>
                <option value='09'>本行存款产品</option>
            </select>
        </div>
        <div class="col-sm-3 len">
            <input type="text" class="form-control" id="proCode" placeholder="产品代码">
        </div>
        <div class="col-sm-2 len">
            <input type="button" class="form-control btn btn-warning dropdown-toggle" id="proSearchBtn" value="搜索">
        </div>
    </div>

    <div id="detailInfo"></div>
    <div id="editShowInfo" style="display:none;">
        <div class="form-group">
            <label class="col-sm-3 control-label">产品简称:</label>
            <div class="col-sm-8" id="prdShortName" style="line-height:34px;"> </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">产品状态:</label>
            <div class="col-sm-8" id="productType" style="line-height:34px;"> </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">上架状态:</label>
            <div class="col-sm-8" id="onsaleType" style="line-height:34px;"></div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">产品名字:</label>
            <div class="col-sm-8" style="line-height:34px;">
                <input type="text" placeholder="请输入" id="prdName" style="width:300px;">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">服务协议地址:</label>
            <div class="col-sm-8" style="line-height:34px;">
                <input type="text" placeholder="请输入" id="prdUrl" style="width:300px;">
            </div>
        </div>
    </div>


</form>