var loader = require('js/activity/favorNow/img-loader');

module.exports = {
    _loader: null,
    init: function() {
        if (this._loader) {
            return this._loader;
        }

        var list = [];

        $('.act6-stage img[data-src]').each(function () {
            var src = this.getAttribute('data-src');
            list.push(src);
            this.setAttribute('src', src);
        });

        this._loader = loader.load(list);

        return this._loader;
    },
    start: function(){
        this._loader.then(function() {
            $('.act6-btn').on('click', function () {
                $('.act6').hide();
                $('.act7').show();
                lottery.init();
                lottery.start();
            });
            setTimeout(function () {
                $('.act6-logo-rot-wrapper').addClass('act6-logo-fadeout').one(ANIM_END_EVENT, function () {
                    $(this).hide();
                });
            },300);
            setTimeout(function () {
                $('.act6-logo-normal-wrapper').addClass('act6-logo-show').one(ANIM_END_EVENT, function () {
                    $(this).css('opacity', 1);
                });
            },800);
        });
    }
};