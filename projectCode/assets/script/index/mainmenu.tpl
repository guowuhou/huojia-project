<%for(var i=0;i<list.length;i++){%>
    <li level="1" index="<%=i%>" style="cursor: pointer"><a><%=list[i].authName%></a></li>
<%}%>