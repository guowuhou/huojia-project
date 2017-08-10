const $ = require("lib/jquery.js");
const _ = require('lib/underscore.js');
const httpreq = require('httpreq.es6');
const Dialog = require('plugins/dialog.es6');
const TagSelector = require('plugins/tag-selector.es6');
const EditRemark = require('plugins/edit-remark.es6');
const moment = require('lib/moment.js');
const utils = require('utils');
require('lib/bootstrap-table.js');
require('lib/bootstrap.autocomplete.js');
class ProPageList extends uu.Component {
    onLoad() {
        this.romateHtml = $(require('tpl/product-selected-add.tpl'));
        this.editHtml = $(require('tpl/product-selected-edit.tpl'));
        this.editOPerationHtml=$(require('tpl/product-selected-editOperation.tpl'));
        this.getPrdStatus();
        this.getDictionaryTypeJb();
        this.getDictionaryTypeKq();
        this.createStatus();
        this.queryChannel();
        this.queryFenXiao();
        this.bindEvent();
    }
    createStatus() {
        let proStatus = [{
            'statusKey': '0',
            'statusValue': '全部'
        }, {
            'statusKey': '1',
            'statusValue': '已推荐、待推荐'
        }, {
            'statusKey': '2',
            'statusValue': '推荐失败'
        }];
        for (let index = 0; index < proStatus.length; index++) {
            let element = proStatus[index];
            $(this.node.dom).find('#recStatus').append(`<option value=${element.statusKey}>${element.statusValue}</option>`);
        }
    }
     //查接入渠道
    queryChannel() {
        var self = this;
        $.get(httpreq.PS_QryAccChannelAuth, (response) => {
            if (response.code == '000000') {
                let channelList = response.data;
                $(self.node.dom).find('#recList').html('');
                for (let index = 0; index < channelList.length; index++) {
                    let element = channelList[index];
                    if (element.accessChannelCode == 'C0003') {
                        $(self.node.dom).find('#recList').append(`<option value=${element.accessChannelCode} selected>${element.accessChannelName}</option>`);
                    } else {
                        $(self.node.dom).find('#recList').append(`<option value=${element.accessChannelCode}>${element.accessChannelName}</option>`);
                    }
                }
                let channelCode = $(self.node.dom).find('#recList').val();
                let merchantCode = $(self.node.dom).find('#fXList').val();
                self.queryPage(channelCode,merchantCode);
            } else {
                //Dialog.alert(response.msg || response.responseMsg);

                if (response.responseCode == '900106') {
                    Dialog.alert(response.msg || response.responseMsg);
                    window.top.location.href = "http://bcoms.paic.com.cn/bcoms/login";
                    return;
                } else {
                    Dialog.alert(response.msg || response.responseMsg);
                }
            }
        });
    }
    
    //查商户合作
    queryFenXiao(){
        var self = this;
        $.get(httpreq.QueryAccessMechantList, (response) => {
            if (response.code == '000000') {
                let fenXiaoList = response.data;
                for (let index = 0; index < fenXiaoList.length; index++) {
                    let element = fenXiaoList[index];
                    if (element.merchantCode == 'C0003') {
                        $(self.node.dom).find('#fXList').append(`<option value=${element.merchantCode} selected>${element.merchantName}</option>`);
                    } else {
                        $(self.node.dom).find('#fXList').append(`<option value=${element.merchantCode}>${element.merchantName}</option>`);
                    }
                }
                let channelCode = $(self.node.dom).find('#recList').val();
                let merchantCode = $(self.node.dom).find('#fXList').val();
                self.queryPage(channelCode,merchantCode);
            } else {
                //Dialog.alert(response.msg || response.responseMsg);

                if (response.responseCode == '900106') {
                    Dialog.alert(response.msg || response.responseMsg);
                    window.top.location.href = "http://bcoms.paic.com.cn/bcoms/login";
                    return;
                } else {
                    Dialog.alert(response.msg || response.responseMsg);
                }
            }
        });
        
    }
    //查页面
    queryPage(channelCode,merchantCode) { 
        var self = this;
        let data1 = {
            'parentCode': channelCode,
            'merchantCode':merchantCode
        };
        $.get(httpreq.PS_QryPageModuleInfo, data1, (response) => {
            if (response.code == '000000') {
                let pageData = response.data;
                $(self.node.dom).find('#pageList').html('');
                for (let index = 0; index < pageData.length; index++) {
                    let element = pageData[index];
                    if (element.pageModuleCode == 'C0003') {
                        $(self.node.dom).find('#pageList').append(`<option value=${element.pageModuleCode} selected>${element.pageModuleName}</option>`);
                    } else {
                        $(self.node.dom).find('#pageList').append(`<option value=${element.pageModuleCode}>${element.pageModuleName}</option>`);
                    }
                }
                let pageCode = $(self.node.dom).find('#pageList').val();
                self.queryRegion(channelCode, pageCode);
            } else {
                if (response.responseCode == '900106') {
                    Dialog.alert(response.msg || response.responseMsg);
                    window.top.location.href = "http://bcoms.paic.com.cn/bcoms/login";
                    return;
                } else {
                    Dialog.alert(response.msg || response.responseMsg);
                }
            }

        });
    }
    //查区域
    queryRegion(channelCode, parentCode) { 
            var self = this;
            let data1 = {
                'parentCode': parentCode
            };
            $.get(httpreq.PS_QryPageRegionInfo, data1, (response) => {
                if (response.code == '000000') {
                    let pageRegionList = [];
                    pageRegionList = response.data;
                    let pageCodeParam = $(self.node.dom).find("#pageList").val();
                    $(".proModelContainer").html('');
                    self.queryRecPro(channelCode, pageCodeParam, pageRegionList);
                } else {
                    if (response.responseCode == '900106') {
                        Dialog.alert(response.msg || response.responseMsg);
                        window.top.location.href = "http://bcoms.paic.com.cn/bcoms/login";
                        return;
                    } else {
                        Dialog.alert(response.msg || response.responseMsg);
                    }
                }
            });
        }
        //绑定onchange事件
    bindEvent() {
            var self = this;
            $("#recList").on('change', (event) => {
                let recCode = $(event.currentTarget).val();
                let merchantCode = $(self.node.dom).find('#fXList').val();
                self.queryPage(recCode,merchantCode);
            });
            $("#fXList").on('change', (event) => {
                let merchantCode = $(event.currentTarget).val();
                let recCode = $(self.node.dom).find('#recList').val();
                self.queryPage(recCode,merchantCode);
            });
            $("#pageList").on('change', (event) => {
                let channelCode = $(self.node.dom).find('#recList').val();
                let pageCode = $(event.currentTarget).val();
                self.queryRegion(channelCode, pageCode);
            });
            $('#recStatus').on('change', (event) => {
                let channelCode = $(self.node.dom).find('#recList').val();
                let pageCode = $(self.node.dom).find('#pageList').val();
                self.queryRegion(channelCode, pageCode);
            })
            $('body').on('click', '#proSearchBtn', (event) => {
                this.validataSearchForm();
            });
            //选择产品或者是运营内容
            $('body').on('click',":radio[name='checkItem']",(event) => {
                this.conditionShowEvents(event);
            });
            //选择产品时彈出框添加按鈕事件
            $('body').on('click', '#dialogBtnAdd', () => {
                this.addToRecommendedLib();
            });
            //选择产品时彈出框控制指标收益显示
            $('body').on('click',":radio[name='prdproTarget']", (e) => {
                  var curAddPrdTarget=e.target;
                if(curAddPrdTarget.value=='1'){
                   $('#prdTargetVal').css("display","block");
                }else{
                   $('#prdTargetVal').css("display","none")
                }
            });
            //选择运营内容时彈出框添加按鈕事件
            $('body').on('click', '#dialogAddBtn', () => {
                this.addToOperationLib();
            });
            //当产品唯一时 产品的模糊搜索结果唯一
            $('body').on('click', '#proType', (e) => {
                this.showOneProduct(e);
            });
            $('body').on('click', '#pzProbq', (event) => { //配置产品标签
                this.currentRegionCode = $(event.currentTarget).parents('table').attr('id').split('-')[1];
                let tableId = $(event.currentTarget).parents('table').attr('id');
                let uuid = $(event.currentTarget).parent().prev('button').attr('uuid');
                this.pzTagList(tableId, uuid);
            });
            $('body').on('click', '#editPro', (event) => { //编辑产品
                let tableId = $(event.currentTarget).parents('table').attr('id');
                let curRegion = $(event.currentTarget).parents('table').attr('id').split('-')[1];
                let uuid = $(event.currentTarget).parent().prev('button').attr('uuid');
                this.editprd(tableId, uuid, curRegion);
            });
        }
        // 创建查询列表
    queryRecPro(channelCode, pageCodeParam, pageRegionList) {
            var self = this;
            let url = httpreq.PS_QuerySelectedLibList;
            let redStatus = $('#recStatus').val();
            let data = {
                pageCode: pageCodeParam,
                channelId: channelCode,
                redStatus: redStatus
            };
            utils.xhr.post(url, data, (response) => {
                if (!response.data) {
                    self._pageData = [];
                } else {
                    self._pageData = response.data.selectedLibList;
                    _.each(response.data.selectedLibList, (item) => {
                        item.getId = item.prdCode + item.recommendSubCode + item.redStatus
                    });
                    if (pageRegionList.length > 0) {
                        for (let index = 0; index < pageRegionList.length; index++) {
                            let element = pageRegionList[index];
                            let regionCode = `${element.pageRegionCode}`;
                            let regionName = `${element.pageRegionName}`;
                            let tableId = `#table-${element.pageRegionCode}`;
                            self.createInnerHtml(regionCode, regionName);
                            let selectBtnId = `#${element.pageRegionCode}-select-btn`;
                            let deleteBtnId = `#${element.pageRegionCode}-delete-btn`;
                            let addTagBtnId = `#${element.pageRegionCode}-addtag`;
                            self.showTable(tableId, regionCode, self._pageData);
                            self.bindBtnEvent(selectBtnId, deleteBtnId, addTagBtnId, regionCode, regionName);
                        }
                    }else{
                        $(".proModelContainer").html(" <p class='form-control-static tac'>暂无记录</p>")
                    }
                }
            }, (res) => {
                self._pageData = [];
            });
        }
        //操作按钮绑定事件
    bindBtnEvent(selectBtnId, deleteBtnId, addTagBtnId, regionCode, regionName) {
            var self = this;
            $(selectBtnId).on("click", (event) => { //绑定选择按钮
                self.currentRegionCode = regionCode;
                self.currentRegionName = regionName;
                self.selectPro();
            });
            $(deleteBtnId).on("click", (event) => { //绑定下架按钮
                self.currentRegionCode = regionCode;
                self.deletetPro();
            });
            $(addTagBtnId).on("click", (event) => { //添加标签代码
                self.currentRegionCode = regionCode;
                self.addTagList();
            });
        }
        //配置标签
    pzTagList(tableId, uuid) {
            let curRegCode = `#table-${this.currentRegionCode}`;
            const tableIdName = '#' + tableId;
            let sel = $(tableIdName).bootstrapTable('getRowByUniqueId', uuid);
            this.tagShow(curRegCode, sel, 0);
        }
        //添加标签
    addTagList() {
        let curRegCode = `#table-${this.currentRegionCode}`;
        let sel = $(curRegCode).bootstrapTable('getAllSelections');
        if (sel.length === 0) {
            Dialog.alert('请选择需要添加标签的产品！');
            return;

        } else {
            this.tagShow(curRegCode, sel, 1);
        }
    }
    showOneProduct(e){
        let targetVal=$(e.currentTarget).val();
        if(targetVal=='06'){
            this.romateHtml.find("#proCode").val('GOLD_DT');
            this.romateHtml.find("#proCode").prop('disabled',true);
        }else if(targetVal=='07'){
            this.romateHtml.find("#proCode").val('GOLD_SHARE');
            this.romateHtml.find("#proCode").prop('disabled',true);
        }
        else{
            this.romateHtml.find("#proCode").val('');
            this.romateHtml.find("#proCode").prop('disabled',false);
        }
    }
    tagShow(curRegCode, selectList, flag) {
           for(var i=0;i<selectList.length;i++){//内容类型为运营内容的不能添加标签
                if(selectList[i].recommendType=='1'){
                    Dialog.alert('所选的内容类型不能包含运营内容');
                    return 
                }
            };
            var self = this;
            let tagSelectorDialog = TagSelector.show({
                type: "tag",
                singleSelect: true,
                canalsCode: $("#recList").val(), //渠道号
                isProduct: 0
            }, (list) => {
                if (list.length === 0) {
                    Dialog.alert('请勾选标签!');
                    return
                }
                var tagData = list[0];
                let prdCodeList = "";
                if (flag == 0) {
                    if(selectList.prdType=='04'){
                        prdCodeList = selectList.productId + ":" + selectList.prdType;
                    }else{
                        prdCodeList = selectList.prdCode + ":" + selectList.prdType;
                    }
                }else{
                    _.each(selectList, (i, index) => {
                        if (i.channelProductInfo.type == '04') { //大额存单上传的prdCodeList参数是productId
                            prdCodeList += i.productId + ':' + i.channelProductInfo.type + '|';
                        } else {
                            prdCodeList += i.prdCode + ':' + i.channelProductInfo.type + '|';
                        }
                    });
                    prdCodeList = prdCodeList.substring(0, prdCodeList.length - 1);
                }
                let data = {
                    prdCodeList: prdCodeList,
                    labelId: tagData.tagCode,
                    region: self.currentRegionCode,
                    pageCode: $('#pageList').val(),
                    labelName: tagData.name,
                    recommend: 'RECOMMEND',
                    channelId: $("#recList").val()
                };
                utils.xhr.post(httpreq.editSelectedProduct, data, (res) => {
                    $(".proModelContainer").html('');
                    self.queryRegion($('#recList').val(), $('#pageList').val())
                    $(curRegCode).bootstrapTable('refresh');
                });
            });
        }
        //搜索弹出框
    selectPro() {
            this.addDialog = Dialog.show({
                title: '挑选产品/运营内容',
                width: 800,
                nl2br: false,
                message: () => {
                    this.romateHtml.find("#otherInfo1,#otherInfo2,#otherInfo3,#addProToDom").empty();
                    this.romateHtml.find("#proCode").val('');
                    this.romateHtml.find("#addProTo").css('display', 'none');
                    this.romateHtml.find("#prodcutRadio").css('display', 'block');
                    this.romateHtml.find("#operationRadio").css('display', 'none');
                    this.romateHtml.find("#checkPrdItemOne").prop('checked', true);
                    // let prdTy = this.romateHtml.find("#proType");
                    // prdTy.change(() => {
                    // if(prdTy.val() == "04"){
                    //     this.romateHtml.find(".len").css('margin','20px 0 0 150px')
                    //     this.romateHtml.find("#isDes").show();
                    // }else{
                    //     this.romateHtml.find(".len").css('margin','0')
                    //     this.romateHtml.find("#isDes").hide();
                    // }
                    // })
                    this.getSearch();
                    this.showProfitInfo();
                    return this.romateHtml;
                }
            });
        }
     showProfitInfo() {
           //选择运营内容时彈出框控制指标收益显示
            this.romateHtml.find("#profitTarget").on('click','input[type="radio"]', (e) => {
                  var curOperTarget=e.target;
                if(curOperTarget.value=='1'){
                    this.romateHtml.find('#showFlag').css("display","block");
                }else{
                    this.romateHtml.find('#showFlag').css("display","none")
                }
            });
     }   
        //模糊搜索
    getSearch() {
            this.romateHtml.find("#proCode").autocomplete({
                source: function (query, process) {
                    var matchCount = this.options.items; //返回结果集最大数量
                    var data = {
                        "prdCode": query,
                        "operateType": "channelProductInfo",
                        "matchCount": matchCount,
                        "prdType": $('#proType').val(),
                        "extendTwo": $('#recList').val(),
                        "extendOne": "noopsyche"
                    };
                    if($("#proType").val()=="04") data['certDepositClass'] = $("#prdTy").val();
                    utils.xhr.post(httpreq.PS_codeblurSel, data, function (response) {
                        return process(response.data.selectedLibList);
                    });
                },
                formatItem: function (item) {
                    return item["prdCode"] + item["prdName"];
                },
                setValue: function (item) {
                    return {
                        'data-value': item["prdCode"],
                        'real-value': item["prdName"]
                    };
                }
            })

        }
    conditionShowEvents(e){
            $("#corterType").empty();
             for (let index = 0; index < this.getDictionaryTypeJb.length; index++) {
                        let ele = this.getDictionaryTypeJb[index];
                        $("#corterType").append(`<option value=${ele.ddCode}>${ele.ddName}</option>`);
                    };
              $("#customerObj").empty();       
             for (let index = 0; index < this.getDictionaryTypeKq.length; index++) {
                let ele = this.getDictionaryTypeKq[index];
                 $("#customerObj").append(`<label><input type="checkbox" name="customerObj" value=${ele.ddCode}><span>${ele.ddName}</span></label>&nbsp&nbsp`);
             }
            if(e.target.value=='0'){
                $("#prodcutRadio").css('display','block');
                $("#operationRadio").css('display','none');
                if($("#otherInfo1").html()==''){
                    $("#addProTo").css('display','none');
                }else{
                    $("#addProTo").css('display','block');
                }
            }else{
                $("#prodcutRadio").css('display','none');
                $("#addProTo").css('display','none');
                $("#operationRadio").css('display','block');
                $('#netWorthRadio1').prop("checked","checked");
                $('#showFlag').css("display","none");
                $('#addProductToDom').empty().append($('#recList option:selected').text() + '>' + $('#pageList option:selected').text());
                $(".remmondIcon").bind("mouseover", () => {
                        $("#remmendSetTips").show();
                    });
                $(".remmondIcon").bind("mouseout", () => {
                    $("#remmendSetTips").hide();
                });
                $("#showEditInfo").find("input[type='text']").each(function(e){
                    $(this).val(""); 
                });
                 $("#showEditInfo").find("textarea").each(function(e){
                    $(this).val(""); 
                });
            }
      }
        //验证搜索表单
    validataSearchForm() {
            $("#otherInfo1,#otherInfo2,#otherInfo3").empty();
            const romateHtml = this.romateHtml;
            var proCode='';
            const proType = romateHtml.find('#proType').val();
            if(proType=='06'){
                proCode='GOLD_DT';
            }else if(proType=='07'){
                proCode='GOLD_SHARE';
            }else {
              proCode = romateHtml.find('#proCode').val();
              if (proCode == '') {
                Dialog.alert('请输入产品代码!');
                return;
              } 
            }
            this.searchRecPro(proType, proCode);
        }
        //搜索推荐产品
    searchRecPro(proType, proCode) {
        var self = this;
        let url = httpreq.PS_SearchProduct;
        // let isSelected = '';
        // if ($("#isSelected").is(':checked')) {
        //     isSelected = '1';//精选
        // } else {
        //     isSelected = '0';//非精选
        // }
        let params = {
            'prdCode': proCode,
            'prdType': proType,
            //'isSelected': isSelected,
            'operateType': 'ADD',
            'channelId': $("#recList").val()
        };
        //调用搜索接口
        utils.xhr.post(url, params, (response) => {
            if (response.code == "000000") {
                let res = response.data,
                    prdListInfo;
                self.addResData = res;
                let saleStatus = '';
                if (res != undefined && res != '') {
                    if (res.prdCode == 'GOLD_DT' || res.prdCode == 'GOLD_SHARE') {
                        prdListInfo = response.data;
                    } 
                    // else if (res.prdCode == '47301') {
                    //     prdListInfo = response.data;
                    // } 
                    else {
                        prdListInfo = response.data.prdListInfo;
                    };
                    let customersLabel;
                    if (res.prdCode == 'GOLD_DT' || res.prdCode == 'GOLD_SHARE') {
                        customersLabel = self.transCusType(res.customersLabel);
                    } else {
                        customersLabel = self.transCusType(res.prdListInfo.customersLabel);
                    }
                    // let customersLabel = self.transCusType(res.customersLabel);
                    // if (res.isSelected == '1') {
                    //     proIsSelected = '精选';
                    // } else {
                    //     proIsSelected = '非精选';
                    // }
                    if (res.saleStatus == 'NEW_SALE') {
                        saleStatus = `新产品上架`;
                    } else if (res.saleStatus == 'ON_SALE') {
                        saleStatus = `上架中`;
                    } else if (res.saleStatus == 'WAIT_SALE') {
                        saleStatus = `待上架`;
                    } else if (res.saleStatus == 'OFF_SALE') {
                        saleStatus = `已下架`;
                    } else if (res.saleStatus == 'FAIL_SALE') {
                        saleStatus = `上架失败`;
                    } else if (res.saleStatus == 'INIT') {
                        saleStatus = `初始`;
                    } else {
                        saleStatus = `无`;
                    };
                    $("#addProTo").css('display', 'block');
                    $('#addProToDom').empty().append($('#recList option:selected').text() + '>' + $('#pageList option:selected').text());
                    $("#otherInfo1").empty().append(`
                      
                      <div class="form-group">
                        <label class="col-sm-3 control-label">产品名称:</label>
                        <div class="col-sm-8" style="line-height:34px;">
                        ${res.prdName}
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="col-sm-3 control-label">上架状态:</label>
                        <div class="col-sm-8" style="line-height:34px;">
                         ${saleStatus}
                        </div>
                      </div>
                    
                    `);
                    $("#otherInfo3").empty().append(`
                      <div class="bp10"><div class="form-group">
                            <label class="col-sm-3 control-label">推荐产品名称/运营标题:</label>
                            <div class="col-sm-8" style="line-height:34px;">
                            <input type="text" class="form-control fl w80"  id="recommendName">
                            <span class="glyphicon glyphicon-question-sign m8 remmondIcon"></span>
                            <div class="card-tip6" id="remmendTips" style="display:none"><i class="icon58"></i>如设置，客户端产品将显示为推荐产品名称</div>
                            </div>
                        </div>
                       <div class="form-group">
                            <label class="col-sm-3 control-label">角标:</label>
                            <div class="col-sm-8" style="line-height:34px;">
                             <select class="form-control" id="jbType" style="width:135px">
                             </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">客群:</label>
                            <div class="col-sm-8" style="line-height:34px;" id='kqfcList'>
                              
                            </div>
                        </div>
                        <div class="form-group" id="prdTarget">
                            <label for="lastname" class="col-sm-3 control-label">收益指标:</label>
                            <label class="checkbox-inline">
                            <input type="radio" name="prdproTarget" checked value="0">使用产品
                            </label>
                            <label class="checkbox-inline">
                            <input type="radio" name="prdproTarget" value="1">自定义
                            </label>
                        </div>
                        <div class="form-group" id="prdTargetVal" style="display:none;">
                            <div>
                            <label for="lastname" class="col-sm-3 control-label"></label>
                            <span style="margin-left:20px">指标名称</span>
                            <input style="margin-left:40px" type="text" id="prdProTargetName">
                            </div>
                            <div style="margin-top: 15px">
                            <label for="lastname" class="col-sm-3 control-label"></label>
                            <span style="margin-left:20px">指标值</span>
                            <input style="margin-left:54px" type="text" id="prdProTargetVal">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">详情备注1:</label>
                            <div class="col-sm-8" style="line-height:34px;">
                            <textarea style="height:60px;" class="form-control" id="remark"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">详情备注2:</label>
                            <div class="col-sm-8" style="line-height:34px;">
                            <textarea style="height:60px;" class="form-control" id="addRemarkTwo"></textarea>
                            </div>
                        </div>
                         <div class="form-group">
                            <label class="col-sm-3 control-label">营销话术:</label>
                            <div class="col-sm-8" style="line-height:34px;">
                            <textarea style="height:60px;" class="form-control" id="yxhs"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">跳转链接:</label>
                            <div class="col-sm-8" style="line-height:34px;">
                            <input type="text" class="form-control fl"  id="interlinking">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">图片链接:</label>
                            <div class="col-sm-8" style="line-height:34px;">
                            <input type="text" class="form-control fl"  id="picturelinking">
                            </div>
                        </div>
                        </div><div id="dialogBtnBox" class="text-right">
                        <button type="button" id="dialogBtnAdd" class="btn btn-primary mt_15">提交审核</button>
                        </div>
                    `);
                    for (let index = 0; index < self.getDictionaryTypeJb.length; index++) {
                        let ele = self.getDictionaryTypeJb[index];
                        $("#jbType").append(`<option value=${ele.ddCode}>${ele.ddName}</option>`);
                    }
                    for (let index = 0; index < self.getDictionaryTypeKq.length; index++) {
                        let ele = self.getDictionaryTypeKq[index];
                        $("#kqfcList").append(`<label><input type="checkbox" name="kqfcName" value=${ele.ddCode}><span>${ele.ddName}</span></label>&nbsp&nbsp`);
                    }
                    if ($('#proType').val() == '02') { //代销
                        self.addCurPrdData = { //存代销产品属性和产品状态
                            'prdArr': response.extendData.prdArr,
                            'status': response.extendData.status
                        };
                        $("#otherInfo2").empty().append(`
                            <div class="form-group">
                                <label class="col-sm-3 control-label">产品状态:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                  ${response.extendData.status?self.prdStatusData[response.extendData.status]:""}
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-3 control-label">产品属性:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${response.extendData.prdArrName?response.extendData.prdArrName:""}
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-3 control-label">预期收益率:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${res.prdListInfo.planRate?res.prdListInfo.planRate:""}%
                                </div>
                            </div>
                            <div class="form-group">
                                    <label class="col-sm-3 control-label">个人首次购买起点:</label>
                                    <div class="col-sm-8" style="line-height:34px;">
                                    ${res.subMinAmt?res.subMinAmt:""}元
                                    </div>
                                </div>
                            <div class="form-group">
                                    <label class="col-sm-3 control-label">募集截止日期:</label>
                                    <div class="col-sm-8" style="line-height:34px;">
                                    ${res.prdListInfo.saleEndDate?res.prdListInfo.saleEndDate:""}
                                    </div>
                            </div>
                                
                            `);

                    } else if ($('#proType').val() == '01') { //本行
                        $("#otherInfo2").empty().append(`
                            <div class="form-group">
                                <label class="col-sm-3 control-label">总额度(剩余额度):</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${res.prdListInfo.totalQuota?res.prdListInfo.totalQuota:""}(${res.prdListInfo.remainQuota?res.prdListInfo.remainQuota:""})元
                                </div>
                            </div>
                            <div class="form-group">
                            <label class="col-sm-3 control-label">预期收益率:</label>
                            <div class="col-sm-8" style="line-height:34px;">
                                ${res.prdListInfo.planRate?res.prdListInfo.planRate:""}%
                            </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-3 control-label">购买起点:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${res.subMinAmt?res.subMinAmt:""}元
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-3 control-label">销售截止日期时间:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${res.prdListInfo.saleEndDate?res.prdListInfo.saleEndDate:""}
                                </div>
                            </div> `);
                    } else if ($('#proType').val() == '04') { //大额存单
                        $("#otherInfo2").empty().append(`
                            <div class="form-group">
                                <label class="col-sm-3 control-label">产品状态:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                   ${this._getPrdStatus(prdListInfo).statusName?this._getPrdStatus(prdListInfo).statusName:""} 
                                </div>
                            </div>
                            <div class="form-group">
                            <label class="col-sm-3 control-label">存款类型:</label>
                            <div class="col-sm-8" style="line-height:34px;">
                                ${prdListInfo.prdType?(prdListInfo.prdType=="0"?'发售':'转让'):""} 
                            </div>
                            </div>
                            <div class="form-group" id="resellTypeDiv" style="display:none">
                                <label class="col-sm-3 control-label">转让类型:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                     ${prdListInfo.resellType?(prdListInfo.resellType=="0"?'指定':'挂网'):""}
                                </div>
                            </div>
                             <div class="form-group">
                                <label class="col-sm-3 control-label">产品期限:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                     ${this.getSaleDate(prdListInfo.saveDeadline)}
                                </div>
                            </div>
                             <div class="form-group">
                                <label class="col-sm-3 control-label">总额度:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                    ${prdListInfo.totalQuota?prdListInfo.totalQuota:""}
                                </div>
                            </div>
                             <div class="form-group">
                                <label class="col-sm-3 control-label">剩余额度:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                    ${prdListInfo.remainQuota?prdListInfo.remainQuota:""}
                                </div>
                            </div>
                             <div class="form-group">
                                <label class="col-sm-3 control-label">募集/转让终止日:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                    ${this._formatDate(prdListInfo.saleEndDate)}
                                </div>
                            </div>`);
                        if (prdListInfo.prdType == "1") {
                            $("#otherInfo2").find("#resellTypeDiv").show();
                        }
                    } else if ($('#proType').val() == '06') { //黄金定投
                        $("#otherInfo2").empty().append(`
                            <div class="form-group">
                                <label class="col-sm-3 control-label">报价单位:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${prdListInfo.quoteUnit?prdListInfo.quoteUnit:""}
                                </div>
                            </div>
                            <div class="form-group">
                            <label class="col-sm-3 control-label">投资方式:</label>
                            <div class="col-sm-8" style="line-height:34px;">
                                ${prdListInfo.investmentStyle?prdListInfo.investmentStyle:""}
                            </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-3 control-label">交易单位:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${prdListInfo.tradingUnit?prdListInfo.tradingUnit:""}
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-3 control-label">协议期限:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${prdListInfo.agreedPeriod?prdListInfo.agreedPeriod:""}
                                </div>
                            </div> `);
                    } else if ($('#proType').val() == '07') { //黄金份额认购产品
                        $("#otherInfo2").empty().append(`
                            <div class="form-group">
                            <label class="col-sm-3 control-label">投资方式:</label>
                            <div class="col-sm-8" style="line-height:34px;">
                                ${prdListInfo.investmentStyle?prdListInfo.investmentStyle:""}
                            </div>
                            </div>`);
                    }else if ($('#proType').val() == '09') { //定活宝-定活通
                         //产品为定活宝-定活通时，对存期进行单位的转译
                         let saveDeadline=prdListInfo.saveDeadline;
                         if(saveDeadline.charAt(saveDeadline.length-1)=='Y'){
                         saveDeadline=`${saveDeadline.charAt(0)}年`
                        };
                        $("#otherInfo2").empty().append(`
                            <div class="form-group">
                                <label class="col-sm-3 control-label">交易币种:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${response.data.ccy?response.data.ccy:""}
                                </div>
                            </div>
                            <div class="form-group">
                            <label class="col-sm-3 control-label">起存金额:</label>
                            <div class="col-sm-8" style="line-height:34px;">
                                ${prdListInfo.minBuyAmt?prdListInfo.minBuyAmt:""}
                            </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-3 control-label">存期:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${saveDeadline?saveDeadline:""}
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-3 control-label">到期利率:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${prdListInfo.planRate?prdListInfo.planRate:""}%
                                </div>
                            </div> 
                               <div class="form-group">
                                <label class="col-sm-3 control-label">付息方式:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                智能付息
                                </div>
                            </div>    
                            <div class="form-group">
                                <label class="col-sm-3 control-label">是否提前支取:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${response.data.drawControlType?response.data.drawControlType:""}
                                </div>
                            </div>`);
                    }
                    $(".remmondIcon").bind("mouseover", () => {
                        $("#remmendTips").show();
                    });
                    $(".remmondIcon").bind("mouseout", () => {
                        $("#remmendTips").hide();
                    });

                } else {
                    $("#otherInfo").empty();
                    Dialog.alert(response.msg);
                }
            }
        }, (res) => {
            $("#otherInfo").empty();
            Dialog.alert(response.msg || response.responseMsg)
        });
    }
    _formatDate(val) {
        if (!val) {
            return "";
        }
        if (val.length == 8) {
            return val.substring(0, 4) + "-" + val.substring(4, 6) + "-" + val.substring(6, 8);
        } else {
            return moment(val).format("YYYY-MM-DD");
        }
    }
    _getPrdStatus(data) {
            const statusMap0 = {
                "01": "新建",
                "02": "删除",
                "03": "复核中",
                "04": "复核通过",
                "05": "募集中",
                "06": "募集结束",
                "07": "到期结清"
            };
            const statusMap1 = {
                "01": "转让中",
                "02": "已转让",
                "03": "已撤"
            };
            if (data.prdType == "0") {
                data.statusName = statusMap0[data.prdState];
            } else if (data.prdType == "1") {
                data.statusName = statusMap1[data.prdState];
            } else {
                data.statusName = "";
            }
            return data;
        }
        //添加推荐运营内容第一步
        addToOperationLib(){
            let custType = []; //客群分层
            let custTypeName = [];
            let cornerSignName = $('#corterType option:selected').text();
            $("input[name='customerObj']:checked").each(
                function () {
                    custType.push($(this).val());
                    custTypeName.push($(this).next().text());
                }
            );
            let addQueryParam = {
                'recommendType':1,
                'channelId': $('#recList').val(),
                'pageCode': $('#pageList').val(),
                'index': '',
                'region':this.currentRegionCode,
                'remark':$("#descOne").val(),
                'remark1':$("#descTwo").val(),
                'isCustomReturnIndex':$("#profitTarget").find("input[type='radio']:checked").val(),//获取收益指标状态
                'recommendName': $("#recommendNameTitle").val(), //推荐产品名称
                'marketing': $("#saleLang").val(), //营销话术
                'cornerSign': $("#corterType").val(), //角标
                'cornerSignName':$("#corterType option:selected").text(), //角标名称
                'custType': custType.join(":"),
                'custTypeName': custTypeName.join(":"),
                'redirectUrl':$("#connectlinking").val(),
                'pictureUrl':$("#piclinking").val()
            };
            if(addQueryParam.isCustomReturnIndex=='1'){
                addQueryParam['indexName']=$("#incomeTargetName").val();//获取指标名称
                addQueryParam['indexContent']=$("#incomeTargetVal").val();//获取指标内容
            }
            this.addToLibSuccess(addQueryParam);  
        }
        //添加推荐产品第一步
    addToRecommendedLib() {
            let custType = []; //客群分层
            let custTypeName = [];
            $("input[name='kqfcName']:checked").each(
                function () {
                    custType.push($(this).val());
                    custTypeName.push($(this).next().text());
                }
            );
            let cornerSignName = $('#jbType option:selected').text();
            let addQueryData = {
                'recommendType':0,
                'prdCode': this.addResData.prdCode,
                'index': '',
                'distributionChannel':$(this.node.dom).find("#fXList").val(),
                'pageCode': $('#pageList').val(),
                // 'distributionChannel':$("#fXList").val(),
                'region': this.currentRegionCode,
                'prdType': $('#proType').val(),
                'channelId': $('#recList').val(),
                'remark': $("#remark").val(), //产品备注1 
                'remark1':$("#addRemarkTwo").val(), //产品备注2
                'isCustomReturnIndex':$("#prdTarget").find("input[type='radio']:checked").val(),//获取收益指标状态
                'regionsName': $('#pageList option:selected').text() + '-->' + this.currentRegionName,
                'reviewType': '1',
                'cornerSign': $("#jbType").val(), //角标
                'cornerSignName': cornerSignName == "请选择" ? "" : cornerSignName,
                'custType': custType.join(":"),
                'custTypeName': custTypeName.join(":"),
                'marketing': $("#yxhs").val(), //营销话术
                'recommendName': $("#recommendName").val(), //推荐产品名称
                'prdId': this.addResData.productId,//大额存单产品productId
                //新加图片、跳转链接
                'redirectUrl':$("#interlinking").val(),
                'pictureUrl':$("#picturelinking").val(),
            };
            if(addQueryData.isCustomReturnIndex=='1'){
                addQueryData['indexName']=$("#prdProTargetName").val();//获取指标名称
                addQueryData['indexContent']=$("#prdProTargetVal").val();//获取指标内容
            }
            if ($('#proType').val() == '02') {
                addQueryData.prdArr = this.addCurPrdData.prdArr;
                addQueryData.status = this.addCurPrdData.status;
            }
            this.addToRecommendedLibSuccess(addQueryData);
        }
        //添加运营内容第二步
        addToLibSuccess(addQueryParam){
            var channelMapToBussType = {
                "C0003": "003", //产品货架—口袋
                "C0007": "004", //产品货架—千人千面
                "C0009": "005", //产品货架-金管家
                "C0010": "008", //产品货架-厅堂
                "C0012": "009" //产品货架-新口袋银行
            };
            this.addDialog.close();
             EditRemark.show({
                btnLabel: '提交审批',//设置按钮的文字,非必传，默认【提交审批】
                businessType: channelMapToBussType[addQueryParam.channelId], //业务类型----传渠道
            }, (data) => { //返回信息包括
                var transDataParam = { //转字段名字
                    applyRemark: data.describe, //申请备注
                    priorityLevel: data.priorityLevel, //优先级
                    applyTit: data.reviewTaskName, //申请标题
                    businessType:data.businessType //业务类型
                };
                var addData = _.extend({}, transDataParam, addQueryParam);
                this.addToRecommended(addData, 2);
            });
        }
        //添加产品第二步
       addToRecommendedLibSuccess(queryData) {
            var channelMapToBuss = {
                "C0003": "003", //产品货架—口袋
                "C0007": "004", //产品货架—千人千面
                "C0009": "005", //产品货架-金管家
                "C0010": "008", //产品货架-厅堂
                "C0012": "009" //产品货架-新口袋银行
            };
            this.addDialog.close();
            EditRemark.show({
                verifyType: "0006", //审批类型,必传；
                businessType: channelMapToBuss[queryData.channelId], //业务类型----传渠道
                btnLabel: '提交审批' //设置按钮的文字,非必传，默认【提交审批】
            }, (data) => { //返回信息包括
                var transData = { //转字段名字
                    reviewUser: data.applicant ? data.applicant : '', //申请人
                    reviewType: data.verifyType, //审批类型
                    applyRemark: data.describe, //申请备注
                    priorityLevel: data.priorityLevel, //优先级
                    applyTit: data.reviewTaskName, //申请标题
                    businessType: data.businessType //业务类型
                };
                var addData = _.extend({}, transData, queryData);
                this.addToRecommended(addData, 2);
            });
        }
        //添加成功
    addToRecommended(option, addFlag) {
            var self = this;
            let data = option;
            if (addFlag == 2) {
                option.redStatus = 2;
            };
            let url  = httpreq.PS_recommendAdd;
            utils.xhr.post(url, data, (response) => {
                let curRegCode = `#table-${self.currentRegionCode}`;
                let pageCodeParam = $('#pageList').val();
                $(".proModelContainer").html('');
                self.queryRegion($(self.node.dom).find('#recList').val(),  $(self.node.dom).find('#pageList').val())
                $(curRegCode).bootstrapTable('refresh');
            });
        }
        //下架选中产品
    deletetPro() {
        var self = this;
        let curRegCode = `#table-${self.currentRegionCode}`;
        let recommendIdList = [];
        let ids = [];
        let list = $(curRegCode).bootstrapTable('getAllSelections');
        for (let i = 0; i < list.length; i++) {
                let recommendId=list[i].id;
                recommendIdList.push(recommendId);
        }
        let recommendList=recommendIdList.join(':'); 
        let data = {
             recommendIds:recommendList,
        };
        let url = httpreq.recommendDelete;
        if (list.length != 0) {
            utils.xhr.post(url, data, (response) => {
                let curRegCode = `#table-${self.currentRegionCode}`;
                for (let i = 0; i < list.length; i++) {
                    ids.push(list[i].prdCode);
                }
                $(curRegCode).bootstrapTable('refresh', {
                    field: 'prdCode',
                    values: ids
                });
                self.queryRegion($(self.node.dom).find('#recList').val(), $(self.node.dom).find('#pageList').val())
            });
        } else {
            Dialog.alert('请选择需要下架的产品！')
        }

    }
    createInnerHtml(regionCode, regionName) {
        $(".proModelContainer").append(`
                <nav class="navbar navbar-default" style="margin-bottom:0px;">
                        <div class="container-fluid">
                            <form class="navbar-form navbar-left" role="search">
                              <p style="margin:0px;line-height:34px;">${regionName}</p>
                           </form>
                            <form class="navbar-form navbar-right" role="search">
                              <button type="button" class="btn btn-primary"  id="${regionCode}-select-btn"  style="width:150px;">挑选产品/运营内容</button>
                              <button type="button" class="btn btn-warning" id="${regionCode}-delete-btn" style="width:150px;">下架选中产品</button>
                              <button type="button" class="btn btn-info" id="${regionCode}-addtag" style="width:150px;">添加标签</button>
                            </form>
                        </div>
                </nav>
              
                <div id="proRecList" style="margin-bottom:30px;">
                    <table id="table-${regionCode}"></table>
                    <div style="margin-top:5px;">共<span id="dataNum" style="color:#ff0000;margin:0 5px;"></span>条</div>
                </div>`);
    }
    showTable(tableId, regionCode, _pageData) {
        var self = this;
        let _tableData = [];
        _tableData = _.filter(_pageData, (item) => {
                    return item.recommendSubCode == regionCode
        });
        $(tableId).next('div').find("#dataNum").text(_tableData.length);
        $(tableId).bootstrapTable({
            data: _tableData,
            pagination: false,
            uniqueId: 'getId',
            columns: [{
                title: '',
                field: '_isChecked',
                align: 'center',
                valign: 'middle',
                checkbox: true
            }, {
                title: '排序',
                field: 'index',
                align: 'center',
                valign: 'middle'
            }, {
                title: '推荐状态',
                field: 'redStatus',
                align: 'center',
                valign: 'middle',
                formatter: (value) => {
                    if (value == '1') {
                        return `已推荐`;
                    } else if (value == '2') {
                        return `待推荐`;
                    } else {
                        return `推荐失败`;
                    }
                }
            }, {
                title: '内容类型',
                field: 'recommendType',
                align: 'center',
                valign: 'middle',
                formatter:(value)=>{
                    if(value == '1'){
                         return `运营内容`;
                    }else{
                         return `产品`;
                    }
                }
            },{
                title: '产品类型',
                field: 'prdType',
                align: 'center',
                valign: 'middle',
                formatter: (value) => {
                    if (value == '01') {
                        return `本行理财产品`;
                    } else if (value == '02') {
                        return `代销理财产品`;
                    } else if (value == '04') {
                        return `大额存单产品`;
                    }else if (value == '06') {
                        return `黄金定投产品`;
                    }else if (value == '07') {
                        return `黄金份额产品`;
                    }else if (value == '09') {
                        return `本行存款产品`;
                    }
                }

            }, {
                title: '产品代码',
                field: 'recommendType',
                align: 'center',
                valign: 'middle',
                formatter: (value,row) => {
                    if(value=='1'){
                          return  row.prdCode||'';
                    }else{
                          return row.channelProductInfo.prdCode;
                    }
                }
            }, {
                title: '产品名称',
                field: 'recommendType',
                align: 'center',
                valign: 'middle',
                formatter: (value,row) => {
                    if(value=='1'){
                          return  row.prdName||'';
                    }else{
                          return row.channelProductInfo.prdName;
                    }
                }
            }, {
                title: '客层分类',
                field: 'recommendType',
                align: 'center',
                valign: 'middle',
                formatter: (value,row) => {
                    if(value=='1'){
                          return self.transCusType(row.custType);
                    }else{
                         if (row.channelProductInfo.prdListInfo) {
                            return self.transCusType(row.channelProductInfo.customersLabel);
                        } else {
                            return self.transCusType(row.channelProductInfo.customersLabel);
                        }
                    }
                }

            }, {
                title: '上架状态',
                field: 'saleStatus',
                align: 'center',
                valign: 'middle',
                formatter: (value) => {
                    if (value == 'NEW_SALE') {
                        return `新产品上架`;
                    } else if (value == 'ON_SALE') {
                        return `上架中`;
                    } else if (value == 'WAIT_SALE') {
                        return `待上架`;
                    } else if (value == 'OFF_SALE') {
                        return `已下架`;
                    } else if (value == 'FAIL_SALE') {
                        return `上架失败`;
                    } else if (value == 'INIT') {
                        return `初始`;
                    } else if (value == 'NULL') {
                        return `无`;
                    } else {
                        return '-'
                    }
                }
            }, {
                title: '推荐产品名称/运营标题',
                field: 'recommendName',
                align: 'center',
                valign: 'middle'
            }, {
                title: '详情备注1',//recommendType
                field: 'remark',
                align: 'center',
                valign: 'middle'
            }, {
                title: '营销话术',
                field: 'marketing',
                align: 'center',
                valign: 'middle'

            }, {
                title: '角标',
                field: 'cornerSignName',
                align: 'center',
                valign: 'middle'

            }, {
                title: '客群',
                field: 'custTypeName',
                align: 'center',
                valign: 'middle'

            }, {
                title: '标签/组合标签',
                field: 'recommendType',
                align: 'center',
                valign: 'middle',
               formatter: (value,row) => {
                    if(value=='1'){
                          return  row.channelComLabelCodeListName||'';
                    }else{
                          return  row.channelProductInfo.channelComLabelCodeListName;
                    }
                }
            }, {
                title: '操作',
                field: 'opEnter',
                align: 'center',
                valign: 'middle',
                formatter: (value, row, index) => {
                    if(row.recommendType=='1'){//根据运营内容去判断
                         return `<div class="btn-group" style = 'vertical-align: null;'>
                                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" uuid="${row.getId}">
                                    功能 <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-right" role="menu">
                                    <li id="editContent"><a href="#" >编辑运营内容</a></li>
                                </ul>
                                </div>`;
                    }else{
                         return `<div class="btn-group" style = 'vertical-align: null;'>
                                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" uuid="${row.getId}">
                                    功能 <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-right" role="menu">
                                    <li id="pzProbq"><a href="#" >添加产品标签</a></li>
                                    <li id="editPro"><a href="#" >编辑产品配置</a></li>
                                </ul>
                                </div>`;
                    }
                },
               events: {
                    'click #editContent': (e, value, row, index) => {
                        let tableId = $(e.currentTarget).parents('table').attr('id');
                        let curRegion = $(e.currentTarget).parents('table').attr('id').split('-')[1];
                        this.editOperation(tableId, row, curRegion);
                    }
                    
                }
            }]
        });
    }
    editOperation(tableId, row, curRegion){
         const tableIdName = '#' + tableId;
          let editOperationDialogHtml = Dialog.show({
                title: '编辑运营内容',
                nl2br: false,
                message: () => {
                    this.getOperationDatas(this.editOPerationHtml,row);
                    return this.editOPerationHtml;
                }
            });
            $(this.editOPerationHtml.find('#topFlag')).on('click', (event) => {
                this.checkTopFlag(this.editOPerationHtml);
            });
            this.editOPerationHtml.find('#fitTarget').on('click', "input[type='radio']",(e) => {
                var curTarget=e.target;
                if(curTarget.value=='1'){
                    this.editOPerationHtml.find('#opeTargetVal').css("display","block");
                    this.editOPerationHtml.find('#editincomeTargetName').val("");
                    this.editOPerationHtml.find('#editincomeTargetVal').val("");
                }else{
                    this.editOPerationHtml.find('#opeTargetVal').css("display","none")
                }
            })
            $(this.editOPerationHtml.find('#toExamineBtn')).on('click', () => { //提交审核按钮
                let newIndex = $("#index").val();
                editOperationDialogHtml.close();
                row.index = newIndex;
                let examineStatus = '01'; //状态标示
                this.saveEditOperation(row, curRegion, examineStatus);
            })
    }
  editprd(tableId, uuid, curRegion) {
        const tableIdName = '#' + tableId;
        const row = $(tableIdName).bootstrapTable('getRowByUniqueId', uuid);
        const status = row.redStatus;
        if (status == '1') { //审核通过
            let editDialogHtml1 = Dialog.show({
                title: '编辑产品',
                nl2br: false,
                message: () => {
                    this.getDatas(this.editHtml, row)
                    this.editHtml.find("#index,#remark,#remarkInfoTwo,#prdincomeTargetName,#prdincomeTargetVal,#interlinking,#picturelinking,#marketing,#edit-cornerSign,#topFlag,input[name='kqfcName'],#edit-recommendName").removeAttr('disabled');
                    this.editHtml.find("input[type='radio']").attr("disabled",false);
                    this.editHtml.find('#toExamineBtn').text('保存').css('display', 'inline-block');
                    return this.editHtml;
                }
            });
            $(this.editHtml.find('#topFlag')).on('click', (event) => {
                this.checkTopFlag(this.editHtml);
            });
            this.editHtml.find('#prdProfitTarget').on('click', "input[type='radio']",(e) => {
                var curTarget=e.target;
                if(curTarget.value=='1'){
                    this.editHtml.find('#prdincomeTargetName').val("");
                    this.editHtml.find('#prdincomeTargetVal').val("");
                    this.editHtml.find('#targetVal').css("display","block");
                }else{
                    this.editHtml.find('#targetVal').css("display","none")
                }
            });
            $(this.editHtml.find('#toExamineBtn')).on('click', () => { //提交审核按钮
                let newIndex = $("#index").val();
                editDialogHtml1.close();
                row.index = newIndex;
                let examineStatus = '01'; //状态标示
                this.toExamineBtn(row, curRegion, examineStatus);
            })
        }
        if (status == '2') { //审核中
            let editDialogHtml2 = Dialog.show({
                title: '编辑产品',
                nl2br: false,
                message: () => {
                    this.getDatas(this.editHtml, row);
                    this.editHtml.find('#toExamineBtn').empty().css('display', 'none');
                    this.editHtml.find("#index,#remarkInfoTwo,#prdincomeTargetName,#prdincomeTargetVal,#interlinking,#picturelinking,#topFlag,#marketing,#remark,input[name='kqfcName'],#edit-cornerSign,#edit-recommendName").attr('disabled', 'disabled');
                    this.editHtml.find("input[type='radio']").attr("disabled",true);
                    return this.editHtml;
                }
            });
           this.editHtml.find('#prdProfitTarget').on('click', "input[type='radio']",(e) => {
                var curTarget=e.target;
                if(curTarget.value=='1'){
                    this.editHtml.find('#targetVal').css("display","block");
                }else{
                    this.editHtml.find('#targetVal').css("display","none")
                }
            });
        }
        if (status == '3') { //审核失败
            this.editDialogHtml3 = Dialog.show({
                title: '编辑产品',
                nl2br: false,
                message: () => {
                    this.getDatas(this.editHtml, row);
                    this.editHtml.find('#index,#topFlag').attr('disabled', 'disabled');
                    this.editHtml.find("#remark,#remarkInfoTwo,#interlinking,#prdincomeTargetName,#prdincomeTargetVal,#picturelinking,#marketing,input[name='kqfcName'],#edit-cornerSign,#edit-recommendName").removeAttr('disabled');
                    this.editHtml.find("input[type='radio']").attr("disabled",false);
                    this.editHtml.find('#toExamineBtn').text('提交审核').css('display', 'inline-block');
                    return this.editHtml;
                }
            });
           this.editHtml.find('#prdProfitTarget').on('click', "input[type='radio']",(e) => {
                var curTarget=e.target;
                if(curTarget.value=='1'){
                    this.editHtml.find('#targetVal').css("display","block");
                }else{
                    this.editHtml.find('#targetVal').css("display","none")
                }
            });
            $(this.editHtml.find('#toExamineBtn')).on('click', () => { //提交审核按钮
                let newRemark = $("#remark").val();
                row.remark = newRemark;
                this.editDialogHtml3.close();
                let examineStatus = '03'; //状态标示
                this.toExamineBtn(row, curRegion, examineStatus);
            })
        }

    }
    getOperationDatas(editOPerationHtml,row){
        let showRecTo = $('#recList option:selected').text() + '>' + $('#pageList option:selected').text();
        editOPerationHtml.find("#editcornerSign").empty();
        for (let index = 0; index < this.getDictionaryTypeJb.length; index++) {
            let ele = this.getDictionaryTypeJb[index];
            editOPerationHtml.find("#editcornerSign").append(`<option value=${ele.ddCode}>${ele.ddName}</option>`);
        };
        editOPerationHtml.find("#editkqfcList").empty();
        for (let index = 0; index < this.getDictionaryTypeKq.length; index++) {
            let ele = this.getDictionaryTypeKq[index];
           editOPerationHtml.find("#editkqfcList").append(`<label><input type="checkbox" name="editkqfcList" value=${ele.ddCode}><span>${ele.ddName}</span></label>&nbsp&nbsp`);
        }
        editOPerationHtml.find("#editcornerSign").val(row.cornerSign);
        let customerTypeList = row.custType;
        if (!!customerTypeList) {
            if (customerTypeList.length > 0 && customerTypeList[0] != '') {
                for (var j = 0; j < customerTypeList.length; j++) {
                    var ele1 = customerTypeList[j];
                    editOPerationHtml.find("#editkqfcList").find("input[value=" + ele1 + "]").attr("checked", "checked")
                }
            }
        }
        if(row.redStatus=='2'){
            editOPerationHtml.find('#dialogBtnBox').css('display','none');
            editOPerationHtml.find('input[type="text"]').prop('readonly',true);
            editOPerationHtml.find('input[type="checkbox"]').prop('disabled',true);
            editOPerationHtml.find('#index').prop('readonly',true);
            editOPerationHtml.find('textarea').prop('readonly',true);
            editOPerationHtml.find('#editcornerSign').prop('disabled',true);
            editOPerationHtml.find('input[type="radio"]').prop('disabled',true);
            editOPerationHtml.find("#editincomeTargetName").prop('readonly',true);
            editOPerationHtml.find("#editincomeTargetVal").prop('readonly',true);
        }else{
            editOPerationHtml.find('#dialogBtnBox').css('display','block');
            editOPerationHtml.find('input[type="text"]').prop('readonly',false);
            editOPerationHtml.find('input[type="checkbox"]').prop('disabled',false);
            editOPerationHtml.find('#index').prop('readonly',false);
            editOPerationHtml.find('textarea').prop('readonly',false);
            editOPerationHtml.find('input[type="radio"]').prop('disabled',false);
            editOPerationHtml.find("#editincomeTargetName").prop('readonly',false);
            editOPerationHtml.find("#editincomeTargetVal").prop('readonly',false);
            editOPerationHtml.find('#editcornerSign').prop('disabled',false);
        };
        if(row.isCustomReturnIndex=='1'){
            editOPerationHtml.find("#operationFitTarget").prop('checked',false);
            editOPerationHtml.find("#operationDefine").prop('checked',true);
            editOPerationHtml.find("#opeTargetVal").css('display','block');
            editOPerationHtml.find("#editincomeTargetName").val(row.indexName);
            editOPerationHtml.find("#editincomeTargetVal").val(row.indexContent);
        }else{
            editOPerationHtml.find("#operationDefine").prop('checked',false);
            editOPerationHtml.find("#operationFitTarget").prop('checked',true);
            editOPerationHtml.find("#opeTargetVal").css('display','none');
        };
        editOPerationHtml.find('#recTo').html(`${showRecTo}`);
        editOPerationHtml.find("#remarkOne").val(row.remark);
        editOPerationHtml.find("#remarkTwo").val(row.remark1);
        editOPerationHtml.find("#marketing").val(row.marketing);
        //新增跳转、图片链接
        editOPerationHtml.find("#interlinking").val(row.redirectUrl);
        editOPerationHtml.find("#picturelinking").val(row.pictureUrl);
        editOPerationHtml.find("#edit-recommendName").val(row.recommendName);
        editOPerationHtml.find(".remmondIcon").bind("mouseover", () => {
            $("#remmendTips").show();
        });
        editOPerationHtml.find(".remmondIcon").bind("mouseout", () => {
            $("#remmendTips").hide();
        });
    }
    saveEditOperation(row, curRegion, examineStatus){
        var self=this;
           let custType = []; //客群分层
            let custTypeName = [];
            $("input[name='editkqfcList']:checked").each(
                function () {
                    custType.push($(this).val());
                    custTypeName.push($(this).next().text());
                }
            );
            let data = {
                'cornerSign': $('#editcornerSign').val(),
                'custType': custType.join(":"),
                'custTypeName': custTypeName.join(":"),
                'index': row.index,
                'region': curRegion,
                'remark': $('#remarkOne').val(),
                'remark1': $('#remarkTwo').val(),//详情备注2
                'marketing': $('#marketing').val(),
                'recommendName': $('#edit-recommendName').val(),
                'isCustomReturnIndex':$("#fitTarget").find("input[type='radio']:checked").val(),//获取收益指标状态
                'redirectUrl':$("#interlinking").val(),
                'pictureUrl':$("#picturelinking").val(),
                'recommendId':row.id
            };
            if(data.isCustomReturnIndex=='1'){
                data['indexName']=$("#editincomeTargetName").val();//获取指标名称
                data['indexContent']=$("#editincomeTargetVal").val();//获取指标内容
            };
           let url = httpreq.PS_RecommendUpdate;
            utils.xhr.post(url, data, (response) => {
                let curRegCode = `#table-${curRegion}`;
                let pageCodeParam = $('#pageList').val();
                self.queryRegion($(self.node.dom).find('#recList').val(), $(self.node.dom).find('#pageList').val())
                $(".proModelContainer").html('');
                $(curRegCode).bootstrapTable('refresh');
            });
    }
    toExamineBtn(row, curRegion, examineStatus) { //编辑提交审核
            let custType = []; //客群分层
            let custTypeName = [];
            $("input[name='kqfcName']:checked").each(
                function () {
                    custType.push($(this).val());
                    custTypeName.push($(this).next().text());
                }
            );
            let data = {
                'prdCode': row.prdCode,
                'index': row.index,
                'region': curRegion,
                'pageCode': $('#pageList').val(),
                'remark': $('#remark').val(),
                'remark1':$("#remarkInfoTwo").val(),
                'certDepositClass':row.channelProductInfo.certDepositClass,
                'cornerSign': $('#edit-cornerSign').val(),
                'custType': custType.join(":"),
                'custTypeName': custTypeName.join(":"),
                'marketing': $('#marketing').val(),
                'recommendName': $('#edit-recommendName').val(),
                'isCustomReturnIndex':$("#prdProfitTarget").find("input[type='radio']:checked").val(),//获取收益指标状态
                'productId': row.productId ,//大额存单产品productId
                //新增跳转、图片链接
                'redirectUrl':$("#interlinking").val(),
                'pictureUrl':$("#picturelinking").val(),
                'recommendId':row.id
            };
            if(data.isCustomReturnIndex=='1'){
                data['indexName']=$("#prdincomeTargetName").val();//获取指标名称
                data['indexContent']=$("#prdincomeTargetVal").val();//获取指标内容
            };
            if (examineStatus == '01') { //成功
                this.editSubmit(data, curRegion);
            } else if (examineStatus == '03') { //失败
                data.operateType = '02';
                data.redStatus = row.redStatus;
                this.editSubmitTo(data, row, curRegion);
            }
        }
        //审核失败、编辑后第二步
    editSubmitTo(queryData, row, curRegion) {
            var channelMapToBuss = {
                "C0003": "003", //产品货架—口袋
                "C0007": "004", //产品货架—千人千面
                "C0009": "005" //口袋插件
            };
            let editPrdQueryData = queryData;
            EditRemark.show({
                verifyType: "0006",
                businessType: channelMapToBuss[queryData.channelId],
                btnLabel: '提交审批'
            }, (resData) => {
                var transData = {
                    reviewUser: resData.applicant,
                    reviewType: resData.verifyType,
                    applyRemark: resData.describe,
                    priorityLevel: resData.priorityLevel,
                    applyTit: resData.reviewTaskName,
                    businessType: resData.businessType
                };
                var editData = _.extend({}, transData, editPrdQueryData);
                this.addToRecommended(editData, 0);
            });
        }
        //编辑提交
    editSubmit(queryData, curRegion) {
        var self = this;
        let url = httpreq.PS_RecommendUpdate;
        utils.xhr.post(url, queryData, (response) => {
            let curRegCode = `#table-${curRegion}`;
            let pageCodeParam = $('#pageList').val();
            self.queryRegion($(self.node.dom).find('#recList').val(),$(self.node.dom).find('#pageList').val())
            $(".proModelContainer").html('');
            $(curRegCode).bootstrapTable('refresh');
        });
    }
    checkTopFlag(editHtml) { //勾选置顶默认为01排序
        if (editHtml.find("#topFlag").is(':checked')) {
            editHtml.find("#index").val('01');
        }
    }
    
    getDatas(editHtml, row) {
        let prdStatusName = '';
        let prdTypeName = '';
        let isSelecteName = '';
        let cusType = '';
        if(row.prdCode=='GOLD_DT'||row.prdCode=='GOLD_SHARE'){
            cusType=row.channelProductInfo.customersLabel;
        }else{
            cusType=row.channelProductInfo.prdListInfo.customersLabel;
        };
        let customersLabel = this.transCusType(cusType);
        let recTo = $('#recList option:selected').text() + '>' + $('#pageList option:selected').text();
        let redStatus = '';
        let saleStatus = '';
        var auditId = row.reviewId || ''; //审核ID
        if (row.saleStatus == 'NEW_SALE') {
            saleStatus = `新产品上架`;
        } else if (row.saleStatus == 'ON_SALE') {
            saleStatus = `上架中`;
        } else if (row.saleStatus == 'WAIT_SALE') {
            saleStatus = `待上架`;
        } else if (row.saleStatus == 'OFF_SALE') {
            saleStatus = `已下架`;
        } else if (row.saleStatus == 'FAIL_SALE') {
            saleStatus = `上架失败`;
        } else if (row.saleStatus == 'INIT') {
            saleStatus = `初始`;
        } else {
            saleStatus = `无`;
        };
        if (row.redStatus == 1) {
            redStatus = '已推荐';
        } else if (row.redStatus == 2) {
            redStatus = '待推荐';
        } else {
            redStatus = '推荐失败';
        }
        if (row.redStatus == '1') {
            prdStatusName = '审核成功';
        } else if (row.redStatus == '2') {
            prdStatusName = '审核中';
        } else {
            prdStatusName = '审核失败';
        }
        // if (row.channelProductInfo.isSelected == '0') {
        //     isSelecteName = '非精选';
        // } else if (row.channelProductInfo.isSelected == '1') {
        //     isSelecteName = '精选';
        // }
        var prdArrMap = {
            "1": "股票型",
            "2": "混合型",
            "3": "债券型",
            "4": "货币型",
            "5": "保本型",
            "6": "QDII",
            "7": "其他"
        };
        var prdTyMap = {"0":"大额存单","1":"定活宝-大额存单"};
        row.prdArrName = prdArrMap[row.prdArr];
        if(row.channelProductInfo.type == '04'){
            editHtml.find("#prdTy").text(prdTyMap[row.channelProductInfo.certDepositClass]);
            editHtml.find("#is_des").show();
        }else{
            editHtml.find("#prdTy").text('');
            editHtml.find("#is_des").hide();
        };
        if (row.channelProductInfo.type == '02') {
            prdTypeName = '代销理财产品';
            editHtml.find('#otherInfo').empty().append(`
               <div class="form-group">
                <label class="col-sm-3 control-label">产品状态:</label>
                <div class="col-sm-8" style="line-height:34px;" id="">
                   ${this.prdStatusData[row.status]?this.prdStatusData[row.status]:""}
                </div>
                </div>
                <div class="form-group">
                <label class="col-sm-3 control-label">产品属性:</label>
                <div class="col-sm-8" style="line-height:34px;" id="">
                   ${row.prdArrName?row.prdArrName:""}
                </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">预期收益率:</label>
                    <div class="col-sm-8" style="line-height:34px;" id="">
                      ${row.channelProductInfo.prdListInfo.planRate?row.channelProductInfo.prdListInfo.planRate:""}%
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">个人首次购买起点:</label>
                    <div class="col-sm-8" style="line-height:34px;" id="">
                      ${row.channelProductInfo.subMinAmt?row.channelProductInfo.subMinAmt:""}元
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">募集截止日期:</label>
                    <div class="col-sm-8" style="line-height:34px;" id="">
                       ${row.channelProductInfo.prdListInfo.saleEndDate?row.channelProductInfo.prdListInfo.saleEndDate:""}
                    </div>
                </div>
            `);
        } else if (row.channelProductInfo.type == '01') {
            prdTypeName = '本行理财产品';
            editHtml.find('#otherInfo').empty().append(`
               <div class="form-group">
                <label class="col-sm-3 control-label">总额度(剩余额度):</label>
                <div class="col-sm-8" style="line-height:34px;">
                  ${row.channelProductInfo.prdListInfo.remainQuota?row.channelProductInfo.prdListInfo.remainQuota:""}(${row.channelProductInfo.prdListInfo.remainQuota?row.channelProductInfo.prdListInfo.remainQuota:""})元
                </div>
                </div>
                <div class="form-group">
                <label class="col-sm-3 control-label">收益率:</label>
                <div class="col-sm-8" style="line-height:34px;">
                    ${row.channelProductInfo.prdListInfo.planRate?row.channelProductInfo.prdListInfo.planRate:""}
                </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">购买起点:</label>
                    <div class="col-sm-8" style="line-height:34px;">
                     ${row.channelProductInfo.subMinAmt?row.channelProductInfo.subMinAmt:""}元
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">销售截止日期时间:</label>
                    <div class="col-sm-8" style="line-height:34px;">
                        ${row.channelProductInfo.prdListInfo.saleEndDate?row.channelProductInfo.prdListInfo.saleEndDate:""}
                    </div>
                </div>
            `);
        } else if (row.channelProductInfo.type == '04') {
            prdTypeName = '大额存单';
            
            let prdListInfo = row.channelProductInfo.prdListInfo;
            editHtml.find('#otherInfo').empty().append(`
                 <div class="form-group">
                    <label class="col-sm-3 control-label">产品状态:</label>
                    <div class="col-sm-8" style="line-height:34px;">
                        ${this._getPrdStatus(prdListInfo).statusName?this._getPrdStatus(prdListInfo).statusName:""} 
                    </div>
                </div>
                <div class="form-group">
                <label class="col-sm-3 control-label">存款类型:</label>
                <div class="col-sm-8" style="line-height:34px;">
                     ${prdListInfo.prdType?(prdListInfo.prdType=="0"?'发售':'转让'):""} 
                </div>
                </div>
                <div class="form-group" id="resellTypeDiv" style="display:none">
                    <label class="col-sm-3 control-label">转让类型:</label>
                    <div class="col-sm-8" style="line-height:34px;">
                         ${prdListInfo.resellType?(prdListInfo.resellType=="0"?'指定':'挂网'):""}
                    </div>
                </div>
                    <div class="form-group">
                    <label class="col-sm-3 control-label">产品期限:</label>
                    <div class="col-sm-8" style="line-height:34px;">
                        ${this.getSaleDate(prdListInfo.saveDeadline)?this.getSaleDate(prdListInfo.saveDeadline):""}
                    </div>
                </div>
                    <div class="form-group">
                    <label class="col-sm-3 control-label">总额度:</label>
                    <div class="col-sm-8" style="line-height:34px;">
                         ${prdListInfo.totalQuota?prdListInfo.totalQuota:""}
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">剩余额度:</label>
                    <div class="col-sm-8" style="line-height:34px;">
                         ${prdListInfo.remainQuota?prdListInfo.remainQuota:""}
                    </div>
                </div>
                    <div class="form-group">
                    <label class="col-sm-3 control-label">募集/转让终止日:</label>
                    <div class="col-sm-8" style="line-height:34px;">
                        ${this._formatDate(prdListInfo.saleEndDate)?this._formatDate(prdListInfo.saleEndDate):""}
                    </div>
                </div>`);
            if (prdListInfo.prdType == "1") {
                editHtml.find("#resellTypeDiv").show();
            }
        } else if (row.channelProductInfo.type == '06') { //黄金定投
            prdTypeName = '黄金定投产品';
            let prdListInfo = row.channelProductInfo;
            editHtml.find('#otherInfo').empty().append(`
                            <div class="form-group">
                                <label class="col-sm-3 control-label">报价单位:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${prdListInfo.quoteUnit?prdListInfo.quoteUnit:""}
                                </div>
                            </div>
                            <div class="form-group">
                            <label class="col-sm-3 control-label">投资方式:</label>
                            <div class="col-sm-8" style="line-height:34px;">
                                ${prdListInfo.investmentStyle?prdListInfo.investmentStyle:""}
                            </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-3 control-label">交易单位:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${prdListInfo.tradingUnit?prdListInfo.tradingUnit:""}
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-3 control-label">协议期限:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${prdListInfo.agreedPeriod?prdListInfo.agreedPeriod:""}
                                </div>
                            </div> `);
        } else if (row.channelProductInfo.type == '07') { //黄金份额认购产品
            prdTypeName = '黄金份额产品';
            let prdListInfo = row.channelProductInfo;
            editHtml.find('#otherInfo').empty().append(`
                            <div class="form-group">
                            <label class="col-sm-3 control-label">投资方式:</label>
                            <div class="col-sm-8" style="line-height:34px;">
                                ${prdListInfo.investmentStyle?prdListInfo.investmentStyle:""}
                            </div>
                            </div>`);
        } else if (row.channelProductInfo.type == '09') { //定活宝-定活通
            prdTypeName = '本行存款产品';
            let prdListInfo = row.channelProductInfo;
            //对返回的存期进行单位的转译
            let saveDeadlineMap=prdListInfo.saveDeadline;
            if(saveDeadlineMap.charAt(saveDeadlineMap.length-1)=='Y'){
                  saveDeadlineMap=`${saveDeadlineMap.charAt(0)}年`
                        };
            editHtml.find('#otherInfo').empty().append(`
                            <div class="form-group">
                                <label class="col-sm-3 control-label">交易币种:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${prdListInfo.ccy?prdListInfo.ccy:""}
                                </div>
                            </div>
                            <div class="form-group">
                            <label class="col-sm-3 control-label">起存金额:</label>
                            <div class="col-sm-8" style="line-height:34px;">
                                ${prdListInfo.prdListInfo.minBuyAmt?prdListInfo.prdListInfo.minBuyAmt:""}
                            </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-3 control-label">存期:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${saveDeadlineMap?saveDeadlineMap:""}
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-3 control-label">到期利率:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${prdListInfo.prdListInfo.planRate?prdListInfo.prdListInfo.planRate:""}%
                                </div>
                            </div> 
                               <div class="form-group">
                                <label class="col-sm-3 control-label">付息方式:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                智能付息
                                </div>
                            </div>    
                            <div class="form-group">
                                <label class="col-sm-3 control-label">是否提前支取:</label>
                                <div class="col-sm-8" style="line-height:34px;">
                                ${prdListInfo.drawControlType?prdListInfo.drawControlType:""}
                                </div>
                            </div>`);
        }
        editHtml.find("#edit-cornerSign").empty();
        for (let index = 0; index < this.getDictionaryTypeJb.length; index++) { //角标
            let ele = this.getDictionaryTypeJb[index];
            editHtml.find("#edit-cornerSign").append("<option value=" + ele.ddCode + ">" + ele.ddName + "</option>");
        }
        editHtml.find("#edit-cornerSign").find("option[value=" + row.cornerSign + "]").attr("selected", "selected");
        editHtml.find("#edit-kqfcList").empty();
        let custTypeList = row.custType;
        for (let index = 0; index < this.getDictionaryTypeKq.length; index++) {
            let ele = this.getDictionaryTypeKq[index];
            editHtml.find("#edit-kqfcList").append(`<label><input type="checkbox" name="kqfcName" value=${ele.ddCode}><span>${ele.ddName}</span></label>&nbsp&nbsp`);
        }
        if (!!custTypeList) {
            if (custTypeList.length > 0 && custTypeList[0] != '') {
                for (var j = 0; j < custTypeList.length; j++) {
                    var ele1 = custTypeList[j];
                    editHtml.find("#edit-kqfcList").find("input[value=" + ele1 + "]").attr("checked", "checked")
                }
            }
        }
        var prdsaleEndDate = '';
        var saleEndDateList ='',prdClass;
        if(row.prdCode=='GOLD_DT'||row.prdCode=='GOLD_SHARE'){
            saleEndDateList= row.channelProductInfo;
            prdClass=row.prdType;
        }else{
            saleEndDateList= row.channelProductInfo.prdListInfo;
            prdClass=row.channelProductInfo.prdListInfo.prdClass;
        };
        if (saleEndDateList.saleEndDate) {
            prdsaleEndDate = saleEndDateList.saleEndDate.slice(0, 4) + "-" + saleEndDateList.saleEndDate.slice(4, 6) + "-" + saleEndDateList.saleEndDate.slice(6, 8);
        };
        var List=editHtml.find("input[type='radio']");
        if(row.isCustomReturnIndex=='1'){
            editHtml.find("#usePrd").prop('checked',false);
            editHtml.find("#useDefine").prop('checked',true);
            editHtml.find('#targetVal').css('display','block');
            editHtml.find("#prdincomeTargetName").val(row.indexName);
            editHtml.find("#prdincomeTargetVal").val(row.indexContent);
        }else{
            editHtml.find("#useDefine").prop('checked',false);
            editHtml.find("#usePrd").prop('checked',true);
            editHtml.find('#targetVal').css('display','none');
        };
        editHtml.find('#redStatus').html(`${redStatus}`);
        editHtml.find('#recTo').html(`${recTo}`);
        editHtml.find('#sjStatus').html(`${saleStatus}`);
        editHtml.find('#applyId').html(`${auditId}`); //审核ID
        editHtml.find('#prdStatus').html(`${prdStatusName}`);
        editHtml.find("#index").val(row.index);
        editHtml.find('#proType').html(`<option value=${prdClass}>${prdTypeName}</option>`).attr('disabled', 'disabled');
        // editHtml.find('#isSelected').html(`${isSelecteName}`);
        editHtml.find("#prdCode").val(row.prdCode).attr('disabled', 'disabled');
        editHtml.find("#prdTy").text(prdTyMap[row.certDepositClass]);
        editHtml.find("#prdName").text(row.channelProductInfo.prdName);
        if(row.prdCode!='GOLD_DT'&&row.prdCode!='GOLD_SHARE'){
           editHtml.find("#incomeRate").html(row.channelProductInfo.prdListInfo.planRate + '%');
           editHtml.find("#totalQuota").html(row.channelProductInfo.prdListInfo.remainQuota + '(' + row.channelProductInfo.prdListInfo.remainQuota + ')' + '元');
        }
        editHtml.find("#minBuy").html(row.channelProductInfo.subMinAmt + '元');
        editHtml.find("#saleEndTime").text(prdsaleEndDate);
        editHtml.find("#remark").val(row.remark);
        editHtml.find("#remarkInfoTwo").val(row.remark1);
        editHtml.find("#marketing").val(row.marketing);
        //新增跳转、图片链接
        editHtml.find("#interlinking").val(row.redirectUrl);
        editHtml.find("#picturelinking").val(row.pictureUrl);
        
        editHtml.find("#edit-recommendName").val(row.recommendName);

        editHtml.find(".remmondIcon").bind("mouseover", () => {
            $("#remmendTips").show();
        });
        editHtml.find(".remmondIcon").bind("mouseout", () => {
            $("#remmendTips").hide();
        });
    }
    transCusType(cusType) {
        let cusTypeList = cusType;
        let customersLabel = '';
        if (!cusTypeList) {
            return '-';
        } else {
            if (cusTypeList.length > 0) {
                for (let i = 0; i < cusTypeList.length; i++) {
                    if (cusTypeList[i] == 'L0001') {
                        customersLabel += `大众、`;
                    } else if (cusTypeList[i] == 'L0002') {
                        customersLabel += `私行、`;
                    } else if (cusTypeList[i] == 'L0003') {
                        customersLabel += `财富、`;
                    } else if (cusTypeList[i] == 'L0004') {
                        customersLabel += `不区分、`;
                    } else if (cusTypeList[i] == 'L0005') {
                        customersLabel += `新客客户、`;
                    } else if (cusTypeList[i] == 'L0006') {
                        customersLabel += `薪客客户、`;
                    }
                }
                return customersLabel.substring(0, customersLabel.length - 1);

            }

        }
    }
    getDictionaryTypeJb() { //角标
        var self = this;
        let data = {
            'ddType': 47
        };
        utils.xhr.post(httpreq.PS_GetDictionaryType, data, (response) => {
            self.getDictionaryTypeJb = response.data;
            self.getDictionaryTypeJb.unshift({
                ddCode: "",
                ddName: "请选择"
            });
        });
    }
    getDictionaryTypeKq() { //客群
        var self = this;
        let data = {
            'ddType': 48
        };
        utils.xhr.post(httpreq.PS_GetDictionaryType, data, (response) => {
            self.getDictionaryTypeKq = response.data;
        });
    }
    getPrdStatus() { //产品状态转义
            var self = this;
            utils.xhr.post(httpreq.PS_GetDictionaryType, {
                'ddType': 16
            }, (response) => {
                if (response.code == '000000') {
                    let obj = {};
                    for (let i = 0; i < response.data.length; i++) {
                        let ele = response.data[i];
                        obj[ele.ddCode] = ele.ddName;
                    }
                    self.prdStatusData = obj;
                } else {
                    if (response.responseCode == '900106') {
                        Dialog.alert(response.msg || response.responseMsg);
                        window.top.location.href = "http://bcoms.paic.com.cn/bcoms/login";
                        return;
                    } else {
                        Dialog.alert(response.msg || response.responseMsg);
                    }
                }
            });
        }
        //产品期限转义
    getSaleDate(val) {
        if (!val) {
            return "";
        }
        if (val.charAt(val.length - 1) == 'M') {
            return `${val.charAt(0)}个月`;
        } else if (val.charAt(val.length - 1) == 'Y') {
            return `${val.charAt(0)}年`; //可能还有周
        }
    }

};
module.exports = ProPageList;