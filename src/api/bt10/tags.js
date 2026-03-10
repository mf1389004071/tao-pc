import request from '@/utils/request'

// 查询通用标签定义表列表
export function listTags(query) {
  return request({
    url: '/bt10/tags/list',
    method: 'get',
    params: query
  })
}

// 查询通用标签定义表详细
export function getTags(id) {
  return request({
    url: '/bt10/tags/' + id,
    method: 'get'
  })
}

// 新增通用标签定义表
export function addTags(data) {
  return request({
    url: '/bt10/tags',
    method: 'post',
    data: data
  })
}

// 修改通用标签定义表
export function updateTags(data) {
  return request({
    url: '/bt10/tags',
    method: 'put',
    data: data
  })
}

// 删除通用标签定义表（支持单个 id 或 id 数组）
export function delTags(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/tags/${_ids}`,
    method: 'delete'
  })
}
