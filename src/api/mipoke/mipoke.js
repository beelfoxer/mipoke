import request from '@/utils/request'

export default {
  // add del update
  mipokeUpdate(data) {
    return request({
      url: '/api/mipoke/update',
      method: 'post',
      data
    }).then(resp => !resp.data ? {} : resp.data)
  },
  // search
  mipokeQuery(data) {
    return request({
      url: '/api/mipoke/query',
      method: 'post',
      data
    }).then(resp => !resp.data ? [] : (resp.data.error ? [] : resp.data.items))
  }
}
