
  <div class="nav-tabs fujian1">
    <span class="uploadtext">产品基本信息</span>
  </div>
  <form class="form-horizontal" style="margin-bottom: 40px;" role="form" id="basicInfo">
    <div class="form-group" id="">
      <label for="lastname" class="col-sm-2 control-label"><span class="star">*</span>产品类型:</label>
      <div class="col-sm-7">
        <select class="form-control w80 3noEdit" uu-model="{{prdType}}" id="prdTypeSelect" disabled>
          <option uu-for="item of prdTypeList" value="{{item.ddCode}}">{{item.ddName}}</option>
          <!--<option uu-for="item of prdTypeList" value="{{item.ddCode}}">{{item.ddName}}</option>-->
        </select>
      </div>
    </div>
    <!--<div class="form-group" uu-if='isDes'>
      <label for="lastname" class="col-sm-2 control-label"><span class="star">*</span>产品种类:</label>
      <div class="col-sm-7">
        <input type="text" class="form-control w80 f1 _check nowrite 3noEdit" id="prdTySelect" disabled>
      </div>
    </div>-->
    <div class="form-group" id="">
      <label for="lastname" class="col-sm-2 control-label"><span class="star">*</span>产品代码:</label>
      <div class="col-sm-7">
        <input type="text" class="form-control w80 fl _check nowrite 3noEdit" value="{{prdCode}}"  id="prdCode" onkeyup="value=value.replace(/[^0-9a-zA-Z]/g,'')">
        <span class="glyphicon glyphicon-ok fl mt_3 ml_10 ft20 clv gc" style="display:none"></span>
        <span class="glyphicon glyphicon-remove fl mt_3 ml_10 ft20 cred gc" style="display:none"></span>
      </div>
    </div>
    <div class="form-group" id="">
      <label for="lastname" class="col-sm-2 control-label"><span class="star">*</span>产品名称:</label>
      <div class="col-sm-7">
        <input type="text" class="form-control w80 fl _check nowrite 3noEdit"  value="{{prdName}}"  id="prdName">
        <span class="glyphicon glyphicon-ok fl mt_3 ml_10 ft20 clv gc" style="display:none"></span>
        <span class="glyphicon glyphicon-remove fl mt_3 ml_10 ft20 cred gc" style="display:none"></span>
      </div>
    </div>
     <div class="form-group" id="" uu-if="prodcutTradeRule">
      <label for="lastname" class="col-sm-2 control-label">渠道产品名称:</label>
      <div class="col-sm-7">
        <input type="text" class="form-control w80 fl nowrite"  value="{{channelPrdName}}"  id="channelPrdName">
        <input type="checkbox" style="margin-left:10px;" value="" id="defaultName"><span>默认</span>
      </div>
    </div>
    <div class="form-group" id="">
      <label for="lastname" class="col-sm-2 control-label">产品描述:</label>
      <div class="col-sm-7">
        <textarea class="form-control w80 nowrite" rows="3" value="" maxLength=100>{{prdDesc}}</textarea>
      </div>
    </div>
    <div class="form-group" id="" uu-if="prodcutTradeRule">
      <label for="lastname" class="col-sm-2 control-label">产品特色:</label>
      <div class="col-sm-7">
        <input type="text" class="form-control w80 fl nowrite"  value="{{prdFeature}}"  id="prdFeature">
      </div>
    </div>
    <!--<div class="form-group" id="" uu-if="isDes">
      <label for="lastname" class="col-sm-2 control-label">产品经理:</label>
      <div class="col-sm-7">
        <input type="text" class="form-control w80 f1 nowrite" value="{{productManName}}">
      </div>
    </div>-->
    <div class="form-group" id="saleStatus" style="display:none">
      <label for="lastname" class="col-sm-2 control-label">上架状态:</label>
      <div class="col-sm-7">
        <p style="margin-top: 6px;" id="saleStatusText"></p>
      </div>
    </div>
     <div class="form-group" id="">
      <label for="lastname" class="col-sm-2 control-label">更新人:</label>
      <div class="col-sm-7">
       <p style="margin-top: 6px;">{{updateBy}}</p>
      </div>
    </div>
    <div class="form-group">
      <label for="lastname" class="col-sm-2 control-label">更新时间:</label>
      <div class="col-sm-7">
        <p style="margin-top: 6px;">{{updateTime}}</p>
      </div>
    </div>
    <div class="form-group" uu-if="bankshowInfo">
      <label for="lastname" class="col-sm-2 control-label">本行理财更新时间:</label>
      <div class="col-sm-7">
        <p style="margin-top: 6px;">{{synchroTime}}</p>
      </div>
    </div>
    <div class="form-group" uu-if="fundupdataTime">
      <label for="lastname" class="col-sm-2 control-label">基金代销更新时间:</label>
      <div class="col-sm-7">
        <p style="margin-top: 6px;">{{synchroTime}}</p>
      </div>
    </div>
     <div class="form-group" id="" uu-if="prodcutTradeRule">
      <label for="lastname" class="col-sm-2 control-label">发布时间:</label>
      <div class="col-sm-7">
        <p style="margin-top: 6px;">{{publishTime}}</p>
      </div>
    </div>
  </form>
  <div class="nav-tabs fujian1">
    <span class="uploadtext">产品自定义信息</span>
  </div>

  <form class="form-horizontal" style="margin-bottom: 40px;" role="form" id="editDiv">
    <template uu-if="consumeFinaFlagFalse">
    <!--<div class="form-group">
        <label for="lastname" class="col-sm-2 control-label"><span class="star" uu-if="isNewProduct">*</span>产品系列:</label>
        <div class="col-sm-7">
          <input type="text" id="productSeries" class="form-control w80 fl nowrite" value="{{productSeries}}" readonly>
          <button type="button" class="btn btn-default searchFlagBtn ml_10" uu-if="editFlag">
              <span class="glyphicon glyphicon-zoom-in"></span>
          </button>
        </div>
      </div>-->
       <div class="form-group">
      <label for="lastname" class="col-sm-2 control-label">产品经理名称:</label>
      <div class="col-sm-7">
        <input type="text" class="form-control w80 nowrite" value="{{prdManagerName}}">
      </div>
    </div>
    <div class="form-group" id="cusAssetClass">
      <label for="lastname" class="col-sm-2 control-label"><span class="star" uu-if="isNewProduct">*</span>客户资产配置分类:</label>
      <label class="checkbox-inline">
          <input type="radio" name="cusAssetClassificationRadio" id="cusAssetClassificationRadio1" uu-model="{{cusAssetClass}}" value="A0005">不区分
      </label>
      <label class="checkbox-inline">
          <input type="radio" name="cusAssetClassificationRadio" id="cusAssetClassificationRadio2" uu-model="{{cusAssetClass}}" value="A0001"> 现金类
      </label>
      <label class="checkbox-inline">
          <input type="radio" name="cusAssetClassificationRadio" id="cusAssetClassificationRadio3" uu-model="{{cusAssetClass}}" value="A0002"> 固收类
      </label>
      <label class="checkbox-inline">
          <input type="radio" name="cusAssetClassificationRadio" id="cusAssetClassificationRadio4"  uu-model="{{cusAssetClass}}" value="A0003"> 权益类
      </label>
      <label class="checkbox-inline">
          <input type="radio" name="cusAssetClassificationRadio" id="cusAssetClassificationRadio5"  uu-model="{{cusAssetClass}}" value="A0004"> 另类投资
      </label>
    </div>
    <div class="form-group" id="marketingStatus">
      <label for="lastname" class="col-sm-2 control-label"><span class="star" uu-if="isNewProduct">*</span>营销状态:</label>
      <label class="checkbox-inline">
          <input type="radio" name="marketingStatusRadio" id="marketingStatusRadio1"  uu-model="{{marketingStatus}}" value="S0004">不区分
      </label>
      <label class="checkbox-inline">
          <input type="radio" name="marketingStatusRadio" id="marketingStatusRadio2"  uu-model="{{marketingStatus}}" value="S0001">推荐
      </label>
      <label class="checkbox-inline">
          <input type="radio" name="marketingStatusRadio" id="marketingStatusRadio3"  uu-model="{{marketingStatus}}" value="S0002">热销
      </label>
      <label class="checkbox-inline">
          <input type="radio" name="marketingStatusRadio" id="marketingStatusRadio4"  uu-model="{{marketingStatus}}" value="S0003">重点
      </label>
    </div>
    </template>
   <template uu-if="consumeFinaFlagTrue">
      <div class="form-group" id="">
      <label for="lastname" class="col-sm-2 control-label"><span class="star" uu-if="isNewProduct">*</span>产品介绍:</label>
      <div class="col-sm-7">
        <textarea class="form-control w80 nowrite" rows="3" value="" maxLength=100>{{prdIntr}}</textarea>
      </div>
    </div>
   </template>
   <!--大额存单-->
    <template uu-if="depositFlagTrue">
      <div class="form-group" id="">
      <label for="lastname" class="col-sm-2 control-label">产品介绍:</label>
      <div class="col-sm-7">
        <textarea class="form-control w80 nowrite" rows="3" value="" maxLength=100>{{prdIntr}}</textarea>
      </div>
      </div>
      <div class="form-group" id="preDrawType" uu-if="isprdClass">
      <label for="lastname" class="col-sm-2 control-label">提前支取方式:</label>
      <div class="col-sm-7">
        <textarea class="form-control w80 nowrite" rows="1">{{preDrawType}}</textarea>
      </div>
      </div>
   </template>
    
    <div class="form-group" id="customersLabel">
      <label for="lastname" class="col-sm-2 control-label">客层分类:</label>
      <label class="checkbox-inline m20">
          <input type="checkbox" name="customersLabelRadio"  uu-model="{{customersLabel}}" value="L0001">大众客户
      </label>
      <label class="checkbox-inline m20">
          <input type="checkbox" name="customersLabelRadio"  uu-model="{{customersLabel}}" value="L0003"> 财富客户
      </label>
      <label class="checkbox-inline m20">
          <input type="checkbox" name="customersLabelRadio"  uu-model="{{customersLabel}}" value="L0002"> 私行客户
      </label>
      <label class="checkbox-inline m20">
          <input type="checkbox" name="customersLabelRadio"  uu-model="{{customersLabel}}" value="L0005"> 新客客户
      </label>
      <label class="checkbox-inline m20">
          <input type="checkbox" name="customersLabelRadio"  uu-model="{{customersLabel}}" value="L0006"> 薪客客户
      </label>
    </div>
    <template uu-if="prodcutTradeRule">
      <div class="form-group" id="breakEven">
        <label for="lastname" class="col-sm-2 control-label">保本属性:</label>
        <label class="checkbox-inline">
          <input type="radio" name="keepNatureRadio"  uu-model="{{breakEven}}" value="0">不区分
        </label>
        <label class="checkbox-inline">
          <input type="radio" name="keepNatureRadio"  uu-model="{{breakEven}}" value="1">保本
        </label>
        <label class="checkbox-inline">
          <input type="radio" name="keepNatureRadio"  uu-model="{{breakEven}}" value="2">非保本
        </label>
      </div>
       <div class="form-group" id="netValuePro">
        <label for="lastname" class="col-sm-2 control-label">净值属性:</label>
        <label class="checkbox-inline">
          <input type="radio" checked="checked" name="netWorthRadio" id="netWorthRadio1" uu-model="{{netValuePro}}" value="0">不区分
        </label>
        <label class="checkbox-inline">
          <input type="radio" name="netWorthRadio"  uu-model="{{netValuePro}}" value="1">净值
        </label>
        <label class="checkbox-inline">
          <input type="radio" name="netWorthRadio"  uu-model="{{netValuePro}}" value="2">非净值
        </label>
      </div>
      <div class="form-group" id="showFlag" style="display:none;">
        <div>
          <label for="lastname" class="col-sm-2 control-label"></label>
          <span style="margin-left:20px">收益指标名称</span>
          <input style="margin-left:40px" type="text" id="incomeTargetName"  value="{{incomeTargetName}}">
        </div>
        <div style="margin-top: 15px">
          <label for="lastname" class="col-sm-2 control-label"></label>
          <span style="margin-left:20px">收益指标值</span>
          <input style="margin-left:54px" type="text" id="incomeTargetVal" value="{{incomeTargetVal}}">
        </div>
      </div>
      <div class="form-group" id="wealthPrd">
        <label for="lastname" class="col-sm-2 control-label">是否财富产品:</label>
        <label class="checkbox-inline">
          <input type="radio" name="isProfiltPrdRadio"  uu-model="{{wealthPrd}}" value="0">是
        </label>
        <label class="checkbox-inline">
          <input type="radio" name="isProfiltPrdRadio"  uu-model="{{wealthPrd}}" value="1">否
        </label>
      </div>
    </template>
    <div class="form-group" uu-if="bankshowInfo">
        <label for="lastname" class="col-sm-2 control-label">分档收益:</label>
        <label class="checkbox-inline">
          <input type="radio" id="bracketProfit" name="isbracketProfit"  uu-model="{{isLevelProFit}}" value="1">是
        </label>
        <label class="checkbox-inline">
          <input type="radio" name="isbracketProfit"  uu-model="{{isLevelProFit}}" value="0">否
        </label>
    </div>
    <div class="form-group" uu-if="fundupdataTime">
        <label for="lastname" class="col-sm-2 control-label">平安优选:</label>
        <label class="checkbox-inline">
          <input type="radio" name="preference"  uu-model="{{paSelective}}" value="1">是
        </label>
        <label class="checkbox-inline">
          <input type="radio" name="preference"  uu-model="{{paSelective}}" value="0">否
        </label>
     </div>
     <div id="leavelProfit" uu-if="bankshowInfo" style="display:none;margin-left:325px;width:60%;margin-bottom:20px;">
          <table id="leavelProfitContainer">

          </table>
      </div>
    <div class="form-group" id="salesChannels">
      <label for="lastname" class="col-sm-2 control-label"><span class="star">*</span>货架接入渠道:</label>
       <label class="checkbox-inline m20" uu-for="item of salesChannelsList">
          <input type="checkbox" name="salesChannelsRadio" id="customersLabelRadio3" uu-model="{{salesChannels}}" value="{{item.accessChannelCode}}"> {{item.accessChannelName}}
      </label>
    </div>
 <template uu-if="consumeFinaFlagTrue">
     <div class="form-group" id="holdingCosts">
      <label for="lastname" class="col-sm-2 control-label"><span class="star" uu-if="isNewProduct">*</span>营销费用支持:</label>
      <label class="checkbox-inline">
          <input type="radio" name="holdingCostsRadio" id="holdingCostsRadio1" uu-model="{{holdingCosts}}" value="00">是
      </label>
      <label class="checkbox-inline">
          <input type="radio" name="holdingCostsRadio" id="holdingCostsRadio2" uu-model="{{holdingCosts}}" value="01">否
      </label>
    </div>
</template>
<template uu-if="editFlag">
    <div class="form-group">
      <label for="lastname" class="col-sm-2 control-label">设置上下架参考时间:</label>
      <div class="col-sm-7 w500">
        <div class="w330">
          <label for="onSaleTime" class="inline p_r10 date1">上架日期：</label>
          <div class="input-group date form_datetime t6 w200 up_datetime" data-date-format="yyyy-mm-dd hh:ii" data-link-field="onSaleTime">
            <input class="form-control nowrite" size="16" type="text" value="{{onSaleTime}}" readonly id="onSaleTime">
            <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
          </div>
        </div>
        <div class="w330 fl mt_15">
          <label for="offSaleTime" class="inline p_r10 date1">下架日期：</label>
          <div class="input-group date form_datetime t6 w200 up_datetime" data-date-format="yyyy-mm-dd hh:ii" data-link-field="offSaleTime">
            <input  class="form-control nowrite" size="16" type="text" value="{{offSaleTime}}" id="offSaleTime" readonly>
            <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
          </div>
        </div>
        <label class="checkbox-inline fl " style="margin: 14px 0 0 20px;">
          <input type="checkbox" id="noEndDate">无结束日期
       </label>
      </div>
    </div>
</template>
    <template uu-if="seeFlag">  
    <div class="form-group">
      <label for="lastname" class="col-sm-2 control-label">设置上下架参考时间:</label>
      <div class="col-sm-7 w500">
        <div class="w330">
          <label for="onSaleTime1" class="inline p_r10 date1">上架日期：</label>
          <div class="input-group date form_datetime t6 w240">
            <input id="onSaleTime1" class="form-control w240" size="16" type="text" value="{{onSaleTime}}" readonly>
          </div>
        </div>
        <div class="w330 fl mt_15">
          <label for="offSaleTime1" class="inline p_r10 date1">下架日期：</label>
          <div class="input-group date form_datetime t6 w240">
            <input id="offSaleTime1" class="form-control w240" size="16" type="text"  value="{{offSaleTime}}" readonly>
          </div>
        </div>
        <label class="checkbox-inline fl " style="margin: 14px 0 0 20px;">
          <input type="checkbox" id="noEndDate1" disabled="true">无结束日期
       </label>
      </div>
    </div>
    </template>
   <template uu-if="consumeFinaFlagTrue">
      <div class="form-group" id="inletMode">
        <label for="lastname" class="col-sm-2 control-label"><span class="star">*</span>进件模式:</label>
        <label class="checkbox-inline">
            <input type="radio" name="inletModeRadio" id="inletModeRadio1" uu-model="{{inletMode}}" value="01">纯线上
        </label>
        <label class="checkbox-inline">
            <input type="radio" name="inletModeRadio" id="inletModeRadio2" uu-model="{{inletMode}}" value="02">线上+线下
        </label>
        <label class="checkbox-inline">
            <input type="radio" name="inletModeRadio" id="inletModeRadio2" uu-model="{{inletMode}}" value="03">纯线下
        </label>
      </div>
  </template>
  </form>
  <template uu-if="prodcutTradeRule">
  <div class="nav-tabs fujian1">
    <span class="productClass" style="font-size:25px;margin-left:25px;">产品分类</span>
  </div>
  <form class="form-horizontal" style="margin-bottom: 40px;" role="form" id="productCalssify">
       <div class="form-group" id=""> 
         <label for="productTemplet" class="col-sm-2 control-label">产品模板:</label>
         <div class="col-sm-7">
         <select class="form-control w80" uu-model="{{templateId}}" id="productTemplet" style="float:left;">
            <option uu-for="item of templateIdList" value="{{item.ddCode}}">{{item.ddName}}</option>
         </select>
         <span style="color:#1BADC4;margin-left:70px;cursor:pointer;float:left;" id="cleanTemplate" uu-if="editFlag">清除</span>
         </div>
       </div>
       <div class="form-group" id=""> 
         <label for="frontClassify" class="col-sm-2 control-label"><span class="star">*</span>前端分类:</label>
         <div class="col-sm-7">
           <input type="text" id="frontClassify" class="form-control w80 fl nowrite" value="{{productSeriesFontName}}" readonly>
           <button type="button" class="btn btn-default frontClassify ml_10" uu-if="editFlag">
              <span class="glyphicon glyphicon-zoom-in"></span>
           </button>
           <span style="color:#1BADC4;margin-left:20px;cursor:pointer" id="cleanfront" uu-if="editFlag">清除</span>
         </div>
       </div>
       <div class="form-group" id=""> 
         <label for="backClassify" class="col-sm-2 control-label">后端分类:</label>
         <div class="col-sm-7">
           <input type="text" id="backClassify" class="form-control w80 fl nowrite" value="{{productSeries}}" readonly>
           <button type="button" class="btn btn-default backClassify ml_10" uu-if="editFlag">
              <span class="glyphicon glyphicon-zoom-in"></span>
           </button>
           <span style="color:#1BADC4;margin-left:20px;cursor:pointer" id="cleanback" uu-if="editFlag">清除</span>
         </div>
       </div>
       <div class="form-group" id=""> 
         <label for="productSeriesReal" class="col-sm-2 control-label">产品系列:</label>
         <div class="col-sm-7">
           <input type="text" id="productSeriesReal" class="form-control w80 fl nowrite" value="{{productSeriesRealName}}" readonly>
           <button type="button" class="btn btn-default productSeriesReal ml_10" uu-if="editFlag">
              <span class="glyphicon glyphicon-zoom-in"></span>
           </button>
           <span style="color:#1BADC4;margin-left:20px;cursor:pointer" id="cleanprdseries" uu-if="editFlag">清除</span>
         </div>
       </div>  
  </form>
</template> 
<template uu-if="prodcutTradeRule">
  <div id="tradRule">
  <div class="nav-tabs fujian1">
    <span class="productClass" style="font-size:25px;margin-left:25px;">交易规则</span>
  </div>
  <form class="form-horizontal" style="margin-bottom: 40px;" role="form" id="tradeRule">
       <div class="form-group" id=""> 
         <label for="tradeRule" class="col-sm-2 control-label"><span class="star">*</span>交易日历:</label>
         <div class="col-sm-7">
         <select class="form-control w80" uu-model="{{tradeCalendar}}" id="tradeCalendar">
            <option uu-for="item of tradeDateList" value="{{item.ddCode}}">{{item.ddName}}</option>
         </select>
         </div>
       </div>
       <div class="form-group" uu-if="proxyFlag" id=""> 
         <label for="pminInvestAmt" class="col-sm-2 control-label">渠道个人最低定投金额（元）:</label>
         <div class="col-sm-7">
             <input type="text" class="form-control w80" id="pminInvestAmt2" value="{{pminInvestAmt2}}" onkeyup="value=(value.match(/\d+(\.\d{0,2})?/)||[''])[0]">
         </div>
       </div>
       <div class="form-group" id=""> 
         <label for="redeemByDay" class="col-sm-2 control-label">赎回到账时间(天):</label>
         <div class="col-sm-7">
             <input type="text" class="form-control w80" value="{{redeemByDay}}">
         </div>
       </div>
       <div class="form-group" id=""> 
         <label for="accrualByDay" class="col-sm-2 control-label">计息时效(天):</label>
         <div class="col-sm-7">
             <input type="text" class="form-control w80" value="{{accrualByDay}}">
         </div>
       </div>
       <div class="form-group" id=""> 
         <label for="purchaseRule" class="col-sm-2 control-label">购买规则描述:</label>
         <div class="col-sm-7">
            <textarea class="form-control w80" rows="3" value="" >{{purchaseRule}}</textarea>
         </div>
       </div>
       <div class="form-group" id=""> 
         <label for="redeemRule" class="col-sm-2 control-label">赎回规则描述:</label>
         <div class="col-sm-7">
             <textarea class="form-control w80" rows="3" value="" >{{redeemRule}}</textarea>
         </div>
       </div> 
       <div class="form-group" id=""> 
         <label for="enchashmentRule" class="col-sm-2 control-label">到账规则描述:</label>
         <div class="col-sm-7">
             <textarea class="form-control w80" rows="3" value="" >{{enchashmentRule}}</textarea>
         </div>
       </div> 
       <div class="form-group" id=""> 
         <label for="incomeRule" class="col-sm-2 control-label">收益规则描述:</label>
         <div class="col-sm-7">
             <textarea class="form-control w80" rows="3" value="" >{{incomeRule}}</textarea>
         </div>
       </div> 
       <template uu-if="proxyFlag">
        <div class="form-group">
        <label for="collectBeginTime2" class="col-sm-2 control-label">募集开始日期:</label>
        <div class="col-sm-3">
           <div class="input-group date form_datetime t6 w200 up_datetime2" data-date-format="yyyy-mm-dd" data-link-field="collectBeginTime2">
              <input class="form-control nowrite flTime" size="16" type="text" value="{{collectBeginTime2}}" readonly id="collectBeginTime">
              <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
          </div>
        </div>
        </div>
        <div class="form-group">
          <label for="collectEndTime2" class="col-sm-2 control-label">募集结束日期:</label>
          <div class="col-sm-3">
              <div class="input-group date form_datetime t6 w200 up_datetime2" data-date-format="yyyy-mm-dd" data-link-field="collectEndTime2">
                <input class="form-control nowrite flTime" size="16" type="text" value="{{collectEndTime2}}" readonly id="collectEndTime">
                <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="estabDate2" class="col-sm-2 control-label">产品起息日:</label>
          <div class="col-sm-3">
            <div class="input-group date form_datetime t6 w200 up_datetime2" data-date-format="yyyy-mm-dd" data-link-field="estabDate2">
                <input class="form-control nowrite flTime" size="16" type="text" value="{{estabDate2}}" readonly id="estabDate">
                <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="endDate2" class="col-sm-2 control-label">产品到期日:</label>
          <div class="col-sm-3">
            <div class="input-group date form_datetime t6 w200 up_datetime2" data-date-format="yyyy-mm-dd" data-link-field="endDate2">
                <input class="form-control nowrite flTime" size="16" type="text" value="{{endDate2}}" readonly id="endDate">
                <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
            </div>
          </div>
        </div>
       </template>
  </form>
  </div>
</template>   
<template uu-if="attachFlag">
  <div class="nav-tabs fujian1">
    <span class="uploadtext">附件</span>
    <button type="button" class="btn btn-info fw_b  fr" id="uploadAttach" uu-if="editFlag">上传附件</button>
  </div>
  <table id="attachListContainer" uunode="1476502_025753_589175_786002" >

  </table>
</template>

<template >
  <div class="nav-tabs fujian1" style="margin-top:40px;">
    <span class="uploadtext">产品标签</span>
  </div>
  <button type="button" class="btn btn-info fr" uu-if="editFlag" id="deleteTag">删除标签</button>
  <button type="button" class="btn btn-info w100 fr mr_30 mb_15" uu-if="editFlag" id="addTag">添加标签</button>
  <table id="tagListContainer">
        
  </table>
</template>
  
  <div class="fr"><button type="button" class="btn btn-info fw_b mb_35 mt_20"  uu-if="editFlag" id="submitBtn">提交审核</button></div>


