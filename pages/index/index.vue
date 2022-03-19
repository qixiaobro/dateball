<template>
	<view class="page-index-wrap">
		<view class="localtion-box" @click="chooseLocation" v-if="currentLocaltionTxt">{{currentLocaltionTxt}}
			<u-icon name="arrow-down-fill" color="$u-content-color" size="16"></u-icon>
		</view>
		<u-swiper :list="swipers" indicator indicatorMode="line" circular keyName="img" :loading="swiperLoading"
			@click="handleSwiperClick"></u-swiper>
		<u-sticky offset-top="0rpx" zIndex="10">
			<u-subsection :list="list" :current="current" @change="sectionChange" fontSize="16" bold></u-subsection>
		</u-sticky>

		<view class="active-list-box" v-show="current===0">
			<template v-if="mineActives.length>0">
				<view class="active-card" v-for="(item, index) in mineActives" :key="index"
					@click="handleCheckActiveDetail(item.activity_id)">
					<view class="active-info-box">
						<view class="active-type">{{transActivityType(item.activity.cate_name)}}</view>
						<view class="active-info">
							<view class="active-name">{{item.activity.activity_name}}</view>
							<view class="active-time">开始时间：<span
									style="color:#f9ae3d">{{transTime(true,item.activity.start_time*1000)}}</span>
							</view>
							<view class="active-people">人数：
								<template v-if="item.activity.down_people_num===item.activity.up_people_num">
									{{item.activity.down_people_num}}
								</template>
								<template v-else>
									{{item.activity.down_people_num}} ~ {{item.activity.up_people_num}}
								</template>
								人 当前：{{item.activity.join_people}}人
							</view>
							<view class="active-gym">
								场馆：{{splitAddress(item.activity.address).name}}
							</view>
						</view>
					</view>
					<view class="active-address">
						地址：{{splitAddress(item.activity.address).address}}
					</view>
					<view class="divide"></view>
					<view class="control-box">
						<button class="u-reset-button btn"
							@click="openLocation(item.activity.longitude,item.activity.latitude)">地址导航</button>
						<view class="align-divide"></view>
						<button class="u-reset-button btn"
							@click="handleCheckActiveDetail(item.activity_id)">查看详情</button>
						<view class="align-divide"></view>
						<button class="u-reset-button btn" open-type="share"
							@click="share(item.activity.activity_name,item.activity_id,item.activity.cate_name)">活动分享</button>
					</view>
					<!--活动状态-->
					<view class="active-status">
						<u-tag :text="transStatusLabel(item.activity.status)" plain
							:type="transStatusLabelColor(item.activity.status)"></u-tag>
					</view>
					<!--活动归属-->
					<view class="active-from" v-if="item.is_create===1">
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
				<view class="active-card" v-for="(item, index) in nearByActives" :key="index"
					@click="handleCheckActiveDetail(item.id)">
					<view class="active-info-box">
						<view class="active-type">{{transActivityType(item.cate_name)}}</view>
						<view class="active-info">
							<view class="active-name">{{item.activity_name}}</view>
							<view class="active-time">活动时间：{{transTime(true,item.start_time*1000)}}</view>
							<view class="active-people">人数：
								<template v-if="item.down_people_num===item.up_people_num">
									{{item.down_people_num}}
								</template>
								<template v-else>
									{{item.down_people_num}} ~ {{item.up_people_num}}
								</template>
								人 当前：{{item.join_people}}人
							</view>
							<view class="active-time" style="width:550rpx">参与截止时间：<span
									style="color:#f9ae3d">{{transTime(true,item.deadline_time*1000)}}</span></view>
							<view class="active-gym">
								场馆：{{splitAddress(item.address).name}}
							</view>
						</view>
					</view>
					<view class="active-address">
						地址：{{splitAddress(item.address).address}}
					</view>
					<view class="divide"></view>
					<view class="control-box">
						<button class="u-reset-button btn"
							@click="openLocation(item.longitude,item.latitude)">地址导航</button>
						<view class="align-divide"></view>
						<button class="u-reset-button btn" @click="handleCheckActiveDetail(item.id)">查看详情</button>
						<view class="align-divide"></view>
						<button class="u-reset-button btn" open-type="share"
							@click="share(item.activity_name,item.id,item.cate_name)">活动分享</button>
					</view>
					<!--活动状态-->
					<view class="active-status">
						<u-tag :text="transStatusLabel(item.status)" plain :type="transStatusLabelColor(item.status)">
						</u-tag>
					</view>
					<!--活动归属-->
					<view class="active-from" v-if="item.is_create===1">
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

		<official-account></official-account>
		<u-back-top :scroll-top="scrollTop"></u-back-top>

		<view class="footer-btn-box">
			<button v-if="!hasUserInfo" class="u-reset-button create-btn" @click="handleAuth">创建活动</button>
			<button v-else class="u-reset-button create-btn" @click="handleCreateActive">创建活动</button>
		</view>

		<u-modal :show="getLocationShow" title="提示" showCancelButton content='球场见需要获取您的定位信息从而获取附近活动呦～'
			@cancel="cancelOpenSetting" @confirm="confirmOpenSetting">
		</u-modal>
	</view>
</template>

<script>
	import {
		MAP_KEY,
		wxlogin,
		setLocaltion,
		transTime,
		splitAddress,
		openLocation,
		getHasUserInfo,
		imgParse,
		getSwiper
	} from '@/utils/common.js'
	import {
		mineActiveList,
		nearByActiveList
	} from '@/api/actives.js'
	import {
		getStorageSync,
		setStorageSync,
		removeStorageSync
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
				swipers: [],
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
				userInfo: '',
				hasUserInfo: false,
				shareTitle: '',
				shareId: '',
				shareType: '',
				isLogin: false,
				swiperLoading: true,
				scrollTop: 0,
			}
		},
		async onLoad() {
			const res = await wxlogin()
			this.swiperLoading = true
			if (res) {
				this.isLogin = true
				this.swipers = await getSwiper()
				this.swiperLoading = false
				this.loadMineActives()
				this.getHasUserInfo()
			}
			this.getUserWxSetting()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onShow() {
			const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
			if (location) {
				this.currentLocaltionTxt = this.getLocationText(location)
				setLocaltion(location.longitude, location.latitude)
				this.refreshList()
			}
			if (this.getLocationShow) {
				this.getLocation()
			}
			if (this.isLogin && !this.hasUserInfo) {
				this.getHasUserInfo()
			}
			const refresh = getStorageSync('homeRefresh')
			if (refresh) {
				this.refreshList()
				removeStorageSync('homeRefresh')
			}
		},
		onUnload() {
			// 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
			chooseLocation.setLocation(null);
		},
		onPullDownRefresh() {
			this.refreshList()
			uni.stopPullDownRefresh();
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
		onShareAppMessage(res) {
			if (res.from === 'button') {
				const imageUrl = imgParse(this.shareType)
				return {
					title: this.shareTitle,
					path: `pages/activeDetail/activeDetail?id=${this.shareId}`,
					imageUrl
				}
			}
			return {
				title: '快来！我们球场见',
				path: `pages/index/index`,
				imageUrl: 'https://img30.360buyimg.com/pop/jfs/t1/220029/19/15263/78063/62358776Ebb80152b/86d3b1ae5e07b584.png'
			}
		},
		onShareTimeline(res) {
			if (res.from === 'button') {
				const imageUrl = imgParse(this.shareType)
				return {
					title: this.shareTitle,
					path: `pages/activeDetail/activeDetail?id=${this.shareId}`,
					imageUrl
				}
			}
			return {
				title: '快来！我们球场见',
				path: `pages/index/index`,
				imageUrl: 'https://img30.360buyimg.com/pop/jfs/t1/220029/19/15263/78063/62358776Ebb80152b/86d3b1ae5e07b584.png'
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
					type: 'gcj02',
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
				const referer = '我们球场见'; //调用插件的app的名称
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
				console.log(id)
				uni.navigateTo({
					url: `../activeDetail/activeDetail?id=${id}`
				})
			},
			getLocationText(address) {
				return `${address.street_number||address.name}`
			},
			transTime(flag, value) {
				return transTime(flag, value)
			},
			splitAddress(e) {
				return splitAddress(e)
			},
			refreshList() {
				if (this.current === 0) {
					this.page1 = 0
					this.mineActives = []
					this.loadMineActives()
				} else if (this.current === 1) {
					this.page2 = 0
					this.nearByActives = []
					this.loadNearByActives()
				}
			},
			openLocation(longitude, latitude) {
				openLocation({
					longitude,
					latitude
				})
			},
			async getHasUserInfo() {
				const res = await getHasUserInfo()
				if (res.data.is_complete === 1 && res.data.phone) {
					setStorageSync('phone',res.data.phone)
					this.hasUserInfo = true
				}
			},
			handleAuth() {
				uni.navigateTo({
					url: '../authPage/authPage?to=../createActive/createActive'
				})
			},
			share(title, id, type) {
				this.shareTitle = title
				this.shareId = id
				this.shareType = type
			},
			handleSwiperClick(index) {
				const {
					app_id,
					link,
					link_type
				} = this.swipers[index]
				switch (link_type) {
					case "1":
						break;
					case "2":
						uni.navigateTo({
							url: link
						})
						break
					case "3":
						uni.navigateTo({
							url: `../link/link?link=${link}`
						})
						break
					case "4":
						wx.navigateToMiniProgram({
							appId: app_id,
							path: link,
							extraData: {},
							success(res) {
								// 打开成功
							},
							fail(err) {
								uni.showToast({
									title: err.message,
									icon: 'none',
									duration: err000
								})
							}
						})
						break
				}
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

						.active-gym {
							display: flex;
							width: 500rpx;
							color: $u-content-color;
							font-size: 28rpx !important;
							margin-bottom: 8rpx;
						}
					}
				}

				.active-address {
					display: flex;
					width: 640rpx;
					color: $u-content-color;
					font-size: 28rpx !important;
					margin-bottom: 8rpx;
					margin-left: 20rpx;
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
