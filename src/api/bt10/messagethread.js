import request from '@/utils/request'

export function listMessagethread(query) {
  return request({
    url: '/bt10/messagethread/list',
    method: 'get',
    params: query
  })
}

export function getMessagethread(id) {
  return request({
    url: '/bt10/messagethread/' + id,
    method: 'get'
  })
}

export function addMessagethread(data) {
  return request({
    url: '/bt10/messagethread',
    method: 'post',
    data: data
  })
}

export function updateMessagethread(data) {
  return request({
    url: '/bt10/messagethread',
    method: 'put',
    data: data
  })
}

export function delMessagethread(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/messagethread/${_ids}`,
    method: 'delete'
  })
}
