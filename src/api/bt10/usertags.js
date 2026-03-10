import request from '@/utils/request'

// 查询用户与多维标签关联表列表
export function listUsertags(query) {
  return request({
    url: '/bt10/usertags/list',
    method: 'get',
    params: query
  })
}

// 查询用户与多维标签关联表详细
export function getUsertags(id) {
  return request({
    url: '/bt10/usertags/' + id,
    method: 'get'
  })
}

// 新增用户与多维标签关联表
export function addUsertags(data) {
  return request({
    url: '/bt10/usertags',
    method: 'post',
    data: data
  })
}

// 修改用户与多维标签关联表
export function updateUsertags(data) {
  return request({
    url: '/bt10/usertags',
    method: 'put',
    data: data
  })
}

// 删除用户与多维标签关联表（支持单个 id 或 id 数组）
export function delUsertags(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/usertags/${_ids}`,
    method: 'delete'
  })
}
