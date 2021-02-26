<template>
  <div>
    <el-card shadow="never">
      <div slot="header" style="display:flex;align-items:center">
        <div style="width:50%">MSTP管理</div>
        <div style="width:50%;text-align: right">
          <el-button :disabled="mstpList.length>=16" @click="handleCreate()">添加MSTP</el-button>
        </div>
      </div>
      <div>
        <el-table
          border
          style="width: 100%"
          :data="mstpList"
        >
          <el-table-column label="instance" prop="instance" min-width="80px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.instance }}</span>
            </template>
          </el-table-column>

          <el-table-column label="vlan" prop="vlan" min-width="80px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.vlan }}</span>
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
          <div slot="header">添加MSTP数据</div>
          <div>
            <el-form ref="dataForm" :label-position="'top'" :rules="rules" :model="temp">
              <el-form-item label="instance" prop="instance">
                <el-input v-model.number="temp.instance" />
              </el-form-item>
              <el-form-item label="vlan">
                <el-switch
                  v-model="temp.vlanBeRange"
                  style="display: block"
                  active-color="#13ce66"
                  inactive-color="#77ce13"
                  active-text="选择范围"
                  inactive-text="选择单个"
                />
              </el-form-item>
              <div
                style="display: flex;
                   align-items: center;
                   justify-content: left"
              >
                <el-form-item prop="vlanStart">
                  <el-input v-model.number="temp.vlanStart" :style="{'width':(temp.vlanBeRange?'98%':'204%')}" :placeholder="temp.vlanBeRange?'初始值':'vlan值'" />
                </el-form-item>
                <el-form-item v-if="temp.vlanBeRange" prop="vlanEnd">
                  <template>{{ " - " }}</template>
                  <el-input v-model.number="temp.vlanEnd" style="width:96%" placeholder="结束值" />
                </el-form-item>
              </div>
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

import mstp from '@/api/internal-network/mstp'

export default {
  name: 'Index',
  data() {
    const validInstance = (rule, value, callback) => {
      if (value === '' || typeof (value) !== 'number') {
        callback(new Error('请输入1至16之间的数字'))
      } else if (value < 1 || value > 16) {
        callback(new Error('输入值需介于1至16之间'))
      } else if (this.mstpList.some(item => value === item.instance)) {
        callback(new Error('不能重复'))
      } else {
        callback()
      }
    }
    const validStart = (rule, value, callback) => {
      if (value === '' || typeof (value) !== 'number') {
        callback(new Error('请输入vlan值介于2至4000之间'))
      } else if (value < 2 || value > 4000) {
        callback(new Error('输入值必需介于2至4000之间'))
      } else if (this.checkVlanRangeRepeat()) {
        callback(new Error('不能重复'))
      } else {
        callback()
      }
    }
    const validEnd = (rule, value, callback) => {
      if (value === '' || typeof (value) !== 'number') {
        callback(new Error('请输入vlan值介于2至4000之间'))
      } else if (value <= this.temp.vlanStart || value > 4000) {
        callback(new Error(`输入值必需介于${this.temp.vlanStart}至4000之间`))
      } else if (this.checkVlanRangeRepeat()) {
        callback(new Error('不能重复'))
      } else {
        callback()
      }
    }
    return {
      mstpList: [],
      dialogFormVisible: false,
      temp: {},
      rules: {
        instance: [{ required: true, validator: validInstance, trigger: 'blur' }],
        vlanStart: [{ required: true, validator: validStart, trigger: 'blur' }],
        vlanEnd: [{ required: true, validator: validEnd, trigger: 'blur' }]
      }
    }
  },
  computed: {},

  created() {
    this.loadResource()
  },

  methods: {
    async loadResource() {
      await this.loadMstpList()
    },
    async loadMstpList() {
      this.mstpList = await mstp.mstpGetAll()
    },
    handleDelete(row, index) {
      mstp.mstpDel(row.id)
      this.mstpList.splice(index, 1)
    },
    checkVlanRangeRepeat() {
      const t_s = this.temp.vlanStart
      const t_e = this.temp.vlanBeRange ? this.temp.vlanEnd : t_s
      return this.mstpList.some(item => {
        let t_rs = item.vlan
        let t_re = item.vlan
        if (typeof (item.vlan) === 'string' && item.vlan.includes('-')) {
          const t_r = item.vlan.split('-')
          t_rs = t_r[0]
          t_re = t_r[1]
        }
        return t_s <= t_re && t_rs <= t_e
      })
    },
    resetTemp() {
      this.temp = {
        instance: '',
        vlanStart: '',
        vlanEnd: '',
        vlanBeRange: false
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
          this.mstpList.push(await mstp.mstpPost({
            instance: this.temp.instance,
            vlan: this.temp.vlanBeRange ? this.temp.vlanStart + '-' + this.temp.vlanEnd : this.temp.vlanStart
          }))
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
