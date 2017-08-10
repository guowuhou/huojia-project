<form class="form-horizontal" role="form" id="formDialog">
   <div class="form-group">
        <label class="col-sm-3 control-label">推荐状态</label>
        <div class="col-sm-3" style="line-height:34px;" id="redStatus">
            
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">添加产品至</label>
        <div class="col-sm-9"  style="line-height:34px;" id="recTo">
            
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">页面排序</label>
        <div class="col-sm-5">
            <input input="text" class="form-control" id='index'> 
        </div>
        <div class="col-sm-3">
            <input  type='checkbox'  id="topFlag" style='margin-top:8px;' />置顶
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">产品代码</label>
        <div class="col-sm-3">
            <input type="text" class="form-control" id='prdCode'>
        </div>
        <div class="col-sm-4">
            <select class="form-control" id="proType">
                <option></option>
            </select>
        </div>
    </div>
    
    <!--<div class="form-group" id="is_des" style="display:none">
      <label class="col-sm-3 control-label">产品种类:</label>
      <div class="col-sm-8" style="line-height:34px;" id="prdTy"></div>
    </div>-->
    
    <div class="form-group">
      <label class="col-sm-3 control-label">产品名称:</label>
      <div class="col-sm-8" style="line-height:34px;" id="prdName"></div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">上架状态:</label>
        <div class="col-sm-3" id ='sjStatus' style="line-height:34px;"></div>
    </div>
    <div id="otherInfo"></div>
    <div class="bp10">
    <div class="form-group">
        <label class="col-sm-3 control-label">推荐产品名称/运营标题:</label>
        <div class="col-sm-8" style="line-height:34px;">
        <input type="text" class="form-control fl w80"  id="edit-recommendName">
        <span class="glyphicon glyphicon-question-sign m8 remmondIcon"></span>
        <div class="card-tip6" id="remmendTips" style="display:none"><i class="icon58"></i>如设置，客户端产品将显示为推荐产品名称</div>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">角标:</label>
        <div class="col-sm-8" style="line-height:34px;"  >
            <select class="form-control" id="edit-cornerSign" style="width:135px">
                
            </select>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">客群:</label>
        <div class="col-sm-8" style="line-height:34px;" id="edit-kqfcList">
            
        </div>
    </div>
     <div class="form-group" id="prdProfitTarget">
            <label for="lastname" class="col-sm-3 control-label">收益指标:</label>
            <label class="checkbox-inline">
              <input type="radio" name="prdfitTarget" id="usePrd" value="0">使用产品
            </label>
            <label class="checkbox-inline">
              <input type="radio" name="prdfitTarget" id="useDefine" value="1">自定义
            </label>
     </div>
    <div class="form-group" id="targetVal" style="display:none;">
        <div>
        <label for="lastname" class="col-sm-3 control-label"></label>
        <span style="margin-left:20px">指标名称</span>
        <input style="margin-left:40px" type="text" id="prdincomeTargetName">
        </div>
        <div style="margin-top: 15px">
        <label for="lastname" class="col-sm-3 control-label"></label>
        <span style="margin-left:20px">指标值</span>
        <input style="margin-left:54px" type="text" id="prdincomeTargetVal">
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">详情备注1:</label>
        <div class="col-sm-8" style="line-height:34px;">
            <textarea style="height:60px;" class="form-control" id="remark"></textarea>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">详情备注2:</label>
        <div class="col-sm-8" style="line-height:34px;">
            <textarea style="height:60px;" class="form-control" id="remarkInfoTwo"></textarea>
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
   <div class="form-group">
        <label class="col-sm-3 control-label">审批状态:</label>
        <div class="col-sm-3" id ='prdStatus' style="line-height:34px;">
            
        </div>
    </div>
   <div class="form-group">
       <label class="col-sm-3 control-label">审核ID:</label>
             <div class="col-sm-8" style="line-height:34px;">
             <div style="height:60px;" id="applyId"></div>
             </div>
   </div>
    </div>
    
    <div id="dialogBtnBox" class="text-right mt_15">
        <button type="button" id="toExamineBtn" class="btn btn-primary">提交审批</button>
        <button type="button" id="toExamineBtnSumit" style="display:none;" class="btn btn-primary"></button><!--提交审核按钮-->
    </div>
    
    
</form>