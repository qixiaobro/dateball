const http = uni.$u.http

//获取首页轮播图
export const getSwipers = (data) => http.get('/api/ball/index', data)