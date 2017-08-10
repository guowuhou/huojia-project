const $ = require("lib/jquery.js");
const utils = require('utils');
const _=require('lib/underscore.js');
const navUrlMapList=require('./nav-url-map.js');

class ProNavClass extends uu.Component {

//使用该头部，必须传入参数type，并且在nav-url-map.js文件中定义相应的tab的url信息
    onLoad() {
       const search = utils.url.get();
       var type=search.type;
       if(!type){
           return;
       }
       var urlObj=_.findWhere(navUrlMapList.urlMap,{
           type:search.type
       });
       var urlList=urlObj.urlList,tabHtml='';
       //供外围系统使用，tab去掉返回产品列表
       if(search.prdCode&&search.outFlag){
           urlList.pop();
       }
       //编辑、查看       
       if(search.prdCode || search.type == "05"){
           _.each(urlList,(item)=>{
                tabHtml+=`<li role="presentation"><a href="${item.url}">${item.tabName}</a></li>`;
           });
       }
       //定义新产品
       else{
           tabHtml=`<li role="presentation"><a href="${urlList[0].url}">${urlList[0].tabName}</a></li>
                    <li role="presentation"><a href="${urlList[urlList.length-1].url}">${urlList[urlList.length-1].tabName}</a></li>`;
       }
       $(this.node.dom).find("#tabListContainer").html(tabHtml);

        const pathnameArr = location.pathname.split('/');
        const basename = pathnameArr[pathnameArr.length - 1];
        $(this.node.dom).find('a').each(function () {
            const href = $(this).attr('href');
            const newhref = `${href}${location.search}${"&backPage=1"}`;
            $(this).attr('href', newhref);
            if (basename == href) {
                $(this).parent().addClass('active');
            }
        });
    }
};

module.exports = ProNavClass;


