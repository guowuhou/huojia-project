<%for(var i=0; i < list.length;i++){var haveChild = list[i].submenu.length==0?'':true;%>
    <li level="2" class="treeview" style="cursor: pointer" <%= haveChild ? '' : 'url="'+list[i].url+'"' %>>
        <a>
            <span><%=list[i].authName%></span>
            <% if( haveChild ){ %>
            <i class="fa fa-angle-left pull-right"></i>
            <%}%>
        </a>
        <% if( haveChild ){ var submenu = list[i].submenu; %>
        <ul class="treeview-menu">
            <%for(var j=0; j < submenu.length; j++){%>
                <li level="3" url="<%= submenu[j].url %>"><a><%=submenu[j].authName%></a></li>
            <%}%>
        </ul>
        <%}%>
    </li>
<%}%>


    