<template>
  <div>
    <el-button type="text" id="new_reqt" style="margin-left:1100px" @click="isCreate=true">+ New</el-button>
    <el-card class="reqt_card">
      <el-table :data="reqtList" style="width: 100% " max-height="560px" @row-click="change">
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
        <el-table-column prop="kind" label="分类" width="180" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" width="180" align="center"></el-table-column>
        <el-table-column prop="stitle" label="所属迭代" width="150" align="center"></el-table-column>
        <el-table-column
          prop="endDate"
          label="截止日期"
          sortable
          width="220px"
          header-align="center"
          align="center"
          column-key="date"
        ></el-table-column>
        <el-table-column prop="description" label="需求描述" width="200" align="center"></el-table-column>
        <el-table-column fixed="right" label="任务列表" width="100" align="center">
          <template slot-scope="scope">
            <el-button @click.native.stop="showTaskList(scope.row.ID)" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog class="form_card" title="Change Requirement" :visible.sync="isForm" :modal="false">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="需求标题" prop="title">
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
        <el-form-item
          label="需求分类"
          prop="kind"
          style="float:right; margin-top:-70px;margin-right:20px"
        >
          <el-select v-model="ruleForm.kind" placeholder="请选择需求分类">
            <el-option label="技术需求" value="技术需求"></el-option>
            <el-option label="功能需求" value="功能需求"></el-option>
            <el-option label="安全需求" value="安全需求"></el-option>
            <el-option label="性能需求" value="性能需求"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需求类型" prop="type" style="float:right;margin-right:20px">
          <el-select v-model="ruleForm.type" placeholder="请选择需求类型">
            <el-option label="新功能" value="新功能"></el-option>
            <el-option label="功能优化" value="功能优化"></el-option>
            <el-option label="交互优化" value="交互优化"></el-option>
            <el-option label="视觉优化" value="视觉优化"></el-option>
            <el-option label="其他" value="其他"></el-option>
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
        <el-form-item label="需求描述" style="position:relative; top:-20px">
          <el-input type="textarea" v-model="ruleForm.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" style="margin-left:500px">立即更改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog class="form_card" title="Create Requirement" :visible.sync="isCreate" :modal="false">
      <el-form
        :model="createForm"
        :rules="rules"
        ref="createForm"
        label-width="100px"
        class="demo-createForm"
      >
        <el-form-item label="需求标题" prop="title">
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
        <el-form-item
          label="需求分类"
          prop="kind"
          style="float:right; margin-top:-65px;margin-right:20px"
        >
          <el-select v-model="createForm.kind" placeholder="请选择需求分类">
            <el-option label="技术需求" value="技术需求"></el-option>
            <el-option label="功能需求" value="功能需求"></el-option>
            <el-option label="安全需求" value="安全需求"></el-option>
            <el-option label="性能需求" value="性能需求"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需求类型" prop="type" style="float:right;margin-right:20px">
          <el-select v-model="createForm.type" placeholder="请选择需求类型">
            <el-option label="新功能" value="新功能"></el-option>
            <el-option label="功能优化" value="功能优化"></el-option>
            <el-option label="交互优化" value="交互优化"></el-option>
            <el-option label="视觉优化" value="视觉优化"></el-option>
            <el-option label="其他" value="其他"></el-option>
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
        <el-form-item label="需求描述" style="position:relative; top:-20px">
          <el-input type="textarea" v-model="createForm.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createReqt('createForm')" style="margin-left:500px">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="Task List" :visible.sync="isTask" :modal="false">
      <el-collapse>
        <el-collapse-item v-for="(task,index) in taskList" :key="index">
          <template slot="title">
            <div :class="taskListName(task.priority)">
              <span
                :class="taskListFont(task.priority)"
                style="font-size:15px;margin-left:20px;margin-right:10px;font: bold 15px '微软雅黑', 'Arial';"
              >{{task.title}}</span>
              <i class="header-icon el-icon-info"></i>
            </div>
          </template>
          <el-row style="margin-left:35px;margin-top:10px;font: bold 15px '微软雅黑'">
            <el-col :span="12">
              <div class="grid-content bg-purple">状态：{{task.state}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">负责人：{{task.username}}</div>
            </el-col>
          </el-row>
          <el-row style="margin-left:35px;font: bold 15px '微软雅黑'">
            <el-col :span="24">
              <div class="grid-content bg-purple-dark">描述：{{task.description}}</div>
            </el-col>
          </el-row>
          <el-row style="margin-left:35px;font: bold 15px '微软雅黑'">
            <el-col :span="12">
              <div class="grid-content bg-purple">开始日期:{{task.startDate}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">截止日期：{{task.endDate}}</div>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ProjectRequire",
  props: ["projectID"],
  data() {
    return {
      currentID: 0,
      pID: 1,
      isForm: false,
      isCreate: false,
      isTask: false,
      sprintList: [],
      reqtList: [],
      ruleForm: {},
      createForm: {},
      taskList: {
        title: "",
        state: "",
        description: "",
        startDate: "",
        endDate: "",
        priority: "",
        sprintTitle: "",
        username: "",
      },
      rules: {
        title: [{ required: true, message: "请输入需求标题", trigger: "blur" }],
        priority: [
          { required: true, message: "请选择优先级", trigger: "change" },
        ],
        kind: [
          {
            required: true,
            message: "请选择一个需求分类",
            trigger: "change",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择一个需求类型",
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
  },
  watch: {
    projectID(to, from) {
      this.pID = this._GLOBAL.ProjectList[to].ID;
      this.show();
    },
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
        .post("/api/requirement/getReqtListByPID?ID=" + this.pID, {
          emulateJSON: true,
        })
        .then((response) => {
          if (response.data.message == "成功") {
            this.reqtList = response.data.data.reqtList;
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
    showTaskList(id) {
      this.axios
        .get("/api/task/getTaskListByRid?reqtid=" + id, {
          emulateJSON: true,
        })
        .then((response) => {
          if (response.data.message == "成功") {
            this.taskList = response.data.data.task;
            this.isTask = true;
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
              "/api/requirement/updateReqtByID",
              {
                ID: this.ruleForm.ID,
                title: this.ruleForm.title,
                kind: this.ruleForm.kind,
                type: this.ruleForm.type,
                priority: this.ruleForm.priority,
                description: this.ruleForm.description,
                endDate: this.ruleForm.endDate,
                sprintID: this.ruleForm.sprintID,
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
    createReqt(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
          this.axios
            .post(
              "/api/requirement/createReqt",
              {
                title: this.createForm.title,
                kind: this.createForm.kind,
                type: this.createForm.type,
                priority: this.createForm.priority,
                description: this.createForm.description,
                endDate: this.createForm.endDate,
                projectID: this.pID,
                sprintID: this.createForm.sprintID,
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
    taskListName(pri) {
      switch (pri) {
        case "最高":
          return "taskHighest";
        case "较高":
          return "taskHigher";
        case "一般":
          return "taskCommon";
        case "较低":
          return "taskLower";
        case "最低":
          return "taskLowest";
      }
    },
    taskListFont(pri) {
      switch (pri) {
        case "最高":
          return "fontHighest";
        case "较高":
          return "fontHigher";
        case "一般":
          return "fontCommon";
        case "较低":
          return "fontLower";
        case "最低":
          return "fontLowest";
      }
    },
  },
};
</script>

<style>
.reqt_card {
  margin: 0px 24px 24px 24px;
  overflow-y: auto;
  height: 600px;
}
.form_card {
  margin: 0px 24px 24px 24px;
  margin: auto;
}
.taskCommon {
  width: 100%;
  background: -webkit-linear-gradient(left, #b6f199, #e1f3d8, #f0f9eb, white);
  background: #ebfae3;
  border-radius: 5px;
  border: 0.2px solid;
  border-color: rgba(174, 214, 151, 0.774);
}
.taskHigher {
  width: 100%;
  /* background: -webkit-linear-gradient(left, #f5da81, #faecd8, #fdf6ec, white); */
  background: #ffe2b7;
  border-radius: 5px;
  border: 0.2px solid;
  border-color: rgba(236, 219, 121, 0.904);
}
.taskHighest {
  width: 100%;
  background: #ffd8d8;
  border-radius: 5px;
  border: 0.2px solid;
  border-color: rgb(253, 175, 175);
}
.taskLower {
  width: 100%;
  background: #dfeefd;
  border-radius: 5px;
  border: 0.2px solid;
  border-color: rgb(175, 209, 253);
}
.taskLowest {
  width: 100%;
  background: #f1f1f1;
  border-radius: 5px;
  border: 0.2px solid;
  border-color: rgb(165, 165, 165);
}

.fontCommon {
  color: #6ec742;
}
.fontHigher {
  color: #e6a23c;
}
.fontHighest {
  color: #f56c6c;
}
.fontLower {
 color:#409EFF;
}
.fontLowest {
  color:#909399;
}
</style>
