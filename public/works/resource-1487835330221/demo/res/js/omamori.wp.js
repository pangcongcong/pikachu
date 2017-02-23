var jsShare = require('coms/jsShare');
var jsAuth = require('coms/jsAuth');
var ajax = require('coms/AjaxLoader');
var Dialog = require('coms/Dialog');
var storage = require('coms/storage');
var bang = require('./omamori-bang');
var demo = require('./omamori-demo');
$(function(){
	var omamoris = [
		[
			['jkqy','身体经历过放肆与消极，也算是没白活，但生活再放肆，也总该有节制', '健康祈愿'],
			['jkshy','阳光正暖 别睡太晚', '健康祈愿'],
			['wbwz', '道理你都懂 2017年开始爱惜自己 一点都不晚', '无病无灾']
		],
		[
			['cyshsh', '钱不是万能的 大概只能解决世界上90%的问题', '财运上升'],
			['gmky', '再辛苦的 也都坚持过来了 再辛苦的 也能笑着面对', '功名开运'],
			['shzhjx', '你受的苦 总有一天会照亮你未来的路', '升职加薪']
		],
		[
			['aqmm', '你崇拜他像个英雄 他疼爱你像个孩子', '爱情美满'],
			['xf', '在余生的温暖时光里 有人与你立黄昏 有人问你粥可温', '幸福'],
			['aqmm', '人生只有两次幸运就好 一次遇见你 一次走到底', '爱情美满'],
			['xf', '在忙着回复工作邮件时，收到重要的人发来的问候', '幸福'],
			['xjly', '假如能够遇见你 我想和你在一起', '喜结良缘'],
			['thy', '其实不是不想谈恋爱，而是单身总矫情', '桃花运'],
			['ach', '愿你所有的快乐 无需假装 愿你此生尽兴 赤诚善良', '随心']
		],
		[
			['hgqy', '愿有前程可奔赴 也有岁月可回头', '合格祈求'],
			['xyjb', '懒懒散散是世间常态，勤勤恳恳却能绽放人生', '学业进步'],
			['bsh', '时间早晚会站在你这边，有何胜利可言？挺住意味着一切', '必胜'],
			['shl', '只要愿意努力 最坏的结果 也不过是大器晚成', '胜利']
		],
		[
			['jnhx', '过年团聚 宜好好陪伴 忌低头玩手机', '家内和谐'],
			['chxaq', '回家的路 雾霾消散 安全畅通', '出行安全'],
			['lxaq', '你放心去浪吧 未知的旅行充满惊喜 也会保你平安', '旅行安全'],
			['chx', '扫掉风霜尘土 行最远的路 爱最好的人 看最美的风景 愿你仍旧是少年', '出行']
		],
		[
			['xchshn', '勇敢面对生活中所有的不堪 再元気满满的去接受下一段挑战', '消除水逆'],
			['xchshn', '没有什么事情是一顿火锅解决不了的 如果有 你懂的', '消除水逆'],
			['kychz', '我们在童话里暂时蜗居，也总要出来面对刀光剑影的世界，然后一声不响的继续生活', '开运除灾']
		],
		[
			['xxshch', '愿你自强到无需人宠人惯，却依然幸运到有人宠有人惯', '心想事成'],
			['xxshch', '假装在运动其实在长胖的快乐', '心想事成'],
			['xxshch', '世界和平', '心想事成'],
			['xxshch', '突然醒来却发现离闹钟响起还有一个小时', '心想事成'],
			['xxshch', '过去的每一天 快乐更清楚 悲伤都模糊', '心想事成'],
			['xxshch', '别说来日方长 当下最好', '心想事成']
		]
	];

	function loadImg(src){
		var p = new Promise(function(resolve,reject){
			var img = new Image();
			img.onload = function(){
				resolve(this);
			}
			img.src = src;
		});
		return p;
	}

	var odrawed = false;
	function initDraw(){
		var canvas = $('#canvas');
		canvas.show();
		var context = canvas[0].getContext('2d');
		canvas.attr('width', canvas.width());
		canvas.attr('height', canvas.height());


		context.lineJoin = "round";
		context.lineWidth = 8;
		context.strokeStyle = '#ffffff';
		var offset = canvas.offset();
		var canvasTop = offset.top;
		var canvasLeft = offset.left;

		var preX = 0;
		var preY = 0;
		var curX = 0;
		var curY = 0;
		var isDrawing = false;
		$('#canvas').on('touchstart',function(evt){
			isDrawing = true;
			preX = evt.touches[0].pageX - canvasLeft;
			preY = evt.touches[0].pageY - canvasTop;
			demo.stop();
		});
		$('#canvas').on('touchmove',function(evt){
			curX = evt.touches[0].pageX - canvasLeft;
			curY = evt.touches[0].pageY - canvasTop;
			context.beginPath();
			context.moveTo(preX, preY);
			context.lineTo(curX, curY);
			context.closePath();
			context.stroke();

			preX = curX;
			preY = curY;
		});

		$('.draw').on('touchmove', function(evt){
			evt.preventDefault();
			evt.stopPropagation();
		});

		$('.draw').on('touchend', function(evt){
			if(odrawed) return;
			odrawed = true;
			$('.scroll-mask').addClass('scroll-mask-hide');
			$('.focus-box').hide();

			var canvasOffset = $('#canvas').offset();
			var paperOffset = $('.scroll-mini-paper').offset();
			var w = canvasOffset.width;
			var h = canvasOffset.height;
			var cr = w/h;
			var pr = paperOffset.width/paperOffset.height;
			var w = canvasOffset.width
			if(cr > pr){
				h = h/(w/paperOffset.width);
				w = paperOffset.width;
			} else {
				w = w/(h/paperOffset.height)
				h = paperOffset.height;
			}
			$('#canvas').css({
				left: paperOffset.left + (paperOffset.width-w)/2,
				top: paperOffset.top + (paperOffset.height-h)/2,
				width: w,
				height: h
			});

			bang.init();
			setTimeout(function(){
				$('#canvas').css({
					left: (paperOffset.width-w)/2,
					top: (paperOffset.height-h)/2
				}).appendTo('.scroll-mini-paper');

				$('.scroll-mini').addClass('tada animated').one(
					'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
					function(){
						bang.bang();
						$('.scroll-mini').hide();
						$('.omamori-open').show();
						$('.scroll-mask-hide').css('opacity', '1');
					});
			}, 500);
			isDrawing = false;
		})
	}

	function openMystery(){
		$('.award').hide();
		$('.award-get').hide();
		ajax.post('/Lottery/ajaxDoLottery', {
			activity_src: PAGE_CONF.activity_src
		}).then(function(res){

			if(res.errno){
				if(res.errno==3434){
					$('.award-title').html('您已领取过新年好礼！');
					$('.award-done').show();
					$('.award').show();
				}else{
					Dialog.alert(res.errmsg);
				}
				return;
			}
			//优理券
			
			var type = res.data.type;
			//type=5;
			if(type=='2') type='coupon';
			if(res.data.award_id=='183')
				type='omamori-coupon';
			if(type=='7')
				type='goods';
			if(type=='5')
				type='money';
			if(type=='6'){
				type='omamori';
			}
			$('.award-title').html(res.data.award_tips);
			if(type=='coupon'){
				var notes = res.data.note.split(' ');
				$('.award-coupon-title').html(notes[0]+'<span>元</span>');
				$('.award-coupon-subtitle').html(notes[1]+'<br>'+notes[2]);
			}

			if(type=='goods'){
				var data = res.data;
				var attach_info = encodeURIComponent(JSON.stringify({
					activity_id: data.activity_id,
					award_id: data.award_id,
					goods_id: data.data.goods_id,
					winning_goods_price: data.data.winning_goods_price
				}));
				
				var url;
				if(PAGE_CONF.browser.app)
					url='wonderfull://mall/pay?pay_src=lottery&attach_info='
						+ attach_info;
				else {
					url = "/cart/?buy_now=1&goods_id="
						+ data.data.goods_id
						+ '&buy_count=1'
						+ '&pay_src=lottery'
						+ '&customer=1'
						+ '&attach_info='+attach_info;
				}
				$('.award-goods a').attr('href', url);
			}
			$('.award-'+type).show();
			$('.award').show();
		});
	}

	var haveChance = true;
	function getAward(){
		$('.wx-share-tip').trigger('click');
		if(!haveChance) return;
		haveChance = false;
		if(PAGE_CONF.browser.app){
			openMystery();
		} else {
			$('.award-get').show();
			$('.award').show();

			$('.award-get button').click(function(){
				if(PAGE_CONF.browser.weixin){
					if (PAGE_CONF.isLogin) {
						openMystery();
					} else {
						jsAuth.reg({
							success: function () {
								PAGE_CONF.isLogin = true; // 注册成功后重置为登录状态
								openMystery();
							},
							loginParams: {
								success: function () {
									PAGE_CONF.isLogin = true; // 登录成功后重置为登录状态
									openMystery();
								}
							}
						});
					}
				} else {
					openMystery();
				}
			});
		}
	}

	var omamoriInited = false;
	function initOmamori(omamoriData, isVisitor){
		omamoriInited = true;
		$('.welcome,.draw').hide();
		$('.omamori').show();

		var bgImgs = [
			'o4','o3','o6','o7','o2','o5','o1'
		].map(function(key){return 'res/img/'+key+'.png'});
		
		var typeIndex, omamoriIndex;
		if(omamoriData){
			typeIndex = omamoriData.typeIndex;
			omamoriIndex = omamoriData.omamoriIndex;
		}else{
			typeIndex = Math.round(Math.random()*7-0.5);
			omamoriIndex = Math.round(Math.random()*omamoris[typeIndex].length-0.5);
		}

		if(PAGE_CONF.browser.weixin){
			$('.omamori').addClass('wx-mod');
		} else {
			if(omamoriData){
				$('.omamori').addClass('second-mod');
			} else {
				$('.omamori').addClass('first-mod');
			}
		}
		
		var key = omamoris[typeIndex][omamoriIndex][0];
		var data = {
			bgImg: bgImgs[typeIndex],
			title: 'res/img/title/'+key+'.png',
			text: omamoris[typeIndex][omamoriIndex][1].split('').map(function(letter){
							if(letter==' ')
								return '<br>';
							else
								return '<span>'+letter+'</span>';
						}).join('')
		};
		var html = $('#omamoriTpl').html();
		html = html.replace(/\{([^}]+)\}/g, function(_,key){
			return data[key];
		});
		$('.omamori').html(html);

		$('.canvas-text').html(data.text);

		$('.omamori .first .share-btn,.omamori .second .share-btn').click(function(){
			window.callShare();
			if(PAGE_CONF.browser.app){
				setTimeout(function(){
					getAward();
				}, 1000);
			}
		});
		$('.omamori .get-award-btn').click(function(){
			storage.remove('omamori');
			location.href="/activity/yushou?chr=other";
		});
		$('.omamori .try-again-btn').tap(function(){
			storage.remove('omamori');
			location.reload();
		});

		if(!omamoriData){
			makeImg(data.bgImg, data.title).then(function(img){
				var data = {
					typeIndex: typeIndex,
					omamoriIndex: omamoriIndex,
					img: img
				};
				storage.set('omamori',data);

				initShare(data);
			});
		}
		
	}

	function makeImg(bgImg, titleImg){
		var p = new Promise(function(resolve){
			var qrcodeURL = window.location.protocol+'//'+window.location.host+'/share/qrcode?url='+encodeURIComponent(
				'https://m.wandougongzhu.cn/activity/yushou?chr=img');
			Promise.all([
				loadImg('/resource/img/activity/omamori/bg-simple2.jpg'),
				loadImg(bgImg),
				loadImg(titleImg),
				loadImg(qrcodeURL),
				loadImg('/resource/img/activity/omamori/underline2.gif')
			]).then(function(imgs){
				var bgImg = imgs[0];
				var omamoriBgImg = imgs[1];
				var titleImg = imgs[2];
				var qrImg = imgs[3];
				var underlineImg = imgs[4];
				var canvas = document.createElement('canvas');
				canvas.width = 750;
				canvas.height = 1206;
				var context = canvas.getContext('2d');

				//绘制底图
				context.drawImage(bgImg, 0, 0);

				//绘制符底图
				context.drawImage(omamoriBgImg, 42, 0);

				//绘制title
				context.drawImage(titleImg, 177, 275);

				//绘制underline
				var boxOffset = $('.canvas-text-box').offset();
				var pat=context.createPattern(underlineImg,"repeat");
				var txtBoxOffset = $('.canvas-text').offset();
				context.save();
				context.translate(
					txtBoxOffset.left-boxOffset.left+152,
					txtBoxOffset.top-boxOffset.top+390);
				context.rect(
					0,
					0,
					$('.canvas-text').width(),
					$('.canvas-text').height());
				context.fillStyle=pat;
				context.fill();
				context.restore();

				//绘制title文字
				context.fillStyle='#000000';
				context.font='34px "Helvetica Neue","Hiragino Sans GB","Segoe UI","Microsoft Yahei","微软雅黑",Tahoma,Arial,STHeiti,sans-serif';
				context.textAlign = 'start';
				context.textBaseline = 'top';
				$('.canvas-text span').each(function(){
					var letter = $(this);
					var offset = letter.offset();

					var s = letter.text();
					var l = offset.left-boxOffset.left+152;
					var t = offset.top-boxOffset.top+390;
					context.fillText(s,l,t);
				});

				//绘制二维码
				context.drawImage(qrImg,175,850,180,180);

				//长按识分二维码
				context.font='26px sans-serif';
				context.fillText('长按识别二维码',377,900);
				context.font='bold 28px sans-serif';
				context.fillText('获取您的新年签',370,940);

				//上传图片
				// var imgCanvas = document.createElement('canvas');
				// imgCanvas.width = 375;
				// imgCanvas.height = 603;
				// var ctx = imgCanvas.getContext('2d');
				// ctx.drawImage(canvas,0,0,750,1206,0,0,imgCanvas.width,imgCanvas.height);
				// var src = imgCanvas.toDataURL('image/jpeg', 0.9);
				
				var src = canvas.toDataURL('image/jpeg', 0.85);
				var base64 = src.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

				$.post('/activity/ajaxUploadShareImg',{
					act_name:'omamori',
					img:base64
				}, function(res){
					PAGE_CONF.shareImg = res.data+'?t='+(+new Date);
					resolve(PAGE_CONF.shareImg);
				},'json');


				// var newImg = new Image();
				// newImg.src = src;
				// document.body.appendChild(newImg);
				// newImg.style.cssText="position:absolute;z-index:22;width:375px"
			});
		});
		return p;
	}


	function insertCssText(cssText) {
		var oStyle = document.createElement("style");
		oStyle.type = "text/css";
		if (oStyle.styleSheet) {
			oStyle.styleSheet.cssText = cssText;
		} else {
			oStyle.appendChild(document.createTextNode(cssText));
		}
		return (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(oStyle);
	}
	function startTypewriter(){
		$('.scroll-content li').each(function(){
			var text = $(this).text();
			$(this).html(text.split('').map(function(t){return '<span>'+t+'</span>'}));
		});
		var html = [];
		var css = [];
		$('.scroll-content li span').each(function(idx){
			var word = $(this);
			var offset = word.offset();
			html.push('<span style="left:'+offset.left+'px;top:'+offset.top+'px">'+word.text()+'</span>');
			css.push('.typewriter span:nth-of-type('+(idx+1)+'){animation-delay: '+(idx*0.1)+'s}')
		});
		insertCssText(css.join(''));
		$('.typewriter').html(html.join(''));
	}

	var shareTitle = '新年御守 - 豌豆公主';
	var shareDesc = '愿你所有的美好都如期而至';
	var shareUrl = 'https://m.wandougongzhu.cn/activity/yushou?default=1';
	function initShare(omamoriData){
		if(omamoriData){
			shareTitle = shareDesc;
			shareDesc = '我的新年签语是：'+omamoris[omamoriData.typeIndex][omamoriData.omamoriIndex][2];
			shareUrl = 'https://m.wandougongzhu.cn/activity/yushou?tindex='+omamoriData.typeIndex+'&oindex='+omamoriData.omamoriIndex;
		}
		jsShare.initShare({
			title: shareTitle,
			timelineTitle: shareDesc,
			desc: shareDesc,
			url: shareUrl,
			img: (omamoriData&&omamoriData.img)||PAGE_CONF.defaultShareImg,
			conf: PAGE_CONF.wxconf,
			success: function(){getAward()}
		});
		window.callShare = function(){
			jsShare.callShare({
				title: shareTitle,
				timelineTitle: shareDesc,
				desc: shareDesc,
				url: shareUrl,
				img: omamoriData&&omamoriData.img||PAGE_CONF.defaultShareImg,
				type: (PAGE_CONF.browser.ios&&PAGE_CONF.browser.app&&omamoriData.img)?'img':'web',
				conf: PAGE_CONF.wxconf,
				success: function(){getAward()}
			});
		}
	}

	function initEvent(){
		$('.welcome-btn').tap(function(){
			if(PAGE_CONF.browser.app && !PAGE_CONF.isLogin){
				window.location.href = 'wonderfull://mall/login';
				return;
			}
			$('.welcome').hide();
			$('.draw').show();
			$('.scroll-box').addClass('scroll-open');
			$('audio')[0].play();
			setTimeout(function(){
				$('.scroll-content ul, .scroll-content button').addClass('guide-show');
			}, 1000);

			//startTypewriter();
		});
		$('.scroll-content button').click(function(){
			$('audio')[0].pause();
			$('.scroll-box').addClass('scroll-collapse');
			$('.scroll-content ul').css('visibility', 'visible');
			$('.typewriter').hide();
			$('.focus-box').addClass('focus-box-show');
			$('.scroll-mini').css('visibility', 'visible');

			initDraw();
			demo.play();
		});

		$('.close-btn').tap(function(){
			$('.award').hide();
		});
		$('.award-done button').tap(function(){
			$('.award').hide();
		});

		$('.omamori-open').click(function(){
			initOmamori();
		});
	}

	function init(){
		if(PAGE_CONF.browser.app && !PAGE_CONF.isLogin){
			window.location.href = 'wonderfull://mall/login';
		}
		var omamoriData = storage.get('omamori');
		if(PAGE_CONF.typeIndex&&PAGE_CONF.omamoriIndex){
			initOmamori({
				typeIndex: parseInt(PAGE_CONF.typeIndex),
				omamoriIndex: parseInt(PAGE_CONF.omamoriIndex)
			}, true);
			initShare();
		}else if(omamoriData){
			initOmamori(omamoriData);
			initShare(omamoriData);
		} else {
			$('.welcome-btn').show();
			initShare();
		}

		initEvent();
	}
	init();
});