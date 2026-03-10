import request from '@/utils/request'

// 查询用户信息画像扩展表列表
export function listUserprofiles(query) {
  return request({
    url: '/bt10/userprofiles/list',
    method: 'get',
    params: query
  })
}

// 查询用户信息画像扩展表详细
export function getUserprofiles(userId) {
  return request({
    url: '/bt10/userprofiles/' + userId,
    method: 'get'
  })
}

// 新增用户信息画像扩展表
export function addUserprofiles(data) {
  return request({
    url: '/bt10/userprofiles',
    method: 'post',
    data: data
  })
}

// 修改用户信息画像扩展表
export function updateUserprofiles(data) {
  return request({
    url: '/bt10/userprofiles',
    method: 'put',
    data: data
  })
}

// 删除用户信息画像扩展表（支持单个 id 或 id 数组）
export function delUserprofiles(userIds) {
  const _ids = Array.isArray(userIds) ? userIds.join(',') : userIds
  return request({
    url: `/bt10/userprofiles/${_ids}`,
    method: 'delete'
  })
}
