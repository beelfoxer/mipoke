export function arrySort(arr, flag = false) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (flag) {
        if (arr[j].index < arr[j + 1].index) {
          const temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
        }
      } else {
        if (arr[j].index > arr[j + 1].index) {
          const temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
        }
      }
    }
  }
  return arr
}

export function filterTraffic(trafficList) {
  /*
  * 如果数据大于三条
  * 如果第一个数据太大那么丢弃
  * */
  if (trafficList.length >= 3) {
    const {
      0: { tx: tx0 },
      1: { tx: tx1 },
      2: { tx: tx2 }
    } = trafficList

    if (tx0 > tx1) {
      trafficList.shift()
    }

    if (tx1 > tx2) {
      trafficList.shift()
      trafficList.shift()
    }
  }

  if (!trafficList.length) return []

  const filteredTrafficList = []

  filteredTrafficList.push(trafficList[0])

  for (const traffic of trafficList) {
    const maxTraffic = filteredTrafficList[filteredTrafficList.length - 1]
    if (traffic.tx > maxTraffic.tx) {
      filteredTrafficList.push(traffic)
    }
  }

  /*
  * 如果第一个统计太小那么也丢弃
  * 目前丢弃小鱼200字节的统计
  * */
  const [{ tx: fTx0 }] = filteredTrafficList
  if (fTx0 < 200) {
    filteredTrafficList.shift()
  }

  return filteredTrafficList
}
