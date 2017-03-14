var loader = require('js/activity/favorNow/img-loader');

module.exports = {
    _loader: null,
    init: function(){
        if (this._loader) {
            return this._loader;
        }

        var list = [];

        $('.act3-stage img[data-src]').each(function () {
            var src = this.getAttribute('data-src');
            list.push(src);
            this.setAttribute('src', src);
        });

        this._loader = loader.load(list);
        return this._loader;
    },
    start: function(){
        this._loader.then(function() {
            act4.init();
            function action() {
                $('.act3').hide();
                act4.start();
            }
            $('.act3-stage').addClass('act3-stage-show');
            $('.act3-leaf>img').addClass('act3-leaf-shake');
            $('.act3-leaf').show().addClass('act3-leaf-drop').one(ANIM_END_EVENT, function () {
                action();
            });
            $('.act3-title').show().find('div').addClass('show-anim');
            setTimeout(function () {
                $('.act3-bg').addClass('act3-fadeout');
                setTimeout(function () {
                    $('.act3-title').addClass('act3-fadeout').one(ANIM_END_EVENT, function () {
                        action();
                    });
                },3000);
            },5000);
        });
    }
};