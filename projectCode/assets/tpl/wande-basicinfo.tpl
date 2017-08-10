<div>
  <div style="border-bottom:1px solid #DA791B;width:600px;margin-bottom: 20px;margin-top: 30px;">
    <span class="title_font">投资目标</span>
  </div>
    <table class="table table-bordered m_b40 m_t20" style="width:1000px;">
        <tbody>
            <% for(var i=0; i<baseinfoList.length; ){ %>
            <tr>
                <td style="width:25%;background:#E8E8E8;"><%= baseinfoList[i].title %></td>
                <td style="width:25%"><%= valueFormar(baseinfoList[i++], baseinfo) %></td>
                <% if( i>= baseinfoList.length){ baseinfoList[i]={} } %>
                <td style="width:25%;background:#E8E8E8;"><%= baseinfoList[i].title %></td>
                <td style="width:25%"><%= valueFormar(baseinfoList[i++], baseinfo) %></td>
            </tr>
            <%}%>
        </tbody>
    </table>
</div>

<div>
    <div style="border-bottom:1px solid #DA791B;width:600px;margin-bottom: 20px;margin-top: 30px;">
        <span class="title_font">发行情况</span>
    </div>
    <table class="table table-bordered" style="width:1000px;">
        <tbody>
            <% for(var i=0; i<ctrlinfoList.length; ){ %>
            <tr>
                <td style="width:25%;background:#E8E8E8;"><%= ctrlinfoList[i].title %></td>
                <td  style="width:25%" colspan="<%= ctrlinfoList[i].colspan||1 %>"><%= valueFormar(ctrlinfoList[i], ctrlinfo) %></td>
                <% if(ctrlinfoList[i].colspan && ctrlinfoList[i].colspan>1){i++;continue;}else{i++;} %>
                <% if( i>= ctrlinfoList.length){ ctrlinfoList[i]={} } %>
                <td style="width:25%;background:#E8E8E8;"><%= ctrlinfoList[i].title %></td>
                <td style="width:25%"><%= valueFormar(ctrlinfoList[i++], ctrlinfo) %></td>
            </tr>
            <%}%>
        </tbody>
    </table>
</div>