import request from '@/utils/request'

export default {
  mstpGetAll() {
    return request({
      url: '/api/mstp/mstp',
      method: 'get'
    }).then(resp => !resp.data ? [] : resp.data.map(res => {
      return {
        instance: res.instance,
        vlan: res.vlan,
        id: res.id
      }
    }))
  },
  mstpPost(data) {
    return request({
      url: '/api/mstp/mstp',
      method: 'post',
      data: {
        instance: data.instance,
        vlan: data.vlan
      }
    }).then(resp => !resp.data ? {} : {
      instance: data.instance,
      vlan: data.vlan,
      id: resp.data
    })
  },
  mstpDel(id) {
    return request({
      url: `/api/mstp/mstp/${id}`,
      method: 'delete'
    })
  },
  mstpGet(id) {
    return request({
      url: `/api/mstp/mstp/${id}`,
      method: 'get'
    }).then(resp => !resp.data ? {} : {
      instance: resp.data.instance,
      vlan: resp.data.vlan,
      id: resp.data.id
    })
  }
}
