
  <div>
  <div id='title' class="nav"><span class="navTitle">平台管理&nbsp&nbsp/&nbsp&nbsp角色管理&nbsp&nbsp/</span><span style="padding:8px;">{{title}}</span></div>
  <form class="form-horizontal station"  role="form" id="basicInfo">
    <div class="form-group" id="department">
      <label for="department" class="col-sm-2 control-label">所属部门:</label>
      <div class="col-sm-7">
        <select class="form-controlone w80 3noEdit" uu-model="{{deptNo}}" id="departmentSelect">
          <option uu-for="item of departmentList" value="{{item.deptNo}}">{{item.deptName}}</option>
        </select>
      </div> 
    </div>
    <div class="form-group" id="roleCode" style="display:none;">
      <label for="roleCode" class="col-sm-2 control-label">角色代码:</label>
      <div class="col-sm-7">
        <input type="text" class="form-controlone w80 fl _check nowrite 3noEdit" value="{{roleNo}}"  id="inputRoleCode" onkeyup="value=value.replace(/[^0-9a-zA-Z]/g,'')">
      </div>
    </div>
    <div class="form-group" id="roleName">
      <label for="roleName" class="col-sm-2 control-label">角色名称:</label>
      <div class="col-sm-7">
        <input type="text" class="form-controlone w80 fl _check nowrite 3noEdit"  value="{{roleName}}"  id="inputroleName">
        <span id='right' style="display:none;margin-left:15px;" class="glyphicon glyphicon-ok"></span>
        <span id='error'  style="display:none;margin-left:15px;" class="glyphicon glyphicon-remove"></span>
      </div>
    </div>
    <div class="form-group" id="describe">
      <label for="describe" class="col-sm-2 control-label">备注:</label>
      <div class="col-sm-7">
        <textarea class="form-controlone w80 nowrite" rows="3" id='roleDesc'>{{remark}}</textarea>
      </div>
    </div>
    <div class="form-group" id="Status">
      <label for="Status" class="col-sm-2 control-label">状态:</label>
      <div class="col-sm-7">
        <label class="checkbox-inline">
          <input type="radio" name="status" id="radioOne" uu-model="{{status}}" value="1">启用
        </label>
        <label class="checkbox-inline">
          <input type="radio" name="status" id="radioTwo" uu-model="{{status}}" value="0">禁用
        </label>
      </div>
    </div>
  </form>
  <form class="form-horizontal" style="margin-bottom: 40px;" role="form" id="editDiv">
       <div class="p">请选择菜单权限</div>
       <div id='list' style="margin-left:120px;margin-right:120px;">
          <table id="operationTable"></table> 
       </div>
  </form> 
  <form>
      <div id="establish">
          <button id="btn_create"  class="btn btn-primary fl_r m_r15" type="button">{{operation}}</button>
      </div>
  </form>
</div>


