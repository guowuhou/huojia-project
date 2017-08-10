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
.m_l100{margin-left:100px;}
</style>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <span>&nbsp;</span>
      </div>
      <div class="modal-body">
      <form class="form-inline m_b10">
        <p class="ma"><label for="taCode" class="inline p_r10">产品代码:</label><span><%=prdCode%></span></p>
        <p class="ma"><label for="taCode" class="inline p_r10">产品名称:</label><span><%=prdName%></span></p>
      </form>
      <form class="form-inline m_b10 tal m_l100">
            <div class="form-group">
              <label for="uptime_input" class="control-label inline">上架日期</label>
              <div id="up_datetime" class="input-group date form_datetime" data-date="" data-date-format="yyyy-mm-dd hh:ss" data-link-field="uptime_input">
                <input id="uptime_input" class="form-control" size="16" type="text" value="" readonly>
                <span class="date-time-remove"><span class="glyphicon glyphicon-remove"></span></span>
                <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
              </div><br/>
            </div>
        </form>
        <form class="form-inline m_b50 tal m_l100">
            <div class="form-group">
              <label for="downtime_input" class="control-label inline">下架日期</label>
              <div id="down_datetime" class="input-group date form_datetime" data-date="" data-date-format="yyyy-mm-dd hh:ss" data-link-field="downtime_input">
                <input id="downtime_input" class="form-control" size="16" type="text" value="" readonly>
                <span class="date-time-remove"><span class="glyphicon glyphicon-remove"></span></span>
                <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
              </div><br/>
            </div>
            <div class="form-group">
              <div class="checkbox">
                <label id="longtime" class="inline p_r10" ><input type="checkbox">无结束日期</label>
              </div>
            </div>
        </form>
        <div></div>
      </div>
      <div class="modal-footer">
        <button id="forthwithfromsale" type="button" class="btn btn-primary p_l50 p_r50">立即下架</button>
        <button id="shelfup" type="button" class="btn btn-primary p_l50 p_r50">上架</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div>