//基本信息
exports.baseinfo = [
    {key:'prdCode', title:'前端代码'},
    {key:'taCode', title:'后端代码'},
    {key:'prdName', title:'基金名称'},
    {key:'currType', title:'基金简称'},
    {key:'prdName', title:'基金管理人'},
    {key:'faceValue', title:'基金托管人'},
    {key:'status', title:'成立日期'},
    {key:'issPrice', title:'管理费'},
    {key:'prdArrName', title:'到期日期'},
    {key:'nav', title:'托管费'},
    {key:'riskLevel', title:'发行份额（亿元）'},
    {key:'navDays', title:'货币代码'},
    {key:'mgtFeeRate', title:'推广起始日期'},
    {key:'prdSponsor', title:'面值'},
    {key:'managedRate', title:'推广截止日期'},
    {key:'prdManager', title:'信托类别'},
    {key:'collectBeginTime', title:'受托人', type:'date', format:'YYYY-MM-DD'},
    {key:'prdTrustee', title:'上市日期/申购首日'},
    {key:'collectEndTime', title:'起购金额',  type:'date', format:'YYYY-MM-DD'},
    {key:'cashFlag', title:'日常赎回起始日'},
    {key:'estabDate', title:'预期收益率', type:'date', format:'YYYY-MM-DD'},
    {key:'openTime', title:'存续状态', type:'time'},
    {key:'scale', title:'发行地'},
    {key:'closeTime', title:'是否结构化产品', type:'time'},
    {key:'isElecPrdFlag', title:'业绩比较基准'},
    {key:'assetManPlanAndAppType', title:'交易所'},
    {key:'exclusivePrd', title:'基金类型'},
    {key:'isSupManConNum', title:'发行日期'},
    {key:'assetManageFlag', title:'是否为初始基金'},
    {key:'isConSmaNum', title:'是否指数基金'},
    {key:'assetManageFlag', title:'退市日期'},
    {key:'', title:''}
];

//发行情况
exports.ctrlinfo = [
    {key:'redDays', title:'基金中文名称'},
    {key:'refundDays', title:'基金英文名称'},
    {key:'divDays', title:'基金中文简称'},
    {key:'failDays', title:'基金管理人'},
    {key:'psubUnit', title:'基金类型'},
    {key:'osubUnit', title:'基金托管人'},
    {key:'pminHold', title:'基金投资类型'},
    {key:'ominHold', title:'发行日期'},
    {key:'pminRed', title:'设立募集期（月）'},
    {key:'ominRed', title:'净认购份额-成立条件（亿份）'},
    {key:'pmaxRed', title:'设立募集目标（亿元）'},
    {key:'omaxRed', title:'认购户数-成立条件'},
    {key:'pfirstAmt', title:'基金面值'},
    {key:'ofirstAmt', title:'管理费率（%）'},
    {key:'pmaxAmt', title:'存续期（年）'},
    {key:'omaxAmt', title:'托管费率（%）'},
    {key:'pdaymaxAmt', title:'基金成立日期'},
    {key:'odaymaxAmt', title:'销售费率（%)'},
    {key:'pappAmt', title:'基金到期日期'},
    {key:'oappAmt', title:'发行数量（亿份）'},
    {key:'pminConvVol', title:'上市日期'},
    {key:'ominConvVol', title:'总有效申购户数'},
    {key:'pminInvestAmt', title:'申购起始日期'},
    {key:'ominInvestAmt', title:'投资认购起始日期'},
    {key:'convFlag', title:'赎回起始日期'},
    {key:'cancelFlag', title:'投资认购终止日期'},
    {key:'autoInvestFlag', title:'认购下限（万元）'},
    {key:'liquMode', title:'每次最低申购金额（万元）'},
    {key:'limitFlag', title:'认购上限（万元）'},
    {key:'limitFlag', title:'单笔赎回份额下限（份）'},
    {key:'divMode', title:'巨额赎回认定比例（%）'},
    {key:'pallowed', title:'货币代码'},
    {key:'divModes', title:'发行价格'},
    {key:'oallowed', title:'超额认购倍数'},
    // {key:'channels', title:'允许渠道组', colspan: 3},
    // {key:'clientGroups', title:'允许客户组', colspan: 3}
];