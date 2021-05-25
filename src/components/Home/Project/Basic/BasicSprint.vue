<template>
	<div>
		<el-card>
			<div slot="header">Sprint</div>
			<div class="card-content">
				<el-card shadow="never">
					<div slot="header">Current sprint</div>
					<p>{{name}}</p><br />
				</el-card>
				<!-- <el-card shadow="never">
					<div slot="header">Current sprint status</div>
					<p>{{state}}</p>
				</el-card> -->
				<el-card shadow="never">
					<div slot="header">Deadline of current iteration</div>
					<p>{{time}}</p>
				</el-card>
			</div>
		</el-card>
	</div>
</template>

<script>
	export default {
		props: [
			'name',
			'state',
			'time',
		],
		data() {
			return {
// 				name: '',
// 				state: '',
// 				time: 0,
			}
		},
		created:function() {
			//this.getSprintName();
		},
		methods: {
			getSprintName () {
				this.axios.post('/api/sprint/getSpListByPID?ID=' + this._GLOBAL.ProjectList[this._GLOBAL.projectIndex].ID)
					.then((response) => {
						if (response.data.message == '成功') {
							var list = response.data.data.spList;
							if (list.length > 0) {
								this.name = list[list.length - 1].title;
								this.state = 'In progress';
								this.time = list[list.length - 1].endDate;
							} else {
								
							}
							// console.log(this.isHost);
						}
					})
			}
		},
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
</style>
