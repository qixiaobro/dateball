<template>
	<view class="page-createactive-wrap">
		<view class="form-box">
			<u--form labelPosition="top" :model="activeForm" :rules="rules" ref="form" labelWidth="auto"
				:borderBottom="false">
				<u-form-item label="活动名称" prop="activity_name" ref="item1">
					<u--input v-model="activeForm.activity_name" placeholder="请输入活动名称" clearable></u--input>
				</u-form-item>
				<u-form-item label="活动类型" prop="cate_id" ref="item1" @click="activityTypeShow = true">
					<u--input v-model="activityType" placeholder="请选择活动类型" ref="cate_id" clearable readonly>
					</u--input>
				</u-form-item>
				<u-form-item label="活动场地" prop="address" ref="item2" @click="handleChooseLocation">
					<u--input v-model="activeForm.address" placeholder="请选择活动场地" prefixIcon="map-fill"
						prefixIconStyle="color: #909399" readonly></u--input>
				</u-form-item>
				<u-form-item label="活动人数下限" prop="down_people_num" ref="item3">
					<u--input v-model="activeForm.down_people_num" type="number" placeholder="请输入活动人数下限" clearable>
					</u--input>
				</u-form-item>
				<u-form-item label="活动人数上限" prop="up_people_num" ref="item8">
					<u--input v-model="activeForm.up_people_num" type="number" placeholder="请输入活动人数上限" clearable>
					</u--input>
				</u-form-item>
				<u-form-item label="开始时间" prop="start_time" ref="item4" @click="startTimePickerShow = true">
					<u--input v-model="activeForm.start_time" placeholder="请选择活动开始时间" clearable readonly>
					</u--input>
				</u-form-item>
				<u-form-item label="结束时间" prop="end_time" ref="item5" @click="endTimePickerShow = true">
					<u--input v-model="activeForm.end_time" placeholder="请选择活动结束时间" clearable readonly></u--input>
				</u-form-item>
				<u-form-item label="参与活动截止时间" prop="deadline_time" ref="item6" @click="deadlineTimePickerShow = true">
					<u--input v-model="activeForm.deadline_time" placeholder="请选择参与活动截止时间" clearable readonly>
					</u--input>
				</u-form-item>
				<u-form-item label="是否公开(公开将展示在附近活动中)" ref="item7">
					<u-switch v-model="activeForm.is_open" :activeValue="1" :inactiveValue="0"></u-switch>
				</u-form-item>
				<u-form-item label="联系方式(参与活动的人才能看到)" prop="phone" ref="item1">
					<u--input v-model="activeForm.phone" placeholder="请输入联系方式" clearable></u--input>
				</u-form-item>
				<u-form-item label="活动备注" ref="item8">
					<u--textarea v-model="activeForm.remark" placeholder="请输入活动备注" count :maxlength="50"></u--textarea>
				</u-form-item>
			</u--form>
			<!--活动类型-->
			<u-picker :show="activityTypeShow" :columns="activityTypeColumns" keyName="cate_name"
				@confirm="activityTypeConfirm" @cancel="activityTypeShow=false"></u-picker>

			<!--活动开始时间-->
			<u-datetime-picker :show="startTimePickerShow" v-model="start_timestamp" mode="datetime"
				@confirm="startTimePickerConfirm" @cancel="startTimePickerShow = false" :minDate="nowTime">
			</u-datetime-picker>
			<!--活动结束时间-->
			<u-datetime-picker :show="endTimePickerShow" v-model="end_timestamp" mode="datetime"
				@confirm="endTimePickerConfirm" @cancel="endTimePickerShow = false" :minDate="minDate">
			</u-datetime-picker>
			<!--活动参与截止时间-->
			<u-datetime-picker :show="deadlineTimePickerShow" v-model="deadline_timestamp" mode="datetime"
				@confirm="deadlineTimePickerConfirm" @cancel="deadlineTimePickerShow = false" :maxDate="maxDate">
			</u-datetime-picker>

			<u-modal :show="getLocationShow" title="提示" showCancelButton content='球场见需要获取您的定位信息从而获取附近活动呦～'
				@cancel="cancelOpenSetting" @confirm="confirmOpenSetting">
			</u-modal>
		</view>

		<view class="footer-btn-box">
			<button v-if="activityId===''" class="u-reset-button create-btn" @click="handleCreateActive"
				:loading="btnloading" :disabled="btnloading">创建活动</button>
			<button v-else="activityId" class="u-reset-button create-btn" @click="handleEditActive"
				:loading="btnloading" :disabled="btnloading">修改活动</button>
		</view>
	</view>
</template>

<script>
	import {
		MAP_KEY,
		transTime
	} from '@/utils/common.js'
	import {
		getStorageSync,
		setStorageSync
	} from '@/utils/local.js'
	import {
		createActive,
		editActive,
		getBallCategory,
		getActivityDetail
	} from "@/api/actives.js"
	const QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
	const chooseLocation = requirePlugin('chooseLocation');
	const qqmapsdk = new QQMapWX({
		key: MAP_KEY
	})
	export default {
		data() {
			return {
				activityId: '',
				location: '',
				hasLocation: false,
				nowTime: Number(new Date()) + 900000,
				category: [],
				activeForm: {
					activity_name: '',
					cate_id: '',
					address: '',
					longitude: '',
					phone: '',
					latitude: '',
					start_time: '',
					end_time: '',
					down_people_num: '',
					up_people_num: '',
					is_open: 1,
					deadline_time: '',
					remark: ''
				},
				start_timestamp: Number(new Date()) + 900000,
				end_timestamp: Number(new Date()) + 2700000,
				deadline_timestamp: Number(new Date()) + 900000,
				rules: {
					'activity_name': {
						type: 'string',
						required: true,
						message: '请填写活动名称',
						trigger: ['blur', 'change']
					},
					'cate_id': {
						type: 'number',
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
					'up_people_num': [{
							required: true,
							type: 'number',
							message: '请输入活动人数上限',
							trigger: ['blur', 'change'],
						},
						{
							asyncValidator: (rule, value, callback) => {
								const val = Number(value)
								if (val >= 2) {
									callback()
								} else {
									callback(new Error('请输入不少于2人的活动人数'))
								}
							},
						}
					],
					'down_people_num': [{
							required: true,
							type: 'number',
							message: '请输入活动人数下限',
							trigger: ['blur', 'change'],
						},
						{
							asyncValidator: (rule, value, callback) => {
								const val = Number(value)
								if (val >= 2) {
									callback()
								} else {
									callback(new Error('请输入不少于2人的活动人数'))
								}
							},
						}
					],
					'deadline_time': {
						type: 'string',
						required: true,
						message: '请选择活动参与截止时间',
						trigger: ['blur', 'change']
					},
					'phone': [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// uni.$u.test.mobile()就是返回true或者false的
								return uni.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}
					]
				},
				activityTypeShow: false,
				activityTypeColumns: [],
				startTimePickerShow: false,
				endTimePickerShow: false,
				deadlineTimePickerShow: false,
				getLocationShow: false,
				btnloading: false,
			};
		},
		computed: {
			minDate() {
				return this.start_timestamp + 1800000
			},
			maxDate() {
				return this.start_timestamp
			},
			activityType() {
				if (this.activityTypeColumns.length) {
					const arr = this.activityTypeColumns[0].filter((item) => item.id === this.activeForm.cate_id)
					if (arr.length) {
						return arr[0].cate_name
					} else {
						return ''
					}
				} else {
					return ''
				}

			}
		},
		watch: {
			nowTime(val) {

			}
		},
		onLoad(e) {
			const location = getStorageSync('location')
			if (location) {
				this.location = location
				this.hasLocation = true
			} else {
				this.hasLocation = false
			}
			this.getBallCategory()
			if (e.id) {
				this.activityId = e.id
				this.getActivityDetail()
			}
			this.activeForm.phone = getStorageSync('phone')
		},
		onShow() {
			const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
			console.log(location)
			if (location) {
				this.location = {
					latitude: location.latitude,
					longitude: location.longitude,
				}
				this.activeForm.address = location.name + ' ' + location.address
				this.hasLocation = true
			}
			if (this.getLocationShow) {
				this.getLocationShow = false
				this.handleChooseLocation()
			}
		},
		onReady() {
			// 设置表单校验规则 否则表单校验无效
			this.$refs.form.setRules(this.rules);
		},
		onUnload() {
			// 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
			chooseLocation.setLocation(null);
		},
		methods: {
			async getBallCategory() {
				try {
					const res = await getBallCategory()
					this.activityTypeColumns.push(res.data.list)
				} catch {

				}
			},

			activityTypeConfirm(e) {
				this.activityTypeShow = false
				this.activeForm.cate_id = e.value[0].id
			},

			startTimePickerConfirm(e) {
				this.startTimePickerShow = false
				this.start_timestamp = e.value
				this.activeForm.start_time = transTime(true, e.value)
			},
			endTimePickerConfirm(e) {
				this.endTimePickerShow = false
				this.end_timestamp = e.value
				this.activeForm.end_time = transTime(true, e.value)
			},
			deadlineTimePickerConfirm(e) {
				this.deadlineTimePickerShow = false
				this.deadline_timestamp = e.value
				this.activeForm.deadline_time = transTime(true, e.value)
			},
			handleChooseLocation() {
				if (!this.hasLocation) {
					const that = this
					uni.getLocation({
						type: 'gcj02',
						isHighAccuracy: true,
						success(location) {
							const referer = '我们球场见'; //调用插件的app的名称
							const category = that.activityType || '篮球场,足球场,网球场,排球场'

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
					const referer = '我们球场见'; //调用插件的app的名称
					const location = JSON.stringify({
						latitude: this.location.latitude,
						longitude: this.location.longitude
					});
					const category = this.activityType || '篮球场,足球场,网球场,排球场'

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
			handleCreateActive() {
				this.$refs.form.validate().then(async (res) => {
					try {
						if (Number(this.activeForm.up_people_num) < Number(this.activeForm.down_people_num)) {
							uni.showToast({
								title: '上限人数不能小于下限人数呦～',
								icon: 'none',
								duration: 1500
							})
							return false
						}
						const sub = await this.requestSubscribeMessage()
						if (!sub) {
							return false
						}
						this.btnloading = true
						const res = await createActive({
							...this.activeForm,
							...this.location,
						})
						uni.showToast({
							title: '创建成功，快去邀请别人参加吧！',
							duration: 3000,
							icon: 'none'
						})
						setStorageSync('homeRefresh', true)
						this.btnloading = false
						uni.redirectTo({
							url: `../activeDetail/activeDetail?id=${res.data.activity_id}`
						})

					} catch (err) {
						this.btnloading = false
						uni.showToast({
							title: err.msg,
							duration: 3000,
							icon: 'none'
						})
					}
				}).catch(errors => {
					uni.$u.toast('请完善活动信息～')
				})
			},
			handleEditActive() {
				this.$refs.form.validate().then(async (res) => {
					try {
						this.activeForm.down_people_num = Number(this.activeForm.down_people_num)
						this.activeForm.up_people_num = Number(this.activeForm.up_people_num)
						if (Number(this.activeForm.up_people_num) < Number(this.activeForm.down_people_num)) {
							uni.showToast({
								title: '上限人数不能小于下限人数呦～',
								icon: 'none',
								duration: 1500
							})
							return false
						}
						const sub = await this.requestSubscribeMessage()
						if (!sub) {
							return false
						}
						this.btnloading = true
						const res = await editActive({
							activity_id: this.activityId,
							...this.activeForm,
							...this.location,
						})
						setStorageSync('detailRefresh', true)
						setStorageSync('homeRefresh', true)
						uni.showToast({
							title: '修改成功，快去邀请别人参加吧！',
							duration: 3000,
							icon: 'none'
						})
						this.btnloading = false
						uni.navigateBack({
							delta: 1
						})
					} catch (err) {
						this.btnloading = false
						uni.showToast({
							title: err.msg,
							duration: 3000,
							icon: 'none'
						})
					}
				}).catch(errors => {
					uni.$u.toast('请完善活动信息～')
				})
			},
			requestSubscribeMessage() {
				return new Promise((resolve, reject) => {
					uni.requestSubscribeMessage({
						tmplIds: ['7e4hxz4qtbTzner5G_dSvyKfniKF83cDicoTj2xh5i8',
							'VCRuCyfH7wqeRJAuAlxeCewpT5P17x0caWTrejjHdE4'
						],
						success: () => {
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
			async getActivityDetail() {
				try {
					const {
						data
					} = await getActivityDetail({
						params: {
							id: this.activityId
						}
					})
					const activeForm = {
						activity_name: data.activity_name,
						cate_id: data.cate_id,
						address: data.address,
						longitude: data.longitude,
						latitude: data.latitude,
						phone:data.phone,
						start_time: transTime(true, data.start_time * 1000),
						end_time: transTime(true, data.end_time * 1000),
						down_people_num: data.down_people_num,
						up_people_num: data.up_people_num,
						is_open: data.is_open,
						deadline_time: transTime(true, data.deadline_time * 1000),
						remark: data.remark
					}
					this.start_timestamp = data.start_time * 1000
					this.end_timestamp = data.end_time * 1000
					this.deadline_timestamp = data.deadline_time * 1000
					this.activeForm = activeForm
					this.location.longitude = Number(data.longitude),
						this.location.latitude = Number(data.latitude)
				} catch (err) {
					uni.showToast({
						title: err.message,
						icon: 'none',
						duration: 1500
					})
				}
			},
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

		.footer-btn-box {
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
