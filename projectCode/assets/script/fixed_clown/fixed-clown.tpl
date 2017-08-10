<div class="nav-tabs fujian1">
  <span style="font-size:25px;margin-left: 25px;">产品基本信息</span>
   <button class="btn btn-primary fl_r" type="button" style="margin-right:10px;" href="bank_deposit-product.html">返回产品列表</button>
</div>
<form class="form-horizontal" style="margin-bottom: 40px;" role="form" id="basicInfo">
  <div class="form-group" id="">
    <label for="prdType" class="col-sm-2 control-label"><span class="star">*</span>产品类型:</label>
    <div class="col-sm-7">
      <p id="prdType" style="margin-top:8px">{{prdType}}</p>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="prdCode" class="col-sm-2 control-label"><span class="star">*</span>产品代码:</label>
    <div class="col-sm-7">
      <p id="prdCode" style="margin-top:8px">{{prdCode}}</p>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="prdName" class="col-sm-2 control-label"><span class="star">*</span>产品名称:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl _check nowrite 3noEdit" value="{{prdName}}" id="prdName">
    </div>
  </div>
    
  <div class="form-group" id="">
    <label for="prdDesc" class="col-sm-2 control-label">产品描述:</label>
    <div class="col-sm-7">
      <textarea class="form-control w80 nowrite" rows="3" value="" id="prdDesc" maxLength=500>{{prdDesc}}</textarea>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="productManName" class="col-sm-2 control-label">产品经理:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl _check nowrite 3noEdit" value="{{productManName}}" id="productManName">
    </div>
  </div>
  <div class="form-group" id="saleStatus">
    <label for="saleStatus" class="col-sm-2 control-label">上架状态:</label>
    <div class="col-sm-7">
      <p style="margin-top:8px" id="saleStatus">{{saleStatus}}</p>
    </div>
  </div>
  <div class="form-group">
    <label for="updataMan" class="col-sm-2 control-label">最近更新人:</label>
    <div class="col-sm-7">
      <p style="margin-top:8px">{{updateBy}}</p>
    </div>
  </div>
  <div class="form-group">
    <label for="updataTime" class="col-sm-2 control-label">更新时间:</label>
    <div class="col-sm-7">
      <p style="margin-top:8px">{{updateTime}}</p>
    </div>
  </div>
</form>
<div class="nav-tabs fujian1">
  <span style="font-size:25px;margin-left: 25px;">产品属性</span>
</div>
<form class="form-horizontal" style="margin-bottom: 40px;" role="form" id="editDiv">
  <div class="form-group" id="currencyType">
    <label for="ccy" class="col-sm-2 control-label">交易币种:</label>
    <div class="col-sm-7">
          <p style="margin-top:8px" id="quoteUnit">{{ccy}}</p>  
    </div>
  </div>
  <div class="form-group" id="">
    <label for="depositAmtMin" class="col-sm-2 control-label"><span class="star"></span>起存金额:</label>
    <div class="col-sm-7">
      <p style="margin-top:8px" id="depositAmtMin">{{amtMin}}</p>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="saveDeadline" class="col-sm-2 control-label"><span class="star"></span>存期:</label>
    <div class="col-sm-7">
       <p style="margin-top:8px" id="saveDeadline">{{saveDeadline}}</p>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="drawRate" class="col-sm-2 control-label"><span class="star"></span>到期利率(%):</label>
    <div class="col-sm-7">
      <p style="margin-top:8px" id="drawRate">{{planRate}}</p>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="payStyle" class="col-sm-2 control-label"><span class="star"></span>付息方式:</label>
    <div class="col-sm-7">
      <p style="margin-top:8px" id="payStyle">智能付息</p>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="drawControlType" class="col-sm-2 control-label"><span class="star"></span>能否提前支取:</label>
    <div class="col-sm-7">
      <p style="margin-top:8px" id="drawControlType">{{drawControlType}}</p>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="preDrawType" class="col-sm-2 control-label"><span class="star"></span>提前支取方式:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl _check nowrite 3noEdit" value="{{preDrawType}}" id="preDrawType" maxlength="80">
    </div>
  </div>
  <div class="form-group" id="">
    <label for="preDrawType" class="col-sm-2 control-label"><span class="star"></span>提前支取利率:</label>
    <div class="col-sm-7">
        <table class="table table-bordered m_b40 m_t20">
        <tbody>
            <thead>
              <tr><th>靠挡期限</th><th>执行利率</th></tr>
            </thead>
            <tbody>
              <tr uu-for="item of intRateList">
                <td>{{item.saveDeadlineLevel}}</td><td>{{item.intRate}}%</td>
              </tr>
            </tbody>
        </tbody>
    </table>  
    </div>
  </div>
  <div class="form-group" id="">
    <label for="transactChannel" class="col-sm-2 control-label"><span class="star"></span>办理渠道:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl _check nowrite 3noEdit" value="{{transactChannel}}" id="transactChannel">
      <!--<input type="text" class="form-control w80 fl _check nowrite 3noEdit"  value="{{usability}}"  id="usability">-->
    </div>
  </div>
  <div class="form-group" id="">
    <label for="appliedCustomer" class="col-sm-2 control-label"><span class="star"></span>试用客户:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl _check nowrite 3noEdit" value="{{appliedCustomer}}" id="appliedCustomer">
      <!--<input type="text" class="form-control w80 fl _check nowrite 3noEdit"  value="{{usability}}"  id="usability">-->
    </div>
  </div>
  <div class="form-group" id="customersLabel">
    <label for="customersLabel" class="col-sm-2 control-label">客层分类:</label>
    <label class="checkbox-inline m20">
          <input type="checkbox" name="customersLabelRadio" id="customersLabelRadio1" uu-model="{{customersLabel}}" value="L0001">大众客户
      </label>
    <label class="checkbox-inline m20">
          <input type="checkbox" name="customersLabelRadio" id="customersLabelRadio2" uu-model="{{customersLabel}}" value="L0003"> 财富客户
      </label>
    <label class="checkbox-inline m20">
          <input type="checkbox" name="customersLabelRadio" id="customersLabelRadio3" uu-model="{{customersLabel}}" value="L0002"> 私行客户
      </label>
  </div>
  <div class="form-group" id="">
    <label for="majorFeatures" class="col-sm-2 control-label"><span class="star"></span>主要特色:</label>
    <div class="col-sm-7">
      <textarea class="form-control w80 nowrite" rows="3" value="" id="majorFeatures" maxLength=500>{{majorFeatures}}</textarea>
    </div>
  </div>
</form>
<div class="nav-tabs fujian1">
  <span style="font-size:25px;margin-left: 25px;">接入渠道</span>
</div>
<form class="form-horizontal" style="margin-bottom: 40px;" role="form" id="channels">
  <div class="form-group" id="salesChannels">
    <label for="lastname" class="col-sm-2 control-label"><span class="star">*</span>接入渠道:</label>
    <label class="checkbox-inline m20" uu-for="item of salesChannelsList">
          <input type="checkbox" name="salesChannelsRadio" id="customersLabelRadio3" uu-model="{{salesChannels}}" value="{{item.accessChannelCode}}"> {{item.accessChannelName}}
      </label>
  </div>
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
   <!--<template uu-if="">
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
  </template>-->
  </form>
<!--<template uu-if="">
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
  </form>
</template>-->
</form>
<form>
    <div class="nav-tabs fujian1">
        <span  style="font-size:25px;margin-left: 25px;">附件</span>
        <button type="button" class="btn btn-info fw_b  fr" id="uploadAttach" uu-if="editFlag">上传附件</button>
    </div>
  <table id="attachListContainer" style="word-break:break-all; word-wrap:break-all;">

  </table>
</form>

<form>
  <div class="nav-tabs fujian1">
    <span  style="font-size:25px;margin-left: 25px;">产品标签</span>
  </div>
  <button type="button" class="btn btn-info fr" uu-if="uploadFlag" id="deleteTag">删除标签</button>
  <button type="button" class="btn btn-info w100 fr mr_30 mb_15" uu-if="uploadFlag" id="addTag">添加标签</button>
  <table id="tagListContainer">
        
  </table>
</form>

<div id='operation' style="text-align:center;">
 <div class="fr"><button type="button" class="btn btn-info fw_b mb_35 mt_20"  uu-if="editFlag" id="submitBtn">提交审核</button></div>
</div>