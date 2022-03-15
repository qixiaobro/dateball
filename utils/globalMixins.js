export default{
	data(){
		return{
			location: {
				longitude: '',
				latitude: ''
			},
			
		}
	},
	methods:{
		getLocationText(address){
			return `${address.street_number||address.name}`
		},
		// wxLogin(){
		// 	console.log(1)
		// 	uni.login({
		// 	  provider: 'weixin',
		// 	  success: function (loginRes) {
		// 	    console.log(loginRes)
		// 	    // // 获取用户信息

		// 	  }
		// 	});
		// },
		customrLogin(){
			uni.getUserProfile({
			  provider: 'weixin',
			  desc:'约球么需获取您的信息用于登录～',
			  success: function (infoRes) {
			    console.log(infoRes);
			  },
			  fail:function(err){
			  	console.log(err)
			  }
			});
		}
	}
}