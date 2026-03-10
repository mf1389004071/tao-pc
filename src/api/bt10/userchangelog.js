import request from '@/utils/request'

// 查询用户关键字段变更记录列表
export function listUserchangelog(query) {
  return request({
    url: '/bt10/userchangelog/list',
    method: 'get',
    params: query
  })
}

// 查询用户关键字段变更记录详细
export function getUserchangelog(id) {
  return request({
    url: '/bt10/userchangelog/' + id,
    method: 'get'
  })
}

// 新增用户关键字段变更记录
export function addUserchangelog(data) {
  return request({
    url: '/bt10/userchangelog',
    method: 'post',
    data: data
  })
}

// 修改用户关键字段变更记录
export function updateUserchangelog(data) {
  return request({
    url: '/bt10/userchangelog',
    method: 'put',
    data: data
  })
}

// 删除用户关键字段变更记录（支持单个 id 或 id 数组）
export function delUserchangelog(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/userchangelog/${_ids}`,
    method: 'delete'
  })
}
