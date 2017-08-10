<div>
    <button type="button" class="btn btn-info fr"  id="intelligents">配置智能货架</button>
</div>
<div class="nav-tabs fujian1">
  <span style="font-size:25px;margin-left: 25px;">产品基本信息</span>
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
      <textarea class="form-control w80 nowrite" rows="3" value="" id="prdDesc" maxLength=100>{{prdDesc}}</textarea>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="productManName" class="col-sm-2 control-label">产品经理:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl _check nowrite 3noEdit"  id="productManName" value="{{productManName}}" >
    </div>
  </div>
  <div class="form-group" id="saleStatus">
    <label for="saleStatus" class="col-sm-2 control-label">上架状态:</label>
    <div class="col-sm-7">
      <select class="form-control w80 3noEdit" uu-model="{{saleStatus}}" id="saleStatus">
          <option uu-for="item of prdSaleStatusList" value="{{item.ddCode}}">{{item.ddName}}</option>
        </select>
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
  <span style="font-size:25px;margin-left: 25px;">产品利率(预期年化收益率)</span>
</div>
<form class="form-horizontal" style="margin-bottom: 40px;" role="form" id="basicInfo">
  <div class="form-group">
    <label for="productRate" class="col-sm-2 control-label">产品利率(%):</label>
    <div class="col-sm-7">
      <input id="productRate" type="text" class="form-control w80 fl _check nowrite 3noEdit" value="{{productRate}}" id="productRate">
    </div>
  </div>   
</form>
<div class="nav-tabs fujian1">
  <span style="font-size:25px;margin-left: 25px;">产品属性</span>
</div>
<form class="form-horizontal" style="margin-bottom: 40px;" role="form" id="editDiv">
  <div class="form-group" id="currencyType">
    <label for="currency" class="col-sm-2 control-label">交易币种:</label>
    <div class="col-sm-7">
      <select class="form-control w80 3noEdit" uu-model="{{currency}}" id="currency">
            <option uu-for="item of currencyList" value="{{item.ddCode}}">{{item.ddName}}</option>
         </select>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="quoteUnit" class="col-sm-2 control-label"><span class="star"></span>报价单位:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl _check nowrite 3noEdit" value="{{quoteUnit}}" id="quoteUnit">
    </div>
  </div>
  <div class="form-group" id="">
    <label for="tradingUnit" class="col-sm-2 control-label"><span class="star"></span>交易单位:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl _check nowrite 3noEdit" value="{{tradingUnit}}" id="tradingUnit">
    </div>
  </div>
  <div class="form-group" id="">
    <label for="investmentStyle" class="col-sm-2 control-label"><span class="star"></span>投资方式:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl _check nowrite 3noEdit" value="{{investmentStyle}}" id="investmentStyle">
    </div>
  </div>
  <div class="form-group" id="">
    <label for="agreedPeriod" class="col-sm-2 control-label"><span class="star"></span>协议期限:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl _check nowrite 3noEdit" value="{{agreedPeriod}}" id="agreedPeriod">
    </div>
  </div>
  <div class="form-group" id="">
    <label for="tradingDay" class="col-sm-2 control-label"><span class="star"></span>交易日:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl _check nowrite 3noEdit" value="{{tradingDay}}" id="tradingDay">
    </div>
  </div>
  <div class="form-group" id="">
    <label for="tradingHour" class="col-sm-2 control-label"><span class="star"></span>交易时间:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl _check nowrite 3noEdit" value="{{tradingHour}}" id="tradingHour">
    </div>
  </div>
  <div class="form-group" id="">
    <label for="transactChannel" class="col-sm-2 control-label"><span class="star"></span>办理渠道:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl _check nowrite 3noEdit" value="{{transactChannel}}" id="transactChannel">
    </div>
  </div>
  <div class="form-group" id="">
    <label for="appliedCustomer" class="col-sm-2 control-label"><span class="star"></span>适用客户:</label>
    <div class="col-sm-7">
      <textarea class="form-control w80 nowrite" rows="2" value="" id="appliedCustomer" maxLength=100>{{appliedCustomer}}</textarea>
      <!--<input type="text" class="form-control w80 fl _check nowrite 3noEdit"  value="{{usability}}"  id="usability">-->
    </div>
  </div>
  <div class="form-group" id="customersLabel">
    <label for="customersLabel" class="col-sm-2 control-label">客层分类:</label>
    <label class="checkbox-inline m20">
          <input type="checkbox" name="customersLabelRadio" id="customersLabelRadio1" uu-model="{{customersLabel}}" value="L0001">大众客户
      </label>
    <label class="checkbox-inline m20">
          <input type="checkbox" name="customersLabelRadio" id="customersLabelRadio1" uu-model="{{customersLabel}}" value="L0003"> 财富客户
      </label>
    <label class="checkbox-inline m20">
          <input type="checkbox" name="customersLabelRadio" id="customersLabelRadio1" uu-model="{{customersLabel}}" value="L0002"> 私行客户
      </label>
    <label class="checkbox-inline m20">
          <input type="checkbox" name="customersLabelRadio" id="customersLabelRadio1" uu-model="{{customersLabel}}" value="L0005"> 新客客户
      </label>
    <label class="checkbox-inline m20">
          <input type="checkbox" name="customersLabelRadio" id="customersLabelRadio1" uu-model="{{customersLabel}}" value="L0006"> 薪客客户
      </label>  
  </div>
  <div class="form-group" id="">
    <label for="majorFeatures" class="col-sm-2 control-label"><span class="star"></span>主要特色:</label>
    <div class="col-sm-7">
      <textarea class="form-control w80 nowrite" rows="3" value="" id="majorFeatures" maxLength=100>{{majorFeatures}}</textarea>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="riskWarning" class="col-sm-2 control-label"><span class="star"></span>风险提示:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl _check nowrite 3noEdit" value="{{riskWarning}}" id="riskWarning">
    </div>
  </div>
  <div class="form-group" id="">
    <label for="attention" class="col-sm-2 control-label"><span class="star"></span>注意事项:</label>
    <div class="col-sm-7">
      <input type="text" class="form-control w80 fl _check nowrite 3noEdit" value="{{attention}}" id="attention">
    </div>
  </div>
  <div class="form-group" id="">
    <label for="handlingProcedures" class="col-sm-2 control-label"><span class="star"></span>办理流程:</label>
    <div class="col-sm-7">
      <textarea class="form-control w80 nowrite" rows="5" value="" id="handlingProcedures" maxLength=100>{{handlingProcedures}}</textarea>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="procedure" class="col-sm-2 control-label"><span class="star"></span>交易类型:</label>
    <table id="channelType" style="margin:10px;text-align:center;height:200px;">
       <tbody>
        <tr>
          <td style="width:200px;">交易类型</td>
          <td>最低交易额</td>
          <td style="padding-left:20px;">交易单位</td>
          <td style="padding-left:30px;">手续费标准</td>
          <td>收取方式</td>
        </tr>
        <tr>
          <td style="width:200px;">主动认购(按金额)</td>
          <td><input type="text" style="width:80px;height:40px;"  id="tradeVolumeMin1" value="{{tradeVolumeMin1}}"></td>
          <td><input type="text" style="width:80px;height:40px;margin-left:40px;" id="tradingUnit1" value="{{tradingUnit1}}"></td>
          <td><input type="text" style="width:80px;height:40px;margin-left:40px;"  id="handlingFeeStandard1" value="{{handlingFeeStandard1}}"></td>
          <td><input type="text" style="width:300px;height:40px;margin-left:40px;" id="chargeStyle1"  value="{{chargeStyle1}}"></td>
        </tr>
         <tr>
          <td style="width:200px;">主动认购(按重量)</td>
          <td><input type="text" style="width:80px;height:40px;"  id="tradeVolumeMin2" value="{{tradeVolumeMin2}}"></td>
          <td><input type="text" style="width:80px;height:40px;margin-left:40px;"  id="tradingUnit2" value="{{tradingUnit2}}"></td>
          <td><input type="text" style="width:80px;height:40px;margin-left:40px;"  id="handlingFeeStandard2" value="{{handlingFeeStandard2}}"></td>
          <td><input type="text" style="width:300px;height:40px;margin-left:40px;"  id="chargeStyle2" value="{{chargeStyle2}}"></td>
        </tr>
        <tr>
          <td style="width:200px;">赎回</td>
          <td><input type="text" style="width:80px;height:40px;"  id="tradeVolumeMin3" value="{{tradeVolumeMin3}}"></td>
          <td><input type="text" style="width:80px;height:40px;margin-left:40px;" id="tradingUnit3"  value="{{tradingUnit3}}"></td>
          <td><input type="text" style="width:80px;height:40px;margin-left:40px;"  id="handlingFeeStandard3" value="{{handlingFeeStandard3}}"></td>
          <td><input type="text" style="width:300px;height:40px;margin-left:40px;"  id="chargeStyle3" value="{{chargeStyle3}}"></td>
        </tr>
      </tbody> 
    </table>
  </div>
</form>
<div class="nav-tabs fujian1">
  <span style="font-size:25px;margin-left: 25px;">接入渠道</span>
</div>
<form class="form-horizontal" style="margin-bottom: 40px;" role="form" id="channels">
  <div class="form-group" id="salesChannels">
    <label for="lastname" class="col-sm-2 control-label"><span class="star">*</span>接入渠道:</label>
    <label class="checkbox-inline m20" uu-for="item of salesChannelsList">
          <input type="checkbox" name="salesChannelsRadio"  uu-model="{{salesChannels}}" value="{{item.ddCode}}"> {{item.ddName}}
      </label>
  </div>
  <div id="editTime" style="display:none;">
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
</div>
  <div id="showTime">  
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
    </div>
</form>
<form>
    <div class="nav-tabs fujian1">
        <span  style="font-size:25px;margin-left: 25px;">附件</span>
    </div>
  <table id="attachList" style="word-break:break-all; word-wrap:break-all;">

  </table>
</form>

<form>
  <div class="nav-tabs fujian1" style="margin-top:40px;">
    <span  style="font-size:25px;margin-left: 25px;">产品标签</span>
  </div>
  <button type="button" class="btn btn-info fr" id="deleteTag">删除标签</button>
  <button type="button" class="btn btn-info w100 fr mr_30 mb_15" id="addTag">添加标签</button>
  <table id="tagList">
        
  </table>
</form>