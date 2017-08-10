const ejs = require('lib/ejs.js');
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const moment = require('lib/moment.js');
const httpreq = require('httpreq.es6');
const prosynchro = require('plugins/fixed-synchro.es6');
require('lib/bootstrap-table.js');

class bankDepositClass extends uu.Component {
    properties() {
        return {
           
        };
    }
    onLoad() {
        this.rqoptions = { pageSize: 25, pageNo: 1 };
        var fixedClown = localStorage.getItem('fixedClown');
        localStorage.removeItem('fixedClown');
        if(fixedClown){
            this.showBack(JSON.parse(fixedClown));
        }
        this.bindEvents();
    }
    
    //手动同步
    bindEvents(){
        $("#deposit_synch").on('click',(event) =>{
            this._synchEvent();
        })
    }
    
    _synchEvent(){
            let list = $("#table").bootstrapTable('getAllSelections'),
                self = this;
            if (list.length <= 0) {
                Dialog.alert("请勾选要同步的产品");
                return;
            }else if(list.length > 10){  
                Dialog.alert("勾选同步的产品不能超过10条");
                return;
            }
            else if(list.selector){
                Dialog.alert("没有选择可同步的产品");
                return;
            }else {
                for(var i=0;i<list.length;i++){
                   if(!list[i].ccy){
                    Dialog.alert(list[i].ccy+'不能手工同步')
                    return;
                  } 
                }
                
            }
             prosynchro.show(list, () => {
                self.getproshelflist(self.rqoptions);
        });
  }
    
    //根据筛选条件rqoptions查询产品列表
    getproshelflist(rqoptions) {
        for (let v in rqoptions) {
            this.rqoptions[v] = rqoptions[v];
        }
        //防重复提交
        if (this.reqFlag) return;
        this.reqFlag = true;
        let listTable = [ 
                 {
                title: '',
                field: '',
                align: 'center',
                valign: 'middle',
                checkbox: true
                }, {
                    field: 'prdCode',
                    title: '产品Code',
                    align: 'center'
                }, {
                    field: 'prdName',
                    title: '产品名称',
                    align: 'center'
                },{
                    field:'ccy',
                    title:'币种',
                    align:'center'
                }
                , {
                    field: 'amtMin',
                    title: '购买起点',
                    formatter:function(value){
                          return Number(value).toFixed(2)
                    },
                    align: 'center'
                },{
                    field: 'saleStatus',
                    title: '上架状态',
                    align: 'center',
                    formatter:function (value){
                         const saleStatusMap = {
                            "ON_SALE": "上架中",
                            "OFF_SALE": "已下架"
                        };
                        return saleStatusMap[value];
                    }
                },{
                    title: '<span style="padding:0px 47px">操作</span>',
                    align: 'center',
                    formatter:_.bind(this.functionEvents, this) 
                }
            ];
        $("#table").bootstrapTable('destroy');
        $('#table').bootstrapTable({
            url: httpreq.PS_getFixedCurrentLinkList,
            columns: listTable ,
            sortable: true,//是否启用排序
            sortOrder: "prdCode",//排序方式
            pagination: true,//是否显示分页
            pageSize: this.rqoptions.pageSize,//每页的记录行数
            queryParams: (params) => {//传递的参数
                return _.extend({}, this.rqoptions ,{
                    pageSize: params.limit,//页面大小
                    pageNo: params.offset / params.limit + 1,
                });
            },
            responseHandler: (res) => {
                let resDate = {};
                if (res.code == "000000") {
                    this.reqFlag = false;
                    this.showQryTimeOrRedCount(res.data.totalSize);
                    this.productInfoList = res.data.list;
                    _.extend(resDate, {
                        rows: res.data.list || [],
                        total: res.data.totalSize
                    });
                }else if(res.responseCode == '900106'||res.responseCode == '683310'){
                         Dialog.alert(res.msg || res.responseMsg);
                         window.top.location.href = "http://brop.pab.com.cn/portal/login.html";
                }else {
                        Dialog.alert(res.msg || res.responseMsg);
                        this.reqFlag = false;
                        this.showQryTimeOrRedCount(0);
                        this.productInfoList = res.data.list;
                        resDate = {};
                     }
                return resDate;
            },
            formatNoMatches: () => {
                return '查无记录';
            },
            formatShowingRows: (pageFrom, pageTo, totalRows) => {
                return '展示' + pageFrom + ' 到 ' + pageTo + ' 条，共 ' + totalRows + ' 条记录';
            },
            formatRecordsPerPage: (pageNumber) => {
                return '每页 ' + pageNumber + ' 条';
            }
        });
    }
    //操作功能事件
    functionEvents(value,row,index) {
            let insertHtml="";
        if(row.saleStatus!="OFF_SALE"){
           insertHtml=`<li><a href="fixed-clown.html?prdCode=${row.prdCode}">编辑产品信息</a></li>
                      <li><a href="fixed-clown.html?prdCode=${row.prdCode}&seeFlag=1">查看产品信息</a></li>`;
        }
        else if(row.saleStatus=="OFF_SALE"){
           insertHtml=`<li><a href="fixed-clown.html?prdCode=${row.prdCode}&seeFlag=1">查看产品信息</a></li>`;
        };
        let html = `<div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">操作<span class="caret"></span></button>
                   <ul class="dropdown-menu dropdown-menu-right" role="menu">
                       ${insertHtml}
                  </ul>
          </div>
        `;
        return html;  
    }       
    //更新查询的记录条数和更新的时间
    showQryTimeOrRedCount(totalSize) {
        let total = parseInt(totalSize, 10);
        total = isNaN(total) ? 0 : total;
        let thistime = moment().format('YYYY-MM-DD HH:mm:ss');
        $(this.node.dom).parent().find("#recordtext").text(`共有 ${total} 条记录`);
    }
    //返回查询产品列表的上送的参数
    getqryparamdatas() {
        return this.rqoptions || {};
    }
    //返回查询产品列表的的数据
    getqrydatas() {
        return this.productInfoList || [];
    }
    //格式化时间
    getshelfDate(time, format) {
        if (time > 0) {
            return moment(time).format(format);
        } else {
            return '';
        }
    }
    
    showBack(fixedClown) {
        var self = this;
        var filter = $("#bank_deposit").find('[filter]');
         _.each(filter,(item)=>{
            let name = $(item).attr('filter');
            if(name !='pageNo'){
                $(item).val(fixedClown[name])
            }
        });
        self.getproshelflist(this.rqoptions);
    }
};
module.exports = bankDepositClass;