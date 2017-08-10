const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');

exports.post = function (url, data, successCb, failCb) {
    if(typeof data =='function'){
        successCb = data;
        data = {};
    }
    $.post(url, data, (res)=>{
        if(typeof(res)=="string"){
            res=JSON.parse(res); 
        }
        if (Number(res.code) == 0) {
            successCb && successCb(res || {});
        }
        else if (res.responseCode == "683310" || res.responseCode == "900106") {
            Dialog.alert(res.responseMsg || res.msg, () => {
                if(/pop-stg\.paic/.test(location.hostname)||/pop-stg2\.paic/.test(location.hostname)){
                    window.top.location.href="http://pop-stg.paic.com.cn/portal/login.html";
                }else{
                    window.top.location.href="http://brop.pab.com.cn/portal/login.html";
                }
            });
        }
        else if (failCb) {
            failCb(res);
        }
        else {
            Dialog.alert(res.msg || res.responseMsg);
        }
    });
    // $.ajax({
    //     data: JSON.stringify(data),
    //     type: "POST",
    //     contentType: "application/json",
    //     url: url,
    //     dataType: "JSON",
    //     success: (res, event) => {
    //         if (Number(res.code) == 0) {
    //             successCb && successCb(res || {});
    //         }
    //         else if (res.responseCode == "683310" || res.responseCode == "900106") {
    //             Dialog.alert(res.responseMsg || res.msg, () => {
    //                 if(/com\.cn/.test(location.hostname)){
    //                     window.top.location.href="http://brop.pab.com.cn/portal/login.html";
    //                 }else{
    //                     window.top.location.href="http://10.14.217.18:8080/portal/login.html";
    //                 }
    //             });
    //         }
    //         else if (failCb) {
    //             failCb(res);
    //         }
    //         else {
    //             Dialog.alert(res.msg || res.responseMsg);
    //         }
    //     },
    //     error: (response) => {
           
    //     }
    // });

};



