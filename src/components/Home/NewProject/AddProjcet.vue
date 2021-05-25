<template>
	<div>
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="Project ID">
				<el-input v-model="formInline.projectid" placeholder="Please enter Project ID"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">Apply to join</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
  export default {
    data() {
      return {
        formInline: {
          projectid: '',
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>

<style>
</style>
