var Vue = require('vue');
var jsShare = require('coms/jsShare');
var wx = require('coms/jsShare/jweixin-1.0.0');
var act1 = require('js/activity/favorNow/act1');
var act2 = require('js/activity/favorNow/act2');
var act3 = require('js/activity/favorNow/act3');
var act4 = require('js/activity/favorNow/act4');
var act5 = require('js/activity/favorNow/act5');
var act6 = require('js/activity/favorNow/act6');
var lottery = require('js/activity/favorNow/lottery');
var loader = require('js/activity/favorNow/img-loader');

window.ANIM_END_EVENT = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
window.act2 = act2;
window.act3 = act3;
window.act4 = act4;
window.act5 = act5;
window.act6 = act6;
window.lottery = lottery;

function getUrlFlag(url) {
    var reg = /(?:&|\?)lottery=([^?&]+)/g;
    var tmp;
    var rs = '';

    while((tmp = reg.exec(url))) {
        rs = tmp[1];
    }

    return rs;
}

$(function(){
    var audio = $('audio')[0];
    if(PAGE_CONF.browser.weixin){
        wx.ready(function(){
            console.log(1)
            audio.play();
        })
    }
    var btn=$('.music').tap(function(){
        if(btn.hasClass('music-play')){
            btn.removeClass('music-play');
            audio.pause();
        } else {
            btn.addClass('music-play');
            audio.play();
        }
    });
});

var flag = getUrlFlag(location.search);
if (flag === '1') {
    loader.hideBigLoader();
    $('.lottery').show().siblings().hide();
    $('.act7').show();
    lottery.init();
    lottery.start();
} else {
    act1.init().then(function() {
        loader.hideBigLoader();
        act1.start();
        
        act2.init();
    });
}

jsShare.initShare({
    title: '致我们在抵达童话之国前走过的一千零一夜',
    desc: '四季悄然变换，岁月慢慢沉淀，现在的你，真的知道怎么宠爱自己吗？',
    timelineTitle: '四季悄然变换，岁月慢慢沉淀，现在的你，真的知道怎么宠爱自己吗？',
    img: 'http://s5.wandougongzhu.cn/s/b3/favor_89109d.jpg',
    url: location.protocol+'//'+location.host+'/activity/mikihouse',
    conf: PAGE_CONF.wxconf
});
// act1.start();

// act2.init();
// act2.start();

// act3.init();
// act3.start();

// act4.init();
// act4.start();

// act5.init();
// act5.start();

// act6.init();
// act6.start();

// lottery.init();
// lottery.start();