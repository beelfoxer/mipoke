// 时间均以秒为单位
import { timeFormat } from '../../utils/idc/timeUtils'

/*
* 如果后一个时间节点大于前一个时间节点
* 丢弃前一个时间节点取后一个时间节点
* */
export function filterNodes(params) {
  const { nodes, range } = params
  if (!nodes.length) return []
  const filteredNodes = []

  filteredNodes.push(nodes[0])

  // let index = 0
  for (let i = 0; i < nodes.length; i++) {
    // const node = nodes[i]
    const { time: curTime, tx: curTx } = nodes[i]
    const { time: maxTime } = filteredNodes[filteredNodes.length - 1]
    if ((curTime - maxTime) < range) {
      filteredNodes.pop()
      if (i === nodes.length - 1) {
        filteredNodes.push({ time: curTime, tx: curTx })
      } else {
        filteredNodes.push({ time: maxTime, tx: curTx }) // 取已经缓存的时间，该区间最小的时间
      }
      continue
    }
    // index++
    //
    // const { tx: preTx } = filteredNodes.pop()
    // const { time: preTime } = nodes[i - 1]
    //
    // filteredNodes.push({ time: preTime, tx: preTx })
    filteredNodes.push({ time: curTime, tx: curTx })
  }

  return filteredNodes
}

//
function generateXYData(param) {
  const xData = []
  const yData = []
  const { startTime, endTime, range, nodes } = param

  if (!nodes.length) {
    nodes[0] = { time: undefined, tx: undefined }
  }

  let [{ time: timeIndex = startTime, tx: txIndex = 0 }] = nodes

  do {
    xData.unshift(timeIndex)
    yData.unshift(0)

    timeIndex -= range
  } while (timeIndex >= startTime)

  timeIndex = xData[xData.length - 1] + range

  let i = 1
  while (timeIndex <= endTime) {
    if (nodes.length > i) {
      const { time: curTime, tx: curTx } = nodes[i]
      xData.push(timeIndex)

      if (curTime > timeIndex) {
        yData.push(yData[yData.length - 1])
        // yData.push(0)
      } else {
        yData.push(((curTx - txIndex) / 1000 / 1000 / range).toFixed(2) * 8)
        txIndex = curTx
        i++
      }
      // if (i >= nodes.length) {
      //   yData.push(0)
      // } else {
      // }
    } else {
      xData.push(timeIndex)
      yData.push(0)
    }
    timeIndex += range
  }

  xData.shift()
  yData.shift()

  // yData.forEach((data, index) => {
  //   if (index > 0) {
  //     if (data === 0) {
  //       yData[index] = yData[index - 1]
  //     }
  //   }
  // })
  return { xData: xData.map(timeStamp => timeFormat(timeStamp * 1000)), yData, stampX: xData }
}

export function generateXYdata(param) {
  // console.log('nodes: ', param.nodes)
  return generateXYData(param)
}
