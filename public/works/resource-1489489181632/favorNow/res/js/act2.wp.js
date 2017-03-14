var loader = require('js/activity/favorNow/img-loader');

module.exports = {
    _loader: null,
    init: function () {
        if (this._loader) {
            return this._loader;
        }

        var list = [];

        $('.act2-stage img[data-src]').each(function () {
            var src = this.getAttribute('data-src');
            list.push(src);
            this.setAttribute('src', src);
        });

        this._loader = loader.load(list);
        return this._loader;
    },
    start: function(){
        this._loader.then(function () {
            act3.init();

            function action() {
                $('.act2-princess-before-jump').show()
                    .addClass('act2-princess-show').one(ANIM_END_EVENT, function () {
                    $('.act2-princess-before-jump').remove();
                    $('.act2-princess-after-jump').show()
                        .addClass('act2-princess-jump').one(ANIM_END_EVENT, function () {
                        $('.act2-title').show().find('div').addClass('show-anim');
                        $('.act2-princess-after-jump').hide();
                        $('.act2-bg').addClass('act2-bg-move');
                        $('.act2-leaf>img').attr('src', 'https://s3.wandougongzhu.cn/s/44/leaf_2_431423.png');
                        $('.act2-leaf>img').addClass('act2-leaf-shake');
                        $('.act2-leaf').addClass('act2-leaf-drop');
                        setTimeout(function () {
                            $('.act2').addClass('act2-fadeout').one(ANIM_END_EVENT, function () {
                                $('.act2').hide();
                                act3.start();
                                act4.init();
                            });
                        }, 6000);
                    });
                });
            }
            $('.act2-stage').addClass('act2-show').one(ANIM_END_EVENT, function () {
                action();
            });
        });
    }
};