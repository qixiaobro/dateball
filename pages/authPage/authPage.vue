<template>
	<view class="page-auth-wrap">
		<view class="logo-wrap">
			<image class="logo" src="https://cdn.uviewui.com/uview/swiper/swiper3.png"></image>
		</view>
		<u-divider></u-divider>
		<view class="title">登录后将获得以下权限</view>
		<view class="desc">・获得你的公开信息（昵称、头像）等</view>
		<view class="footer-btn-box">
			<button class="u-reset-button create-btn" open-type="getUserInfo"
				@click="getUserInfo">立即登录</button>
		</view>
		<u-modal :show="phoneAuthShow"  title="授权" content="需要授权您的手机号以便球友联系～" :showConfirmButton="false">
					<view class="slot-content">
						<view class="desc">需要授权您的手机号以便球友联系～</view>
						<!-- <button class="auth-phone-btn" slot="confirm-button" open-type="getPhoneNumber" @click="getPhoneNumber">确定</button> -->
						<button class="auth-phone-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">确定</button>
					</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		setStorageSync
	} from '@/utils/local.js'
	import {
		authPhone
	} from '@/api/login.js'
	import {
		wxlogin
	} from '@/utils/common.js'
	export default {
		data() {
			return {
				from:'',
				to:'',
				phoneAuthShow:false
			}
		},
		onLoad(e){
			const {from,to} = e
			this.from = from
			this.to = to
		},
		methods: {
			getUserInfo(e) {
				const that = this
				uni.showLoading({
					title:'加载中'
				})
				uni.getUserProfile({
					provider: 'weixin',
					desc: '用于创建活动',
					success: async function(infoRes) {
						const res = await wxlogin(infoRes.iv, infoRes.encryptedData)
						if(res){
							uni.hideLoading()
							setStorageSync('hasUserInfo',true)
							setStorageSync('userInfo', infoRes)
							that.phoneAuthShow = true
						}
					},
					fail: function(err) {
						uni.hideLoading()
						uni.showToast({
							title: '球场见需要获取您的头像、昵称～',
							icon: 'none',
							duration: 1500
						})
					}
				});
			},
			async getPhoneNumber(e){
				console.log(e)
				uni.showLoading({
					title:'请求中'
				})
				const that = this
				try{
					const {iv,encryptedData} = e.detail
					uni.login({
						provider: 'weixin',
						success: async function(loginRes) {
							const res = await authPhone({
								code:loginRes.code,
								iv,
								encryptedData
							})
							that.phoneAuthShow = false
							uni.hideLoading()
							if(that.to==='../createActive/createActive'){
								uni.redirectTo({
									url:'../createActive/createActive'
								})
							}else{
								uni.navigateBack({
								  delta: 1
								})
							}
						}
					});

				}catch(err){
					uni.hideLoading()
					uni.showToast({
						title:err.message,
						icon:'none'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-auth-wrap {
		position: relative;
		width: 750rpx;
		min-height: 100vh;
		background: #FFFFFF;
		padding: 25rpx;
		box-sizing: border-box;
		padding-bottom: 120rpx;

		.logo-wrap {
			width: 100%;
			height: 300rpx;
			border-radius: 8rpx;
			.logo {
				width: 100%;
				height: 300rpx;
				border-radius: 8rpx;
			}
		}
		.title{
			color:$u-main-color;
			font-size: 34rpx;
		}
		.desc{
			color:$u-tips-color;
			font-size: 28rpx;
			margin: 20rpx;
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
		
		.slot-content{
			.desc{
				color:$u-tips-color;
				font-size: 28rpx;
				margin: 20rpx;
				margin-bottom: 40rpx;
			}
			.auth-phone-btn{
				margin-top: 20rpx;
				background: #2979ff;
				color: #fff;
			}
		}
		/deep/ .u-modal .u-modal__content{
			padding-bottom: 25rpx !important;
		}
	}
</style>
