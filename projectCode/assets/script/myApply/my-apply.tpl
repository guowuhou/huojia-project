<!-- 导航 -->

<div class="container-fluid" style="padding-bottom:10px;border-bottom:1px solid #bbb;margin-bottom:10px">
    <form class="form-inline m_b10">
        <div class="form-group m_r60">
            <p class="ma"><label for="taCode" class="inline p_r10">申请ID:</label><span><%=reviewId%></span></p>
        </div>
        <div class="form-group">
            <p class="ma"><label for="taCode" class="inline p_r10">优先级:</label><span><%=priorityLevelMap%></span></p>
        </div>
    </form>
    <form class="form-inline m_b10">
        <div class="form-group m_r60">
            <p class="ma"><label for="taCode" class="inline p_r10">提单人:</label><span><%=createBy%></span></p>
        </div>
        <div class="form-group">
            <p class="ma"><label for="taCode" class="inline p_r10">提交时间:</label><span><%=moment(createTime).format('YYYY-MM-DD HH:mm:ss')%></span></p>
        </div>
    </form>
    <form class="form-inline m_b10">
        <div class="form-group m_r60">
            <p class="ma"><label for="taCode" class="inline p_r10">申请标题:</label><span><%=reviewTaskName%></span></p>
        </div>
    </form>
    <form class="form-inline m_b10">
        <div class="form-group m_r60">
            <p class="ma"><label for="taCode" class="inline p_r10">申请备注:</label><span><%=describe%></span></p>
        </div>
    </form>
    <form class="form-inline m_b10">
        <div class="form-group m_r60">
            <p class="ma"><label for="taCode" class="inline p_r10">审核状态:</label><span><%=reviewStatusMap%></span></p>
        </div>
    </form>
    <form class="form-inline m_b10">
        <div class="form-group m_r60">
            <p class="ma"><label for="taCode" class="inline p_r10">业务类型：</label><span><%=businessTypeMap%></span></p>
        </div>
        <div class="form-group">
            <p class="ma"><label for="taCode" class="inline p_r10">审核类型：</label><span><%=operationTypeMap%></span></p>
        </div>
    </form>
</div>
<div class="container-fluid">
    <form class="form-inline m_b10">
        <div class="form-group m_r60">
            <p class="ma"><label for="taCode" class="inline p_r10">新产品代码:</label><span><%=verifyData.prdCode%></span></p>
        </div>
    </form>
    <form class="form-inline m_b10">
        <div class="form-group m_r60">
            <p class="ma"><label for="taCode" class="inline p_r10">详细信息链接:</label><a href="#"><%=verifyData.prdName%>详细信息</a></p>
        </div>
    </form>
    <form class="form-inline m_b10">
        <div class="form-group m_r60">
            <span style="float:left;">*审批意见：</span>
            <span><textarea id='reviewReason' name="a" style="width:300px;height:80px;"><%=reviewReason%></textarea></span>
        </div>
    </form>
</div>