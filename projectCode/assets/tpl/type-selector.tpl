<div class="modal fade bs-example-modal-lg" id="<%= id %>">
<style>
.mylist {
  width: 24% !important;
  height: 220px !important;
}
.myalert {
  margin: 15px 0px 0px 0px !important;
  width: 98% !important;
}
</style>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">请选择产品分类</h4>
      </div>
      <div class="modal-body">
        <form class="form-inline">
            <select multiple class="form-control mylist" level="1">
              <% for(var i=0; i<dataLevel1.length; i++){ var d = dataLevel1[i]; %>
                <option value="<%= d.clId %>"><%= d.clName %></option>
              <%}%>
            </select>
            <select multiple class="form-control mylist" level="2"></select>
             <select multiple class="form-control mylist" level="3"></select>
             <select multiple class="form-control mylist" level="4"></select>
        </form>
        <div class="alert alert-warning myalert" role="alert">您现在选择的是:</div>
        <div class="alert alert-danger myalert" role="error" style="display:none;"></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" disabled="disabled" callbackbtn="<%= id %>" style="width:100px;">确认</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->