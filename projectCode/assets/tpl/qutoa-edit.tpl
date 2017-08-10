<form class="form-horizontal" role="form">
    <div class="form-group">
        <label class="col-sm-3 control-label" style='text-align: left'>产品名称</label>
        <div class="col-sm-7">
            <select class="form-control" disabled="disabled" id='prdCode'>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-sm-3 control-label" style='text-align: left'>渠道名称</label>
        <div class="col-sm-7">
            <select class="form-control" disabled="disabled" id='channelCode'>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label" style='text-align: left'>单个客户最大保有量上限</label>
        <div class="col-sm-7">
            <input type="text" class="form-control" id='singleHoldings'>
        </div>
        <div class="col-sm-2">万元</div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label" style='text-align: left'>渠道单日销量上限</label>
        <div class="col-sm-7">
            <input type="text" class="form-control" id='channelDaySales'>

        </div>
        <div class="col-sm-2">亿元</div>
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label" style='text-align: left'>渠道分配额度</label>
        <div class="col-sm-7">
            <input type="text" class="form-control" id='channelVol'>
        </div>
        <div class="col-sm-2">亿元</div>
    </div>

</form>