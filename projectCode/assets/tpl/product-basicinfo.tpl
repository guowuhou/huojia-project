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
    <table class="table table-bordered m_b40 m_t20">
        <tbody>
            <% for(var i=0; i<ctrlinfoList.length; ){ %>
            <tr>
                <td style="width:25%"><%= ctrlinfoList[i].title %></td>
                <td  style="width:25%;word-break: break-all;" colspan="<%= ctrlinfoList[i].colspan||1 %>"><%= valueFormar(ctrlinfoList[i], ctrlinfo) %></td>
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

<div class="panel panel-primary">
  <div class="panel-heading">4.基金折扣率</div>
    <table class="table table-bordered m_b40 m_t20">
        <tbody>
            <tr>
                <td style="width:25%">销售渠道ID</td>
                <td  style="width:25%;word-break: break-all;">交易类型</td>
                <td style="width:25%">交易金额区间</td>
                <td style="width:25%">折扣率(%)</td>
            </tr>
            <% for(var i=0; i<funddisconut.length;i++ ){ %>
            <tr>
                <td style="width:25%"><%= funddisconut[i].channelId %>-<%= funddisconut[i].channelName %></td>
                <td  style="width:25%;word-break: break-all;"><%= funddisconut[i].transCode%>-<%= funddisconut[i].transName %></td>
                <td style="width:25%"><%= funddisconut[i].minAmt%>-<%= funddisconut[i].maxAmt%></td>
                <td style="width:25%"><%= funddisconut[i].agio %></td>
            </tr>
            <%}%>
        </tbody>
    </table>
</div>


<div class="panel panel-primary" style="width:50%;">
  <div class="panel-heading">9.其他字段</div>
  <!--<div class="panel-body">-->
    <table class="table table-bordered m_b40 m_t20" >
        <tbody>
            <% for(var i=0; i<additioninfoList.length; i++ ){ %>
            <tr>
                <td style="width:25%"><%= additioninfoList[i].title %></td>
                <td style="width:25%"><%= valueFormar(additioninfoList[i], additioninfo) %></td>
            </tr>
            <%}%>
        </tbody>
    </table>
  <!--</div>-->
</div>