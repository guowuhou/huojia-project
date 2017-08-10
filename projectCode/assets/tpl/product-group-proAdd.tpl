<%for(var i=0; i<prdArrList.length;i++){%>
<li class="list-group-item">
    <div class="form-horizontal">
        <div class="form-group">
            <label class="centerText control-label col-sm-1" typeid="1073"><%=prdArrList[i].prdArrName%></label>
            <div class="col-sm-2" categoryunionid="0075">
                <input type="text" class="form-control" name="proportion" maxlength="10" prdArr="<%=prdArrList[i].prdArr%>" prdArrName="<%=prdArrList[i].prdArrName%>" placeholder="请输入占比">
            </div>  
            <div class="col-sm-2 col-sm-offset-1">
                <button class="btn btn-primary config-product-btn">配置产品</button>
            </div>
        </div>
        <div class="form-group" style="display: none">
            <div class="col-sm-12">
                <table class="table table-hover centerTd table-bordered">
                    <thead>
                        <tr>
                            <th>产品代码</th>
                            <th>产品名称</th>
                            <th>风险等级</th>
                            <th>起购金额(元)</th>
                            <th>币种</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>
                </table>            
            </div>
        </div>
    </div>
</li>
<%}%>