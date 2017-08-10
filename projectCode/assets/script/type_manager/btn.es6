const $ = require('lib/jquery.js');

const TreeGridClass = uu.Component.extend({

    // show properties in Editor, you can use this.xxx directly
    properties: {
        treegrid: {
            defaultValue: null,
            type: uu.Node
        }
    },

    // init
    onLoad: function () {     
       $(this.node.dom).on('click', ()=>{
           this.treegrid.getComponent('treegrid.es6').addType({});
       });
    }

});

module.exports = TreeGridClass;