<tr><td>产品编号</td><td><%=prdCode%></td></tr>
<tr><td>产品名称</td><td><%=prdName%></td></tr>
<tr><td>允许使用机构</td><td><%=orgName.split("@").join(",")%></td></tr>
<tr><td>允许使用币种</td><td><%=currencyenable.split("@").join(",")%></td></tr>
<tr><td>允许还款方式</td><td><%=returnMethodEnable.split("@").join(",")%></td></tr>
<tr><td>允许还款周期</td><td><%=returnPeriodEnable.split("@").join(",")%></td></tr>
<tr><td>扣款日类别</td><td><%=debitType.split("@").join(",")%></td></tr>
<tr><td>允许使用担保方式</td><td><%=vouchTypeEnable.split("@").join(",")%></td></tr>
<tr><td>允许使用平安守护</td><td><%=pinganguard.split("@").join(",")%></td></tr>
<tr><td>额度项下允许使用产品</td><td><%=businessTypeEnable.split("@").join(",")%></td></tr>
<tr><td>额度项下允许还款方式</td><td><%=returnMethodEnable.split("@").join(",")%></td></tr>
<tr><td>额度项下允许利率调整周期</td><td><%=rateAdjustType.split("@").join(",")%></td></tr>
<tr><td>额度项下允许用途</td><td><%=purposeEnable.split("@").join(",")%></td></tr>
<tr><td>贷款最长期限</td><td><%=maxLPeriod%></td></tr>
<tr><td>是否允许多次放款</td><td><%=moreLoan%></td></tr>
<tr><td>还款顺序</td><td><%=returnSort.split("@").join(",")%></td></tr>
<tr><td>是否允许贴息</td><td><%=allowance%></td></tr>
<tr><td>是否开通存抵贷</td><td><%=finacing%></td></tr>
<tr><td>是否随贷款质量浮动</td><td><%=rateFloatFlag%></td></tr>
<tr><td>违约金的计算方式</td><td><%=defaultBalanceType%></td></tr>
<tr><td>提前还款违约金的收取比例</td><td><%=aheadpayDefaultCode%></td></tr>
<tr><td>单笔贷款金额下限</td><td><%=dbMinLimit%></td></tr>
<tr><td>单笔贷款金额上限</td><td><%=dbMaxLimit%></td></tr>
<tr><td>单户贷款金额下限</td><td><%=dhMinLimit%></td></tr>
<tr><td>单户贷款金额上限</td><td><%=dhMaxLimit%></td></tr>
<tr><td>利率上限</td><td><%=interestRateCeiling%></td></tr>
<tr><td>利率下限</td><td><%=interestRateFloor%></td></tr>