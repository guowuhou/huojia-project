exports.get = function(){
    const search = location.search.replace('?', '');
    const arr = search.split('&');
    const ret = {};
    for(let i=0; i < arr.length; i++){
        const d = arr[i];
        if( d && d.length >= 3 ){
            const kv = d.split('=');
            ret[kv[0]] = kv[1];
        }
    }
    return ret;
};