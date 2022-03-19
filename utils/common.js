import {
	silentLogin,
	authLogin,
	getWechatInfo
} from '@/api/login.js'
import {getSwipers} from '@/api/common.js'
import {
	setStorageSync
} from '@/utils/local.js'
export const MAP_KEY = '3FUBZ-TJECU-JAPV5-2GARY-35VDV-HKBLL'

export const BASE_URL = 'https://yq.snailgo.top'


// export const wxlogin = function(iv='',encryptedData=''){
// 	return new Promise((resolve,reject)=>{
// 		uni.login({
// 		  provider: 'weixin',
// 		  success: async function (loginRes) {
// 		    console.log(loginRes)
// 		    try{
// 				const res = await login({
// 					code:loginRes.code,
// 					login_type:'routine',
// 					iv,
// 					encryptedData
// 				})
// 			}catch{

// 			}

// 		  }
// 		});
// 	})
// }


export const wxlogin = function(iv = '', encryptedData = '') {
	return new Promise((resolve, reject) => {
		uni.login({
			provider: 'weixin',
			success: async function(loginRes) {
				if (iv) {
					try {
						await userAuthLogin(loginRes.code, iv, encryptedData)
						resolve(true)
					} catch {
						reject(false)
					}
				} else {
					try {
						await silentAuthLogin(loginRes.code)
						resolve(true)
					} catch {
						reject(false)
					}

				}

			}
		});
	})
}

const silentAuthLogin = function(code) {
	return new Promise(async (resolve, reject) => {
		try {
			const res = await silentLogin({
				params: {
					code
				},
			})
			setStorageSync('token', res.data.token)
			resolve(true)
		} catch (err) {
			uni.showToast({
				title: err.msg,
				icon: 'none',
				duration: 2000
			});
			reject(false)
		}
	})
}

const userAuthLogin = function(code, iv, encryptedData) {
	return new Promise(async (resolve, reject) => {
		try {
			const res = await authLogin({
				code,
				login_type: 'routine',
				iv,
				encryptedData
			})
			setStorageSync('token', res.data.token)
			resolve(true)
		} catch (err) {
			uni.showToast({
				title: err.msg,
				icon: 'none',
				duration: 2000
			});
			reject(false)
		}
	})
}

export const setLocaltion = function(longitude, latitude) {
	const location = {
		longitude: longitude,
		latitude: latitude
	}
	setStorageSync('location', location)
}

export const transTime = function(flag, value) {
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

export const splitAddress = function(address) {
	if(address==='') {
		return {
			name: '',
			address: ''
		}
	}
	const arr = address.split(' ')
	return {
		name: arr[0]||'',
		address: arr[1]||''
	}
}

export const openLocation = function(location) {
	const latitude = Number(location.latitude)
	const longitude = Number(location.longitude)
	wx.openLocation({
		latitude,
		longitude,
		scale: 18
	})
}

export const getHasUserInfo =  function(){
	return new Promise(async (resolve,reject)=>{
		try{
			const res = await getWechatInfo({})
			resolve(res)
		}catch(err){
			reject(false)
		}
	})

}

export const imgParse = function(type){
	let imageUrl = ''
	switch (type) {
		case '篮球':
			imageUrl = 'https://img30.360buyimg.com/pop/jfs/t1/158923/1/28066/36154/62358930Ee0d36d14/4c0cc0ff71410b92.png'
			break
		case '足球':
			imageUrl = 'https://img30.360buyimg.com/pop/jfs/t1/182992/22/21869/42133/6235882bE1ffa01a9/7fcf4a2d8513591d.png'
			break
		case '排球':
			imageUrl = 'https://img30.360buyimg.com/pop/jfs/t1/128530/39/26037/40023/623588e3Ea0ca1abf/5674e0172c94c964.png️'
			break
		case '羽毛球':
			imageUrl = 'https://img30.360buyimg.com/pop/jfs/t1/109166/20/25222/56486/62358979E59c429d6/3d4346d5896d7e29.png'
			break
		case '乒乓球':
			imageUrl = 'https://img30.360buyimg.com/pop/jfs/t1/209039/5/18980/67480/623589aeE1e34a292/bdba9e2a66ab37a3.png'
			break
		case '网球':
			imageUrl = 'https://img30.360buyimg.com/pop/jfs/t1/212292/33/15451/90922/62358a21E7ddedc23/9785077f46aa6f30.png'
			break
		default:
			imageUrl = 'https://img30.360buyimg.com/pop/jfs/t1/220029/19/15263/78063/62358776Ebb80152b/86d3b1ae5e07b584.png'
			break
	}
	return imageUrl
}

export const getSwiper = async function(){
	return new Promise(async (resolve,reject)=>{
		try{
			const res = await getSwipers({})
			resolve(res.data.banner)
		}catch{
			reject([])
		}
	})
}