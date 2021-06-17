<template>
  <div>
    <el-button type="text" id="new_task" style="margin-left:1100px" @click="create">
      + New
    </el-button>
    <el-card class="task_card">
      <el-table :data="taskList" style="width: 100% ; height: 1080px" @row-click="change">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="ID" label="任务编号" width="180" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" width="180" align="center"></el-table-column>
        <el-table-column prop="title" label="标题" width="180" align="center"></el-table-column>
        <el-table-column prop="username" label="负责人" width="180" align="center"></el-table-column>
        <el-table-column
          prop="priority"
          label="优先级"
          align="center"
          width="150"
          :filters="[{ text: '最高', value: '最高' }, { text: '较高', value: '较高' }, { text: '普通', value: '普通' }, { text: '较低', value: '较低' }, { text: '最低', value: '最低' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag :type="pri(scope.row.priority)" disable-transitions>{{scope.row.priority}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sprintTitle" label="所属迭代" width="150" align="center"></el-table-column>
        <el-table-column
          prop="endDate"
          label="截止日期"
          sortable
          width="220px"
          header-align="center"
          align="center"
          column-key="date"
        ></el-table-column>
        <el-table-column prop="description" label="任务描述" width="200" align="center"></el-table-column>
      </el-table>
    </el-card>


    <el-dialog class="form_card" title="Change Taskinfo"
      :visible.sync="isForm"
      :modal="false">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="任务标题" prop="title">
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
        <el-form-item label="起始时间" prop="startDate" style="width:600px" required>
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="ruleForm.startDate"
              style="width: 100%;"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="截止时间" prop="endDate" style="width:600px;float:right; margin-top:-62px;margin-right:-205px" required>
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="ruleForm.endDate"
              style="width: 100%;"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item
          label="状态" prop="state" style="float:right; margin-top:-125px;margin-right:70px" required>
          <el-select v-model="ruleForm.state" placeholder="请选择任务状态">
            <el-option label="未开始" value="未开始"></el-option>
            <el-option label="进行中" value="进行中"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属迭代" prop="stitle">
          <el-select v-model="ruleForm.sprintID" placeholder="请选择所属迭代">
            <el-option v-for="item in sprintList" :key="item.index" :value="item.ID" :label="item.title"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定需求" prop="pname" style="float:right; margin-top:-62px;margin-right:70px">
          <el-select v-model="ruleForm.reqtID" placeholder="请选择要绑定的需求">
            <el-option v-for="item in reqtList" :key="item.index" :value="item.ID" :label="item.title"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input type="textarea" v-model="ruleForm.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即更改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog class="form_card" title="create new task" :visible.sync="tocreate" :modal="false">
      <el-form :model="createForm" :rules="createrules" ref="createruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="任务标题" prop="title" required>
          <el-input v-model="createForm.title"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority" required>
          <el-select v-model="createForm.priority" placeholder="请选择优先级">
            <el-option label="最高" value="最高"></el-option>
            <el-option label="较高" value="较高"></el-option>
            <el-option label="一般" value="一般"></el-option>
            <el-option label="较低" value="较低"></el-option>
            <el-option label="最低" value="最低"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="state" style="float:right; margin-top:-62px;margin-right:70px" required>
          <el-select v-model="createForm.state" placeholder="请选择任务状态">
            <el-option label="未开始" value="未开始"></el-option>
            <el-option label="进行中" value="进行中"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始时间" prop="startDate" style="width:600px" required>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="createForm.startDate" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd">></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="截止时间" prop="endDate" style="width:600px;float:right; margin-top:-62px;margin-right:-205px" required>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="createForm.endDate" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd">></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input type="textarea" v-model="createForm.description"></el-input>
        </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="tocreate = false">取 消</el-button>
          <el-button type="primary" @click="createtask">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
import progresslist from './progresslist.vue'
export default{
  name: 'ProjectProgress',
    components: {
    'progress-list': progresslist,
  },
  props: ['projectID'],
  data() {
    return {
      // pickerOptions: {
      //   disabledDate(time) {
      //   return time.getTime() > Date.now();
      //   },
      // },
      userID: 2,
      pID: 1,
      isForm: false,
      tocreate: false,
      sprintList: [],
      taskList: [],
      ruleForm: {},
      sprintList:{},
      reqtList:[],
      createForm: {
        userID:1,
        title:"",
        state:"未开始",
        priority:"一般",
        startDate:"2021-01-13",
        endDate:"2021-01-14",
        description:"",
        projectID:1,
        sprintID:1,
        reqtID:6
      },
      rules: {
        title: [{ required: true, message: "请输入需求标题", trigger: "blur" }],
        priority: [
          { required: true, message: "请选择优先级", trigger: "change" },
        ],
        endDate: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
      },
      createrules: {
        title: [{ required: true, message: "请输入需求标题", trigger: "blur" }],
        priority: [
          { required: true, message: "请选择优先级", trigger: "change" },
        ],
        state: [
          { required: true, message: "请选择任务状态", trigger: "change" },
        ],
        startDate: [
          {
            required: true,
            message: "请选择开始日期",
            trigger: "change",
          },
        ],
        endDate: [
          {
            required: true,
            message: "请选择截止日期",
            trigger: "change",
          },
        ],
      }
    };
  },
  watch:{
    projectID(to, from){
      this.pID = this._GLOBAL.ProjectList[to].ID
      this.show()
    }
  },
  created() {
    this.show();
    this.getSprintList();
    this.getreqtList();
  },
  methods: {
    create(){
      this.tocreate=true;
    },
    change(row) {
      this.isForm = true;
      this.ruleForm=row;
    },
    pri(pri){
      switch(pri){
        case "最高":return "danger";
        case "较高":return "warning";
        case "普通":return "success";
        case "较低":return "primary";
        case "最低":return "info";
      }
    },
    show() {
      this.axios
        .get("/api/task/getTaskListByPid?projectid="+this.pID, {
          emulateJSON: true,
        })
        .then((response) => {
          if (response.data.message == "成功") {
            this.taskList = response.data.data.task;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    filterTag(value, row) {
      return row.tag === value;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
          console.log(this.ruleForm.reqtID);
          //console.log(this.pID,this.userID,this.ruleForm.ID,this.ruleForm.title,this.ruleForm.state,this.ruleForm.priority,this.ruleForm.startDate,this.ruleForm.endDate,this.ruleForm.description);
          this.updateTaskInfo(this.pID,this.userID,this.ruleForm.ID,this.ruleForm.title,this.ruleForm.state,this.ruleForm.priority,this.ruleForm.startDate,this.ruleForm.endDate,this.ruleForm.description,this.ruleForm.sprintID,this.ruleForm.reqtID);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    updateTaskInfo(projectID,userid,taskid,tasktitle,state,taskpriority,starttime,endtime,describ,sprintid,reqtid){
      this.axios
        .post("/api/task/updateTaskByID",{
          projectID: projectID,
          userID: userid,
          ID: taskid,
          title: tasktitle,
          state: state,
          priority: taskpriority,
          startDate: starttime,
          endDate: endtime,
          description: describ,
          sprintID: sprintid,
          reqtID: reqtid,
        }, {
          emulateJSON: true,
        })
        .then((response) => {
          console.log(response);
          if (response.data.code == 20000) {
            this.$alert("修改成功！");
            this.isForm=false;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    createtask(){
      console.log(this.createForm);
      this.axios
        .post("/api/task/addtask",this.createForm, {
          emulateJSON: true,
        })
        .then((response) => {
          if (response.data.code == 20000) {
            this.$alert("创建成功！新建任务id为"+response.data.data.ID);
            this.tocreate=false;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getSprintList(){
      this.axios
        .post("/api/sprint/getSpListByPID?ID="+this.pID, {
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
    getreqtList(){
      this.axios
        .post("/api/requirement/getReqtListByPID?ID="+this.pID, {
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
  },
}
</script>

<style scoped>
.task_card{
  margin: 0px 24px 24px 24px;
  overflow-y: auto;
  height: 620px;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
}

</style>
