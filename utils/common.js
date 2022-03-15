import {
	silentLogin,
	authLogin
} from '@/api/login.js'
import {
	setStorageSync
} from '@/utils/local.js'
export const MAP_KEY = '3FUBZ-TJECU-JAPV5-2GARY-35VDV-HKBLL'

export const BASE_URL = 'http://yq.snailgo.top'


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
