import request from '@/utils/request'

export function listUsersocialaction(query) {
  return request({
    url: '/bt10/usersocialaction/list',
    method: 'get',
    params: query
  })
}

export function getUsersocialaction(id) {
  return request({
    url: '/bt10/usersocialaction/' + id,
    method: 'get'
  })
}

export function addUsersocialaction(data) {
  return request({
    url: '/bt10/usersocialaction',
    method: 'post',
    data: data
  })
}

export function updateUsersocialaction(data) {
  return request({
    url: '/bt10/usersocialaction',
    method: 'put',
    data: data
  })
}

export function delUsersocialaction(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/usersocialaction/${_ids}`,
    method: 'delete'
  })
}
