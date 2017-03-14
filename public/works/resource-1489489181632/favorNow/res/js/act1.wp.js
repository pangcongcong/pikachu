var loader = require('js/activity/favorNow/img-loader');

module.exports = {
    _loader: null,
    init: function(){
        if (this._loader) {
            return this._loader;
        }

        var list = [];

        $('.act1-stage img[data-src]').each(function () {
            var src = this.getAttribute('data-src');
            list.push(src);
            this.setAttribute('src', src);
        });
        list.push('https://s4.wandougongzhu.cn/s/72/witch-angry_ad5cd6.png');

        this._loader = loader.load(list, function(total, per) {
            loader.showPer(per);
        });
        return this._loader;
    },
    start: function(){
        this._loader.then(function() {
            function knock() {
                $('.princess-stand').hide();
                $('.princess-run')
                    .show()
                    .addClass('princess-anim-run').one(ANIM_END_EVENT, function () {


                    $(this).hide().removeClass('princess-anim-run');
                    //$('.princess-stand').addClass('princess-stand2').show();
                    $('.knock').show();

                    $('.apple').hide();
                    $('.drop-apple').show().addClass('drop-apple-anim').one(ANIM_END_EVENT, function () {
                        $('.witch').addClass('witch-angry');
                        $('.knock').hide();
                        $('.princess-run')
                            .addClass('princess-anim-run2')
                            .show()
                            .one(ANIM_END_EVENT, function () {
                                $('.act1').hide();
                                $('.act2').show();
                                act2.start();
                            });
                        setTimeout(function () {
                            $('.stage').addClass('stage-anim');
                        }, 500);
                    });
                });
                setTimeout(function () {
                    $('.effect').show();
                }, 100);
            }

            $('.princess').addClass('princess-walk').one(ANIM_END_EVENT, function () {
                $(this).hide().removeClass('princess-walk');
                $('.princess-stand').show();
                setTimeout(knock, 1000);
            });
            $('.subtitle').show().find('div').addClass('show-anim');
        });
	}
};