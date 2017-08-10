<%for(var i=0; i<combPrdArrList.length;i++){%>
<li class="list-group-item">
    <div class="form-horizontal">
        <div class="form-group">
            <label class="centerText control-label col-sm-1" typeid="1073"><%=combPrdArrList[i].prdArrName%></label>
            <div class="col-sm-2" categoryunionid="0075">
                <input type="text" disabled="true" class="form-control" name="proportion" maxlength="10" placeholder="请输入占比" value="<%=combPrdArrList[i].prdRatio%>">
            </div>
        </div>
        <div class="form-group" style="display: <%=combPrdArrList[i].prdInfoList.length>0?'block':'none'%>">
            <div class="col-sm-12">
                <% if(combPrdArrList[i].prdInfoList.length>0){%>
                <table class="table table-hover centerTd table-bordered">
                    <thead>
                        <tr>
                            <th>产品代码</th>
                            <th>产品名称</th>
                            <th>风险等级</th>
                            <th>起购金额(元)</th>
                            <th>币种</th>
                        </tr>
                    </thead>
                    <tbody>
                        <%for(var n=0;n<combPrdArrList[i].prdInfoList.length;n++){
                            var thisPro = combPrdArrList[i].prdInfoList[n]; %>
                        <tr>
                            <td><%=thisPro.prdCode%></td>
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
                        </tr>
                        <%}%>
                    </tbody>	
                </table>
                <%}%>
            </div>
        </div>
    </div>
</li>
<%}%>