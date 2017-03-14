var loader = require('js/activity/favorNow/img-loader');

module.exports = {
    _loader: null,
    init: function() {
        if (this._loader) {
            return this._loader;
        }

        var list = [];

        $('.act5-viewport img[data-src]').each(function () {
            var src = this.getAttribute('data-src');
            list.push(src);
            this.setAttribute('src', src);
        });

        list.push('https://s2.wandougongzhu.cn/s/b8/stage2_b02f47.jpg');
        list.push('https://s5.wandougongzhu.cn/s/20/wheel_6236d6.png');
        list.push('https://s2.wandougongzhu.cn/s/1e/wheel-2_eede17.png');
        list.push('https://s.wandougongzhu.cn/s/83/goat_edbeed.png');
        list.push('https://s2.wandougongzhu.cn/s/5c/flash_41808b.png');
        list.push('https://s4.wandougongzhu.cn/s/e3/subtitle_300b55.png');

        this._loader = loader.load(list);

        return this._loader;
    },
    start: function() {
        this._loader.then(function() {
            act6.init();
            $('.act5-viewport').show();
            setTimeout(function() {
                $('.act5-viewport').addClass('act5-viewport-show');
            }, 10);
            setTimeout(function() {
                $('.act5-moon-img').addClass('act5-moon-img-show');
            }, 300);
            setTimeout(function() {
                $('.act5-couple-img').hide().next().hide();
                $('.act5-prince-dance-layer img').addClass('dance-man');
                $('.act5-princess-dance-layer').show().find('img').attr('src', 'https://s4.wandougongzhu.cn/s/d7/-1_7ddacb.gif');
                setTimeout(function () {
                    $('.act5').hide();
                    $('.act6').show();
                    act6.start();
                }, 1700);
            }, 12000);
        });
    }
};
