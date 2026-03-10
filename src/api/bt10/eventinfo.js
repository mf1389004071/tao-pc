import request from '@/utils/request'

// 查询活动或线下课程主表列表
export function listEventinfo(query) {
  return request({
    url: '/bt10/eventinfo/list',
    method: 'get',
    params: query
  })
}

// 查询活动或线下课程主表详细
export function getEventinfo(id) {
  return request({
    url: '/bt10/eventinfo/' + id,
    method: 'get'
  })
}

// 新增活动或线下课程主表
export function addEventinfo(data) {
  return request({
    url: '/bt10/eventinfo',
    method: 'post',
    data: data
  })
}

// 修改活动或线下课程主表
export function updateEventinfo(data) {
  return request({
    url: '/bt10/eventinfo',
    method: 'put',
    data: data
  })
}

// 删除活动或线下课程主表（支持单个 id 或 id 数组）
export function delEventinfo(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/eventinfo/${_ids}`,
    method: 'delete'
  })
}
