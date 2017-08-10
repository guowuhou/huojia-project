const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const httpreq = require('httpreq.es6');
const utils = require('utils');

class MainMenuClass extends uu.Component {

    // show properties in Editor, you can use this.xxx directly
    properties() {
        return {
            sidemenu: {
                defaultValue: null,
                type: uu.Dom
            },
            iframe: {
                defaultValue: null,
                type: uu.Dom
            }
        };
    }
    
    onLoad(){
       const self = this;
       utils.xhr.post(httpreq.LoginQryMenuAuth,{},function(res){
            var FirstList=res.data.FirstList;
            var SecondList=res.data.SecondList;
            var ThirdList=res.data.ThirdList||[];
            
            _.each(SecondList,(second)=>{
                second.submenu=_.where(ThirdList,{
                    parentAuthNo:second.authNo
                })
            });

            _.each(FirstList,(first)=>{
                first.submenu=_.where(SecondList,{
                    parentAuthNo:first.authNo
                })
            });
            self.data=FirstList;
            self.bindEvent();
            self.renderMainMenu();
        });
    }
    bindEvent(){
         //菜单
        var self=this;
        var data=this.data;
        $('body').on('click', 'li', function(){
            const li = $(this);
            // if( li.hasClass('active') ){
            //     return;
            // }
            const level = parseInt(li.attr('level'), 10);
            $(`li[level="${level}"]`).removeClass("active");
            if( level == 2 ){
                $(`li[level="3"]`).removeClass("active");
            }
            li.addClass('active');
            const url = li.attr('url');
            const index = li.attr('index');
            //可以跳转
            if( url ){
                $(self.iframe).attr('src', url);
            }
            else if( index ){
                const d = data[index];
                if( d.url ){
                    $(self.iframe).attr('src', d.url);
                }
                else if( d.submenu ){
                    self.renderSideMenu(d.submenu);
                }
            }
        });
    }

    //渲染主菜单
    renderMainMenu() {
        const renderFunc = _.template( require('./mainmenu.tpl') );
        const menuHTML = renderFunc({ list: this.data });
        $(this.node.dom).html(menuHTML);
        // $('li[main]').eq(0).trigger("click");
    }
    
    //渲染子菜单
    renderSideMenu(data){
        const renderFunc = _.template( require('./childmenu.tpl') );
        const menuHTML = renderFunc({ list: data });
        $(this.sidemenu).html(menuHTML);
    }

};

module.exports = MainMenuClass;