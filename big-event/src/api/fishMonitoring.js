import request from '@/utils/request.js'

// 获取最新的鱼类监测数据
export const getLatestFishDataService = ()=>{
    return request.get('/serial/latest')
}

// 获取所有鱼类标签数据
export const getAllFishTagsService = ()=>{
    return request.get('/serial/getAll')
}