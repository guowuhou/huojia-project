<form class="form-horizontal" style="margin-bottom: 40px;" role="form">
  <div class="form-group" id="">
    <label for="lastname" class="col-sm-2 control-label"><span class="star">*</span>顺序:</label>
    <div class="col-sm-7">
      <input onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" type="text" class="form-control w80 fl" id="sequence">
    </div>
  </div>
  <div class="form-group" id="">
    <label for="lastname" class="col-sm-2 control-label"><span class="star">*</span>收益名称:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl" id="profitName" maxLength=20>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="lastname" class="col-sm-2 control-label"><span class="star">*</span>指标范围:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl" id="targetrange" maxLength=20>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="lastname" class="col-sm-2 control-label"><span class="star">*</span>收益值:</label>
    <div class="col-sm-7">
       <input type="text" class="form-control w80 fl" id="targetval">
    </div>
  </div>
</form>