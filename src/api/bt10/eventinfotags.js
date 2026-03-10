import request from '@/utils/request'

// 查询活动与标签多对多关联列表
export function listEventinfotags(query) {
  return request({
    url: '/bt10/eventinfotags/list',
    method: 'get',
    params: query
  })
}

// 查询活动与标签多对多关联详细
export function getEventinfotags(id) {
  return request({
    url: '/bt10/eventinfotags/' + id,
    method: 'get'
  })
}

// 新增活动与标签多对多关联
export function addEventinfotags(data) {
  return request({
    url: '/bt10/eventinfotags',
    method: 'post',
    data: data
  })
}

// 修改活动与标签多对多关联
export function updateEventinfotags(data) {
  return request({
    url: '/bt10/eventinfotags',
    method: 'put',
    data: data
  })
}

// 删除活动与标签多对多关联（支持单个 id 或 id 数组）
export function delEventinfotags(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/eventinfotags/${_ids}`,
    method: 'delete'
  })
}
