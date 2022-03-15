<template>
	<view class="page-createactive-wrap">
		<view class="form-box">
			<u--form labelPosition="top" :model="activeForm" :rules="rules" ref="form1" labelWidth="auto"
				:borderBottom="false">
				<u-form-item label="活动名称" prop="activity_name" ref="item1">
					<u--input v-model="activeForm.activity_name" placeholder="请输入活动名称" clearable></u--input>
				</u-form-item>
				<u-form-item label="活动类型" prop="activity_type" ref="item1" @click="activityTypeShow = true">
					<u--input v-model="activeForm.activity_type" placeholder="请选择活动类型" ref="activity_type" clearable
						readonly></u--input>
				</u-form-item>
				<u-form-item label="活动场地" prop="address" ref="item2" @click="handleChooseLocation">
					<u--input v-model="activeForm.address" placeholder="请选择活动场地" prefixIcon="map-fill"
						prefixIconStyle="color: #909399" readonly></u--input>
				</u-form-item>
				<u-form-item label="活动人数" prop="people_num" ref="item3">
					<u--input v-model="activeForm.people_num" type="number" placeholder="请输入活动人数" clearable></u--input>
				</u-form-item>
				<u-form-item label="开始时间" prop="start_time" ref="item4" @click="startTimePickerShow = true">
					<u--input v-model="activeForm.start_time" placeholder="请选择活动开始时间" clearable readonly>
					</u--input>
				</u-form-item>
				<u-form-item label="结束时间" prop="end_time" ref="item5" @click="endTimePickerShow = true">
					<u--input v-model="activeForm.end_time" placeholder="请选择活动结束时间" clearable readonly></u--input>
				</u-form-item>
				<u-form-item label="参与活动截止时间" prop="deadline_time" ref="item6" @click="deadlineTimePickerShow = true">
					<u--input v-model="activeForm.deadline_time" placeholder="请选择参与活动截止时间" clearable readonly></u--input>
				</u-form-item>
				<u-form-item label="是否公开(公开将展示在附近活动中)" ref="item7">
					<u-switch v-model="activeForm.is_open" :activeValue="1" :inactiveValue="0"></u-switch>
				</u-form-item>
				<u-form-item label="活动备注" ref="item8">
					<u--textarea v-model="activeForm.remark" placeholder="请输入活动备注" count :maxlength="50"></u--textarea>
				</u-form-item>
			</u--form>
			<!--活动类型-->
			<u-picker :show="activityTypeShow" :columns="activityTypeColumns" @confirm="activityTypeConfirm"
				@cancel="activityTypeShow=false"></u-picker>
				
			<!--活动开始时间-->
			<u-datetime-picker :show="startTimePickerShow" v-model="start_timestamp" mode="datetime"
				@confirm="startTimePickerConfirm" @cancel="startTimePickerShow = false" :minDate="nowTime"></u-datetime-picker>
			<!--活动结束时间-->
			<u-datetime-picker :show="endTimePickerShow" v-model="end_timestamp" mode="datetime"
				@confirm="endTimePickerConfirm" @cancel="endTimePickerShow = false" :minDate="minDate"></u-datetime-picker>
			<!--活动参与截止时间-->
			<u-datetime-picker :show="deadlineTimePickerShow" v-model="deadline_timestamp" mode="datetime"
				@confirm="deadlineTimePickerConfirm" @cancel="deadlineTimePickerShow = false" :minDate="minDate"></u-datetime-picker>

			<u-modal :show="getLocationShow" title="提示" showCancelButton content='约球么需要获取您的定位信息从而获取附近活动呦～'
				@cancel="cancelOpenSetting" @confirm="confirmOpenSetting">
			</u-modal>
		</view>
		
		<view class="footer-btn-box">
			<button class="u-reset-button create-btn" open-type="getUserInfo" @click="handleCreateActive">创建活动</button>
		</view>
	</view>
</template>

<script>
	import {
		MAP_KEY
	} from '@/utils/common.js'
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
				location: '',
				hasLocation: false,
				nowTime:Number(new Date()),
				activeForm: {
					activity_name: '',
					activity_type: '',
					address: '',
					longitude: '',
					latitude: '',
					start_time: '',
					end_time: '',
					people_num: '',
					is_open: 1,
					deadline_time: '',
					remark:''
				},
				start_timestamp: Number(new Date()),
				end_timestamp: Number(new Date()),
				deadline_timestamp: Number(new Date()),
				rules: {
					'activity_name': {
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					},
					'activity_type': {
						type: 'string',
						required: true,
						message: '请选择活动类型',
						trigger: ['change']
					},
					'address': {
						type: 'string',
						required: true,
						message: '请选择活动场地',
						trigger: ['blur', 'change']
					},
					'start_time': {
						type: 'string',
						required: true,
						message: '请选择活动开始时间',
						trigger: ['blur', 'change']
					},
					'end_time': {
						type: 'string',
						required: true,
						message: '请选择活动结束时间',
						trigger: ['blur', 'change']
					},
					'people_num': {
						type: 'string',
						required: true,
						message: '请输入活动人数',
						trigger: ['blur', 'change']
					},
					'deadline_time': {
						type: 'string',
						required: true,
						message: '请选择活动参与截止时间',
						trigger: ['blur', 'change']
					},
				},
				activityTypeShow: false,
				activityTypeColumns: [
					['篮球', '足球', '网球', '排球', '台球', '乒乓球']
				],
				startTimePickerShow: false,
				endTimePickerShow: false,
				deadlineTimePickerShow: false,
				getLocationShow: false
			};
		},
		computed:{
			minDate(){
				return this.start_timestamp + 1800000
			}
		},
		onLoad() {
			const location = getStorageSync('location')
			if (location) {
				this.location = location
				this.hasLocation = true
			} else {
				this.hasLocation = false
			}
		},
		onShow() {
			const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
			if (location) {
				this.location = {
					latitude: location.latitude,
					longitude: location.longitude,
				}
				this.activeForm.address = location.name
				this.hasLocation = true
			}
			if (this.getLocationShow) {
				this.getLocationShow = false
				this.handleChooseLocation()
			}
		},
		onUnload() {
			// 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
			chooseLocation.setLocation(null);
		},
		methods: {
			activityTypeConfirm(e) {
				this.activityTypeShow = false
				this.activeForm.activity_type = e.value
			},

			startTimePickerConfirm(e) {
				this.startTimePickerShow = false
				this.start_timestamp = e.value
				this.activeForm.start_time = this.transTime(true, e.value)
			},
			endTimePickerConfirm(e) {
				this.endTimePickerShow = false
				this.end_timestamp = e.value
				this.activeForm.end_time = this.transTime(true, e.value)
			},
			deadlineTimePickerConfirm(e) {
				this.deadlineTimePickerShow = false
				this.deadline_timestamp = e.value
				this.activeForm.deadline_time = this.transTime(true, e.value)
			},


			handleChooseLocation() {
				if (!this.hasLocation) {
					const that = this
					uni.getLocation({
						type: 'wgs84',
						isHighAccuracy: true,
						success(location) {
							const referer = '外卖券天天领取'; //调用插件的app的名称
							const category = '篮球场,足球场,网球场,排球场';

							wx.navigateTo({
								url: 'plugin://chooseLocation/index?key=' + MAP_KEY + '&referer=' +
									referer +
									'&location=' +
									JSON.stringify(location) + '&category=' + category
							});
						},
						fail() {
							that.getLocationShow = true
						}
					});
				} else {
					const referer = '外卖券天天领取'; //调用插件的app的名称
					const location = JSON.stringify({
						latitude: this.location.latitude,
						longitude: this.location.longitude
					});
					const category = '篮球场,足球场,网球场,排球场';

					wx.navigateTo({
						url: 'plugin://chooseLocation/index?key=' + MAP_KEY + '&referer=' + referer +
							'&location=' +
							location + '&category=' + category
					});
				}

			},
			cancelOpenSetting() {
				this.getLocationShow = false
			},
			confirmOpenSetting() {
				uni.openSetting({

				})
			},
			transTime(flag, value) {
				if (flag) { //时间戳
					const date = new Date(value);
					const Y = date.getFullYear() + '-';

					const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
					const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';

					const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
					const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
					return Y + M + D + h + m
				} else {

				}
			}
		}
	}
</script>

<style lang="scss">
	.page-createactive-wrap {
		position: relative;
		width: 750rpx;
		min-height: 100vh;
		background: $u-bg-color;
		padding: 0 25rpx;
		box-sizing: border-box;
		padding-bottom: 120rpx;

		.form-box {
			width: 700rpx;
			background: $uni-bg-color;
			border-radius: 8rpx;
			padding: 20rpx;
			box-sizing: border-box;
		}
		
		.footer-btn-box{
			width: 700rpx;
			position: fixed;
			bottom: 10rpx;
			height: 100rpx;
			z-index: 10;
			
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
