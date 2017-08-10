/*
开发环境ip: 10.20.11.131 - PAFA5管控后台：http://10.20.11.130/admin/login.html
测试环境ip: 10.14.217.18:8080 - PAFA5管控后台：http://10.14.217.11:8080/admin/login.html
*/
//平时开发用前缀
const prefix = 'product/brop/pop/fsm/'; 
// 部署到开发，测试，生产时的后缀
// const prefix = 'brop/pop/fsm/'; 

//平时开发用后缀，用于自动登录
const suffix = '?user=linkaibin4471&signContent=cXFPEbFoU1ZMHsWUhlvOXAy6UZy8%2FMyKTYzjRAtd%2FLiF9j3j0A8hgkM7r69ydo7BHHiUHprdpiBR8t2GMyKfk75kFYxKhIF9T6rALMc9MquPjZYguyjen75173Lb5pIgz0BF59Typ5qmop0jjJ9KODdQa65ePrfqT%2BqH0L8criE%3D';
//部署到开发，测试，生产时的后缀
// const suffix = '';

const list = {
    //分类s
    PS_GetProductType:                  `${prefix}getProductType.do${suffix}`,                       //查询分类
    PS_AddProductType:                  `${prefix}addProductType.do${suffix}`,                       //增加分类
    PS_UpdateProductType:               `${prefix}updateProductType.do${suffix}`,                    //更新分类（名称）
    PS_RemoveProdutType:                `${prefix}removeProductType.do${suffix}`,                    //删除分类
    PS_MoveProductType:                 `${prefix}moveProductType.do${suffix}`,                      //移动分类
    //模板
    PS_GetFundTemplate:                 `${prefix}getFundTemplate.do${suffix}`,                      //查询模板数据
    PS_UpdateFundTemplate:              `${prefix}updateFundTemplate.do${suffix}`,                   //更新模板
    //产品
    PS_QueryProductDetail:              `${prefix}product/queryProductDetail${suffix}`,              //查询产品信息
    PS_QueryTAList:                     `${prefix}product/queryTAList${suffix}`,                     //TA代码查询
    PS_QueryStatusList:                 `${prefix}product/queryStatusList${suffix}`,                 //产品状态查询
    PS_QueryArrList:                    `${prefix}product/queryArrList${suffix}`,                    //产品属性查询
    PS_QueryList:                       `${prefix}product/queryList${suffix}`,                       //产品列表查询
    PS_DownLoadFundList:                `${prefix}downLoadFundList.do${suffix}`,                     //代销数据导出
    PS_DownLoadFinaList:                `${prefix}downLoadFinaList.do${suffix}`,                     //本行数据导出
    PS_OffSale:                         `${prefix}product/offSale${suffix}`,                         //立即下架
    PS_OnSale:                          `${prefix}product/onSale${suffix}`,                          //上架
    PS_SynchroFund:                     `${prefix}synchroFund.do${suffix}`,                          //手动同步
    PS_GetFinancialDetail:              `${prefix}getFinancialDetail${suffix}`,                   //查询本行产品信息
    PS_GetFinancialList:                `${prefix}getFinancialList${suffix}`,                        //本行理财产品列表查询
    PS_SynchroFinancial:                `${prefix}synchroFinancial${suffix}`,                        //本行理财产品手动同步
    PS_GetDictionaryType:               `${prefix}getDictionaryType${suffix}`,                       //查询数据字典
    PS_CustomizedInfo_Show:             `${prefix}product/customizedInfo/show${suffix}`,             //查询产品自定义信息
    PS_CustomizedInfo_ReplaceInfo:      `${prefix}product/customizedInfo/replaceinfo${suffix}`,      //子模板覆盖产品信息
    PS_CustomizedInfo_Update:           `${prefix}product/customizedInfo/update${suffix}`,           //更新产品信息
    PS_FileUpload:                      `${prefix}product/file/upload${suffix}`,                     //文件附件上传
    PS_FileDelete:                      `${prefix}product/file/delete${suffix}`,                     //文件附件删除
    PS_FileDownload:                    `${prefix}product/file/download`,                            //文件附件下载
    PS_CodeblurSel:                     `${prefix}product/codeblurSel`,                               //模糊搜索
    PS_FinancialOffSale:                `${prefix}financialOffSale`,                                 //本行新产品下架
    PS_GetVerifyType:                   `${prefix}getVerifyType`,                                    //理财产品获取审核信息
    PS_FinancialDelete:                 `${prefix}financialDelete`,                                  //删除本行理财产品
    PS_OffSaleFundProduct:              `${prefix}product/offSaleFundProduct`,                     //代销新产品下架
    PS_DeleteFundProduct:               `${prefix}product/deleteFundProduct`,                      //删除代销理财产品
    PS_QryChannelAuth:                  `${prefix}authorization/menu/qryChannelAuth${suffix}`,     //产品货架接入渠道
    PS_QryAccChannelAuth:               `${prefix}authorization/channel/qryAccChannelAuth${suffix}`,//产品货架新接入渠道
    PS_QryDisChannelInfo:               `${prefix}authorization/channel/qryDisChannelInfo${suffix}`,//智能推荐分销渠道
    PS_QryPageModuleInfo:               `${prefix}authorization/channel/qryPageModuleInfo${suffix}`,//智能推荐页面模块
    PS_QryPageRegionInfo:               `${prefix}authorization/channel/qryPageRegionInfo${suffix}`,//智能推荐页面区域
    PS_recommendAdd:                    `${prefix}recommend/add${suffix}`,                           //智能货架挑选运营内容提交审核
    
         
    //财汇 
    PS_FindDates:                       `${prefix}product/caihui/finddates${suffix}`,                //财汇投资组合日期查询  
    PS_Caihui_Investportfolio:          `${prefix}product/caihui/investportfolio${suffix}`,          //财汇投资组合
    PS_Caihui_Summary:                  `${prefix}product/caihui/summary${suffix}`,                  // 查询产品财汇基本信息	
    PS_Caihui_Feedetail:                `${prefix}product/caihui/feedetail${suffix}`,		         // 查询产品财汇基金费率详情
    PS_Caihui_Fundnav:                  `${prefix}product/caihui/fundnav${suffix}`,                  // 查询财汇历史净值
    
    //标签  
    Tag_FindDept:                       `${prefix}product/tags/findDept${suffix}`,                   //标签-查询所有部门
    Tag_FindClassification:             `${prefix}product/tags/findClassification${suffix}`,         //标签-查询标签分类
    Tag_AllPages:                       `${prefix}product/tags/findSinglesByPage${suffix}`,          //标签-分页
    insertSingle:                       `${prefix}product/tags/insertSingle${suffix}`,               //新增单个标签
    updateSingle:                       `${prefix}product/tags/updateSingle${suffix}`,               //编辑单个标签
    deleteSingle:                       `${prefix}product/tags/deleteSingle${suffix}`,               //删除单个标签
    PS_fectiveSingle:                   `${prefix}product/tags/effectiveOrInEffectiveSingle${suffix}`,//更改单个标签状态
    
    
    //组合标签
    TagGroup_GetByTagCode:              `${prefix}product/tagParts/findTagByCode${suffix}`,          //组合标签查询
    TagGroup_All:                       `${prefix}product/tagParts/findAll${suffix}`,               //查询所有组合标签
    TagGroup_AllPages:                  `${prefix}product/tagParts/findTagsByPage${suffix}`,         //查询组合标签-分页
    TagGroup_AllTags:                   `${prefix}product/tags/findSinglesByName${suffix}`,          //查询单个标签-分页
    TagGroup_Add:                       `${prefix}product/tagParts/insert${suffix}`,                 //新增组合标签
    TagGroup_Delete:                    `${prefix}product/tagParts/delete${suffix}`,                 //删除组合标签
    TagGroup_Update:                    `${prefix}product/tagParts/update${suffix}`,                 //更新组合标签
    PS_fectiveGroup:                    `${prefix}product/tagParts/effictiveOrInEffictiveGroupTag${suffix}`,//更改组合标签状态
    
    //标签分类
    findClassificationByPage:           `${prefix}product/classification/findClassificationByPage${suffix}`,   //查询标签分类列表
    findAllProduct:                     `${prefix}product/tags/findProductClassification${suffix}`,            //查询产品分类
    findAllDept:                        `${prefix}product/tags/findDept${suffix}`,                      //查询所有部门
    insert_classification:              `${prefix}product/classification/insert${suffix}`,                     //新增标签分类
    update_classification:              `${prefix}product/classification/update${suffix}`,                      //修改标签分类
    delete_classification:              `${prefix}product/classification/delete${suffix}`,                      //删除标签分类
    PS_fectiveClass:                    `${prefix}product/classification/effectiveOrInEffectiveClassification${suffix}`,                      //修改标签分类状态
               
    //本行理财
    AddToProductLib:                    `${prefix}product/addToChannelProductLib${suffix}`,                          //加入到产品库
    RemoveFromProductLib:               `${prefix}product/removeFromChannelProductLib${suffix}`,                     //移除产品库产品	
    queryFinaProductLibList:            `${prefix}product/queryFinaProductLibList${suffix}`,                  //查询产品库（理财）产品列表
    editSelectedProduct:                `${prefix}product/editChannelProduct${suffix}`,		              //编辑产品库产品(打标签)
	
    //本行详情增加分档收益
    AddOrUpdateLevelProFitInfo:         `${prefix}levelProFitInfo/addOrUpdateLevelProFitInfo${suffix}`,		    //新增或修改分档收益信息
    DeleteLevelProFitInfo:              `${prefix}levelProFitInfo/deleteLevelProFitInfo${suffix}`,              //删除分档收益信息
    GetLevelProFitInfoList:              `${prefix}levelProFitInfo/getLevelProFitInfoList${suffix}`,              //查询分档收益信息
    	

    //基金代销
    product_lib_fund:                   `${prefix}product/queryFundProductLibList${suffix}`,         //产品库列表(基金)
    add_to_selected_lib:                `${prefix}product/addToChannelProductLib${suffix}`,                 //产品加入产品精选库
    remove_from_selected_lib:           `${prefix}product/removeFromChannelProductLib${suffix}`,            //产品移出产品精选库
    qr_fund_company_list:               `${prefix}getDictionaryType${suffix}`,                             //查询基金公司列表
    add_tag_to_product:                 `${prefix}product/editChannelProduct${suffix}`,                        //给产品打标签
    // edit_selected_product:              `${prefix}product/pocket/editSelectedProduct${suffix}`,                        //给产品打标签
     
    //大额存单 
    PS_getDepositList:                     `${prefix}getDepositList${suffix}`,                            //大额存单产品列表
    
    //上传文件
    PS_improtProductList:                   `${prefix}improtProductList.do${suffix}`,  //本行、代销产品上传更新
    
    //存款类型
    PS_getFixedCurrentLinkList:            `${prefix}getFixedCurrentLinkList${suffix}`,     //产品工厂存款类型列表
    PS_getFixedCurrentLinkDetail:          `${prefix}getFixedCurrentLinkDetail${suffix}`,   //存款类型产品详情
    PS_getFixedHistoryDrawRate:            `${prefix}getFixedHistoryDrawRate${suffix}`,   //定活通产品利率
    PS_queryFixedProductLibList:           `${prefix}product/queryFixedProductLibList${suffix}`,   //产品货架定活通列表
    PS_synFixedPrdByCcy:                   `${prefix}synFixedPrdByCcy${suffix}`,   //定活通产品手动同步
 
    //推荐页面管理
    //页面模块
    PS_queryPageModuleList:                 `${prefix}product/queryPageModuleList${suffix}`, //页面模块模糊搜索、页面模块列表
    PS_addPageModule:                       `${prefix}product/addPageModule${suffix}`, //创建页面模块
    PS_updatePageModule:                    `${prefix}product/updatePageModule${suffix}`, //编辑页面模块
    PS_getPageModuleInfo:                   `${prefix}product/getPageModuleInfo${suffix}`, //获取页面模块信息
    PS_deletePageModule:                    `${prefix}product/deletePageModule${suffix}`, //删除页面模块
    //页面区域
    PS_queryPageRegionList:                 `${prefix}product/queryPageRegionList${suffix}`, //页面区域模糊搜索、页面区域列表
    PS_addPageRegion:                       `${prefix}product/addPageRegion${suffix}`,//创建页面区域
    PS_updatePageRegion:                    `${prefix}product/updatePageRegion${suffix}`, //编辑页面区域
    PS_getgetPageRegionInfo:                `${prefix}product/getPageRegionInfo${suffix}`, //获取页面区域信息
    PS_deletePageRegion:                    `${prefix}product/deletePageRegion${suffix}`, //删除页面区域
 
    //公共
    PS_GetCurTime:                      `${prefix}product/getCurTime${suffix}`,                      //获取服务器当前时间戳
    
    //产品自定义
    getFinancialCustom:                 `${prefix}getFinancialCustom${suffix}`,                      //查询理财产品自定义信息
    setFinancialCustom:                 `${prefix}setFinancialCustom${suffix}`,                      //编辑自定义理财产品信息
    checkFinaProperty:                  `${prefix}checkFinaProperty${suffix}`,       //理财产品唯一性检查
    addFinancial:                       `${prefix}addFinancial${suffix}`,            //新增理财产品
    getVerifyType:                      `${prefix}getVerifyType${suffix}`,           //理财产品获取审核信息
     
    showFundCustom:                     `${prefix}product/showFundCustom${suffix}`,   //查询基金产品自定义信息
    setFundProduct:                     `${prefix}product/setFundProduct${suffix}`,   //编辑自定义基金产品信息
    addFundProduct:                     `${prefix}product/addFundProduct${suffix}`,   //新增基金产品
    checkFundProperty:                  `${prefix}product/checkFundProperty${suffix}`,   //基金产品唯一性检查
    queryVerifyStatus:                  `${prefix}product/queryVerifyStatus${suffix}`,   //查询审核状态
                                      
    //产品附件
    attach_search:                      `${prefix}file/search${suffix}`,       //附件信息查询接口
    attach_delete:                      `${prefix}file/delete${suffix}`,       //删除产品附件信息
    attach_update:                      `${prefix}file/update${suffix}`,       //修改产品附件信息
    attach_add:                         `${prefix}file/add${suffix}`,             //增加产品附件信息
    
    //产品交易 闲钱+产品管理
    SaveRemainingMoneyProduct:          `${prefix}saveRemainingMoneyProduct${suffix}`,             //增加产品
    ListRemainingMoneyProduct:          `${prefix}listRemainingMoneyProduct${suffix}`,             //增加产品
    //产品交易 闲钱+客户计划
    QueryRemainingMoneyShelfPlan:        `${prefix}queryRemainingMoneyShelfPlan${suffix}`,             //查询客户计划列表
    SetRemainingMoneyProductDefault:     `${prefix}setRemainingMoneyProductDefault${suffix}`,             //设置为默认产品
    DownloadRemainingMoneyShelfPlan:     `${prefix}downloadRemainingMoneyShelfPlan${suffix}`,             //批量导出
    
    //闲钱+ 商户合作
    QueryRemainingMoneyMerchantCooperate:     `${prefix}queryRemainingMoneyMerchantCooperate${suffix}`,   //查询商户合作列表
    SaveRemainingMoneyMerchantCooperate:      `${prefix}saveRemainingMoneyMerchantCooperate${suffix}`,   //添加合作商户
    QueryAccessMechantList:                   `${prefix}queryAccessMechantList${suffix}`,   //查询商户合作下拉
    GetRemainingMoneyMerchantCooperate:       `${prefix}getRemainingMoneyMerchantCooperate${suffix}`,   //查询单个具体的详情
  
    //产品推荐管理
    PS_getUserChannel:                 `${prefix}getUserChannel${suffix}`,   //查询渠道
    PS_QryEditAccChannel:              `${prefix}authorization/channel/qryEditAccChannel${suffix}`,   //新查询渠道
    PS_getDictionaryType:              `${prefix}getDictionaryType${suffix}`,   //角标、客群分层
    PS_QuerySelectedLibList:           `${prefix}product/querySelectedLibList${suffix}`,          //查询分类
    // PS_AddToRecommendedLib:            `${prefix}product/addToRecommendedLib${suffix}`,           //添加---审核
    PS_RecommendAddList:        `${prefix}recommend/addList${suffix}`,                   //配置智能货架添加多条---审核
    PS_RemoveFromRecommendedLib:       `${prefix}product/removeFromRecommendedLib${suffix}`,      //删除单个标签
    PS_RecommendUpdate:                `${prefix}recommend/update${suffix}`,                     //编辑修改产品、运营内容
    PS_SearchProduct:                  `${prefix}product/searchProduct${suffix}`,                 //从精选库搜素
    PS_codeblurSel:                    `${prefix}product/codeblurSel${suffix}`,                 //从精选库搜素

    //审核
    Check_FinalReview:                 `${prefix}product/review/findWaitReviews${suffix}`,        //最终审核表
    Check_FinalPass:                   `${prefix}product/review/reviewProducts${suffix}`,         //最终审核通过
    CHeck_FinalRefuse:                 `${prefix}product/review/refusedProducts${suffix}`,          //最终审核拒绝
    
    //新增审批申请接口
    Check_QueryVerifyList:              `${prefix}product/queryVerifyProductList${suffix}`,               //待审批申请接口
    Check_QueryDetail:                  `${prefix}product/detail${suffix}`,                     //审批详情接口
    Check_verifyProduct:                `${prefix}product/verify${suffix}`,            //审核任务接口   
    Check_QueryVerifyStatus:            `${prefix}product/queryVerifyStatus${suffix}`,  //提交审批之前防重复
    
    
    //限额管理
    Quotaprd:                          `${prefix}product/limit/queryAllProduct${suffix}`,                //产品查询
    Quotacha:                          `${prefix}product/limit/queryAllChannel${suffix}`,                //渠道查询
    QuotaList:                         `${prefix}product/limit/queryPaginationLimitConfig${suffix}`,     //列表查询
    QuotaUpdateLimitConfig:            `${prefix}product/limit/updateLimitConfig${suffix}`,         //修改限额配置
    QuotaInsertLimitConfig:            `${prefix}product/limit/insertLimitConfig${suffix}`,         //插入限额配置

    //大额存单
    getDepositDetail:                  `${prefix}getDepositDetail${suffix}`,     //大额存单详情
    GetcodeblurSel:                    `${prefix}product/codeblurSel${suffix}`,     //大额存单模糊搜索接口
    UpdateDepositCustomData:           `${prefix}updateDepositCustomData${suffix}`,     //产品工厂大额存单编辑页面接口
    GetShelfDepositList:               `${prefix}getShelfDepositList${suffix}`,     //产品货架大额存单查询列表接口
    GetShelfDepositCustom:             `${prefix}getShelfDepositCustom${suffix}`,     //产品货架大额存单查询详情接口
    GetpfDepositCustom:                `${prefix}getpfDepositCustom${suffix}`,     //产品工厂大额存单查询详情接口
    SynchroDeposit:                    `${prefix}synchroDeposit${suffix}`,     //产品工厂大额存单同步接口

    //消费金融
    getConsumerFinanceCustom:          `${prefix}getConsumerFinanceCustom${suffix}`,   //获取消费金融自定义基本信息       
    setConsumerFinanceCustom:          `${prefix}setConsumerFinanceCustom${suffix}`,   //编辑消费金融自定义基本信息


    
    //个贷消费金融
    fuzzySearch:                       `${prefix}fuzzySearch${suffix}`,                 //贷款品种代码/名称
    getConsumerFinances:               `${prefix}getConsumerFinances${suffix}`,         //个贷消费金融列表查询
    getCodeLibrary:                    `${prefix}getCodeLibrary${suffix}`,              //担保/还款方式查询
    setConsumerFinanceTag:             `${prefix}setConsumerFinanceTag${suffix}`,        //添加标签
    getConsumerFinanceTag:             `${prefix}getConsumerFinanceTag${suffix}`,       //查询标签
    delConsumerFinanceTag:             `${prefix}delConsumerFinanceTag${suffix}`,      //删除标签

    //部门权限管理
    editDapratPower:                   `${prefix}authorization/dept/editDept${suffix}`,      //编辑部门权限
    checkDapartList:                   `${prefix}authorization/dept/qryDeptList${suffix}`,   //部门权限列表
    FirSecondMenu:                      `${prefix}getMenuAuth${suffix}`,                     //一、二级菜单
    updateDeptStatus:                   `${prefix}authorization/dept/updateDeptStatus${suffix}`, //更新部门状态
    saveDept:                           `${prefix}authorization/dept/saveDept${suffix}`,        //保存
    EditChannel:                        `${prefix}authorization/dept/editChannel${suffix}`,        //接入渠道权限接口



    //角色管理
    QryRoleList:                       `${prefix}authorization/role/qryRoleList${suffix}`,      //查询角色列表接口
    AddRoleAuth:                       `${prefix}authorization/role/addRoleAuth${suffix}`,      //保存创建角色信息列表
    EditRole:                          `${prefix}authorization/role/editRole${suffix}`,         //查询编辑页面信息列表
    IsRoleExist:                       `${prefix}authorization/role/isRoleExist${suffix}`,      //检查角色唯一性
    UpdateRoleStatus:                  `${prefix}authorization/role/updateRoleStatus${suffix}`, //禁用或启用此角色
    LoginQryMenuAuth:                  `${prefix}authorization/menu/qryInitMenuAuth${suffix}`,   //登录时查询菜单权限
    QryMenuAuth:                       `${prefix}authorization/menu/qryMenuAuth${suffix}`,       //创建角色权限菜单接口
    SaveRole:                          `${prefix}authorization/role/saveRole${suffix}`,          //编辑后保持信息接口
    QryAllDept:                        `${prefix}authorization/dept/qryAllDept${suffix}`,        //角色管理创建角色的部门接口
    RoleQryMenuAuth:                   `${prefix}authorization/menu/roleQryMenuAuth${suffix}`,   //角色管理创建角色权限菜单列表接口


   //黄金定投与黄金份额
   GetGoldPrdDetail:                  `${prefix}product/gold/getGoldPrdDetail${suffix}`,   //黄金定投与黄金份额产品详情
   //GetGoldInvestmentDetail:            `${prefix}product/gold/getGoldInvestmentDetail${suffix}`,   //黄金定投与黄金份额产品详情
   SetGoldProductTag:                  `${prefix}product/gold/setGoldProductTag${suffix}`,   //黄金定投与黄金份额添加标签接口
   DelGoldProductTag:                  `${prefix}product/gold/delGoldProductTag${suffix}`,   //黄金定投与黄金份额删除标签接口 
   GetGoldProductTag:                  `${prefix}product/gold/getGoldProductTag${suffix}`,   //查询黄金定投与黄金份额标签接口  
   SetGoldCustomInfo:                  `${prefix}product/gold/setGoldCustomInfo${suffix}`,   //黄金定投与黄金份额编辑、提交审核接口 
   QueryVerifyStatus:                  `${prefix}product/queryVerifyStatus${suffix}`,   //黄金定投、定活宝-定活通与黄金份额是否在审核中的接口

   //定活宝-定活通
   GetDhtPrdDetail:                    `${prefix}getDhtPrdDetail${suffix}`, //查询定活宝定活通的详情
   SetDhtCustomInfo:                   `${prefix}setDhtCustomInfo${suffix}`, //保存自定义定活宝定活通修改后的详情
   SetDhtProductTag:                   `${prefix}setDhtProductTag${suffix}`,   //定活宝-定活通添加标签接口
   DelDhtProductTag:                   `${prefix}delDhtProductTag${suffix}`,   //定活宝-定活通删除标签接口
   Search:                             `${prefix}file/search${suffix}`,     //查询定活宝-定活通附件接口
   GetDhtProductTag:                   `${prefix}getDhtProductTag${suffix}`,     //查询定活宝-定活通附件接口

    //组合产品配置
    queryCombProductArrInfoList:         `${prefix}queryCombProductArrInfoList${suffix}`,       //产品大类查询列表
    updateCombProductArrInfo:            `${prefix}updateCombProductArrInfo${suffix}`,        //产品大类修改
    addCombProductArrInfo:               `${prefix}addCombProductArrInfo${suffix}`,            //产品大类新增
    addCombProduct:                      `${prefix}addCombProduct${suffix}`,                   //组合产品新增
    editCombProduct:                     `${prefix}editCombProduct${suffix}`,                   //组合产品编辑
    queryCombProductById:                `${prefix}queryCombProductById${suffix}`,              //组合产品查询
    offSaleCombProduct:                  `${prefix}offSaleCombProduct${suffix}`,              //组合产品下架
    recommendDelete:                     `${prefix}recommend/delete${suffix}`,               //智能货架下架选中产品
    searchCombPrdList:                   `${prefix}searchCombPrdList${suffix}`,              //组合产品列表查询
    verifyCombProduct:                   `${prefix}verifyCombProduct${suffix}`,              //组合产品审核
    queryProductInfoList:                `${prefix}single/queryProductInfoList${suffix}`,     //产品列表查询
    // GetMenuAuth:                       `${prefix}getMenuAuth${suffix}`,     //获取菜单权限一、二级菜单
    
    
    //用户管理
    qryUserList:                       `${prefix}authorization/user/qryUserList${suffix}`,      //查询用户列表接口
    addUser:                           `${prefix}authorization/user/addUser${suffix}`,          //创建用户
    editUser:                          `${prefix}authorization/user/editUser${suffix}`,         //编辑用户
    isUserExist:                       `${prefix}authorization/user/isUserExist${suffix}`,      //检查用户唯一性
    qryOneUser:                        `${prefix}authorization/user/qryUserDetail${suffix}`,    //查看用户详情
    chgUserStatus:                     `${prefix}authorization/user/chgUserStatus${suffix}`,    //禁用或启用此用户
    qryAllDept:                        `${prefix}authorization/dept/qryAllDept${suffix}`,       //查询所有部门
    qryRoleInfoByDeptNo:               `${prefix}authorization/role/qryRoleInfoByDeptNo${suffix}`,       //按部门查询角色


    logout:                            `/portal/handle/work/user/logout.do`,               //退出登录
    logoutMenu:                         `/portal/getCurrentUser.do`                        //退出到运营菜单

}
module.exports = list;
