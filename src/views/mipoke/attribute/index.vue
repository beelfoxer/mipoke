<template>
  <div>
    <el-card shadow="never">
      <div slot="header" style="display:flex;align-items:center">
        <div style="width:50%">Pokemon</div>
        <div style="width:50%;text-align: right;">
          <el-input placeholder="新属性名称" style="width: 150px"/>
          <el-button @click="handleCreate()">新增</el-button>
          <el-button @click="handleSubmit()">提交</el-button>
        </div>
      </div>
      <div>
        <el-table
          class="tableBox"
          border
          stripe
          style="width: 100%"
          :data="attributeTable"
        >
          <el-table-column label="名称" prop="name" min-width="40px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>

          <template v-for="item in attributeList">
            <el-table-column :key="item.id" label="item" prop="name" min-width="40px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          </template>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>

import mipoke from '@/api/mipoke/mipoke'

export default {
  name: 'Index',
  data() {
    return {
      attributeList: [],
      attributeTable: [],
      query: {
        table: 'attribute'
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
    },

    async loadList() {
      this.pokemonList = this.praseRaceValue(await mipoke.mipokeQuery(this.query))
    },
    handleDelete(row, index) {
      mipoke.mipokeUpdate({ table: 'pokemon', data: { id: row.id, status: 0 }})
      this.pokemonList.splice(index, 1)
    },
    handleCreate() {
      this.resetTemp()
      this.FormStatus = 0
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async createData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          this.dialogFormVisible = false
          this.pokemonList.push(await mipoke.mipokeUpdate({ table: 'pokemon', data: this.temp }))
        }
      })
    },
    handleUpdate(row, index) {
      this.temp = Object.assign({}, row)
      this.FormStatus = 1
      this.updateIndex = index
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async updateData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          this.dialogFormVisible = false
          this.pokemonList[this.updateIndex] = await mipoke.mipokeUpdate({ table: 'pokemon', data: this.temp })
        }
      })
    }

  }
}
</script>

<style lang='scss'>
.tableBox {
  th{
    padding:0 !important;;
    height: 28px;
    line-height: 28px;
  }
  tr{
    padding:0 !important;;
    height: 28px;
    line-height: 28px;
  }
  td{
    padding:0 !important;;
    height: 28px;
    line-height: 28px;
  }
  td .cell{
    padding:0 !important;;
  }
}
</style>
