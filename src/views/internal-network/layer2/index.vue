<template>
  <div>
    <el-card shadow="never">
      <div slot="header" style="display:flex;align-items:center">
        <div style="width:50%">业务管理</div>
        <div style="width:50%;text-align: right;"><el-button @click="handleCreate()">添加业务</el-button></div>
      </div>
      <div>
        <el-table
          border
          style="width: 100%"
          :data="layer2list"
        >
          <el-table-column label="名称" prop="name" min-width="80px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="mstp信息" prop="mstpId" min-width="80px" align="center">
            <template slot-scope="{row}">
              <span>{{ GetMstpInfoById(row.mstpId) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="vlanId" prop="vlanId" min-width="80px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.vlanId }}</span>
            </template>
          </el-table-column>

          <el-table-column label="带宽" prop="bandwidth" min-width="80px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.bandwidth }}</span>
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
      <el-dialog :visible.sync="dialogFormVisible" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-card shadow="never">
          <div slot="header">添加业务数据</div>
          <div>
            <el-form ref="dataForm" :label-position="'top'" :rules="rules" :model="temp">
              <el-form-item label="名称" prop="name">
                <el-input v-model="temp.name" />
              </el-form-item>
              <el-form-item label="选择mstp" prop="mstpId">
                <el-select v-model="temp.mstpId" class="filter-item" placeholder="Please select">
                  <el-option v-for="item in mstpList" :key="item.id" :label="item.instance+':'+item.vlan" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="vlanId" prop="vlanId">
                <el-input v-model.number="temp.vlanId" />
              </el-form-item>
              <el-form-item label="带宽" prop="bandwidth">
                <el-input v-model.number="temp.bandwidth" />
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
        </el-card>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>

import layer2 from '@/api/internal-network/layer2'
import mstp from '@/api/internal-network/mstp'

export default {
  name: 'Index',
  data() {
    const validWidth = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入'))
      } else if (value <= 0) {
        callback(new Error('输入值需大于0'))
      } else {
        callback()
      }
    }
    const validVlan = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入'))
      } else if (this.layer2list.some(item => item.vlanId === value)) {
        callback(new Error('vlanId不能重复'))
      } else {
        for (const item of this.mstpList) {
          if (item.id === this.temp.mstpId) {
            let t_min = item.vlan
            let t_max = item.vlan
            if (typeof (item.vlan) === 'string' && item.vlan.includes('-')) {
              const t_list = item.vlan.split('-')
              t_min = t_list[0]
              t_max = t_list[1]
            }
            if (value < t_min || value > t_max) {
              callback(new Error(`输入值需介于${t_min}至${t_max}之间`))
              return
            } else {
              callback()
              return
            }
          }
        }
        callback(new Error('mstp未选择'))
      }
    }
    const validName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入名称'))
      } else if (this.layer2list.some(item => item.name === value)) {
        callback(new Error('名称不能重复'))
      } else {
        callback()
      }
    }
    return {
      layer2list: [],
      mstpList: [],
      dialogFormVisible: false,
      temp: {},
      rules: {
        bandwidth: [{ required: true, validator: validWidth, trigger: 'blur' }],
        name: [{ required: true, validator: validName, trigger: 'blur' }],
        vlanId: [{ required: true, validator: validVlan, trigger: 'blur' }],
        mstpId: [{ required: true, message: 'mstpId is required', trigger: 'change' }]
      }
    }
  },
  computed: {},

  created() {
    this.loadResource()
  },

  methods: {
    async loadResource() {
      await this.loadList()
      await this.loadMstpList()
    },

    async loadList() {
      this.layer2list = await layer2.layer2GetAll()
    },
    async loadMstpList() {
      this.mstpList = await mstp.mstpGetAll()
    },
    handleDelete(row, index) {
      layer2.layer2Del(row.id)
      this.layer2list.splice(index, 1)
    },
    GetMstpInfoById(v_id) {
      for (const item of this.mstpList) {
        if (v_id === item.id) {
          return item.instance + ' (' + item.vlan + ')'
        }
      }
      return 'No info'
    },
    resetTemp() {
      this.temp = {
        mstpId: '',
        name: '',
        vlanId: '',
        bandwidth: 1000
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
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          this.dialogFormVisible = false
          this.layer2list.push(await layer2.layer2Post(this.temp))
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
