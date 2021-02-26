import request from '@/utils/request'

export default {
  devices() {
    return request({
      url: '/device',
      method: 'get'
    }).then(resp => !resp.data ? [] : resp.data.map(device => {
      return {
        id: device.id,
        status: device.isOnline,
        lastOnlineTimeStamp: device.lastOnlineTimestamp
      }
    }))
  },

  ports() {
    return request({
      url: '/device',
      method: 'get'
    }).then(resp => !resp.data ? [] : Promise.all(resp.data.map(device => request({
      url: `/device/${encodeURIComponent(device.id)}/port`,
      method: 'get'
    }).then(resp => !resp.data ? [] : resp.data.map(port => {
      return {
        deviceId: device.id,
        portIndex: port.id,
        name: port.name,
        mac: port.mac
      }
    })))).then(ports => ports.reduce((pre, cur) => pre.concat(cur))))
  }
}
