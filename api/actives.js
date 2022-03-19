const http = uni.$u.http


export const mineActiveList = (data) => http.get('/api/ball/activity/home_list', data)

export const nearByActiveList = (data) => http.get('/api/ball/activity/nearby_list', data)

//创建活动
export const createActive = (params, config = {}) => http.post('/api/ball/activity/add', params, config)

//获取活动分类
export const getBallCategory = (data) => http.get('/api/ball/category', data)

//获取活动详情
export const getActivityDetail = (data) => http.get(`api/ball/activity/detail/${data.params.id}`,{})


//修改活动
export const editActive = (params, config = {}) => http.post('/api/ball/activity/edit', params, config)

//解散
export const cancelActive = (params, config = {}) => http.post('/api/ball/activity/cancel', params, config)

//退出活动
export const quitActive = (params, config = {}) => http.post('/api/ball/activity/quit', params, config)

//参与活动
export const joinActive = (params, config = {}) => http.post('/api/ball/activity/join', params, config)