import request from '@/utils/request'

// bt10 公共枚举接口（Enums）
export function getBt10Enums() {
  return request({
    url: '/bt10/common/enums',
    method: 'get'
  })
}

// bt10 业务状态枚举接口（Status）
export function getBt10Status() {
  return request({
    url: '/bt10/common/status',
    method: 'get'
  })
}

