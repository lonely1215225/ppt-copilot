import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function register(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function upload(data) {
  return request({
    url: '/upload',
    method: 'post',
    data
  })
}

export function checkEmail(data) {
  return request({
    url: '/email/verify_email',
    method: 'post',
    data
  })
}

export function sendEmail(data) {
  return request({
    url: '/email/send_email',
    method: 'post',
    data:{
      email:data
    }
  })
}

export function resetEmail(id,email) {
  return request({
    url: '/user/'+id,
    method: 'put',
    data:{
      email:email
    }
  })
}

export function resetName(id,name) {
  return request({
    url: '/user/'+id,
    method: 'put',
    data:{
      username:name
    }
  })
}

export function resetDescription(id,description) {
  return request({
    url: '/user/'+id,
    method: 'put',
    data:{
      description:description
    }
  })
}
