import request from '@/utils/request'

// 查询邀请关系与奖励记录列表
export function listUserinvite(query) {
  return request({
    url: '/bt10/userinvite/list',
    method: 'get',
    params: query
  })
}

// 查询邀请关系与奖励记录详细
export function getUserinvite(id) {
  return request({
    url: '/bt10/userinvite/' + id,
    method: 'get'
  })
}

// 新增邀请关系与奖励记录
export function addUserinvite(data) {
  return request({
    url: '/bt10/userinvite',
    method: 'post',
    data: data
  })
}

// 修改邀请关系与奖励记录
export function updateUserinvite(data) {
  return request({
    url: '/bt10/userinvite',
    method: 'put',
    data: data
  })
}

// 删除邀请关系与奖励记录（支持单个 id 或 id 数组）
export function delUserinvite(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/userinvite/${_ids}`,
    method: 'delete'
  })
}
