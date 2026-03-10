import request from '@/utils/request'

// 查询社群与用户的成员关系列表
export function listCommunitymember(query) {
  return request({
    url: '/bt10/communitymember/list',
    method: 'get',
    params: query
  })
}

// 查询社群与用户的成员关系详细
export function getCommunitymember(id) {
  return request({
    url: '/bt10/communitymember/' + id,
    method: 'get'
  })
}

// 新增社群与用户的成员关系
export function addCommunitymember(data) {
  return request({
    url: '/bt10/communitymember',
    method: 'post',
    data: data
  })
}

// 修改社群与用户的成员关系
export function updateCommunitymember(data) {
  return request({
    url: '/bt10/communitymember',
    method: 'put',
    data: data
  })
}

// 删除社群与用户的成员关系（支持单个 id 或 id 数组）
export function delCommunitymember(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/communitymember/${_ids}`,
    method: 'delete'
  })
}
