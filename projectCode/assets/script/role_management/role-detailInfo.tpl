  <div>
  <div id='title' class="nav"><span class="navTitle">平台管理&nbsp&nbsp/&nbsp&nbsp角色管理&nbsp&nbsp/&nbsp</span>查看角色</div>
  <form class="form-horizontal station"  role="form" id="basicInfo">
    <div class="form-group" id="department">
      <label for="department" class="col-sm-2 control-label">所属部门:</label>
      <div class="location_det" id="departmentSelect"><%=deptRoleName%></div> 
      <!--<div class="location_det" id="departmentSelect"><%=deptName%></div>-->
    </div>
    <div class="form-group" id="roleCode">
      <label for="roleCode" class="col-sm-2 control-label">角色代码:</label>
      <div class="location_det" id="inputRoleCode"><%=roleNo%></div>
    </div>
    <div class="form-group" id="roleName">
      <label for="roleName" class="col-sm-2 control-label">角色名称:</label>
      <div class="location_det" id="inputroleName"><%=roleName%></div>
    </div>
    <div class="form-group" id="describe">
      <label for="describe" class="col-sm-2 control-label">备注:</label>
      <div class="location_det"><%=remark%></div>
    </div>
    <div class="form-group" id="Status">
      <label for="Status" class="col-sm-2 control-label">状态:</label>
      <div class="location_det"><%=stateMap%></div>
    </div>
  </form>
  <form class="form-horizontal" style="margin-bottom: 40px;" role="form" id="editDiv">
       <div class="p">请选择菜单权限</div>
       <div id='list' style="margin-left:120px;margin-right:120px;">
          <table id="detailInfoTable"></table> 
       </div>
  </form> 
  <form>
      <div id="establish">
          <a href="role-management.html"><button id="btn_close"  onclick="window.open('role-management.html','_self')" class="btn btn-primary fl_r m_r15" type="button">关闭</button></a>         
      </div>
  </form>
</div>
