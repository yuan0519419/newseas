import request from '@/utils/request.js'


//文章分类的查询
export const seaDataListService = ()=>{
    return request.get('/seaData/echo')
}

//添加文章分类
export const seaDataAddService = (seaModel) => {
    return request.post('/seaData/insert',seaModel)
}

//修改分类    articleCategoryUpdateService
export const seaDataUpdateService = (categoryModel)=>{
    return request.put('/seaData/update',categoryModel)
}

//删除分类
export const seaDataDeleteService = (id)=>{
    return request.delete('/seaData/delete?id='+id);
}

//按日期查询数据
export const seaDataByDateService = (date) => {
    return request.get(`/seaData/otherday?date=${date}`);
}