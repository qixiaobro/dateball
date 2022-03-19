export default {
	data() {
		return {
			activityStatus: ['召集中', '已达标', '已满员', '待开始', '进行中', '已取消', '已结束'],
			activityStatusColor: ['warning', 'success', 'success', 'warning', 'success', 'info', 'info'],
		}
	},
	methods: {
		transStatusLabel(status) {
			return this.activityStatus[status]
		},
		transStatusLabelColor(status) {
			return this.activityStatusColor[status]
		},
		transActivityType(label) {
			let icon = ''
			switch (label) {
				case '篮球':
					icon = '🏀'
					break
				case '足球':
					icon = '⚽️'
					break
				case '排球':
					icon = '🏐️'
					break
				case '羽毛球':
					icon = '🏸️'
					break
				case '乒乓球':
					icon = '🏓️'
					break
				case '网球':
					icon = '🎾'
					break
			}
			return icon
		},
	}
}
