const http = uni.$u.http


export const mineActiveList = (data) => http.get('/api/ball/activity/home_list', data)

export const nearByActiveList = (data) => http.get('/api/ball/activity/nearby_list', data)