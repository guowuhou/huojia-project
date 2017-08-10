const $ = require('lib/jquery.js');
require('lib/bootstrap.js');

class HeadClass extends uu.Component {

    onLoad() {
        //统一事件处理
        $(document).ready(() => {
            $('body').on('click', 'button[href]', function () {
                const href = $(this).attr('href');
                location.href = href;
            });
        });
    }

};

module.exports = HeadClass;  //hello 