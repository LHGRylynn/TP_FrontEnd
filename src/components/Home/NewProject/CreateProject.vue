<template>
	<div>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-form-item label="Name" prop="name">
				<el-input v-model="ruleForm.name" style="width:400px"></el-input>
			</el-form-item>
			<el-form-item label="Period" prop="datavalue">
				<el-date-picker v-model="ruleForm.datavalue" type="daterange" value-format="yyyy-MM-dd" range-separator="To" start-placeholder="Start" end-placeholder="End">
				</el-date-picker>
			</el-form-item>
			<!-- <el-form-item label="项目开始时间" prop="date1">
				<el-col :span="11">
					<el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
				</el-col>
			</el-form-item>
			<el-form-item label="项目结束时间" prop="date2">
				<el-col :span="11">
					<el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date2" style="width: 100%;"></el-date-picker>
				</el-col>
			</el-form-item> -->
			<el-form-item label="Description" prop="desc">
				<el-input type="textarea" v-model="ruleForm.desc" placeholder="No longer than 100 characters" style="width:800px"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('ruleForm')">Create project</el-button>
				<el-button @click="resetForm('ruleForm')">Reset</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		name: 'ProjectSprint',
		data() {
			return {
				ruleForm: {
					name: '',
					datavalue: '',
					date1: '',
					date2: '',
					desc: '',
				},
				rules: {
					name: [{
							required: true,
							message: 'Please enter a valid project name, which may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.',
							trigger: 'blur'
						},
						{
							max: 20,
							message: 'No longer than 20 characters',
							trigger: 'blur'
						}
					],
					datevalue: [{
						type: 'date',
						required: true,
						message: '请选择项目结束时间',
						trigger: 'change'
					}],
					// 					date1: [{
					// 						type: 'date',
					// 						required: true,
					// 						message: '请选择项目开始时间',
					// 						trigger: 'change'
					// 					}],
					// 					date2: [{
					// 						type: 'date',
					// 						required: true,
					// 						message: '请选择项目结束时间',
					// 						trigger: 'change'
					// 					}],
					desc: [{
						required: false,
						message: '请填写项目描述',
						trigger: 'blur'
					}]
				},
			}
		},

		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.axios.post('/api/project/createProject', {
								"name": this.ruleForm.name,
								"description": this.ruleForm.desc,
								"startDate": this.ruleForm.datavalue[0],
								"endDate": this.ruleForm.datavalue[1],
								"state": "Pending",
								"hostID": this._GLOBAL.userID
							}, {
								emulateJSON: true
							})
							.then((response) => {
								if (response.data.message == '成功') {
									alert('Create successfully!');
								}
								// 获取所有项目
								this.axios.get('/api/project/getPrjListByUID', {
										params: {
											UID: this._GLOBAL.userObj.ID
										}
									})
									.then((response) => {
										console.log(response);
										if (response.data.message == '成功') {
											this._GLOBAL.ProjectList = response.data.data.prjList;
											this.$eventBus.$emit('add',this.todoList);
										}
									})
							})
						//console.log(this.ruleForm.datavalue[0]);
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>

<style>
</style>
