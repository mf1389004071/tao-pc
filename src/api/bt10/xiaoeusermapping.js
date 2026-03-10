import request from '@/utils/request'

// 查询本平台用户与小鹅通用户ID映射列表
export function listXiaoeusermapping(query) {
  return request({
    url: '/bt10/xiaoeusermapping/list',
    method: 'get',
    params: query
  })
}

// 查询本平台用户与小鹅通用户ID映射详细
export function getXiaoeusermapping(id) {
  return request({
    url: '/bt10/xiaoeusermapping/' + id,
    method: 'get'
  })
}

// 新增本平台用户与小鹅通用户ID映射
export function addXiaoeusermapping(data) {
  return request({
    url: '/bt10/xiaoeusermapping',
    method: 'post',
    data: data
  })
}

// 修改本平台用户与小鹅通用户ID映射
export function updateXiaoeusermapping(data) {
  return request({
    url: '/bt10/xiaoeusermapping',
    method: 'put',
    data: data
  })
}

// 删除本平台用户与小鹅通用户ID映射（支持单个 id 或 id 数组）
export function delXiaoeusermapping(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/xiaoeusermapping/${_ids}`,
    method: 'delete'
  })
}
