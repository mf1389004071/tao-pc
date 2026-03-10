import request from '@/utils/request'

// 查询用户成长阶段变更历史列表
export function listUsergrowth(query) {
  return request({
    url: '/bt10/usergrowth/list',
    method: 'get',
    params: query
  })
}

// 查询用户成长阶段变更历史详细
export function getUsergrowth(id) {
  return request({
    url: '/bt10/usergrowth/' + id,
    method: 'get'
  })
}

// 新增用户成长阶段变更历史
export function addUsergrowth(data) {
  return request({
    url: '/bt10/usergrowth',
    method: 'post',
    data: data
  })
}

// 修改用户成长阶段变更历史
export function updateUsergrowth(data) {
  return request({
    url: '/bt10/usergrowth',
    method: 'put',
    data: data
  })
}

// 删除用户成长阶段变更历史（支持单个 id 或 id 数组）
export function delUsergrowth(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/usergrowth/${_ids}`,
    method: 'delete'
  })
}
