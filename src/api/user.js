// import request from '@/utils/request'

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export function login(data) {
  // return request({
  //   url: '/vue-element-admin/user/login',
  //   method: 'post',
  //   data
  // })
  const { username } = data
  const token = tokens[username]
  return new Promise(resolve => {
    if (!token) {
      resolve({
        code: 60204,
        message: 'Account and password are incorrect.'
      })
    } else {
      resolve({
        code: 20000,
        data: token
      })
    }
  })
}

export function getInfo(token) {
  // return request({
  //   url: '/vue-element-admin/user/info',
  //   method: 'get',
  //   params: { token }
  // })
  const info = users[token]
  return new Promise(resolve => {
    if (!info) {
      resolve({
        code: 50008,
        message: 'Login failed, unable to get user details.'
      })
    } else {
      resolve({
        code: 20000,
        data: info
      })
    }
  })
}

export function logout() {
  // return request({
  //   url: '/vue-element-admin/user/logout',
  //   method: 'post'
  // })
  return new Promise(resolve => {
    resolve({
      code: 20000,
      data: 'success'
    })
  })
}
