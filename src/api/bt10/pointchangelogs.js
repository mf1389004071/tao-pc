import request from '@/utils/request'

// 查询积分变动审计列表
export function listPointchangelogs(query) {
  return request({
    url: '/bt10/pointchangelogs/list',
    method: 'get',
    params: query
  })
}

// 查询积分变动审计详细
export function getPointchangelogs(id) {
  return request({
    url: '/bt10/pointchangelogs/' + id,
    method: 'get'
  })
}

// 新增积分变动审计
export function addPointchangelogs(data) {
  return request({
    url: '/bt10/pointchangelogs',
    method: 'post',
    data: data
  })
}

// 修改积分变动审计
export function updatePointchangelogs(data) {
  return request({
    url: '/bt10/pointchangelogs',
    method: 'put',
    data: data
  })
}

// 删除积分变动审计（支持单个 id 或 id 数组）
export function delPointchangelogs(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/pointchangelogs/${_ids}`,
    method: 'delete'
  })
}
