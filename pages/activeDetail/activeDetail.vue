<template>
	<view class="page-activedetail-wrap">
		<u-swiper :list="list3" indicator indicatorMode="line" circular></u-swiper>
		<view class="active-detail-info-box">
			<view class="active-line1">
				<view class="active-type">
					🏀
				</view>
				<view class="active-name">
					周日下午两点打球
				</view>
				<view class="share-icon">
					<u-icon name="share" color="#2979ff" size="32"></u-icon>
				</view>
			</view>
			<view class="active-time">时间：2020/03/10 10:00 - 2020/03/10 10:00</view>
			<view class="active-people">人数：5/10人</view>
			<view class="active-address">
				地址：福建省厦门市软件园二期篮球场
			</view>
			<view class="active-time">参与截止时间：2020/03/10 10:00</view>
			<view class="active-remark">备注：阿顺利到家了卡斯蒂略卡上了多久啊实力代理刷卡机</view>
			<view class="active-status">
				<u-tag text="召集中" type="warning" plain></u-tag>
			</view>
			<u-divider :dashed="true"></u-divider>
			<view class="active-join-people">参与人员：</view>
			<view class="join-item">
				<u-avatar src="https://unsplash.com/photos/FXCvslpSeUY" shape="circle"></u-avatar>
				<view class="join-people-info">
					<view class="join-name">金男</view>
					<view class="join-time">2022/03/10 10:01:51</view>
				</view>
				<view class="join-status create">
					创建
				</view>
			</view>
			<view class="join-item">
				<u-avatar src="https://unsplash.com/photos/FXCvslpSeUY" shape="circle"></u-avatar>
				<view class="join-people-info">
					<view class="join-name">文哥</view>
					<view class="join-time">2022/03/10 10:01:51</view>
				</view>
				<view class="join-status join">
					参加
				</view>
			</view>
			<view class="join-item">
				<u-avatar src="https://unsplash.com/photos/FXCvslpSeUY" shape="circle"></u-avatar>
				<view class="join-people-info">
					<view class="join-name">七小</view>
					<view class="join-time">2022/03/10 10:01:51</view>
				</view>
				<view class="join-status out">
					退出
				</view>
			</view>

		</view>
		<view class="footer-btn-box">
			<view class="navigation-btn">
				<u-icon name="map-fill" color="#909193" size="28"></u-icon>
			</view>
			<template v-if="false">
				<u-button style="margin-left: 20rpx;" type="primary" size="normal" shape="circle" text="修改"></u-button>
				<u-button style="margin-left: 20rpx;" type="error" size="normal" shape="circle" text="解散"></u-button>
			</template>
			<template v-else-if="false">
				<u-button style="margin-left: 20rpx;" type="primary" size="normal" shape="circle" text="立即参加"></u-button>
			</template>
			<template v-else-if="true">
				<u-button style="margin-left: 20rpx;" type="error" size="normal" shape="circle" text="退出活动"></u-button>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list3: [
					'https://cdn.uviewui.com/uview/swiper/swiper3.png',
					'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					'https://cdn.uviewui.com/uview/swiper/swiper1.png',
				],
			}
		},
		methods: {

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
				{
				width: 660rpx;
				height: 40rpx;
				color: $u-content-color;
				font-size: 28rpx;
				margin-bottom: 8rpx;
			}

			.active-remark {
				width: 660rpx;
				height: 80rpx;
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


		}

		.footer-btn-box {
			width: 700rpx;
			position: fixed;
			bottom: 30rpx;
			height: 100rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			.navigation-btn{
				width: 70rpx;
				height: 70rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
				background: $uni-bg-color;
				flex-shrink: 0;
			}
			/deep/ .u-button{
				margin-left: 20rpx !important;
			}
		}
	}
</style>
