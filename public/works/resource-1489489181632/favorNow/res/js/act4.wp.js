var loader = require('js/activity/favorNow/img-loader');

function doAnimation(func, delay) {
    var defer = $.Deferred();
    if (!delay) {
        func();
        defer.resolve();
    } else {
        setTimeout(function() {
            func();
            defer.resolve();
        }, delay);
    }

    return defer.promise();
}

function adjustLayer() {
    var sW = $('.act4-stage').width();
    var sH = $(window).height();
    var layerWidth = $('.act4-main-layer').width();
    var h = 0;
    var layer = $('.act4-main-layer');
    var bg = $('.act4-main-bg');

    if (layerWidth < sW) {
        layer.css('height', 'auto');
        bg.width(sW);
        h = $('.act4-main-bg').height();
        layer.height(h);
        layer.css('top', (sH - h) / 2);
    } else {
        layer[0].style.cssText = '';
        bg[0].style.cssText = '';
    }
}
module.exports = {
    _loader: null,
    init: function() {
        if (this._loader) {
            return this._loader;
        }

        var list = [];

        $('.act4-stage img[data-src]').each(function () {
            var src = this.getAttribute('data-src');
            list.push(src);
            this.setAttribute('src', src);
        });

        list.push('https://s.wandougongzhu.cn/s/b7/tips_23f211.png');

        this._loader = loader.load(list).then(function() {
            adjustLayer();
        });

        return this._loader;
    },
    start: function() {
        this._loader.then(function() {
            act5.init();

            $('.act4-stage').addClass('act4-stage-show');
            doAnimation(function() {
                $('.act4-win-layer').addClass('act4-win-layer-show');
                $('.act4-subtitle').addClass('act4-subtitle-show');
            }, 300).then(function() {
                return doAnimation(function() {
                    $('.act4-win-light').addClass('act4-win-light-show');
                }, 300);
            }).then(function() {
                $('.act4-birds-box').show();
            }).then(function() {
                doAnimation(function() {
                    $('.act4-birds-box').addClass('act4-birds-box-in');
                }, 10);
            }).then(function() {
                return doAnimation(function() {
                    $('.act4-hide-item').removeClass('act4-hide-item');
                }, 600);
            }).then(function() {
                return doAnimation(function() {
                    $('.act4-role-princess-img').hide();
                    $('.act4-role-princess-nao').show();
                }, 1000);
            }).then(function() {
                return doAnimation(function() {
                    $('.act4-role-princess-img').show();
                    $('.act4-role-princess-nao').hide();
                }, 3000);
            }).then(function() {
                return doAnimation(function() {
                    $('.act4-subtitle').addClass('act4-subtitle-show');
                }, 10);
            }).then(function() {
                return doAnimation(function() {
                    $('.act4-curtain-layer').addClass('act4-curtain-layer-close');

                    setTimeout(function() {
                        $('.act4').hide();
                    }, 1000);

                    act5.start();
                }, 3500);
            });
        });
    }
};
