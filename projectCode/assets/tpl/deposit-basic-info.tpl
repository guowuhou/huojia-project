<div class="panel panel-primary">
  <div class="panel-heading">1.产品基本信息</div>
  <!--<div class="panel-body">-->
    <table class="table table-bordered m_b40 m_t20">
        <tbody>
            <% for(var i=0;i<baseinfoList.length;i++){ %>
                 <tr>
                     <td style="width:25%"><%= baseinfoList[i].title %></td>
                     <td style="width:25%"><%= valueFormar(baseinfoList[i], baseinfo) %></td>
                 </tr>
            <%}%>
                 
        </tbody>
    </table>
  <!--</div>-->
</div>
