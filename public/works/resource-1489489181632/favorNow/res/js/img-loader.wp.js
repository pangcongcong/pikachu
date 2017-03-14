function createImg(src, load) {
    var img = new Image();
    img.onload = img.onerror = function() {
        load.call(img);
    };

    img.src = src;
}

function load(list, progress) {
    var count = 0;
    var len = list.length;
    var defer = $.Deferred();

    function counter() {
        count++;

        if (progress) {
            progress.call(this, count, count / len, list);
        }

        if (count === len) {
            defer.resolve();
        }
    }

    list.every(function(v) {
        createImg(v, counter);
        return true;
    });

    if (list.length === 0) {
        defer.resolve();
    }

    return defer.promise();
}

module.exports = {
    load: load,
    _tid: null,
    hideBigLoader: function() {
        if (this._tid) {
            clearTimeout(this._tid);
        }

        var box = $('.screen-loader');

        box.addClass('screen-loader-trans');

        this._tid = setTimeout(function() {
            box.hide();
        }, 500);
    },
    showPer: function(per) {
        $('.load-beautyful-life p').text(Math.floor(per * 100) + '%');
    }
};