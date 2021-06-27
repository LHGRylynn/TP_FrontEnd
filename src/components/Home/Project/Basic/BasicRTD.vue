<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="10">
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
      <el-col :span="14">
        <el-card>
          <div slot="header">Project distribution</div>
          <el-col :span="14" :offset="2">
            <div id="main" style="width: 300px; height:168px; align-content: center;"></div>
          </el-col>
          <el-col :span="4" :offset="1">
            <p></p>
            <br />
            <p>Require: {{rCnt}}</p>
            <br />
            <p>Task: {{count}}</p>
            <br />
            <p>Defect: {{dCnt}}</p>
            <br />
          </el-col>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: [
    "count",
    "already",
    "processing",
    "nostarting",
    "percentage",
    "rCnt",
    "dCnt",
  ],
  data() {
    return {
      // 				count: 0,
      // 				already: 0,
      // 				processing: 0,
      // 				nostarting: 0,
      // 				percentage: 0,
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
    this.myEcharts();
  },
  created: function () {
    this.calculate();
    this.myEcharts();
  },
  watch: {
    // 若 projectID 变更，更新页面
    rCnt(to, from) {
      this.myEcharts();
      this.calculate();
    },
    dCnt(to, from) {
      this.myEcharts();
      this.calculate();
    },
    count(to, from) {
      this.myEcharts();
      this.calculate();
    },
  },
  methods: {
    calculate() {
      this.axios
        .get(
          "/api/task/getTaskListByPid?projectid=" +
            this._GLOBAL.ProjectList[this._GLOBAL.projectIndex].ID
        )
        .then((response) => {
          if (response.data.message == "成功") {
            var taskList = response.data.data.task;
            console.log(taskList);
            this.count = 0;
            this.already = 0;
            this.processing = 0;
            this.nostarting = 0;
            for (let task of taskList) {
              this.count++;
              if (task.state == "已完成") this.already++;
              else if (task.state == "未开始") this.nostarting++;
              else this.processing++;
            }
            this.percentage = this.count==0?0.00: (this.already / this.count*100).toFixed(2);
          }
        })
        .catch(function (error) {
          console.log(error);
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
      var myChart = require("echarts").init(document.getElementById("main"));
      // 指定图表的配置项和数据
      var option = {
        // 					title: {
        // 						text: ''
        // 					},
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
            radius: "55%", // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
            data: [
              // 数据数组，name 为数据项名称，value 为数据项值
              {
                value: this.rCnt,
                name: "Require",
              },
              {
                value: this.count,
                name: "Task",
              },
              {
                value: this.dCnt,
                name: "Defect",
              },
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

<style scoped>
.el-card >>> .el-card__header  {
  background-color: #bddbff38;
}
.card-content {
  display: flex;
}
.card-content > * {
  flex-grow: 1;
  flex-shrink: 1;
  margin: 0px 12px;
}
</style>