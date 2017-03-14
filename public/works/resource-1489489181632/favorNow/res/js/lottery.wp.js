var Vue = require('vue');
var qtip = require('coms/QuickTip');
var Dialog = require('coms/Dialog');
var ajax = require('coms/AjaxLoader');
var jsShare = require('coms/jsShare');
var jsAuth  = require('coms/jsAuth');
var Address = require('js/cart-v2/pay/Address.vue');
var AddressEdit = require('js/cart-v2/pay/AddressEdit.vue');
var animEndEvent = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
var angle = 0, resData;
var isLotterying = false;
var addrApp;
var awardConf = {
	'146': 'japan',
	'150': 'iphone',
	'151': 'thx',
	'147': '10',
	'149': '100',
	'148': '50'
};
function showResult(){
	isLotterying = false;
	console.log(awardConf);
	console.log(resData)
	console.log(awardConf[resData.award_id])
	$('.act7-re-box')[0].className = 'act7-re-box act7-re-'+awardConf[resData.award_id];
	if(resData.award_tips.trim())
		$('.act7-re-tip').html(resData.award_tips).show();
	else
		$('.act7-re-tip').hide();
	$('.act7-re-box').css('display','flex');
}
module.exports = {
	init: function(){
		$('.screen').css('overflow', 'auto');
		var cw=document.documentElement.clientWidth;
		if(cw>640)cw=640;
		document.documentElement.style.fontSize=cw/640*100+"px";


		$('.act7-re-btn-confirm').click(function(){
			$('.act7-re-box').hide();
		});
		$('.act7-re-btn-addr').click(function(){
			$('.screen').hide();
			this.isVisible = false;
			$('.addr-box').show();
			if(!addrApp){
				$(`<div class="addr-box">
						<div class="addr-list">
							<x-address
								v-show="visibleStat.address"
								v-ref:address
								:addr="address"></x-address>
							<x-address-edit
								v-show="visibleStat.addressedit"
								v-ref:addressedit
								:address-id="editAddressId"></x-address-edit>
						</div>
					</div>`).appendTo(document.body);
				$('.addr-box').show();
				addrApp = new Vue({
					el: '.addr-list',
					components: {
						'x-address': Address,
						'x-address-edit': AddressEdit
					},
					data: {
						param: {
							address_id: 0,
						},
						address: {},
						visibleStat:{
							address: true,
							addressedit: false
						},
						pageNav: ['address']
					},
					ready: function(){
						this.$refs['address'].$emit('show');
					},
					methods: {
						confirmAddress: function(){
							var self = this;
							if(!this.address || !this.address.address_id){
								if(confirm('您没有选择收货地址。确定要放弃iphone 6s吗?')){
									location.reload();
								}
							} else {
								var self = this;
								Dialog.confirm('确定使用下面的收货地址？\n'+this.address.full_address, {fn:function(re){
									if(re!='yes') return;
									ajax.post('/lottery/ajaxAddAddress',{
										award_id: resData.award_id,
										address_id: self.address.address_id,
										activity_src: PAGE_CONF.activity_src
									}).then(function(res){
										if(res.errno){
											Dialog.alert(res.errmsg);
										} else {
											qtip.show('添加成功，奖品将在活动结束后发出');
											$('.addr-box').hide();
											$('.screen').show();
											$('.act7-re-box').hide();
										}
									});
								}});
							}
						}
					},
					events: {
						//pageback/pagego涉及到页面的展示和隐藏，要展示的页会收到'show'事件,要
						//隐藏的页会收到'hide'事件。这两个事件是子页面初始化或清理数据的好时机
						'pageback': function(){
							var self = this;
							if(this.pageNav.length<=1){
								this.confirmAddress();
								return;
							}
							var animPageName = this.pageNav.pop();
							var bottomPage = this.pageNav[this.pageNav.length-1];
							this.visibleStat[bottomPage] = true;
							this.$refs[bottomPage].$emit('show');
							var page = $(this.$el)
								.find('.p-'+animPageName)
								.addClass('page-out-anim')
								.one(animEndEvent, function(evt){
									evt.stopPropagation();
										self.visibleStat[animPageName] = false;
										self.$refs[animPageName].$emit('hide');
										page.removeClass('page-out-anim');
								});
						},
						'pagego': function(animPageName){
							var self = this;
							this.visibleStat[animPageName] = true;
							this.$refs[animPageName].$emit('show');
							var bottomPage = this.pageNav[this.pageNav.length-1];
							var page = $(this.$el)
								.find('.p-'+animPageName)
								.addClass('page-in-anim')
								.one(animEndEvent, function(evt){
										evt.stopPropagation();
										self.visibleStat[bottomPage] = false;
										self.pageNav.push(animPageName);
										page.removeClass('page-in-anim');
										self.$refs[bottomPage].$emit('hide');
								});
						},
						'addresschange': function(address){
							this.address = address;
							this.param.address_id = address.address_id;
						},
						'addressedit': function(addressId){
							this.editAddressId = addressId;
						},
						'addresseditdone': function(addressId){
							//收到地址编辑完成消息，通知地址列表更新，并且告知其它组件最新的地址数据
							this.$broadcast('addressupdate', addressId);
						}
					}
				});
			}
		});
		$('.act7-re-btn-share').click(function(){
			jsShare.callShare();
		});

		$('audio')[0].pause();
		$('.music').hide();
	},
	start: function(){
		$('.act7-needle').click(function(){
			if(PAGE_CONF.isLogin!='1'){
				if(PAGE_CONF.browser.weixin){
					jsAuth.reg({
						success: function(){
							PAGE_CONF.isLogin = '1';
							PAGE_CONF.residual_count=1;
							$('.act7-needle').click();
						}
					});
				} else {
					jsAuth.login({
						success: function(){
							PAGE_CONF.isLogin = '1';
							PAGE_CONF.residual_count=1;
							$('.act7-needle').click();
						}
					});
				}

				return;
			}
			if(isLotterying) return;
			if(PAGE_CONF.residual_count<=0){
				Dialog.alert('您今天已经没有抽奖次数');
				return;
			}
			isLotterying = true;
			ajax.post('/Lottery/ajaxDoLottery', {
				activity_src: PAGE_CONF.activity_src
			}).then(function(res){
				//res = {"errno":0,"errmsg":"ok","data":{"award_id":"45","name":"beef\u5973\u7ae5\u88c5","activity_id":"12","type":"4","icon":"https:\/\/s.wandougongzhu.cn\/s\/d2\/gift_17d6be.gif","award_tips":"\u606d\u559c\u83b7\u5f97\u88d9\u5b50","note":"","is_add_address":"1","user_reg_time_interval":"[]","residual_count":199,"is_share_wx":false,"data":{"goods_id":"6538"},"coupon_expire_date":"","score_lottery_num":58}};
				if(res.errno==3434){
					isLotterying = false;
					Dialog.alert('您今天已经没有抽奖次数');
					return;
				}
				if(res.errno){
					isLotterying = false;
					Dialog.alert(res.errmsg);
					return;
				}
				resData = res.data;
				PAGE_CONF.residual_count = res.data.residual_count;
				var index = $('.act7-pan [data-id="'+res.data.award_id+'"]').data('index');
				index = parseInt(index, 10);

				angle += (360-angle%360)+index*60+30+360*5;
				$('.act7-pan').css({
					'transform':'rotate('+(-angle)+'deg)',
					'-webkit-transform':'rotate('+(-angle)+'deg)',
				});

				setTimeout(showResult,4200);
			});
		});
	}
}