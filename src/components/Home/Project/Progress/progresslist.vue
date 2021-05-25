<template>
	<div>
		<el-card class="task_nexttop">
			<el-col :span="1"><i class="el-icon-setting"></i></el-col>
			<el-col :span="3">状态</el-col>
			<el-col :span="7">标题</el-col>
			<el-col :span="3">负责人</el-col>
			<el-col :span="3">优先级</el-col>
			<el-col :span="3">所属迭代</el-col>
			<el-col :span="4">创建时间</el-col>
			<el-row></el-row>
		</el-card>
		
		<div class="task_item" v-for="item in MyTask" :key="item.id">
			<el-card class="task_list">
				<el-col :span="1" >{{item.taskid}}</el-col>
				<el-col :span="3">{{item.state}}</el-col>
				<el-col :span="7">{{item.title}}</el-col>
				<el-col :span="3">{{item.userid}}</el-col>
				<el-col :span="3">{{item.priority}}</el-col>
				<el-col :span="3">{{item.sprintid}}</el-col>
				<el-col :span="4">{{item.startdate}}</el-col>
				<el-row></el-row>
			</el-card>
		</div>
		
	</div>
</template>

<script>
	export default {
		name: 'progresslist',
		props: [
			'name',
			'start',
			'end',
			'description'
		],
		data(){
			return{
				MyTask:[
					{
						taskid:1,
						state:"ST",
						title:"this is first task.",
						userid:1,
						priority:"super",
						sprintid:1,
						startdate:"2020-01-10",
						
					},
					{
						taskid:1,
						state:"ST",
						title:"this is first task.",
						userid:1,
						priority:"super",
						sprintid:1,
						startdate:"2020-01-10",
					},
					{
						taskid:1,
						state:"ST",
						title:"this is first task.",
						userid:1,
						priority:"super",
						sprintid:1,
						startdate:"2020-01-10",
					}
				],
			}
		}
	}
</script>

<style scoped>
	.card-content {
		display: flex;
	}

	.card-content>* {
		flex-grow: 1;
		flex-shrink: 1;
		margin: 0px 12px;
	}
	.task_nexttop{
		text-align: center;
	}
	.task_list{
		text-align: center;
	}
</style>
