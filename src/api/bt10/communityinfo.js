import request from '@/utils/request'

// 查询合伙人创建的社群列表
export function listCommunityinfo(query) {
  return request({
    url: '/bt10/communityinfo/list',
    method: 'get',
    params: query
  })
}

// 查询合伙人创建的社群详细
export function getCommunityinfo(id) {
  return request({
    url: '/bt10/communityinfo/' + id,
    method: 'get'
  })
}

// 新增合伙人创建的社群
export function addCommunityinfo(data) {
  return request({
    url: '/bt10/communityinfo',
    method: 'post',
    data: data
  })
}

// 修改合伙人创建的社群
export function updateCommunityinfo(data) {
  return request({
    url: '/bt10/communityinfo',
    method: 'put',
    data: data
  })
}

// 删除合伙人创建的社群（支持单个 id 或 id 数组）
export function delCommunityinfo(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/communityinfo/${_ids}`,
    method: 'delete'
  })
}
