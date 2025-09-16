<template>
	<!-- 修改密码 -->
	<el-dialog v-model="state.changePasswordDialog" title="修改密码" width="400px" >
		<el-form class="login-form" :label-position="labelPosition" :rules="rules">
			<el-form-item label="请输入您的旧密码" prop="oldPassword">
			      <el-input v-model="passwordData.oldPassword" placeholder="请输入您的旧密码" show-password/>
			</el-form-item>
			<el-form-item label="请输入您的新密码" prop="newPassword">
			      <el-input v-model="passwordData.newPassword" placeholder="请输入您的新密码" show-password/>
			</el-form-item>
		</el-form>
		<!-- 底部内容 -->
		 <template #footer>
		    <div class="dialog-footer">
		        <el-button @click="state.changePasswordDialog = false">取消</el-button>
		        <el-button type="primary" @click="changeUserPassword">
		          确定
		        </el-button>
		    </div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
	import{ ref , reactive, onBeforeUnmount } from 'vue'
	import { changePassword } from '@/api/userinfor.js'
	import { ElMessage } from 'element-plus'
	import { useRouter } from 'vue-router'
	import {
		bus
	} from "@/utils/mitt.js"
	
	const router = useRouter()
	//表单对齐方式
	const labelPosition = ref('top')
	//表单对象接口
	interface passwordData{
		oldPassword:string;
		newPassword:string;
	}
	
	//表单对象
	const passwordData : passwordData = reactive({
		oldPassword:'',
		newPassword:'',
	})
	
	//表单规则
	const rules = reactive({
		oldPassword: [
		    { required: true, message: '请输入您的旧密码', trigger: 'blur' },
		],
		newPassword: [
			{ required: true, message: '请输入您的新密码', trigger: 'blur' },
	    ],
	})
	
	//控制弹窗默认关闭
	const state = reactive({
		changePasswordDialog:false,
	})
	
	//修改密码 id跟两个password
	const changeUserPassword = async()=> {
		if(passwordData.oldPassword == passwordData.newPassword){
			const res = await changePassword(localStorage.getItem('id'),passwordData.oldPassword,passwordData.newPassword)
			if(res.status == 0){
				ElMessage({
					message:'修改成功',
					type:'success',
				})
				state.changePasswordDialog = false
				router.push('/login')
			}	else{
				ElMessage.error('修改密码失败，请重新输入！')
			}
		}	else{
			ElMessage.error('请检查输入的数据！')
		}
	}
	
	//打开修改密码的弹窗
	const open = () => {
		state.changePasswordDialog = true
	}
	
	defineExpose({
		open
	})
	
	// onBeforeUnmount(()=>{
	// 	bus.all.clear()
	// })
</script>

<style lang="scss" scoped>
</style>