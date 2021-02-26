/*
* 先生成Ｘ轴的时间数据
* */
export function generateXYData(param) {
  const { startTime, endTime, nodes, distant } = param
  const xData = []

  let xTimeIndex = startTime

  do {
    xData.push(xTimeIndex)
    xTimeIndex += distant
  } while (xTimeIndex <= endTime)

  const yData = []

  let nodeIndex = 0
  for (const xTime of xData) {
    yData.push(0)
    const yCurData = []
    for (; nodeIndex < nodes.length; nodeIndex++) {
      const { time: nodeTime, tx: nodeTx } = nodes[nodeIndex]
      if (nodeTime <= xTime && nodeTime > xTime - distant) {
        yData.pop()
        yData.push(nodeTx)
        yCurData.push(nodeTx)
        continue
      }
      // if (nodeTime > xTime + distant)
      if (nodeTime > xTime) {
        nodeIndex--
      }
    }
  }
}
