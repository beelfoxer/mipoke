import request from '@/utils/request'

export default {
  rings() {
    return request({
      url: '/api/ring/ring',
      method: 'get'
    }).then(resp => !resp.data ? [] : resp.data.map(ring => {
      return {
        id: ring.id,
        switchIds: ring.switchIds,
        mgmtVlanId: ring.mgmtVlanId,
        mgmtCidr: ring.mgmtCidr,
        ringname: ring.ringname
      }
    }))
  },

  addRing(ring) {
    return request({
      url: '/api/ring/ring',
      method: 'post',
      data: ring
    }).then(resp => !resp.data ? '' : resp.data)
  },

  deleteRing(id) {
    return request({
      url: `/api/ring/ring/${encodeURIComponent(id)}`,
      method: 'delete'
    }).then(resp => !resp.data ? {} : resp.data)
  }
}
