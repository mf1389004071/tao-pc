import request from '@/utils/request'

// 查询小鹅通订单同步表列表
export function listXiaoeorders(query) {
  return request({
    url: '/bt10/xiaoeorders/list',
    method: 'get',
    params: query
  })
}

// 查询小鹅通订单同步表详细
export function getXiaoeorders(id) {
  return request({
    url: '/bt10/xiaoeorders/' + id,
    method: 'get'
  })
}

// 新增小鹅通订单同步表
export function addXiaoeorders(data) {
  return request({
    url: '/bt10/xiaoeorders',
    method: 'post',
    data: data
  })
}

// 修改小鹅通订单同步表
export function updateXiaoeorders(data) {
  return request({
    url: '/bt10/xiaoeorders',
    method: 'put',
    data: data
  })
}

// 删除小鹅通订单同步表（支持单个 id 或 id 数组）
export function delXiaoeorders(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/xiaoeorders/${_ids}`,
    method: 'delete'
  })
}
