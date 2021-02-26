import deviceApi from '@/api/idc/device'

import { arrySort } from './index'

export async function formatDeviceAndPorts() {
  const deviceList = await deviceApi.getList()
  const portList = await deviceApi.getPortList()

  return deviceList.reduce((pre, cur) => {
    const devicePorts = portList
      .filter(port => port.deviceId === cur.id)
      .map(filterPort => {
        return {
          value: filterPort.portNum,
          label: filterPort.portNum,
          index: parseInt(filterPort.portNum),
          disabled: false
        }
      })

    const formater = {
      value: cur.id,
      label: cur.id,
      disabled: false,
      children: arrySort(devicePorts)
    }
    pre.push(formater)
    return pre
  }, [])
}
