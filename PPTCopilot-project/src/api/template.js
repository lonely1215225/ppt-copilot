import request from '@/utils/request'

export function getAllTemplates() {
  return request({
    url: '/template/info',
    method: 'get',
  })
}
