<%for(var i=0;i<prdArrList.length;i++){%>
<tr>
    <td><%=prdArrList[i].prdArr%></td>
    <td><%=prdArrList[i].prdArrName%></td>
    <td>
        <button class="btn btn-sm btn-primary ravampDalei-btn" style="width:70px" prdArrName="<%=prdArrList[i].prdArrName%>" prdArr="<%=prdArrList[i].prdArr%>">编辑</button>
        <button class="btn btn-sm btn-primary deleteDalei-btn" style="width:70px" prdArr="<%=prdArrList[i].prdArr%>">删除</button>
    </td>
</tr>
<%}%>