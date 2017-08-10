<nav class="navbar navbar-default" role="navigation" style="border:0px;background:none;margin:0px;">
    <div class="container-fluid" style="padding:0px;">
        <div class="navbar-form navbar-left" role="search">
            
        </div>
        <div class="navbar-form navbar-right" role="search" action="#">
            <input type="text" class="form-control" placeholder="产品名称/代码" id="pro-name-int">
            <select class="form-control" id="riskLevel-sel">
                <option value="">全部</option>
                <option value="1">低风险</option>
                <option value="2">中低风险</option>
                <option value="3">中风险</option>
                <option value="4">中高风险</option>
                <option value="5">高风险</option>
            </select>
            <button type="button" class="btn btn-primary" style="width:100px;" id="pro-serarch-btn">搜索</button>
        </div>
    </div>
</nav>
<table id="productListTable"></table>