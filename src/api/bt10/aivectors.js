import request from '@/utils/request'

// 查询AI向量列表
export function listAivectors(query) {
  return request({
    url: '/bt10/aivectors/list',
    method: 'get',
    params: query
  })
}

// 查询AI向量详细
export function getAivectors(id) {
  return request({
    url: '/bt10/aivectors/' + id,
    method: 'get'
  })
}

// 新增AI向量
export function addAivectors(data) {
  return request({
    url: '/bt10/aivectors',
    method: 'post',
    data: data
  })
}

// 修改AI向量
export function updateAivectors(data) {
  return request({
    url: '/bt10/aivectors',
    method: 'put',
    data: data
  })
}

// 删除AI向量（支持单个 id 或 id 数组）
export function delAivectors(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/aivectors/${_ids}`,
    method: 'delete'
  })
}
