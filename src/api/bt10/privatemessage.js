import request from '@/utils/request'

export function listPrivatemessage(query) {
  return request({
    url: '/bt10/privatemessage/list',
    method: 'get',
    params: query
  })
}

export function getPrivatemessage(id) {
  return request({
    url: '/bt10/privatemessage/' + id,
    method: 'get'
  })
}

export function addPrivatemessage(data) {
  return request({
    url: '/bt10/privatemessage',
    method: 'post',
    data: data
  })
}

export function updatePrivatemessage(data) {
  return request({
    url: '/bt10/privatemessage',
    method: 'put',
    data: data
  })
}

export function delPrivatemessage(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/privatemessage/${_ids}`,
    method: 'delete'
  })
}
