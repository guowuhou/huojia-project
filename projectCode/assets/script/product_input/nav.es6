const $ = require("lib/jquery.js");

class ProNavClass extends uu.Component {

    onLoad() {
        const pathnameArr = location.pathname.split('/');
        const basename = pathnameArr[pathnameArr.length - 1];
        $(this.node.dom).find('a').each(function () {
            const href = $(this).attr('href');
            const newhref = `${href}${location.search}`;
            $(this).attr('href', newhref);
            if (basename == href) {
                $(this).parent().addClass('active');
            }
        });
    }
};

module.exports = ProNavClass;


