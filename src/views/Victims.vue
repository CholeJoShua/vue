<template>
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入姓名" suffix-icon="el-icon-search" v-model="name">
      </el-input>
      <el-input style="width: 200px" placeholder="请输入身份证号" suffix-icon="el-icon-message" class="ml-5" v-model="idCard">
      </el-input>
      <!-- <el-input style="width: 200px" placeholder="请输入邮箱" suffix-icon="el-icon-message" class="ml-5"
                v-model="email"></el-input>
            <el-input style="width: 200px" placeholder="请输入地址" suffix-icon="el-icon-position" class="ml-5"
                v-model="address"></el-input> -->
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd" v-if="user.role === 'ROLE_ADMIN'">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
      <el-popconfirm class="ml-5" confirm-button-text='确定' cancel-button-text='我再想想' icon="el-icon-info"
        icon-color="red" title="您确定批量删除这些数据吗？" @confirm="delBatch" v-if="user.role === 'ROLE_ADMIN'">
        <el-button type="danger" slot="reference">批量删除 <i class="el-icon-remove-outline"></i></el-button>
      </el-popconfirm>
      <el-upload action="http://localhost:9090/victims/import" :show-file-list="false" accept="xlsx"
        :on-success="handleExcelImportSuccess" style="display: inline-block">
        <el-button type="primary" class="ml-5" v-if="user.role === 'ROLE_ADMIN'">导入 <i class="el-icon-bottom"></i></el-button>
      </el-upload>
      <el-button type="primary" @click="exp" class="ml-5" v-if="user.role === 'ROLE_ADMIN'">导出 <i class="el-icon-top"></i></el-button>
    </div>

    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="姓名" width="140"></el-table-column>
      <!-- <el-table-column prop="sex" label="性别"></el-table-column> -->
      <el-table-column prop="idCard" label="身份证号"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="isRescue" label="是否抢救"></el-table-column>
      <el-table-column prop="date" label="遇难时间"></el-table-column>
      <el-table-column prop="isContact" label="是否与其家人取得联系"></el-table-column>
      



      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="success" @click="handleEdit(scope.row)" v-if="user.role === 'ROLE_ADMIN'">编辑 <i class="el-icon-edit"></i></el-button>
          <el-popconfirm class="ml-5" confirm-button-text='确定' cancel-button-text='我再想想' icon="el-icon-info"
            icon-color="red" title="您确定删除吗？" @confirm="del(scope.row.id)">
            <el-button type="danger" slot="reference" v-if="user.role === 'ROLE_ADMIN'">删除 <i class="el-icon-remove-outline"></i></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
        :page-sizes="[2, 5, 10, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog title="遇难人员信息" :visible.sync="dialogFormVisible" width="40%">
      <el-form label-width="160px" size="small">
        <el-form-item label="姓名">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="性别">
          <el-select v-model="form.sex" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="身份证号">
          <el-input v-model="form.idCard" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="年龄">
          <el-input v-model="form.age" autocomplete="off"></el-input>
        </el-form-item>
       
        <el-form-item label="是否抢救">
          <el-radio v-model="form.isRescue" label="是">是</el-radio>
          <el-radio v-model="form.isRescue" label="否">否</el-radio>
        </el-form-item>

        <el-form-item label="是否与其家人取得联系">
          <el-radio v-model="form.isContact" label="是">是</el-radio>
          <el-radio v-model="form.isContact" label="否">否</el-radio>
        </el-form-item>
      
        <el-form-item label="遇难时间">
            <el-date-picker v-model="form.date" value-format="yyyy-MM-dd" type="date" placeholder="选择日期时间" clearable>
            </el-date-picker>
        </el-form-item>

        


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Victims",
    data() {
      return {
        user:{},
        tableData: [],
        total: 0,
        pageNum: 1,
        pageSize: 10,
        name: "",
        idCard:"",
        // email: "",
        // address: "",
        form: {},
        dialogFormVisible: false,
        multipleSelection: [],
        roles: [],
        options: [
          { value: '男', label: '男' },
          { value: '女', label: '女' },
          { value: '未知', label: '未知' }
        ],
       
      }
    },
    created() {
      let userStr = localStorage.getItem("user") || "{}"
      this.user = JSON.parse(userStr)
      this.load()
    },
    methods: {
      load() {
        this.request.get("/victims/page", {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            name: this.name,
            idCard:this.idCard
          }
        }).then(res => {
          // console.log(res)
          this.tableData = res.data.records
          this.total = res.data.total
        })

        this.request.get("/role").then(res => {
          this.roles = res.data
        })
      },
      save() {
        this.request.post("/victims", this.form).then(res => {
          if (res.code === '200') {
            this.$message.success("保存成功")
            this.dialogFormVisible = false
            this.load()
          } else {
            this.$message.error("保存失败")
          }
        })
      },
      handleAdd() {
        this.dialogFormVisible = true
        this.form = {}
      },
      handleEdit(row) {
        this.form = row
        this.dialogFormVisible = true
      },
      del(id) {
        this.request.delete("/victims/" + id).then(res => {
          if (res.code === '200') {
            this.$message.success("删除成功")
            this.load()
          } else {
            this.$message.error("删除失败")
          }
        })
      },
      handleSelectionChange(val) {
        // console.log(val)
        this.multipleSelection = val
      },
      delBatch() {
        let ids = this.multipleSelection.map(v => v.id)  // [{}, {}, {}] => [1,2,3]
        this.request.post("/victims/del/batch", ids).then(res => {
          if (res.code === '200') {
            this.$message.success("批量删除成功")
            this.load()
          } else {
            this.$message.error("批量删除失败")
          }
        })
      },
      reset() {
        this.name = ""
        this.idCard = ""
        // this.email = ""
        // this.address = ""
        this.load()
      },
      handleSizeChange(pageSize) {
        // console.log(pageSize)
        this.pageSize = pageSize
        this.load()
      },
      handleCurrentChange(pageNum) {
        // console.log(pageNum)
        this.pageNum = pageNum
        this.load()
      },
      exp() {
        window.open("http://localhost:9090/victims/export")
      },
      handleExcelImportSuccess() {
        this.$message.success("导入成功")
        this.load()
      },
    }
  }
</script>


<style>
  .headerBg {
    background: #eee !important;
  }
</style>