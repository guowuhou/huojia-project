<form class="form-horizontal" role="form" id="formDialog">
     <div class="form-group" id="checkPrd">
        <label class="col-sm-3 control-label">配置内容类型:</label>
        <div style="margin-top:6px;">
               <input type="radio" style="margin-left:15px;" name="checkItem" value="0" id="checkPrdItemOne"> 
               <label class="">产品</label>
               <input type="radio"  name="checkItem" style="margin-left:100px;" value="1" id="checkPrdItemTwo"> 
               <label class="">运营内容</label> 
        </div>
    </div>
    <div class="form-group" id="addProTo" style="display:none;">
        <label class="col-sm-3 control-label">添加产品至:</label>
        <div class="col-sm-8" style="line-height:34px;" id="addProToDom">
        
        </div>
    </div>
   <div style="display:block;" id="prodcutRadio">
    <div class="form-group">
        <label class="col-sm-3 control-label">产品代码:</label>
        <div class="col-sm-3">
            <select class="form-control" id="proType" style="width:135px">
                <option value='02'>代销理财产品</option>
                <option value='01'>本行理财产品</option>
                <option value='04'>大额存单产品</option>
                <option value='06'>黄金定投产品</option>
                <option value='07'>黄金份额认购产品</option>
                <option value='09'>存款产品类型</option>
            </select>
        </div>
        <!--<div id="isDes" style="display:none">
            <label class="col-sm-2 control-label">产品种类:</label>
            <div class="col-sm-2">
                <select class="form-control" id="prdTy" style="width:135px">
                    <option value='0'>大额存单</option>
                    <option value='1'>定活宝-大额存单</option>
                </select>
            </div>
        </div>-->
        <div class="col-sm-3 len">
            <input type="text" class="form-control" autocomplete="off" id="proCode" placeholder="产品代码">
        </div>
        <!--<div class="col-sm-2" style="width: 7%;padding: 0;">
            <p style="line-height:33px;"><input type="checkbox" id="isSelected" />精选</p>
        </div>-->
        <div class="col-sm-2 len">
            <input type="button" class="form-control btn btn-warning dropdown-toggle" id="proSearchBtn" value="搜索">
        </div>
    </div>

    <div id="otherInfo1">
    </div>
    <div id="otherInfo2">
    </div>
    <div id="otherInfo3">
    </div>
</div>
  <div style="display:none;" id="operationRadio">
    <div class="form-group" id="addProductTo">
        <label class="col-sm-3 control-label">添加产品至:</label>
        <div class="col-sm-8" style="line-height:34px;" id="addProductToDom">
        
        </div>
    </div>
    <div class="bp10" id="showEditInfo">
        <div class="form-group">
            <label class="col-sm-3 control-label">推荐产品名称/运营标题:</label>
            <div class="col-sm-8" style="line-height:34px;">
                <input type="text" class="form-control fl w80" id="recommendNameTitle">
                <span class="glyphicon glyphicon-question-sign m8 remmondIcon"></span>
                <div class="card-tip6" id="remmendSetTips" style="display:none"><i class="icon58"></i>如设置，客户端产品将显示为推荐产品名称</div>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">角标:</label>
            <div class="col-sm-8" style="line-height:34px;">
                <select class="form-control" id="corterType" style="width:135px">
                </select>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">客群:</label>
            <div class="col-sm-8" style="line-height:34px;" id='customerObj'>

            </div>
        </div>
        <div class="form-group" id="profitTarget">
            <label for="lastname" class="col-sm-3 control-label">收益指标:</label>
            <label class="checkbox-inline">
              <input type="radio" name="profitTarget" id="netWorthRadio1" value="0">无
            </label>
            <label class="checkbox-inline">
              <input type="radio" name="profitTarget" value="1">自定义
            </label>
        </div>
        <div class="form-group" id="showFlag" style="display:none;">
            <div>
            <label for="lastname" class="col-sm-3 control-label"></label>
            <span style="margin-left:20px">指标名称</span>
            <input style="margin-left:40px" type="text" id="incomeTargetName">
            </div>
            <div style="margin-top: 15px">
            <label for="lastname" class="col-sm-3 control-label"></label>
            <span style="margin-left:20px">指标值</span>
            <input style="margin-left:54px" type="text" id="incomeTargetVal">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">详情备注1:</label>
            <div class="col-sm-8" style="line-height:34px;">
                <textarea style="height:60px;" class="form-control" id="descOne"></textarea>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">详情备注2:</label>
            <div class="col-sm-8" style="line-height:34px;">
                <textarea style="height:60px;" class="form-control" id="descTwo"></textarea>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">营销话术:</label>
            <div class="col-sm-8" style="line-height:34px;">
                <textarea style="height:60px;" class="form-control" id="saleLang"></textarea>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">跳转链接:</label>
            <div class="col-sm-8" style="line-height:34px;">
                <input type="text" class="form-control fl" id="connectlinking">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">图片链接:</label>
            <div class="col-sm-8" style="line-height:34px;">
                <input type="text" class="form-control fl" id="piclinking">
            </div>
        </div>
    </div>
    <div id="dialogBox" class="text-right">
        <button type="button" id="dialogAddBtn" class="btn btn-primary mt_15">提交审核</button>
    </div>
</div>
    
    
</form>