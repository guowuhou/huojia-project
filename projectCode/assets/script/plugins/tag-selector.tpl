<!-- 导航 -->
<nav class="navbar navbar-default" role="navigation" style="border:0px;background:none;margin:0px;">
    <div class="container-fluid" style="padding:0px;">
        <form class="navbar-form navbar-left" role="search">
            <select class="form-control" tagtype>
                <option value="tag">标签</option>
                <option value="group">组合标签</option>
            </select>
        </form>
        <div class="navbar-form navbar-right" role="search" action="#">
            <input type="text" class="form-control" placeholder="标签关键词" tagsearchfield>
            <button type="button" class="btn btn-default" style="width:100px;" tagsearchbtn>搜索</button>
        </div>
    </div>
</nav>
<table id="tag-selector-table"></table>