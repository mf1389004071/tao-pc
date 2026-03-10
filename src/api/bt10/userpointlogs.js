import request from '@/utils/request'

// 查询用户积分收支流水列表
export function listUserpointlogs(query) {
  return request({
    url: '/bt10/userpointlogs/list',
    method: 'get',
    params: query
  })
}

// 查询用户积分收支流水详细
export function getUserpointlogs(id) {
  return request({
    url: '/bt10/userpointlogs/' + id,
    method: 'get'
  })
}

// 新增用户积分收支流水
export function addUserpointlogs(data) {
  return request({
    url: '/bt10/userpointlogs',
    method: 'post',
    data: data
  })
}

// 修改用户积分收支流水
export function updateUserpointlogs(data) {
  return request({
    url: '/bt10/userpointlogs',
    method: 'put',
    data: data
  })
}

// 删除用户积分收支流水（支持单个 id 或 id 数组）
export function delUserpointlogs(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/userpointlogs/${_ids}`,
    method: 'delete'
  })
}
