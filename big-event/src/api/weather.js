import request from '@/utils/request.js'

//文章分类的查询
export const weatherListService = ()=>{
    return request.get('/weather/select')
}

//添加文章分类
export const weatherAddService = (weatherModel) => {
    return request.post('/weather/insert',weatherModel)
}

//修改分类    articleCategoryUpdateService
export const weatherUpdateService = (weatherModel)=>{
    return request.put('/weather/update',weatherModel)
}

//删除分类
export const weatherDeleteService = (id)=>{
    return request.delete('/weather/delete?id='+id);
}

//按日期查询数据
export const seaDataByDateService = (date) => {
    return request.get(`/weather/otherday?date=${date}`);
}