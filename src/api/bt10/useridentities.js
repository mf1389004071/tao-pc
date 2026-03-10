import request from '@/utils/request'

// 查询用户身份关系表列表
export function listUseridentities(query) {
  return request({
    url: '/bt10/useridentities/list',
    method: 'get',
    params: query
  })
}

// 查询用户身份关系表详细
export function getUseridentities(id) {
  return request({
    url: '/bt10/useridentities/' + id,
    method: 'get'
  })
}

// 新增用户身份关系表
export function addUseridentities(data) {
  return request({
    url: '/bt10/useridentities',
    method: 'post',
    data: data
  })
}

// 修改用户身份关系表
export function updateUseridentities(data) {
  return request({
    url: '/bt10/useridentities',
    method: 'put',
    data: data
  })
}

// 删除用户身份关系表（支持单个 id 或 id 数组）
export function delUseridentities(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/useridentities/${_ids}`,
    method: 'delete'
  })
}
