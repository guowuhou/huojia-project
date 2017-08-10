<div class="nav-tabs fujian1">
  <span style="font-size:25px;margin-left: 25px;">产品模板基本信息</span>
</div>
<form class="form-horizontal" style="margin-bottom: 40px;" role="form" id="basicInfo">
  <div class="form-group" id="">
    <label for="templetCode" class="col-sm-2 control-label">模板代码:</label>
    <div class="col-sm-7">
      <p id="templetCode" style="margin-top:8px">{{templetCode}}</p>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="templetName" class="col-sm-2 control-label">产品模板名称:</label>
    <div class="col-sm-7">
      <p id="templetName" style="margin-top:8px">{{templetName}}</p>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="prdType" class="col-sm-2 control-label">产品类型:</label>
    <div class="col-sm-7">
      <p id="prdType" style="margin-top:8px">{{prdType}}</p>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="creatBy" class="col-sm-2 control-label">创建人:</label>
    <div class="col-sm-7">
      <p id="creatBy" style="margin-top:8px">{{creatBy}}</p>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="creatTime" class="col-sm-2 control-label">创建时间:</label>
    <div class="col-sm-7">
      <p id="creatTime" style="margin-top:8px">{{creatTime}}</p>
    </div>
  </div>
  <div class="form-group" id="">
    <label for="templetDesc" class="col-sm-2 control-label">备注:</label>
    <div class="col-sm-7">
      <textarea class="form-control w80 nowrite" rows="3" value="" id="templetDesc" maxLength=500>{{templetDesc}}</textarea>
    </div>
  </div>
  <div class="form-group">
    <label for="updataMan" class="col-sm-2 control-label">更新人:</label>
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

<form>
  <div class="nav-tabs fujian1">
      <span  style="font-size:25px;margin-left: 25px;">产品卡片及列表</span>
  </div>
  <button type="button" class="btn btn-primary w100 fr mr_30 mb_15" id="list_delete">删除</button>
  <button type="button" class="btn btn-primary w100 fr mr_30 mb_15"  id="list_addDefine">添加自定义字段</button>
  <button type="button" class="btn btn-primary fr mr_30 mb_15"  id="list_addSystem">添加系统字段</button>
  <table id="cardListContainer" style="word-break:break-all; word-wrap:break-all;">

  </table>
</form>

<form>
  <div class="nav-tabs fujian1">
    <span  style="font-size:25px;margin-left: 25px;">产品详情</span>
  </div>
  <button type="button" class="btn btn-primary w100 fr mr_30 mb_15" id="detail_delete">删除</button>
  <button type="button" class="btn btn-primary w100 fr mr_30 mb_15"  id="detail_addDefine">添加自定义字段</button>
  <button type="button" class="btn btn-primary fr mr_30 mb_15"  id="detail_addSystem">添加系统字段</button>
  <table id="ListContainer">
        
  </table>
</form>
<div id='operation' style="float:right;">
  <button type="button" class="btn btn-info mt_20" id="edit">预览</button>
  <button type="button" style="margin-left:15px;" class="btn btn-info mt_20" id="submitBtn" >保存</button>
</div>