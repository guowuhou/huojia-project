const menu = [
    {
        name: '产品工厂',
        submenu: [
            {
                name: '本行理财产品',
                url: 'product-list-bank.html'
            },
            {
                name: '代理理财产品',
                url: 'product-list-proxy.html'
            },
            {
                name: '大额存单',
                url: 'product-deposit-receipt.html'
            },
            {
                name: '消费金融',
                url: 'financial-consumption.html'
            },
            {
                name: '组合产品配置',
                url: 'product-group-config.html?type=05'
            }
        ]
    },
    {
        name: '产品目录',
        submenu: [
            {
                name: '标签分类',
                url: 'tag-type.html'
            },
            {
                name: '标签',
                url: 'tag-manager.html'
            },
            {
                name: '组合标签',
                url: 'tag-group-manager.html'
            }
        ]
    },
    {
        name: '产品货架',
        submenu: [
            {
                name: '产品货架',
                url: 'product-input-index.html'
            },
            {
                name: '智能推荐',
                url: 'product-selected.html'
            },
            
        ]
    },
    {
        name: '产品交易',
        submenu: [
            {
                name: '交易限额',
                url: 'quota-export.html'
            }
        ]
    },
     {
        name: '审批管理',
        submenu: [
            {
                name: '我的申请',
                url: 'product-myapply.html'
            },
            {
                name: '待审批申请',
                url: 'product-check-apply.html'
            }
        ]
    }
     
];

module.exports = menu;