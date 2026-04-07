import request from '@/utils/request.js'

//文章分类的查询
export const reserveListService = ()=>{
    return request.get('/reserve/select')
}

//添加文章分类
export const reserveAddService = (reserveModel) => {
    return request.post('/reserve/insert',reserveModel)
}

//修改分类    articleCategoryUpdateService
export const reserveUpdateService = (reserveModel)=>{
    return request.put('/reserve/update',reserveModel)
}

//删除分类
export const reserveDeleteService = (id)=>{
    return request.delete('/reserve/delete?id='+id);
}

//按日期查询数据
export const seaDataByDateService = (date) => {
    return request.get(`/reserve/otherday?date=${date}`);
}