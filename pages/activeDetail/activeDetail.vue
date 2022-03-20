<template>
	<view class="page-activedetail-wrap">
		<u-swiper :list="swipers" indicator indicatorMode="line" circular keyName="img" :loading="swiperLoading"
			@click="handleSwiperClick"></u-swiper>
		<view class="active-detail-info-box">
			<u-skeleton rows="3" title :loading="activityDetail===''">
				<view class="active-line1">
					<view class="active-type">
						{{transActivityType(activityDetail.cate_name)}}
					</view>
					<view class="active-name">
						{{activityDetail.activity_name}}
					</view>
					<button open-type="share" class="u-reset-button share-icon">
						<u-icon name="share" color="#2979ff" size="32"></u-icon>
					</button>
				</view>
				<view class="active-time">时间：{{transTime(true,activityDetail.start_time*1000)}} -
					{{transTime(true,activityDetail.end_time*1000)}}
				</view>
				<view class="active-people">人数：
					<template v-if="activityDetail.down_people_num===activityDetail.up_people_num">
						{{activityDetail.down_people_num}}
					</template>
					<template v-else>
						{{activityDetail.down_people_num}} ~ {{activityDetail.up_people_num}}
					</template>
					人 当前：{{activityDetail.join_people}}人
				</view>
				<view class="active-gym">
					场馆：{{activityDetail&&splitAddress(activityDetail.address).name}}
				</view>
				<view class="active-address">
					地址：{{activityDetail&&splitAddress(activityDetail.address).address}}
				</view>
				<view class="active-time">参与截止时间：{{transTime(true,activityDetail.deadline_time*1000)}}</view>
				<view class="active-time">联系电话：<span
						v-if="activityDetail.is_join===1">{{activityDetail.phone}}</span><span v-else>参加活动可查看</span>
				</view>
				<view class="active-remark">备注：{{activityDetail.remark}}</view>
				<view class="active-remark" v-if="activityDetail.status===5">取消原因：{{activityDetail.cancel_reason}}</view>
				<view class="active-status">
					<u-tag :text="transStatusLabel(activityDetail.status)"
						:type="transStatusLabelColor(activityDetail.status)" plain></u-tag>
				</view>
				<u-tag text="您的消息通知次数快耗尽了,快点击我增加!" type="warning" size="medium" plain icon="bell-fill"
					@click="requestSubscribeMessage"></u-tag>
				<u-divider :dashed="true"></u-divider>
				<view class="active-join-people">参与人员：</view>
				<template v-for="(item,index) in activityDetail.join">
					<view class="join-item" :key="item.id">
						<u-avatar :src="item.avatar" shape="circle"></u-avatar>
						<view class="join-people-info">
							<view class="join-name">{{item.nickname}} <span style="margin-left: 20rpx;"
									v-if="activityDetail.is_create===1&&item.status===1&&index!==0">{{item.phone}}</span></view>
							<view class="join-time">{{transTime(true,item.add_time*1000)}}</view>
						</view>
						<view class="join-status create" v-if="item.is_create===1">
							创建
						</view>
						<view class="join-status join" v-else-if="item.is_create===0&&item.status===1">
							参加
						</view>
						<view class="join-status out" v-else-if="item.is_create===0&&item.status===0">
							退出
						</view>
					</view>
					<view class="join-remark" v-if="item.remark&&item.status===1">备注：{{item.remark}}</view>
					<view class="join-remark" v-else-if="item.cancel_reason&&item.status===0">备注：{{item.cancel_reason}}
					</view>
					<u-divider :dashed="true" v-if="index!==activityDetail.join.length-1"></u-divider>
				</template>

			</u-skeleton>
		</view>
		<official-account></official-account>
		<view class="footer-btn-box"
			v-if="activityDetail&&activityDetail.status!==6&&activityDetail.status!==5&&activityDetail.status!==4">
			<view class="navigation-btn" @click="openLocation(activityDetail.longitude,activityDetail.latitude)">
				<u-icon name="map-fill" color="#909193" size="28"></u-icon>
			</view>
			<template v-if="activityDetail.is_create===1">
				<u-button style="margin-left: 20rpx;" type="primary" size="normal" shape="circle" text="修改"
					@click="handleEdit"></u-button>
				<u-button style="margin-left: 20rpx;" type="error" size="normal" shape="circle" text="解散"
					@click="dimissShow = true"></u-button>
			</template>
			<template v-else-if="(activityDetail.status===-1||activityDetail.status===0)&&activityDetail.is_join===0">
				<u-button style="margin-left: 20rpx;" type="primary" size="normal" shape="circle" text="立即参加"
					@click="handleJoin"></u-button>
			</template>
			<template v-else-if="activityDetail.is_join===1">
				<u-button style="margin-left: 20rpx;" type="error" size="normal" shape="circle" text="退出活动"
					@click="quitShow = true"></u-button>
			</template>
		</view>

		<u-modal :show="dimissShow" title="提示" content='确认取消此活动？' showCancelButton @cancel="dimissShow = false"
			@confirm="onDismissConfirm">
			<view class="slot-content">
				<view style="margin-bottom: 20rpx;">确认取消活动？</view>
				<view style="width: 600rpx;">
					<u--textarea placeholder="请输入退出理由" border="surround" style="width: 650rpx;" :maxlength="50"
						v-model="remark" count></u--textarea>
				</view>
			</view>
			</u-modal>
		<u-modal :show="quitShow" title="提示" content='确认取消此活动？' showCancelButton @cancel="quitShow = false"
			@confirm="onQuitConfirm">
			<view class="slot-content">
				<view style="margin-bottom: 20rpx;">确认退出活动？</view>
				<view style="width: 600rpx;">
					<u--textarea placeholder="请输入退出理由" border="surround" style="width: 650rpx;" :maxlength="50"
						v-model="remark" count></u--textarea>
				</view>
			</view>

		</u-modal>
		<u-modal :show="joinShow" title="提示" content='确认取消此活动？' showCancelButton @cancel="joinShow = false"
			@confirm="onJoinConfirm">
			<view class="slot-content">
				<view style="width: 600rpx;">
					<u--textarea placeholder="请输入一些您的备注,如:我晚一点到,我打中锋等" border="surround" style="width: 650rpx;"
						:maxlength="50" v-model="remark" count></u--textarea>
				</view>
			</view>

		</u-modal>
	</view>
</template>

<script>
	import {
		getActivityDetail,
		cancelActive,
		quitActive,
		joinActive
	} from '@/api/actives.js'
	import {
		transTime,
		splitAddress,
		openLocation,
		getHasUserInfo,
		wxlogin,
		imgParse,
		getSwiper
	} from '@/utils/common.js'
	import {
		getStorageSync,
		setStorageSync,
		removeStorageSync
	} from '@/utils/local.js'
	export default {
		data() {
			return {
				activityId: '',
				activityDetail: '',
				hasUserInfo: false,
				dimissShow: false,
				quitShow: false,
				joinShow: false,
				remark: '',
				swipers: [],
				isLogin:false,
				swiperLoading:false
			}
		},
		watch: {
			quitShow(val) {
				if (!val) {
					this.remark = ''
				}
			},
			joinShow(val) {
				if (!val) {
					this.remark = ''
				}
			}
		},
		async onLoad(e) {
			const res = await wxlogin()
			if(res){
				this.isLogin = true
				const res2 = await getHasUserInfo()
				if (res2.data.is_complete === 1 && res2.data.phone) {
					this.hasUserInfo = true
				}
				this.swiperLoading = true
				this.swipers = await getSwiper()
				this.swiperLoading = false
			}
			this.activityId = e.id
			this.getActivityDetail()
		},
		async onShow() {
			if(this.isLogin && !this.hasUserInfo){
				const res = await getHasUserInfo()
				if (res.data.is_complete === 1 && res.data.phone) {
					this.hasUserInfo = true
				}
			}
			const refresh = getStorageSync('detailRefresh')
			if (refresh) {
				this.getActivityDetail()
				removeStorageSync('detailRefresh')
			}
		},
		onShareAppMessage(res) {
			const imageUrl =  imgParse(this.activityDetail.cate_name)
			return {
				title: this.activityDetail.activity_name,
				path: `/pages/activeDetail/activeDetail?id=${this.activityId}`,
				imageUrl
			}
		},
		onShareTimeline(res) {
			const imageUrl =  imgParse(this.activityDetail.cate_name)
			return {
				title: this.activityDetail.activity_name,
				path: `/pages/activeDetail/activeDetail?id=${this.activityId}`,
				imageUrl
			}
		},
		onPullDownRefresh() {
			this.activityDetail = ''
			this.getActivityDetail()
			uni.stopPullDownRefresh();
		},
		methods: {
			async getActivityDetail() {
				try {
					const res = await getActivityDetail({
						params: {
							id: this.activityId
						}
					})
					this.activityDetail = res.data
				} catch (err) {
					uni.showToast({
						title: err.message,
						icon: 'none',
						duration: 1500
					})
				}
			},
			transTime(flag, value) {
				return transTime(flag, value)
			},
			splitAddress(e) {
				return splitAddress(e)
			},
			openLocation(longitude, latitude) {
				openLocation({
					longitude,
					latitude
				})
			},
			handleEdit() {
				uni.navigateTo({
					url: `../createActive/createActive?id=${this.activityDetail.id}`
				})
			},
			async onDismissConfirm() {
				try {
					uni.showLoading({
						title: '请求中'
					})
					const res = await cancelActive({
						activity_id: this.activityId,
						cancel_reason:this.remark
					})
					uni.hideLoading()
					this.dimissShow = false
					uni.showToast({
						title: '解散活动成功',
						icon: 'none',
					})
					this.remark = ''
					setStorageSync('homeRefresh', true)
					this.activityDetail = ''
					this.getActivityDetail()
				} catch {
					uni.hideLoading()
				}
			},
			async onQuitConfirm() {
				try {
					uni.showLoading({
						title: '请求中'
					})
					const res = await quitActive({
						activity_id: this.activityId,
						cancel_reason: this.remark
					})
					this.quitShow = false
					uni.hideLoading()
					this.remark = ''
					uni.showToast({
						title: '退出活动成功',
						icon: 'none',
					})
					setStorageSync('homeRefresh', true)
					this.activityDetail = ''
					this.getActivityDetail()
				} catch {
					uni.hideLoading()
				}
			},
			handleJoin() {
				if (this.hasUserInfo) {
					this.joinShow = true
				} else {
					uni.navigateTo({
						url: '../authPage/authPage?from=../activeDetail/activeDetail&to=1'
					})
				}
			},
			async onJoinConfirm() {
				try {

					const that = this
					uni.requestSubscribeMessage({
						tmplIds: ['7e4hxz4qtbTzner5G_dSvyKfniKF83cDicoTj2xh5i8',
							'VCRuCyfH7wqeRJAuAlxeCewpT5P17x0caWTrejjHdE4'
						],
						success: async () => {
							uni.showLoading({
								title: '请求中'
							})
							const res = await joinActive({
								activity_id: that.activityId,
								remark: that.remark
							})
							that.joinShow = false
							that.remark = ''
							uni.showToast({
								title: '参加活动成功',
								icon: 'none',
							})
							setStorageSync('homeRefresh', true)
							uni.hideLoading()
							that.activityDetail = ''
							that.getActivityDetail()
						},
						fail(err) {
							console.log(err)
							uni.showToast({
								title: '订阅通知，才能即时接收活动消息哟～',
								icon: 'none'
							})
						}
					})

				} catch {
					uni.hideLoading()
				}
			},
			requestSubscribeMessage() {
				return new Promise((resolve, reject) => {
					uni.requestSubscribeMessage({
						tmplIds: ['7e4hxz4qtbTzner5G_dSvyKfniKF83cDicoTj2xh5i8',
							'VCRuCyfH7wqeRJAuAlxeCewpT5P17x0caWTrejjHdE4'
						],
						success: () => {
							uni.showToast({
								title: '订阅成功',
								icon: 'success'
							})
							resolve(true)
						},
						fail(err) {
							console.log(err)
							uni.showToast({
								title: '订阅通知，才能即时接收活动消息哟～',
								icon: 'none'
							})
							reject(false)
						}
					})
				})
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
	.page-activedetail-wrap {
		position: relative;
		width: 750rpx;
		min-height: 100vh;
		background: $u-bg-color;
		padding: 0 25rpx;
		box-sizing: border-box;
		padding-bottom: 140rpx;

		.active-detail-info-box {
			width: 700rpx;
			background: $uni-bg-color;
			border-radius: 8rpx;
			padding: 20rpx;
			box-sizing: border-box;
			margin-top: 20rpx;
			margin-bottom: 20rpx;
			position: relative;

			.active-line1 {
				display: flex;

				.active-type {
					width: 80rpx;
					height: 80rpx;
					text-align: left;
					line-height: 80rpx;
					font-size: 58rpx;
				}

				.active-name {
					width: 500rpx;
					height: 80rpx;
					color: $u-main-color;
					font-size: 34rpx;
					line-height: 80rpx;
				}

				.share-icon {
					width: 80rpx;
					height: 80rpx;
					text-align: center;
					line-height: 80rpx;
					font-size: 58rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}

			.active-time,
			.active-people,
			.active-address,
			.active-gym {
				width: 660rpx;
				// height: 40rpx;
				color: $u-content-color;
				font-size: 28rpx;
				margin-bottom: 8rpx;
			}

			.active-remark {
				width: 660rpx;
				// height: 80rpx;
				line-height: 40rpx;
				color: $u-content-color;
				font-size: 28rpx;
				margin-bottom: 8rpx;
			}

			.active-status {
				position: absolute;
				top: 176rpx;
				right: 20rpx;
				transform: rotate(45deg)
			}

			.active-join-people {
				width: 660rpx;
				height: 40rpx;
				line-height: 40rpx;
				color: $u-content-color;
				font-size: 28rpx;
				margin-bottom: 8rpx;
			}

			.join-item {
				display: flex;
				align-items: center;
				margin: 10rpx 0;

				/deep/ .u-avatar {
					border-radius: 50%;
					width: 70rpx !important;
					height: 70rpx !important;

					image {
						width: 70rpx !important;
						height: 70rpx !important;
					}
				}

				.join-people-info {
					margin-left: 10rpx;

					.join-name {
						font-size: 28rpx;
						color: $u-content-color;
					}

					.join-time {
						font-size: 26rpx;
						color: $u-tips-color;
					}
				}

				.join-status {
					margin-left: auto;
					font-size: 28rpx;
				}

				.create {
					color: $u-primary
				}

				.join {
					color: $u-success
				}

				.out {
					color: $u-error
				}

			}

			.join-remark {
				width: 660rpx;
				color: $u-light-color;
				font-size: 26rpx;
			}


		}

		.footer-btn-box {
			width: 700rpx;
			position: fixed;
			bottom: 30rpx;
			height: 100rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;

			.navigation-btn {
				width: 70rpx;
				height: 70rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
				background: $uni-bg-color;
				flex-shrink: 0;
			}

			/deep/ .u-button {
				margin-left: 20rpx !important;
			}
		}

		.slot-content {
			text-align: left;
		}
	}
</style>
