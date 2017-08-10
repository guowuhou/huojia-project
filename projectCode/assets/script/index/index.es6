const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const httpreq = require('httpreq.es6');
const utils = require('utils');
const Dialog = require("plugins/dialog.es6");

class LoginOutClass extends uu.Component {
    
    onLoad(){
        this.bindEvent();
        this.showName();
    }
    bindEvent(){
        var self=this;
        $('#_back').on('click', function(){
            self.loginout();
        });
    }
    loginout(){
         if(/pop-stg\.paic/.test(location.hostname) || /pop-stg2\.paic/.test(location.hostname)){
                    window.top.location.href="http://pop-stg.paic.com.cn/portal/nav.html";
                }else{
                    window.top.location.href="http://brop.pab.com.cn/portal/nav.html";
                }
        // Dialog.confirm({
        //     message: "确定退出吗？",
        //     closable: false,
        //     draggable: false,
        //     btnCancelLabel: "取消",
        //     btnOKLabel: "确定",
        //     callback: function(flag){
        //         if(flag){
        //              utils.xhr.post(httpreq.logout,{},(res)=>{
        //                 if(/com\.cn/.test(location.hostname)){
        //                     window.top.location.href="http://brop.pab.com.cn/portal/login.html";
        //                 }else{
        //                     window.top.location.href="http://10.14.217.18:8080/portal/login.html";
        //                 }
        //                 return;
        //              });
        //         }
        //     }
        // }) 
    }
    showName(){
        utils.xhr.post(httpreq.logoutMenu,{},(res)=>{
                        var hostName=res.data.userId;
                        $("#hostName").html(hostName);
                     });
    }

};

module.exports = LoginOutClass;

  



