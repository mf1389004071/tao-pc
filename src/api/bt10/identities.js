import request from '@/utils/request'

// 查询系统身份定义表列表
export function listIdentities(query) {
  return request({
    url: '/bt10/identities/list',
    method: 'get',
    params: query
  })
}

// 查询系统身份定义表详细
export function getIdentities(identityCode) {
  return request({
    url: '/bt10/identities/' + identityCode,
    method: 'get'
  })
}

// 新增系统身份定义表
export function addIdentities(data) {
  return request({
    url: '/bt10/identities',
    method: 'post',
    data: data
  })
}

// 修改系统身份定义表
export function updateIdentities(data) {
  return request({
    url: '/bt10/identities',
    method: 'put',
    data: data
  })
}

// 删除系统身份定义表（支持单个 id 或 id 数组）
export function delIdentities(identityCodes) {
  const _ids = Array.isArray(identityCodes) ? identityCodes.join(',') : identityCodes
  return request({
    url: `/bt10/identities/${_ids}`,
    method: 'delete'
  })
}
