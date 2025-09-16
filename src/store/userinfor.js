import { defineStore } from 'pinia'

import { getUserInfor } from '@/api/userinfor.js'
export const useUserInfor = defineStore('userinfor' , {
	state: () => {
		return {
			imageUrl: '',
			name: '',
			sex: '',
			department: '',
			identity: '',
			account: '',
			email:'',
		}
	},
	actions: {
		async userInfor(id) {
			const res = await getUserInfor(id)
			this.imageUrl = res.image_url
			this.name = res.name
			this.sex = res.sex
			this.department = res.department
			this.identity = res.identity
			this.account = res.account
			this.email = res.email
		}
	},
},{
	persist:{
		//存储全部数据
		enabled:true,
		//关键字
		key:'userinfor',
		storage:localStorage,
	}
})