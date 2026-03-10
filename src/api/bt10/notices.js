import request from '@/utils/request'

// 查询系统级通知与公告列表
export function listNotices(query) {
  return request({
    url: '/bt10/notices/list',
    method: 'get',
    params: query
  })
}

// 查询系统级通知与公告详细
export function getNotices(id) {
  return request({
    url: '/bt10/notices/' + id,
    method: 'get'
  })
}

// 新增系统级通知与公告
export function addNotices(data) {
  return request({
    url: '/bt10/notices',
    method: 'post',
    data: data
  })
}

// 修改系统级通知与公告
export function updateNotices(data) {
  return request({
    url: '/bt10/notices',
    method: 'put',
    data: data
  })
}

// 删除系统级通知与公告（支持单个 id 或 id 数组）
export function delNotices(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/notices/${_ids}`,
    method: 'delete'
  })
}
