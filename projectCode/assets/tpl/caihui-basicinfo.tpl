<table class="ch_basicTable">
   <tbody>
      <tr>
         <td class=""><strong>基金简称</strong></td>
         <td><%=prdName%></td>
      </tr>
      <tr>
         <td><strong>基金类型</strong></td>
         <td><%=prdType%></td>
      </tr>
      <tr>
         <td><strong>份额净值</strong></td>
         <td><%=netShareString%></td>
      </tr>
      <tr>
         <td><strong>净值报告日</strong></td>
         <td><%=reportDateString%></td>
      </tr>
      <tr>
         <td><strong>涨/跌</strong></td>
         <td><%=changeString%></td>
      </tr>
      <tr>
         <td><strong>晨星评级（三年）</strong</td>
         <td><%=chenxingRate%></td>
      </tr>
       <tr>
         <td><strong>金思维评级（两年）[说明]</strong></td>
         <td><%=jinsiweiRate%></td>
      </tr>
      <tr>
         <td><strong>成立日</strong></td>
         <td><%=establishDateString%></td>
      </tr>
      <tr>
         <td><strong>基金管理人</strong></td>
         <td><%=fundManagementCompany%></td>
      </tr>
      <tr>
         <td><strong>基金托管人</strong></td>
         <td><%=fundTrustee%></td>
      </tr>
      <tr>
         <td><strong>最新基金规模</strong></td>
         <td><%=latestFundSize%></td>
      </tr>
   </tbody>
</table>
<div class="title_barline">
    <span class="title_font">基金业绩表现</span>
</div>
<table class="table table-bordered m_b40 m_t20">
     <thead> 
        <tr class="active"> 
            <th>单位％</th> 
            <th>净值回报</th> 
        </tr> 
    </thead> 
   <tbody>
      <tr>
         <td>最近一周</td>
         <td><%=weekReturnNetRateString%></td>
      </tr>
      
      <tr>
         <td>最近一月</td>
         <td><%=monthReturnNetRateString%></td>
      </tr>
      
      <tr>
         <td>最近三月</td>
         <td><%=threeMonthsReturnNetRateString%></td>
      </tr>
      
      <tr>
         <td>最近六月</td>
         <td><%=sixMonthsReturnNetRateString%></td>
      </tr>
      
      <tr>
         <td>最近一年</td>
         <td><%=yearReturnNetRateString%></td>
      </tr>
      
      <tr>
         <td>年初至今</td>
         <td><%=yearToDateReturnNetRateString%></td>
      </tr>
      
      <tr>
         <td>成立至今</td>
         <td><%=establishReturnNetRateString%></td>
      </tr>
   </tbody>
</table>