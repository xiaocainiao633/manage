<template>
	<el-dialog v-model="dialogFormVisible" title='删除操作' width="30%" center >
		<span v-if="adminid">是否去掉此用户的管理员职位？删除后此用户将重新展现在用户列表中</span>
		<span v-else>请慎重操作，删除后此用户将永久失去登录资格</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="deleteadmin">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
	import { onBeforeUnmount, ref } from 'vue'
	import {
		bus
	} from "@/utils/mitt.js"
	import {
		changeIdentityToUser, deleteUser
	} from '@/api/userinfor.js'
	import { ElMessage } from 'element-plus'
	import { tracking } from '@/utils/operation.js'
	
	const adminid = ref()
	const userid = ref()
	const account = ref()
	const name = ref()
	
	bus.on('deleteId', async(id : number) => {
		adminid.value = id
	})
	
	bus.on('deleteUserId', (userInfor : any) => {
		userid.value = userInfor.id
		account.value = userInfor.account
		name.value = userInfor.name
	})
	
	// const emit = defineEmits(['success'])

	const deleteadmin = async () => {
		if(adminid.value) {
			const res = await changeIdentityToUser(adminid.value)
			if (res.status == 0) {
				ElMessage({
					message: '对管理员降职成功',
					type: 'success',
				})
				// emit('success')
				bus.emit('adminDialogOff', 3)
				dialogFormVisible.value = false
			} else {
				ElMessage.error('对管理员降职失败')
				dialogFormVisible.value = false
			}
		}
		if(userid.value) {
			const res = await deleteUser(userid.value,account.value)
			if (res.status == 0) {
				ElMessage({
					message: '删除用户成功',
					type: 'success',
				})
				tracking('管理员', localStorage.getItem('name'),name.value,'高级')
				dialogFormVisible.value = false
				bus.emit('offDialog', 1)
			} else {
				ElMessage.error('删除用户失败')
				dialogFormVisible.value = false
			}
		}
	}
	
	// 弹窗开关
	const dialogFormVisible = ref(false)

	// 打开编辑管理员的弹窗
	const open = () => {
		dialogFormVisible.value = true
	}

	defineExpose({
		open
	})
	
	onBeforeUnmount(()=>{
		bus.all.clear()
	})

</script>

<style lang="scss" scoped>

</style>