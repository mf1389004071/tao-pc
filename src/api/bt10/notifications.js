import request from '@/utils/request'

// 查询用户站内通知列表
export function listNotifications(query) {
  return request({
    url: '/bt10/notifications/list',
    method: 'get',
    params: query
  })
}

// 查询用户站内通知详细
export function getNotifications(id) {
  return request({
    url: '/bt10/notifications/' + id,
    method: 'get'
  })
}

// 新增用户站内通知
export function addNotifications(data) {
  return request({
    url: '/bt10/notifications',
    method: 'post',
    data: data
  })
}

// 修改用户站内通知
export function updateNotifications(data) {
  return request({
    url: '/bt10/notifications',
    method: 'put',
    data: data
  })
}

// 删除用户站内通知（支持单个 id 或 id 数组）
export function delNotifications(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/notifications/${_ids}`,
    method: 'delete'
  })
}
