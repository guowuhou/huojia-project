

<%for(var n=0;n<list.length;n++){
    var thisPro = list[n]; %>
    <tr>
        <td prdClass="<%=thisPro.prdClass%>"><%=thisPro.prdCode%></td>
        <td><%=thisPro.prdName%></td>
        <td>
            <%=
                thisPro.riskLevel == "1"?"低":
                thisPro.riskLevel == "2"?"中低":
                thisPro.riskLevel == "3"?"中":
                thisPro.riskLevel == "4"?"中高":
                thisPro.riskLevel == "5"?"高":thisPro.riskLevel
            %>
        </td>
        <td><%=thisPro.minBuyAmt%></td>
        <td><%=thisPro.currency%></td>
        <td>
            <button class="btn btn-primary delete-pro-btn">取消选择</button>
        </td>
    </tr>
<%}%>