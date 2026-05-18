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

//获取最新十条数据用于图表渲染
export const seaDataLatestTenService = () => {
    return request.get('/seaData/latestTen');
}

//获取最新一条数据用于仪表盘
export const seaDataLatestService = () => {
    return request.get('/seaData/latest');
}

//获取AI研判建议数据
export const aiSuggestionService = () => {
    return request.get('/ai/suggestion');
}
