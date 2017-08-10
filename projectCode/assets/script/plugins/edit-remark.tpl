<form class="form-horizontal" style="margin-bottom: 40px;" role="form">
  <div class="form-group" id="">
    <label for="lastname" class="col-sm-2 control-label">业务类型:</label>
    <div class="col-sm-7">
      <p style="margin-top: 6px;" id="businessType"></p>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="lastname" class="col-sm-2 control-label">审批类型:</label>
    <div class="col-sm-7">
      <p style="margin-top: 6px;" id="verifyType"></p>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="lastname" class="col-sm-2 control-label"><span  class="star">*</span>申请人:</label>
    <div class="col-sm-7">
      <p style="margin-top: 6px;" id="applicant"></p>
    </div>
  </div>
  <div class="form-group">
    <label for="priorityLevel" class="col-sm-2 control-label">优先级：</label>
    <div class="col-sm-7">
      <select class="form-control" id="priorityLevel" filter="cusAssetClass" style="width: 200px;float: left;margin-top: -6px;">
         
      </select>
    </div>
  </div>

  <div class="form-group" id="">
    <label for="lastname" class="col-sm-2 control-label"><span class="star">*</span>申请标题:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl" id="reviewTaskName" maxLength=20>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="lastname" class="col-sm-2 control-label">申请备注:</label>
    <div class="col-sm-7">
      <textarea class="form-control w80" rows="3" id="describe" maxLength=20></textarea>
    </div>
  </div>
</form>