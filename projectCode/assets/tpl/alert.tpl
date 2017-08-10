<div class="modal fade" id="alert-temp-wrap">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title"><%= title %></h4>
      </div>
      <div class="modal-body">
        <p><%= content %></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" disabled1="disabled" style="width:100px;" alertokbtn><%=okTxt%></button>
        <% if(cancelTxt){ %>
        <button type="button" class="btn btn-default" disabled1="disabled" style="width:100px;" alertcancelbtn><%=cancelTxt%></button>
        <%}%>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->