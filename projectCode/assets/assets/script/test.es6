/**
* This is a custom_script template, change it!
*/
class YourClass extends uu.Component {

    // show properties in Editor, you can use this.xxx directly
    properties() {
        return {
            // name: {
            //     defaultValue: 'myname',
            //     type: uu.String
            // },
            // box: {
            //     defaultValue: null,
            //     type: uu.Node
            // }
        };
    }

    // init
    onLoad() {
        // console.log(`this.name = ${this.name}`);
    }

    // all other nodes and components is ready
    start() {

    }

};

module.exports = YourClass;