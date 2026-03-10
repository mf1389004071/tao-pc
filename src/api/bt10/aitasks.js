import request from '@/utils/request'

// 查询AI异步任务列表
export function listAitasks(query) {
  return request({
    url: '/bt10/aitasks/list',
    method: 'get',
    params: query
  })
}

// 查询AI异步任务详细
export function getAitasks(id) {
  return request({
    url: '/bt10/aitasks/' + id,
    method: 'get'
  })
}

// 新增AI异步任务
export function addAitasks(data) {
  return request({
    url: '/bt10/aitasks',
    method: 'post',
    data: data
  })
}

// 修改AI异步任务
export function updateAitasks(data) {
  return request({
    url: '/bt10/aitasks',
    method: 'put',
    data: data
  })
}

// 删除AI异步任务（支持单个 id 或 id 数组）
export function delAitasks(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/aitasks/${_ids}`,
    method: 'delete'
  })
}
