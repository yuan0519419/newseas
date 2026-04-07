import request from '@/utils/request.js'

//文章分类的查询
export const eqpListService = ()=>{
    return request.get('/eqp/select')
}

//添加文章分类
export const eqpAddService = (eqpModel) => {
    return request.post('/eqp/insert',eqpModel)
}

//修改分类    articleCategoryUpdateService
export const eqpUpdateService = (eqpModel)=>{
    return request.put('/eqp/update',eqpModel)
}

//删除分类
export const eqpDeleteService = (id)=>{
    return request.delete('/eqp/delete?id='+id);
}

//按日期查询数据
export const seaDataByDateService = (date) => {
    return request.get(`/eqp/otherday?date=${date}`);
}