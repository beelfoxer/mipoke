<template>
  <div>
    <el-card shadow="never">
      <div slot="header" style="display:flex;align-items:center">
        <div style="width:20%">Pokemon</div>
        <div style="width:30%"><el-switch
          v-model="query.showAbility"
          style="display: block"
          active-color="#44cc55"
          inactive-color="red"
          active-text="show"
          inactive-text="hide"
        /></div>  <div style="width:30%">
          <el-input v-model="query.searchInfo" style="width:160px" />
          <el-button @click="loadList()">查找</el-button>
        </div>
        <div style="width:20%;text-align: right;"><el-button @click="handleCreate()">新增</el-button></div>
      </div>
      <div>
        <el-table
          class="tableBox"
          border
          stripe
          style="width: 100%"
          :data="pokemonList"
        >
          <el-table-column label="编号" prop="vpid" min-width="20px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.vpid }}</span>
            </template>
          </el-table-column>

          <el-table-column label="名称" prop="name" min-width="40px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="形态" prop="type" min-width="80px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.type }}</span>
            </template>
          </el-table-column>

          <el-table-column label="属性" prop="attribute" width="92px" align="center" style="padding: 0">
            <template slot-scope="{row}">
              <el-tag :color="'Red'" style="width:45px;padding:0;text-align: center" effect="dark">{{ row.attribute1 }}</el-tag>
              <el-tag v-if="row.attribute2" :color="'green'" style="width:45px;padding:0;text-align: center" effect="dark">{{ row.attribute2 }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="all" prop="all" min-width="30px" align="center">
            <template slot-scope="{row}">
              <span>{{ sumList(row.racevalue) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="query.showAbility" label="hp" prop="hp" min-width="30px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.racevalue[0] }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="query.showAbility" label="atk" prop="atk" min-width="30px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.racevalue[1] }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="query.showAbility" label="def" prop="def" min-width="30px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.racevalue[2] }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="query.showAbility" label="sat" prop="sat" min-width="30px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.racevalue[3] }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="query.showAbility" label="sde" prop="sde" min-width="30px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.racevalue[4] }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="query.showAbility" label="spd" prop="spd" min-width="30px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.racevalue[5] }}</span>
            </template>
          </el-table-column>

          <el-table-column label="特性1" prop="feature1" min-width="40px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.feature1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="特性2" prop="feature2" min-width="40px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.feature2 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="隐藏特性" prop="feature3" min-width="40px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.feature3 }}</span>
            </template>
          </el-table-column>

          <el-table-column label="备注" prop="mark" min-width="80px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.mark }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="80px" align="center">
            <template slot-scope="{row,$index}">
              <el-button size="mini" type="info" @click="handleUpdate(row,$index)">
                修改
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :visible.sync="dialogFormVisible" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-card shadow="never">
          <div slot="header">{{ FormStatus==0?"新增":"修改" }}</div>
          <div>
            <el-form ref="dataForm" :inline="true" :label-position="'right'" label-width="70x" :rules="rules" :model="temp">
              <el-form-item label="编号" prop="vpid">
                <el-input v-model.number="temp.vpid" style="width:450px" />
              </el-form-item>
              <el-form-item label="名称" prop="name">
                <el-input v-model="temp.name" style="width:450px" />
              </el-form-item>
              <el-form-item label="属性" prop="attribute">
                <el-select v-model="temp.attribute1" class="filter-item" placeholder="Please select" style="width:150px">
                  <el-option v-for="item in 18" :key="item" :label="item" :value="item" />
                </el-select>
                {{ " " }}
                <el-select v-model="temp.attribute2" class="filter-item" placeholder="Please select" style="width:150px">
                  <el-option v-for="item in 18" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item label="形态" prop="type">
                <el-input v-model="temp.type" style="width:450px" />
              </el-form-item>
              <el-form-item label="生命" prop="HP">
                <el-input v-model.number="temp.racevalue[0]" style="width:100%" />
              </el-form-item>
              <el-form-item label="物攻" prop="ATK">
                <el-input v-model.number="temp.racevalue[1]" style="width:100%" />
              </el-form-item>
              <el-form-item label="物防" prop="DEF">
                <el-input v-model.number="temp.racevalue[2]" style="width:100%" />
              </el-form-item>
              <el-form-item label="特攻" prop="SAT">
                <el-input v-model.number="temp.racevalue[3]" style="width:100%" />
              </el-form-item>
              <el-form-item label="特防" prop="SDE">
                <el-input v-model.number="temp.racevalue[4]" style="width:100%" />
              </el-form-item>
              <el-form-item label="速度" prop="SPD">
                <el-input v-model.number="temp.racevalue[5]" style="width:100%" />
              </el-form-item>
              <el-form-item label="特性" prop="feature">
                <el-input v-model="temp.feature1" style="width:48%" placeholder="特性1" />{{ " " }}
                <el-input v-model="temp.feature2" style="width:48%" placeholder="特性2" />
              </el-form-item>
              <el-form-item label="隐藏特性" prop="feature">
                <el-input v-model="temp.feature3" style="width:100%" placeholder="隐藏特性" />
              </el-form-item>
              <el-form-item label="备注" prop="mark">
                <el-input v-model="temp.mark" style="width:450px" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center">
              <el-button @click="dialogFormVisible = false">
                取消
              </el-button>
              <el-button type="primary" @click="FormStatus==0?createData():updateData()">
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

import mipoke from '@/api/mipoke/mipoke'

export default {
  name: 'Index',
  data() {
    return {
      pokemonList: [],
      FormStatus: '',
      updateIndex: 0,
      dialogFormVisible: false,
      temp: { racevalue: new Array(6) },
      query: {
        table: 'pokemon',
        attribute: '',
        showAbility: false,
        searchInfo: ''
      },
      rules: {}
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
    praseRaceValue(v_list) {
      for (const item of v_list) {
        item.racevalue = JSON.parse(item.racevalue)
      }
      return v_list
    },
    sumList(v_list) {
      let sum = 0
      for (const i of v_list) {
        sum += Number(i)
      }
      return sum
    },
    handleDelete(row, index) {
      mipoke.mipokeUpdate({ table: 'pokemon', data: { id: row.id, status: 0 }})
      this.pokemonList.splice(index, 1)
    },
    resetTemp() {
      this.temp = {
        id: 0,
        status: 1,
        racevalue: new Array(6)
      }
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
