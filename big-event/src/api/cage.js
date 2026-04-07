import request from '@/utils/request.js'

//文章分类的查询
export const cageListService = ()=>{
    return request.get('/cages/select')
}

//添加文章分类
export const cageAddService = (cageModel) => {
    return request.post('/cages/insert',cageModel)
}

//修改分类    articleCategoryUpdateService
export const cageUpdateService = (cageModel)=>{
    return request.put('/cages/update',cageModel)
}

//删除分类
export const cageDeleteService = (id)=>{
    return request.delete('/cages/delete?id='+id);
}

//按日期查询数据
export const seaDataByDateService = (date) => {
    return request.get(`/cages/otherday?date=${date}`);
}