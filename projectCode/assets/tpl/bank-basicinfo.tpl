<div class="panel panel-primary">
  <div class="panel-heading">1.产品基本信息</div>
  <!--<div class="panel-body">-->
    <table class="table table-bordered m_b40 m_t20">
        <tbody>
            <% for(var i=0; i<baseinfoList.length; ){ %>
            <tr>
                <td style="width:25%"><%= baseinfoList[i].title %></td>
                <td style="width:25%"><%= valueFormar(baseinfoList[i++], baseinfo) %></td>
                <% if( i>= baseinfoList.length){ baseinfoList[i]={} } %>
                <td style="width:25%"><%= baseinfoList[i].title %></td>
                <td style="width:25%"><%= valueFormar(baseinfoList[i++], baseinfo) %></td>
            </tr>
            <%}%>
        </tbody>
    </table>
  <!--</div>-->
</div>

<div class="panel panel-primary">
  <div class="panel-heading">2.产品控制参数</div>
  <!--<div class="panel-body">-->
    <table class="table table-bordered">
        <tbody>
            <% for(var i=0; i<ctrlinfoList.length; ){ %>
            <tr>
                <td style="width:25%"><%= ctrlinfoList[i].title %></td>
                <td  style="width:25%" colspan="<%= ctrlinfoList[i].colspan||1 %>"><%= valueFormar(ctrlinfoList[i], ctrlinfo) %></td>
                <% if(ctrlinfoList[i].colspan && ctrlinfoList[i].colspan>1){i++;continue;}else{i++;} %>
                <% if( i>= ctrlinfoList.length){ ctrlinfoList[i]={} } %>
                <td style="width:25%"><%= ctrlinfoList[i].title %></td>
                <td style="width:25%"><%= valueFormar(ctrlinfoList[i++], ctrlinfo) %></td>
            </tr>
            <%}%>
        </tbody>
    </table>
  <!--</div>-->
</div>