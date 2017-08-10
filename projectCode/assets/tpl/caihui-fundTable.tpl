<table class="table table-bordered m_b40 m_t20">
     <thead> 
        <tr class="active"> 
            <th>项目</th> 
            <th>金额（万元）</th> 
            <th>占基金总资产（%）</th> 
        </tr> 
    </thead> 
   <tbody>
      <%if(Number(Portfolio)<=0){%>
       <tr>
         <td>资产合计</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td>股票</td>
         <td></td>
         <td></td>
      </tr>
      
      <tr>
         <td>货币资金</td>
          <td></td>
         <td></td>
      </tr>
      
      <tr>
         <td>债券</td>
         <td></td>
         <td></td>
      </tr>
      
      <tr>
         <td>其他投资</td>
          <td></td>
         <td></td>
      </tr>
      <%}else{%>
           <tr>
         <td>资产合计</td>
         <td><%=Portfolio.totalFundAsset%></td>
         
         <td><%=(100*(Portfolio.totalFundAsset/Portfolio.totalFundAsset)).toFixed(2)%>%</td>
      </tr>
      
      <tr>
         <td>股票</td>
         <td><%=Portfolio.stockAsset%></td>
         <%if(Portfolio.stockAsset){%>
            <td><%=(100*(Portfolio.stockAsset/Portfolio.totalFundAsset)).toFixed(2)%>%</td>
         <%}else{%>
            <td></td>
         <%}%>
         
      </tr>
      
      <tr>
         <td>货币资金</td>
         <td><%=Portfolio.currencyAsset%></td>
         <%if(Portfolio.currencyAsset){%>
            <td><%=(100*(Portfolio.currencyAsset/Portfolio.totalFundAsset)).toFixed(2)%>%</td>
         <%}else{%>
            <td></td>
         <%}%>
      </tr>
      
      <tr>
         <td>债券</td>
         <td><%=Portfolio.bondAsset%></td>
         <%if(Portfolio.bondAsset){%>
            <td><%=(100*(Portfolio.bondAsset/Portfolio.totalFundAsset)).toFixed(2)%>%</td>
         <%}else{%>
            <td></td>
         <%}%>
      </tr>
      
      <tr>
         <td>其他投资</td>
         <td><%=Portfolio.otherTotal%></td>
         <%if(Portfolio.otherTotal){%>
            <td><%=(100*(Portfolio.otherTotal/Portfolio.totalFundAsset)).toFixed(2)%>%</td>
         <%}else{%>
            <td></td>
         <%}%>
      </tr>
      <%}%>
   </tbody>
</table>

<div class="title_barline">
    <span class="title_font">基金发行情况</span>
</div>
<table class="table table-bordered m_b40 m_t20">
   <tbody>
      <tr>
         <td class="active">募资公布日</td>
         <td><%=caihuiBasicInfo.raisePublishDateString%></td>
         <td class="active">发行起始日</td>
         <td><%=caihuiBasicInfo.issueStartDateString%></td>
      </tr>
      <tr>
         <td class="active">发行截止日</td>
         <td><%=caihuiBasicInfo.issueEndDateString%></td>
         <td class="active">发行面值（元/份）</td>
         <td><%=caihuiBasicInfo.issueParValueString%></td>
      </tr>
      <tr>
         <td class="active">募集份额（万份）</td>
         <td><%=caihuiBasicInfo.raiseShare%></td>
         <td class="active">实际募资（万元）</td>
         <td><%=caihuiBasicInfo.ultimateRaise%></td>
      </tr>
      <tr>
         <td class="active">缴款方式</td>
         <td><%=caihuiBasicInfo.payMethod%></td>
         <td class="active">认购方式</td>
         <td><%=caihuiBasicInfo.subsciptionForm%></td>
      </tr>
      <tr>
         <td class="active">首次有效购户数（户）</td>
         <td><%=caihuiBasicInfo.initialSubsciptionNum%></td>
         <td class="active"></td>
         <td></td>
      </tr>
   </tbody>
</table>