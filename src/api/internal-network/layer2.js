import request from '@/utils/request'

export default {
  layer2Post(data) {
    return request({
      url: '/api/layer2/layer2-m2m',
      method: 'post',
      data: {
        mstpId: data.mstpId,
        name: data.name,
        vlanId: data.vlanId,
        bandwidth: data.bandwidth
      }
    }).then(resp => !resp.data ? {} : {
      mstpId: data.mstpId,
      name: data.name,
      vlanId: data.vlanId,
      bandwidth: data.bandwidth,
      id: resp.data
    })
  },
  layer2GetAll() {
    return request({
      url: '/api/layer2/layer2-m2m',
      method: 'get'
    }).then(resp => !resp.data ? [] : resp.data.map(res => {
      return {
        mstpId: res.mstpId,
        name: res.name,
        vlanId: res.vlanId,
        bandwidth: res.bandwidth,
        id: res.id
      }
    }))
  },
  layer2Del(id) {
    return request({
      url: `/api/layer2/layer2-m2m/${id}`,
      method: 'delete'
    })
  },
  layer2Get(id) {
    return request({
      url: `/api/layer2/layer2-m2m/${id}`,
      method: 'get'
    }).then(resp => !resp.data ? {} : {
      mstpId: resp.data.mstpId,
      name: resp.data.name,
      vlanId: resp.data.vlanId,
      bandwidth: resp.data.bandwidth,
      id: resp.data.id
    })
  },
  layer2PostAc(data) {
    return request({
      url: '/api/layer2/layer2m2mac',
      method: 'post',
      data: {
        layer2M2MId: data.layer2M2MId,
        switchId: data.switchId,
        portId: data.portId
      }
    }).then(resp => !resp.data ? {} : {
      layer2M2MId: data.layer2M2MId,
      switchId: data.switchId,
      portId: data.portId,
      id: resp.data
    })
  },
  layer2GetAllAc() {
    return request({
      url: '/api/layer2/layer2m2mac',
      method: 'get'
    }).then(resp => !resp.data ? [] : resp.data.map(res => {
      return {
        layer2M2MId: res.layer2M2MId,
        switchId: res.switchId,
        portId: res.portId,
        id: res.id
      }
    }))
  },
  layer2DelAc(id) {
    return request({
      url: `/api/layer2/layer2m2mac/${id}`,
      method: 'delete'
    })
  },
  layer2GetAc(id) {
    return request({
      url: `/api/layer2/layer2m2mac/${id}`,
      method: 'get'
    }).then(resp => !resp.data ? {} : {
      layer2M2MId: resp.data.layer2M2MId,
      switchId: resp.data.switchId,
      portId: resp.data.portId,
      id: resp.data.id
    })
  }
}
