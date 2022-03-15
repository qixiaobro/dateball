<template>
	<view class="page-index-wrap">
		<view class="localtion-box" @click="chooseLocation" v-if="currentLocaltionTxt">{{currentLocaltionTxt}}
			<u-icon name="arrow-down-fill" color="$u-content-color" size="16"></u-icon>
		</view>
		<u-swiper :list="list3" indicator indicatorMode="line" circular></u-swiper>
		<u-sticky offset-top="0rpx" zIndex="10">
			<u-subsection :list="list" :current="current" @change="sectionChange" fontSize="16" bold></u-subsection>
		</u-sticky>

		<view class="active-list-box" v-show="current===0">
			<template v-if="mineActives.length>0">
				<view class="active-card" v-for="(item, index) in mineActives" :key="index">
					<view class="active-info-box">
						<view class="active-type">🏀</view>
						<view class="active-info">
							<view class="active-name">周日下午软二球场打球</view>
							<view class="active-time">时间：2020/03/10 10:00</view>
							<view class="active-people">人数：5/10人</view>
							<view class="active-address">
								地址：福建省厦门市软件园二期篮球场
							</view>
						</view>
					</view>
					<view class="divide"></view>
					<view class="control-box">
						<button class="u-reset-button btn">地址导航</button>
						<view class="align-divide"></view>
						<button class="u-reset-button btn" @click="handleCheckActiveDetail">查看详情</button>
						<view class="align-divide"></view>
						<button class="u-reset-button btn">活动分享</button>
					</view>
					<!--活动状态-->
					<view class="active-status">
						<u-tag text="待开始" plain type="warning"></u-tag>
					</view>
					<!--活动归属-->
					<view class="active-from">
						<u-icon size="24" name="account-fill" color="#3c9cff"></u-icon>
					</view>
				</view>
			</template>

			<template v-if="loading&&mineActives.length===0">
				<view class="active-card" v-for="(item, index) in 5" :key="index">
					<u-skeleton rows="3" :loading="loading" avatar :title="false" avatarShape="square" avatarSize="50"
						:rowsWidth="['100%','80%','60%']">

					</u-skeleton>
				</view>
			</template>
			<u-empty v-if="!loading&&mineActives.length===0" mode="list"
				:icon="require('../../static/assets/icon/acitve-empty.png')" iconSize="90" text="暂无活动,快去创建吧～">
			</u-empty>
		</view>
		<view class="active-list-box" v-show="current===1">
			<template v-if="nearByActives.length>0">
				<view class="active-card" v-for="(item, index) in nearByActives" :key="index">
					<view class="active-info-box">
						<view class="active-type">🏀</view>
						<view class="active-info">
							<view class="active-name">周日下午软二球场打球</view>
							<view class="active-time">时间：2020/03/10 10:00</view>
							<view class="active-people">人数：5/10人</view>
							<view class="active-address">
								地址：福建省厦门市软件园二期篮球场
							</view>
						</view>
					</view>
					<view class="divide"></view>
					<view class="control-box">
						<button class="u-reset-button btn">地址导航</button>
						<view class="align-divide"></view>
						<button class="u-reset-button btn">查看详情</button>
						<view class="align-divide"></view>
						<button class="u-reset-button btn">活动分享</button>
					</view>
					<!--活动状态-->
					<view class="active-status">
						<u-tag text="待开始" plain type="warning"></u-tag>
					</view>
					<!--活动归属-->
					<view class="active-from">
						<u-icon size="24" name="account-fill" color="#3c9cff"></u-icon>
					</view>
				</view>
			</template>

			<template v-if="loading2&&nearByActives.length===0">
				<view class="active-card" v-for="(item, index) in 5" :key="index">
					<u-skeleton rows="3" :loading="loading2" avatar :title="false" avatarShape="square" avatarSize="50"
						:rowsWidth="['100%','80%','60%']">

					</u-skeleton>
				</view>
			</template>
			<u-empty v-if="!loading2&&nearByActives.length===0" mode="list"
				:icon="require('../../static/assets/icon/acitve-empty.png')" iconSize="90" text="暂无活动,快去创建吧～">
			</u-empty>
		</view>


		<view class="footer-btn-box">
			<button v-if="!hasUserInfo" class="u-reset-button create-btn" open-type="getUserInfo" @click="getUserInfo">创建活动</button>
			<button v-else class="u-reset-button create-btn" @click="handleCreateActive">创建活动</button>
		</view>

		<u-modal :show="getLocationShow" title="提示" showCancelButton content='约球么需要获取您的定位信息从而获取附近活动呦～'
			@cancel="cancelOpenSetting" @confirm="confirmOpenSetting">
		</u-modal>
	</view>
</template>

<script>
	import {
		MAP_KEY,
		wxlogin,
		setLocaltion
	} from '@/utils/common.js'
	import {
		mineActiveList,
		nearByActiveList
	} from '@/api/actives.js'
	import {
		getStorageSync,
		setStorageSync
	} from '@/utils/local.js'
	const QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
	const chooseLocation = requirePlugin('chooseLocation');
	const qqmapsdk = new QQMapWX({
		key: MAP_KEY
	})
	export default {
		data() {
			return {
				currentLocaltionTxt: '',
				list3: [
					'https://cdn.uviewui.com/uview/swiper/swiper3.png',
					'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					'https://cdn.uviewui.com/uview/swiper/swiper1.png',
				],
				list: ['我的活动', '附近活动'],
				current: 0,
				mineActives: [], //我的活动
				nearByActives: [], //附近的活动
				loading: true,
				loading2: false,
				page1: 0,
				page2: 0,
				mineNoMore: false,
				nearByNoMore: false,
				getLocationShow: false,
				userInfo:'',
				hasUserInfo:false,
			}
		},
		async onLoad() {
			const res = await wxlogin()
			if (res) {
				this.loadMineActives()
			}
			this.getUserWxSetting()
			const userInfo = getStorageSync('userInfo')
			if(userInfo){
				this.hasUserInfo = true
			}
		},
		onShow() {
			const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
			if (location) {
				this.currentLocaltionTxt = this.getLocationText(location)
				setLocaltion(location.longitude, location.latitude)
				this.page2 = 0
				this.nearByActives = []
				if (this.current === 1) {
					this.loadNearByActives()
				}
			}
			if (this.getLocationShow) {
				this.getLocation()
			}
		},
		onUnload() {
			// 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
			chooseLocation.setLocation(null);
		},
		onReachBottom() {
			if (this.current === 0) {
				if (this.mineNoMore) {
					return
				} else {
					this.loadMineActives()
				}
			} else if (this.current === 1) {
				if (this.nearByNoMore) {
					return
				} else {
					this.loadNearByActives()
				}
			}
		},
		methods: {
			sectionChange(index) {
				if (this.current === index) {
					return false
				}
				this.current = index
				if (this.current === 0) {
					// this.loadMineActives()
				} else if (this.current === 1) {
					const location = getStorageSync('location')
					if (location) {
						if (this.page2 === 0) {
							this.loadNearByActives()
						}
					} else {
						this.getLocation()
					}
				}
				uni.vibrateShort({});
			},
			async loadMineActives() {
				this.loading = true
				this.page1++
				try {
					const res = await mineActiveList({
						params: {
							page: this.page1,
							limit: 10,
						}
					})
					if (res.data.list.length) {
						this.mineActives = this.mineActives.concat(res.data.list)
					}
					if (res.data.list.length < 10) {
						this.mineNoMore = true
					}
					this.loading = false
				} catch {

				}
			},
			async loadNearByActives() {
				this.loading2 = true
				this.page2++
				const location = getStorageSync('location')
				try {
					const res = await nearByActiveList({
						params: {
							page: this.page2,
							limit: 10,
							longitude: location.longitude,
							latitude: location.latitude,
						}
					})
					if (res.data.list.length) {
						this.nearByActives = this.nearByActives.concat(res.data.list)
					}
					if (res.data.list.length < 10) {
						this.nearByNoMore = true
					}
					this.loading2 = false
				} catch {

				}

			},
			getUserWxSetting() {
				const that = this
				uni.getSetting({
					success: function(res) {
						if (res.authSetting['scope.userLocation']) {
							that.getLocation()
						}
					},
					fail: function(err) {
						console.log(err)
					}
				})
			},
			getLocation() {
				const that = this
				uni.getLocation({
					type: 'wgs84',
					isHighAccuracy: true,
					success(location) {
						setLocaltion(location.longitude, location.latitude)
						if (that.getLocationShow) {
							that.getLocationShow = false
							that.loadNearByActives()
						}
						qqmapsdk.reverseGeocoder({
							location: {
								longitude: location.longitude,
								latitude: location.latitude
							},
							success(res) {
								const {
									address_component
								} = res.result
								that.currentLocaltionTxt = that.getLocationText(address_component)
							},
							fail(res) {},
						});
					},
					fail(err) {
						console.log(err)
						that.getLocationShow = true
					}
				});
			},
			chooseLocation() {
				const referer = '外卖券天天领取'; //调用插件的app的名称
				const location = JSON.stringify(getStorageSync('location'))
				const category = '篮球场,足球场,网球场,排球场';

				wx.navigateTo({
					url: 'plugin://chooseLocation/index?key=' + MAP_KEY + '&referer=' + referer + '&location=' +
						location + '&category=' + category
				});
			},
			cancelOpenSetting() {
				this.getLocationShow = false
				this.current = 0
			},
			confirmOpenSetting() {
				uni.openSetting({

				})
			},
			handleCreateActive() {
				chooseLocation.setLocation(null);
				uni.navigateTo({
					url: '../createActive/createActive'
				})
			},
			handleCheckActiveDetail(id) {
				uni.navigateTo({
					url: '../activeDetail/activeDetail'
				})
			},
			getUserInfo(e) {
				const that = this
				uni.getUserProfile({
					provider: 'weixin',
					desc: '用于创建活动',
					success: async function(infoRes) {
						that.hasUserInfo = true
						that.userInfo = infoRes
						setStorageSync('userInfo',infoRes)
						
						const res = await wxlogin(infoRes.iv,infoRes.encryptedData)
						if(res){
							that.handleCreateActive()
						}
					},
					fail: function(err) {
						uni.showToast({
							title:'约球么需要获取您的头像、昵称～',
							icon:'none',
							duration:1500
						})
					}
				});
			}

		}
	}
</script>

<style lang="scss" scoped>
	.page-index-wrap {
		position: relative;
		width: 750rpx;
		min-height: 100vh;
		background: $u-bg-color;
		padding: 0 25rpx;
		box-sizing: border-box;
		padding-bottom: 120rpx;

		.localtion-box {
			display: flex;
			font-size: 32rpx;
			color: $u-content-color;
			margin-bottom: 20rpx;
		}

		/deep/ .u-swiper {
			width: 700rpx;
			box-sizing: border-box;
		}

		/deep/ .u-subsection {
			width: 700rpx;
			height: 80rpx;
			margin: 20rpx 0 0 0;
			box-sizing: border-box;

			.u-subsection__bar {
				height: 68rpx;
			}
		}

		.active-list-box {
			.active-card {
				width: 700rpx;
				min-height: 200rpx;
				background: $uni-bg-color;
				margin: 20rpx 0;
				border-radius: 8rpx;
				padding: 10rpx;
				box-sizing: border-box;
				position: relative;

				.active-info-box {
					width: 680rpx;
					display: flex;
					box-sizing: border-box;

					.active-type {
						width: 100rpx;
						height: 144rpx;
						text-align: center;
						line-height: 144rpx;
						font-size: 78rpx;
					}

					.active-info {
						margin-left: 10rpx;

						.active-name {
							width: 400rpx;
							color: $u-main-color;
							font-size: 34rpx;
							margin-bottom: 8rpx;
						}

						.active-time {
							width: 400rpx;
							color: $u-content-color;
							font-size: 28rpx;
							margin-bottom: 8rpx;
						}

						.active-people {
							width: 400rpx;
							color: $u-content-color;
							font-size: 28rpx;
							margin-bottom: 8rpx;
						}

						.active-address {
							display: flex;
							width: 500rpx;
							color: $u-content-color;
							font-size: 28rpx !important;
							margin-bottom: 8rpx;
						}
					}
				}

				.divide {
					width: 640rpx;
					height: 2rpx;
					box-sizing: border-box;
					background: rgba(230, 231, 228, 0.5);
					margin: 10rpx 0;
					margin-left: 20rpx;
				}

				.align-divide {
					width: 2rpx;
					height: 30rpx;
					background: rgba(230, 231, 228, 0.5);
				}

				.control-box {
					display: flex;
					align-items: center;
					height: 70rpx;

					.btn {
						height: 70rpx;
						color: $u-primary;
						font-size: 28rpx;
						line-height: 70rpx;
					}
				}

				.active-status {
					position: absolute !important;
					right: 30rpx !important;
					top: 78rpx !important;
				}

				.active-from {
					position: absolute !important;
					right: 25rpx !important;
					top: 10rpx !important;
				}

			}
		}

		.footer-btn-box {
			width: 700rpx;
			position: fixed;
			bottom: 10rpx;
			height: 100rpx;

			.create-btn {
				width: 700rpx;
				height: 80rpx;
				background: #2979ff;
				color: #fff;
				line-height: 80rpx;
				border-radius: 10rpx;

				&:hover {
					background: #398ade;
				}
			}
		}
	}
</style>
