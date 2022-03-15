import request from '@/utils/request.js'
const http = uni.$u.http

// post请求，获取菜单
export const postMenu = (params, config = {}) => http.post('/ebapi/public_api/index', params, config)

// get请求，获取菜单，注意：get请求的配置等，都在第二个参数中，详见前面解释
export const getMenu = (data) => http.get('/ebapi/public_api/index', data)

// const login = params => request({
// 	url: '/api/v2/wechat/routine_auth',
// 	data: params
// })

// const silentLogin = params => request({
// 	url: `/api/v2/wechat/silence_auth_login?code=${params.code}`,
// 	params,
// 	method: 'GET'
// })


//静默登录
export const silentLogin = (data) => http.get('/api/v2/wechat/silence_auth_login', data)


//授权用户信息登录
export const authLogin = (params, config = {}) => http.post('/api/v2/wechat/routine_auth', params, config)