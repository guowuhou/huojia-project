<form class="form-horizontal" role="form" id="formDialog">
    <div class="form-group">
        <label class="col-sm-3 control-label">添加产品至:</label>
        <div class="col-sm-9" style="line-height:34px;" id="recTo">

        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">页面排序:</label>
        <div class="col-sm-5">
            <input input="text" class="form-control" id='index'>
        </div>
        <div class="col-sm-3">
            <input type='checkbox' id="topFlag" style='margin-top:8px;' />置顶
        </div>
    </div>
    <div class="bp10">
        <div class="form-group">
            <label class="col-sm-3 control-label">推荐产品名称/运营标题:</label>
            <div class="col-sm-8" style="line-height:34px;">
                <input type="text" class="form-control fl w80" id="edit-recommendName">
                <span class="glyphicon glyphicon-question-sign m8 remmondIcon"></span>
                <div class="card-tip6" id="remmendTips" style="display:none"><i class="icon58"></i>如设置，客户端产品将显示为推荐产品名称</div>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">角标:</label>
            <div class="col-sm-8" style="line-height:34px;">
                <select class="form-control" id="editcornerSign" style="width:135px">
                
            </select>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">客群:</label>
            <div class="col-sm-8" style="line-height:34px;" id="editkqfcList">

            </div>
        </div>
        <div class="form-group" id="fitTarget">
            <label for="lastname" class="col-sm-3 control-label">收益指标:</label>
            <label class="checkbox-inline">
              <input type="radio" name="fitTarget" id="operationFitTarget" value="0">无
            </label>
            <label class="checkbox-inline">
              <input type="radio" name="fitTarget" id="operationDefine" value="1">自定义
            </label>
        </div>
        <div class="form-group" id="opeTargetVal" style="display:none;">
            <div>
            <label for="lastname" class="col-sm-3 control-label"></label>
            <span style="margin-left:20px">指标名称</span>
            <input style="margin-left:40px" type="text" id="editincomeTargetName">
            </div>
            <div style="margin-top: 15px">
            <label for="lastname" class="col-sm-3 control-label"></label>
            <span style="margin-left:20px">指标值</span>
            <input style="margin-left:54px" type="text" id="editincomeTargetVal">
            </div>
        </div>
        <div class="form-group">
           <label class="col-sm-3 control-label">详情备注1:</label>
           <div class="col-sm-8" style="line-height:34px;">
              <textarea style="height:60px;" class="form-control" id="remarkOne"></textarea>
           </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">详情备注2:</label>
            <div class="col-sm-8" style="line-height:34px;">
                <textarea style="height:60px;" class="form-control" id="remarkTwo"></textarea>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">营销话术:</label>
            <div class="col-sm-8" style="line-height:34px;">
                <textarea style="height:60px;" class="form-control" id="marketing"></textarea>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">跳转链接:</label>
            <div class="col-sm-8" style="line-height:34px;">
                <input type="text" class="form-control fl" id="interlinking">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">图片链接:</label>
            <div class="col-sm-8" style="line-height:34px;">
                <input type="text" class="form-control fl" id="picturelinking">
            </div>
        </div>
    </div>

    <div id="dialogBtnBox" class="text-right mt_15">
        <button type="button" id="toExamineBtn" class="btn btn-primary">保存</button>
        <button type="button" id="toExamineBtnSumit" style="display:none;" class="btn btn-primary"></button>
        <!--提交审核按钮-->
    </div>
</form>