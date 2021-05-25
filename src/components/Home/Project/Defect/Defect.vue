<template>
  <div>
    <el-button type="text" id="new_defect" style="margin-left:1100px" @click="isCreate=true">+ New</el-button>
    <el-card class="defect_card">
      <el-table :data="defectList" style="width: 100% " max-height="560px" @row-click="change">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column
          prop="priority"
          label="优先级"
          align="center"
          width="150"
          :filters="[{ text: '最高', value: '最高' }, { text: '较高', value: '较高' }, { text: '普通', value: '普通' }, { text: '较低', value: '较低' }, { text: '最低', value: '最低' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag :type="pri(scope.row.priority)" disable-transitions>{{scope.row.priority}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" width="180" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" width="180" align="center"></el-table-column>
        <el-table-column prop="stitle" label="所属迭代" width="150" align="center"></el-table-column>
        <el-table-column prop="name" label="负责人" width="150" align="center"></el-table-column>
        <el-table-column
          prop="endDate"
          label="截止日期"
          sortable
          width="210px"
          header-align="center"
          align="center"
          column-key="date"
        ></el-table-column>
        <el-table-column prop="description" label="缺陷描述" width="200" align="center"></el-table-column>
      </el-table>
    </el-card>

    <el-dialog class="form_card" title="Change Defect" :visible.sync="isForm" :modal="false">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="缺陷标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="ruleForm.priority" placeholder="请选择优先级">
            <el-option label="最高" value="最高"></el-option>
            <el-option label="较高" value="较高"></el-option>
            <el-option label="一般" value="一般"></el-option>
            <el-option label="较低" value="较低"></el-option>
            <el-option label="最低" value="最低"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缺陷状态" prop="state" style="float:right;margin-right:20px;margin-top:-65px">
          <el-select v-model="ruleForm.state" placeholder="请选择缺陷状态">
            <el-option label="打开" value="打开"></el-option>
            <el-option label="已确认" value="已确认"></el-option>
            <el-option label="修复中" value="修复中"></el-option>
            <el-option label="已解决" value="已解决"></el-option>
            <el-option label="关闭" value="关闭"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缺陷类型" prop="type" style="float:right;margin-right:20px">
          <el-select v-model="ruleForm.type" placeholder="请选择缺陷类型">
            <el-option label="功能问题" value="功能问题"></el-option>
            <el-option label="性能问题" value="性能问题"></el-option>
            <el-option label="接口问题" value="接口问题"></el-option>
            <el-option label="安全问题" value="安全问题"></el-option>
            <el-option label="UI界面问题" value="UI界面问题"></el-option>
            <el-option label="兼容性问题" value="兼容性问题"></el-option>
            <el-option label="易用性问题" value="易用性问题"></el-option>
            <el-option label="数据问题" value="数据问题"></el-option>
            <el-option label="逻辑问题" value="逻辑问题"></el-option>
            <el-option label="需求问题" value="需求问题"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间" prop="endDate" style="width:490px" required>
          <el-date-picker placeholder="选择日期" v-model="ruleForm.endDate" style="width: 200px;"></el-date-picker>
        </el-form-item>
        <el-form-item label="所属迭代" prop="stitle" style="position:relative; top:-20px">
          <el-select v-model="ruleForm.sprintID" placeholder="请选择所属迭代">
            <el-option
              v-for="item in sprintList"
              :key="item.index"
              :label="item.title"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="name" style="position:relative; top:-20px">
          <el-select v-model="ruleForm.userID" placeholder="请选择负责人">
            <el-option
              v-for="user in userList"
              :key="user.index"
              :label="user.name"
              :value="user.ID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缺陷描述" style="position:relative; top:-20px">
          <el-input type="textarea" v-model="ruleForm.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" style="margin-left:500px">立即更改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog class="form_card" title="Create Defect" :visible.sync="isCreate" :modal="false">
      <el-form
        :model="createForm"
        :rules="rules"
        ref="createForm"
        label-width="100px"
        class="demo-createForm"
      >
        <el-form-item label="缺陷标题" prop="title">
          <el-input v-model="createForm.title"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="createForm.priority" placeholder="请选择优先级">
            <el-option label="最高" value="最高"></el-option>
            <el-option label="较高" value="较高"></el-option>
            <el-option label="一般" value="一般"></el-option>
            <el-option label="较低" value="较低"></el-option>
            <el-option label="最低" value="最低"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缺陷状态" prop="state" style="float:right;margin-right:20px;margin-top:-65px">
          <el-select v-model="createForm.state" placeholder="请选择缺陷状态">
            <el-option label="打开" value="打开"></el-option>
            <el-option label="已确认" value="已确认"></el-option>
            <el-option label="修复中" value="修复中"></el-option>
            <el-option label="已解决" value="已解决"></el-option>
            <el-option label="关闭" value="关闭"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缺陷类型" prop="type" style="float:right;margin-right:20px">
          <el-select v-model="createForm.type" placeholder="请选择缺陷类型">
            <el-option label="功能问题" value="功能问题"></el-option>
            <el-option label="性能问题" value="性能问题"></el-option>
            <el-option label="接口问题" value="接口问题"></el-option>
            <el-option label="安全问题" value="安全问题"></el-option>
            <el-option label="UI界面问题" value="UI界面问题"></el-option>
            <el-option label="兼容性问题" value="兼容性问题"></el-option>
            <el-option label="易用性问题" value="易用性问题"></el-option>
            <el-option label="数据问题" value="数据问题"></el-option>
            <el-option label="逻辑问题" value="逻辑问题"></el-option>
            <el-option label="需求问题" value="需求问题"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间" prop="endDate" style="width:490px" required>
          <el-date-picker placeholder="选择日期" v-model="createForm.endDate" style="width: 200px;"></el-date-picker>
        </el-form-item>
        <el-form-item label="所属迭代" prop="stitle" style="position:relative; top:-20px">
          <el-select v-model="createForm.sprintID" placeholder="请选择所属迭代">
            <el-option
              v-for="item in sprintList"
              :key="item.index"
              :label="item.title"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="name" style="position:relative; top:-20px">
          <el-select v-model="createForm.userID" placeholder="请选择负责人">
            <el-option
              v-for="user in userList"
              :key="user.index"
              :label="user.name"
              :value="user.ID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缺陷描述" style="position:relative; top:-20px">
          <el-input type="textarea" v-model="createForm.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createDefect('createForm')" style="margin-left:500px">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ProjectDefect",
  props: ['projectID'],
  data() {
    return {
      currentID: 0,
      pID: 1,
      isForm: false,
      isCreate: false,
      sprintList: [],
      defectList: [],
      userList:[],
      ruleForm: {},
      createForm: {},
      rules: {
        title: [{ required: true, message: "请输入缺陷标题", trigger: "blur" }],
        priority: [
          { required: true, message: "请选择优先级", trigger: "change" },
        ],
        state: [
          {
            required: true,
            message: "请选择一个缺陷状态",
            trigger: "change",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择一个缺陷类型",
            trigger: "change",
          },
        ],
        endDate: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this.show();
    this.getSprintList();
    this.getUserList();
  },
  watch:{
    projectID(to, from){
      this.pID = this._GLOBAL.ProjectList[to].ID
      this.show()
    }
  },
  methods: {
    change(row) {
      this.isForm = true;
      this.ruleForm = row;
    },
    pri(pri) {
      switch (pri) {
        case "最高":
          return "danger";
        case "较高":
          return "warning";
        case "一般":
          return "success";
        case "较低":
          return "primary";
        case "最低":
          return "info";
      }
    },
    show() {
      this.axios
        .post("/api/defect/getDefListByPID?ID=" + this.pID, {
          emulateJSON: true,
        })
        .then((response) => {
          if (response.data.message == "成功") {
            this.defectList = response.data.data.defectList;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getSprintList() {
      this.axios
        .post("/api/sprint/getSpListByPID?ID=" + this.pID, {
          emulateJSON: true,
        })
        .then((response) => {
          if (response.data.message == "成功") {
            this.sprintList = response.data.data.spList;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getUserList() {
      this.axios
        .get("/api/project/getMemberListByPID?ID=" + this.pID, {
          emulateJSON: true,
        })
        .then((response) => {
          if (response.data.message == "成功") {
            this.userList = response.data.data.memberList;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    filterTag(value, row) {
      return row.priority === value;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
          this.axios
            .post(
              "/api/defect/updateDefByID",
              {
                ID: this.ruleForm.ID,
                title: this.ruleForm.title,
                state: this.ruleForm.state,
                type: this.ruleForm.type,
                priority: this.ruleForm.priority,
                description: this.ruleForm.description,
                endDate: this.ruleForm.endDate,
                sprintID: this.ruleForm.sprintID,
                userID:this.ruleForm.userID
              },
              {
                emulateJSON: true,
              }
            )
            .then((response) => {
              if (response.data.message == "成功") {
                this.isForm = false;
                this.show();
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    createDefect(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
          this.axios
            .post(
              "/api/defect/createDefect",
              {
                title: this.createForm.title,
                state: this.createForm.state,
                type: this.createForm.type,
                priority: this.createForm.priority,
                description: this.createForm.description,
                endDate: this.createForm.endDate,
                projectID: this.pID,
                sprintID: this.createForm.sprintID,
                userID:this.ruleForm.userID
              },
              {
                emulateJSON: true,
              }
            )
            .then((response) => {
              if (response.data.message == "成功") {
                this.show();
                this.isCreate = false;
                this.createForm = [];
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    taskListName(pri){
      switch(pri){
        case"最高":return "taskHighest";
        case"较高":return "taskHigher";
        case"一般":return "taskCommon";
        case"较低":return "taskLower";
        case"最低":return "taskLowest";
      }
    }
  },
}
</script>


<style>
.defect_card {
  margin: 0px 24px 24px 24px;
  overflow-y: auto;
  height: 600px;
}
.form_card {
  margin: 0px 24px 24px 24px;
  margin: auto;
}
</style>
