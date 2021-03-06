exports.baseinfo=[
  {key:"productId",title:"产品ID"},
  {key:"prdName",title:"产品名称"},
  {key:"prdCode",title:"产品CODE"},
  {key:"status",title:"产品状态"},
  {key:"sellerDate",title:"产品建立日期/转让日期",type:'date', format:'YYYY-MM-DD'},
  {key:"sellerTime",title:"产品建立时间/转让时间"},
  {key:"transferApplyDate",title:"募集起始日期/转让起始日",type:'date', format:'YYYY-MM-DD'},
  {key:"transferEndDate",title:"募集终止日期/转让截止日",type:'date', format:'YYYY-MM-DD'},
  {key:"productType",title:"存款类型"},
  {key:"resellType",title:"转让类型",type:"zhuanrang"},
  {key:"totalCreidtAmt",title:"产品总额度",type:"money"},
  {key:"usedLimit",title:"产品已使用额度"},
  {key:"currency",title:"币种"},
  {key:"saveDeadline",title:"产品期限",type:'qixian'},
  {key:"rateType",title:"利率类型"},
  {key:"interestRate",title:"存单利率(%)"},
  {key:"rateFluctuationMode",title:"利率浮动方式",type:"fudong"},
  {key:"minIntFltRate",title:"最小利率浮动比例",type:"fudong"},
  {key:"maxIntFltRate",title:"最大利率浮动比例",type:"fudong"},
  {key:"intRateFloatScale",title:"利率浮动比例",type:"fudong"},
  {key:"frequency",title:"付息方式"},
  {key:"repayInterestPeriod",title:"付息周期"},
  // {key:"interestMode",title:"计息方法"},
  {key:"depositAmtMin",title:"起存金额"},
  {key:"increaseAmt",title:"递增金额"},
  {key:"sellFlag",title:"是否可转让"},
  {key:"buyerCommission",title:"买方转让手续费率",type:"zhuanrang"},
  {key:"sellerScAmount",title:"卖方转让手续费率",type:"zhuanrang"},
  {key:"preDrawFlag",title:"是否可提前支取"},
  {key:"allowRedeemFlag",title:"是否可赎回",type:'whether',type:"zhuanrang"},
  {key:"transferPrincipal",title:"可申购余额/转让本金",type:"money"},
  {key:"drawTimes",title:"支取次数"},
  // {key:"pledgeeFlag",title:"是否可质押",type:'whether'},
  {key:"partDrawFlag",title:"是否可部分支取"},
  {key:"freezeDate",title:"冻结日期"},
  {key:"sellerCardNo",title:"卖方卡号",type:"zhuanrang"},
  {key:"sellerFeeChargeCardNo",title:"卖方手续费收费卡号",type:"zhuanrang"},
  {key:"buyerCommission",title:"买方手续费金额",type:"zhuanrang"},
  {key:"sellerScAmount",title:"卖方手续费金额",type:"zhuanrang"},
  {key:"transferUserName",title:"转让客户名称",type:"zhuanrang"},
  {key:"transferPrice",title:"转让价格",type:"zhuanrang"},
  {key:"maturityDate",title:"存单到期日",type:'date', format:'YYYY-MM-DD',type:"zhuanrang"},
  {key:"startInterestDate",title:"起息日",type:'date', format:'YYYY-MM-DD',type:"zhuanrang"},
  {key:"remark",title:"备注"}

  ];


