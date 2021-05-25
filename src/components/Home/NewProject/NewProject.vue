<template>
	<div>
		<el-tabs v-model="tab" type="card">
			<el-tab-pane label="Create Project" name="create">
				<create />
			</el-tab-pane>
			<!-- <el-tab-pane label=" Join Project" name="add">
				<add />
			</el-tab-pane> -->
		</el-tabs>
	</div>
</template>

<script>
	import AddProject from './AddProjcet.vue'
	import CreateProject from './CreateProject.vue'

	export default {
		name: 'newProject',
		components: {
			'add': AddProject,
			'create': CreateProject,
		},
		data() {
			return {
				tab: 'create',
				projectID: ''
			}
		},
	}
</script>

<style>
</style>
