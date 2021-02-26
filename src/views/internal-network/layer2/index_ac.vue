<template>
  <div>
    <el-card shadow="never">
      <div slot="header" style="display:flex;align-items:center">
        <div style="width:50%">AC口管理</div>
        <div style="width:50%;text-align: right;"><el-button @click="handleCreate()">添加AC口</el-button></div>
      </div>
      <div>
        <el-table
          border
          style="width: 100%"
          :data="layer2acList"
        >
          <el-table-column label="业务名称" prop="layer2M2MId" min-width="80px" align="center">
            <template slot-scope="{row}">
              <span>{{ GetM2MNameById(row.layer2M2MId) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="switchId" prop="switchId" min-width="80px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.switchId }}</span>
            </template>
          </el-table-column>

          <el-table-column label="portId" prop="portId" min-width="80px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.portId }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="80px" align="center">
            <template slot-scope="{row,$index}">
              <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :visible.sync="dialogFormVisible" width="500px" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-card shadow="never">
          <div slot="header">添加AC数据</div>
          <div
            style="display: flex;
            align-items: center;
            justify-content: center;"
          >
            <div>
              <el-form ref="dataForm" :label-position="'top'" :rules="rules" :model="temp">
                <el-form-item label="选择业务" prop="layer2M2MId">
                  <el-select v-model="temp.layer2M2MId" class="filter-item" placeholder="Please select" style="width:300px">
                    <el-option v-for="item in layer2List" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="选择交换机端口" prop="switchId">
                  <el-cascader
                    v-model="temp.switchId"
                    style="width:300px"
                    :options="SwitchOptions"
                    :props="{ expandTrigger: 'hover' }"
                  />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer" style="text-align: left">
                <el-button @click="dialogFormVisible = false">
                  取消
                </el-button>
                <el-button type="primary" @click="createData()">
                  确认
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>

import layer2 from '@/api/internal-network/layer2'
import deviceApi from '@/api/internal-network/device'
import ring from '@/api/internal-network/ring'

export default {
  name: 'IndexAc',
  data() {
    return {
      layer2acList: [],
      layer2List: [],
      ringList: [],
      deviceList: [],
      portList: [],
      dialogFormVisible: false,
      temp: {},
      expandRowKeys: [],
      rules: {
        switchId: [{ required: true, message: 'switchId is required', trigger: 'change' }],
        layer2M2MId: [{ required: true, message: 'layer2M2MId is required', trigger: 'change' }]
      }
    }
  },
  computed: {
    SwitchOptions: function() {
      const t_opt = []
      for (const iDevice of this.deviceList) {
        let t_dis = true
        const t_children = []
        for (const iPort of this.portList) {
          if (iPort.deviceId === iDevice.id) {
            if (!this.layer2acList.some(item => item.switchId === iPort.deviceId && item.portId === iPort.portIndex)) {
              t_children.push({
                value: iPort.portIndex,
                label: iPort.name
              })
            }
          }
        }
        t_dis = !this.ringList.some(ring => ring.switchIds.some(sid => iDevice.id === sid))
        t_opt.push({
          value: iDevice.id,
          label: iDevice.id,
          children: t_children,
          disabled: t_dis || t_children.length === 0
        })
      }
      return t_opt
    }
  },

  created() {
    this.loadResource()
  },

  methods: {
    async loadResource() {
      await this.loadList()
      await this.loadAcList()
      await this.loadRingList()
      await this.loadDeviceList()
      await this.loadPortList()
    },
    async loadDeviceList() {
      this.deviceList = await deviceApi.devices()
    },

    async loadPortList() {
      this.portList = await deviceApi.ports()
    },

    async loadList() {
      this.layer2List = await layer2.layer2GetAll()
    },
    async loadAcList() {
      this.layer2acList = await layer2.layer2GetAllAc()
    },
    async loadRingList() {
      this.ringList = await ring.rings()
    },
    GetM2MNameById(v_id) {
      for (const item of this.layer2List) {
        if (item.id === v_id) {
          return item.name
        }
      }
      return v_id
    },
    handleDelete(row, index) {
      layer2.layer2DelAc(row.id)
      this.layer2acList.splice(index, 1)
    },
    resetTemp() {
      this.temp = {
        layer2M2MId: '',
        switchId: []
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async createData() {
      console.log(this.temp.switchId[1])
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          this.dialogFormVisible = false
          this.layer2acList.push(await layer2.layer2PostAc({
            layer2M2MId: this.temp.layer2M2MId,
            switchId: this.temp.switchId[0],
            portId: this.temp.switchId[1]
          }))
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
