<template>
  <div>
    <el-row :gutter="20" style="margin-left:16px;margin-top:20px">
      <el-col :span="12">
        <el-card>
          <div slot="header">Task</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-progress
                type="dashboard"
                :percentage="percentage"
                :color="colors"
                style="position: relative; left: 25%;"
              ></el-progress>
            </el-col>
            <el-col :span="10" :offset="1">
              <p>All: {{count}}</p>
              <br />
              <p>Pending: {{nostarting}}</p>
              <br />
              <p>In progress: {{processing}}</p>
              <br />
              <p>Completed: {{already}}</p>
              <br />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">Defect Distribution</div>
          <el-col :span="12" :offset="2">
            <div id="defect_chart" style="width: 300px; height:168px; align-content: center;"></div>
          </el-col>
          <el-col :span="8" :offset="1">
            <p>opened: {{open}}</p>
            <br />
            <p>confirmed: {{confirmed}}</p>
            <br />
            <p>restoring: {{restoring}}</p>
            <br />
            <p>solved: {{solved}}</p>
            <br />
          </el-col>
        </el-card>
      </el-col>
    </el-row>

    <list-card class="my-jobs__card" title="My Tasks" :data="tasks" :fields="tasksFields" />
    <list-card class="my-jobs__card" title="My Defects" :data="defects" :fields="defectsFields" />
  </div>
</template>

<script>
import ListCard from "./ListCard.vue";
export default {
  title: "MyJobs",
  components: {
    "list-card": ListCard,
  },
  // props: [
  // 		'count',
  // 		'already',
  // 		'processing',
  // 		'nostarting',
  // 		'percentage',
  // 	],
  data() {
    return {
      count: 0,
      already: 0,
      processing: 0,
      nostarting: 0,
      percentage: 0,
      open: 0,
      confirmed: 0,
      restoring: 0,
      solved: 0,
      requiresFields: [
        "title",
        "type",
        "kind",
        "priority",
        "description",
        "endDate",
        "stitle",
      ],
      tasksFields: [
        "title",
        "state",
        "startDate",
        "endDate",
        "priority",
        "description",
      ],
      defectsFields: ["title", "type", "state", "endDate", "description"],
      meetingsFields: ["type", "date", "description", "attachment"],
      requires: [
        {
          title: "",
          type: "",
          kind: "",
          priority: "",
          description: "",
          endDate: "",
          stitle: "",
          state: "",
        },
      ],
      tasks: [
        {
          title: "",
          state: "",
          username: "",
          startDate: "",
          endDate: "",
          priority: "",
          description: "",
        },
      ],
      defects: [
        { title: "", type: "", state: "", endDate: "", description: "" },
      ],
      colors: [
        {
          color: "#f56c6c",
          percentage: 20,
        },
        {
          color: "#e6a23c",
          percentage: 40,
        },
        {
          color: "#5cb87a",
          percentage: 60,
        },
        {
          color: "#1989fa",
          percentage: 80,
        },
        {
          color: "#6f7ad3",
          percentage: 100,
        },
      ],
    };
  },
  mounted() {
    this.getData();
    this.myEcharts();
  },
  created() {
    this.getData();
    this.myEcharts();
    // this.calculate();
  },
  methods: {
    getData() {
      // 'headers': {'Access-Control-Allow-Origin': '*','access-control-allow-credentials': 'true'}
      // this.axios.setRequestHeader()
      var userID = this._GLOBAL.userObj.ID;
      var url =
        this._GLOBAL.baseUrl + "/task/getTaskListByUid?userid=" + userID;
      this.axios.get(url).then((response) => {
        if (response.data.message == "成功") {
          this.tasks = response.data.data.task;
          this.count = 0;
          this.already = 0;
          this.processing = 0;
          this.nostarting = 0;
          for (let task of this.tasks) {
            this.count++;
            if (task.state == "已完成") this.already++;
            else if (task.state == "未开始") this.nostarting++;
            else this.processing++;
          }
          this.percentage = this.count*100==0?0.00:(this.already / this.count*100).toFixed(2);
        }
      });
      url = this._GLOBAL.baseUrl + "/defect/getDefListByUID?ID=" + userID;
      this.axios.post(url).then((response) => {
        if (response.data.message == "成功") {
          this.defects = response.data.data.defectList;
          this.open = 0;
          this.confirmed = 0;
          this.restoring = 0;
          this.solved = 0;
          for (let defect of this.defects) {
            if (defect.state == "已确认") {
              this.confirmed++;
            } else if (defect.state == "打开") this.open++;
            else if (defect.state == "修复中") this.restoring++;
            else if (defect.state == "已解决") this.solved++;
          }
          this.myEcharts();
        }
      });
    },
    increase() {
      this.percentage += 10;
      if (this.percentage > 100) {
        this.percentage = 100;
      }
    },
    decrease() {
      this.percentage -= 10;
      if (this.percentage < 0) {
        this.percentage = 0;
      }
    },
    myEcharts() {
      // 基于准备好的dom，初始化echarts实例
      //  var myChart = this.$echarts.init(document.getElementById('main'));
      var myChart = require("echarts").init(
        document.getElementById("defect_chart")
      );
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: "",
        },
        tooltip: {},
        // 					legend: {
        // 						data: ['销量']
        // 					},
        // 					xAxis: {
        // 						data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        // 					},
        // 					yAxis: {},
        series: [
          {
            //name: '访问来源',
            type: "pie", // 设置图表类型为饼图
            radius: "80%", // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
            data: [
              // 数据数组，name 为数据项名称，value 为数据项值
              {
                value: this.open,
                name: "opened",
              },
              {
                value: this.confirmed,
                name: "confirmed",
              },
              {
                value: this.restoring,
                name: "restoring",
              },
              {
                value: this.solved,
                name: "solved",
              },
              //   {
              //     value: 3,
              //     name: "关闭",
              //   },
            ],
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>

<style>
.my-jobs__card {
  margin: 24px 24px 24px 24px;
}
</style>
