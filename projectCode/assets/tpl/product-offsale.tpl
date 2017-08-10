<form class="form-horizontal" role="form" id="formDialog">
    <div class="form-group">
        <label class="col-sm-3 control-label">业务类型:</label>
        <div class="col-sm-9" id="ywType"><%=businessType%></div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">审批类型:</label>
        <div class="col-sm-7" id="spType"><%=verifyType%></div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">申请人:</label>
        <div class="col-sm-7" id="umNum"><%=applicant%></div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">优先级:</label>
        <div class="col-sm-7">
            <select id="priLevel" class="form-control">
               <option value="0">高</option>
               <option value="1">中</option>
               <option value="2">低</option>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">申请标题:</label>
        <div class="col-sm-7">
            <input type="text" class="form-control" id="Title">
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label">申请备注:</label>
        <div class="col-sm-7">
           <textarea style="height:60px;" class="form-control" id="Remark"></textarea>
        </div>
    </div> 
</form>