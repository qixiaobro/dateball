import request from '@/utils/request.js'
const http = uni.$u.http

//静默登录
export const silentLogin = (data) => http.get('/api/v2/wechat/silence_auth_login', data)


//授权用户信息登录
export const authLogin = (params, config = {}) => http.post('/api/v2/wechat/routine_auth', params, config)


//授权手机号
export const authPhone = (params, config = {}) => http.post('/api/v2/auth_bind_phone', params, config)

export const getWechatInfo = (data) => http.get('/api/wechat_info', data)