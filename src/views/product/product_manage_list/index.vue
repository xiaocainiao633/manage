<template>
	<breadCrumb ref="breadcrumb" :item='item'></breadCrumb>
	<!-- wrapper -->
	<div class="module-common-wrapped">
		<div class="module-common-content">
			<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane label="产品列表" name="first">
					<div class="pane-content">
						<div class="pane-top">
							<div class="module-common-header">
								<div class="search-wrapped">
									<el-input v-model="productId" class="w-50 m-2" size="large" placeholder="输入入库编号进行搜索"
										:prefix-icon="Search" @change="searchProduct()"
									clearable @clear="getProductFirstPageList"	
									/>
								</div>
								<div class="button-wrapped">
									<el-button type="primary" @click="productInWarehouse">产品入库</el-button>
								</div>
							</div>
							<!-- 表格部分-->
							<div class="module-common-table">
								<el-table el-table :data="tableData" border style="width: 100%" >
									<el-table-column type="index" width="50"></el-table-column>
									<el-table-column prop="product_id" label="入库编号" width="200" />
									<el-table-column prop="product_name" label="产品名称" width="160" />
									<el-table-column prop="product_category" label="产品类别" width="100" />
									<el-table-column prop="product_unit" label="单位" />
									<el-table-column prop="product_in_warehouse_number" label="库存数量" width="100" />
									<el-table-column prop="product_single_price" label="产品单价" width="150" />
									<el-table-column prop="product_all_price" label="库存总价" width="100" />
									<el-table-column prop="product_status" label="库存状态" width="100">
										<template #default="{row}">
											<el-tag class="ml-2" type="success"
												v-if="row.product_in_warehouse_number<100">库存较少</el-tag>
											<el-tag class="ml-2" type="success"
												v-else-if="row.product_in_warehouse_number>=100&&row.product_in_warehouse_number<=300">库存正常</el-tag>
											<el-tag class="ml-2" type="success"
												v-else-if="row.product_in_warehouse_number>300">库存过剩</el-tag>
										</template>
									</el-table-column>
									<el-table-column prop="product_create_person" label="入库负责人" width="100" />
									<el-table-column prop="product_create_time" label="入库时间" width="200">
										<template #default="{row}">
											<div>{{row.product_create_time?.slice(0,10)}}</div>
										</template>
									</el-table-column>
									<el-table-column prop="product_update_time" label="最后修改时间" width="200">
										<template #default="{row}">
											<div>{{row.product_update_time?.slice(0,10)}}</div>
										</template>
									</el-table-column>
									<el-table-column prop="in_memo" label="入库备注" width="200" />
									<el-table-column label="操作" width="300" fixed="right">
										<template #default="{row}">
											<div>
												<el-button type="primary" @click="applyOut(row)"
													:disabled='row.product_out_status=="申请出库" || row.product_in_warehouse_number==0'>申请出库</el-button>
												<el-button type="success" @click="editProduct(row)"
													:disabled='row.product_out_status=="申请出库"'>修改</el-button>
												<el-button type="danger" @click="deleteProduct(row.id)"
													:disabled='row.product_out_status=="申请出库"'>删除</el-button>
											</div>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</div>
						<div class="table-footer">
							<el-pagination :page-size="1" :current-page="paginationData.productCurrentPage"
                             :pager-count="7" :total="paginationData.productTotal"
                             :page-count="paginationData.productPageCount" @current-change="ProductcurrentChange"
                             layout="prev, pager, next" />
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="审核列表" name="second">
					<div class="pane-content">
						<div class="pane-top">
							<div class="module-common-header">
								<div class="search-wrapped">
									<el-input v-model="productOutId" class="w-50 m-2" size="large" clearable
									placeholder="输入入库编号进行搜索" :prefix-icon="Search" @change="searchApplyProduct()"
									@clear="getApplyProductFirstPageList" disabled/>
								</div>
								<div class="button-wrapped">
								</div>
							</div>
							<!-- 表格部分 -->
							<div class="module-common-table">
								<el-table :data="applytableData" border style="width: 100%">
									<el-table-column type="index" width="50"></el-table-column>
									<el-table-column prop="product_out_id" label="申请出库编号" width="200" />
									<el-table-column prop="product_name" label="产品名称" width="200" />
									<el-table-column prop="product_out_number" label="申请出库数量" width="180" />
									<el-table-column prop="product_out_price" label="申请出库总价" width="180" />
									<el-table-column prop="product_out_apply_person" label="申请人" width="100" />
									<el-table-column prop="product_apply_time" label="申请出库时间" width="180">
										<template #default="{row}">
											<div>{{row.product_apply_time?.slice(0,10)}}</div>
										</template>
									</el-table-column>
									<el-table-column prop="product_out_audit_person" label="审核人" width="150" />
									<el-table-column prop="product_audit_time" label="审核时间" width="180">
										<template #default="{row}">
											<div>{{row.product_audit_time?.slice(0,10)}}</div>
										</template>
									</el-table-column>
									<el-table-column prop="product_out_status" label="审核状态" width="100" />
									<el-table-column prop="apply_memo" label="申请出库备注" width="200" />
									<el-table-column prop="audit_memo" label="审核备注" width="200" />
									<el-table-column label="操作" width="300" fixed="right">
										<template #default="{row}">
											<div>
												<el-button type="primary"
													@click="withdrawProduct(row.id)">撤回申请</el-button>
												<el-button type="success" :disabled='row.product_out_status=="申请出库"'
													@click="againApply(row)">再次申请</el-button>
												<el-button type="danger" @click="auditProduct(row)">审核</el-button>
											</div>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</div>
						<div class="table-footer">
							<el-pagination :page-size="1" :current-page="paginationData.applyProductCurrentPage"
                             :pager-count="7" :total="paginationData.applyProductTotal"
                             :page-count="paginationData.applyProductCount"
                             @current-change="applyProductcurrentChange" layout="prev, pager, next" />
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
	<inwarehouse ref="inware" @success="getProductFirstPageList"></inwarehouse>
	<apply ref="applyp" @success="changeTwoPageList"></apply>
	<edit ref="editp" @success="getProductFirstPageList"></edit>
	<deleteP ref="deletep" @success="getProductFirstPageList"></deleteP>
	<audit ref="auditP" @success="changeTwoPageList"></audit>
	<withdraw ref="withdrawP" @success="changeTwoPageList"></withdraw>
	<again ref="againP" @success="getApplyProductFirstPageList"></again>
</template>

<script lang="ts" setup>
	import { ref, onBeforeUnmount, reactive } from 'vue'
	import breadCrumb from '@/components/bread_crumb.vue'
	import {
		Search
	} from '@element-plus/icons-vue'
	import inwarehouse from '../components/product_in_warehouse.vue' 
	import apply from '../components/apply.vue'
	import edit from '../components/edit_product.vue'
	import deleteP from '../components/delete_product.vue'
	import audit from '../components/audit.vue'
	import withdraw from '../components/withdraw.vue'
	import again from '../components/again_apply.vue'
	import { 
		getProductList, 
		searchProductForId, 
		searchProductForApplyId,
		applyProductList,
		getProductLength,
		getApplyProductLength,
		returnProductListData,
		returnApplyProductListData,
	} from '@/api/product.js'
	import { bus } from '@/utils/mitt.js'
	import { ElMessage } from 'element-plus'
	import type {
		TabsPaneContext
	} from 'element-plus'
	
	// 面包屑
	const breadcrumb = ref()
	// 面包屑参数
	const item = ref({
		first: '产品管理',
		second: '产品列表'
	})
	
	const handleClick = (tab: TabsPaneContext) => {
		if (tab.props.label == '产品列表') {
			getProductFirstPageList()
		}
		if (tab.props.label == '审核列表') {
			getApplyProductFirstPageList()
		}
	}
	
	const activeName = ref('first')
	
	// 产品入库编号
	const productId = ref<number>()
	// 产品申请出库编号
	const productOutId = ref<number>()
	// 产品表格
	const tableData = ref([])
	// 产品申请出库表格
	const applytableData = ref([])
	
	// 分页数据
	const paginationData = reactive({
		// 产品总数
		productTotal: 0,
		// 产品列表总页数
		productPageCount: 0,
		// 产品列表当前所处页数
		productCurrentPage: 1,
		// 申请的总数
		applyProductTotal: 0,
		// 申请列表总页数
		applyProductCount: 0,
		// 申请列表当前所处页数
		applyProductCurrentPage: 0,
	})
	
	// 获取产品列表的页数
	const getProductListlength = async () => {
		const res = await getProductLength()
		paginationData.productTotal = res.length
		paginationData.productPageCount = Math.ceil(res.length / 10)
	}
	getProductListlength()
	
	// 获取申请列表的页数
	const getApplyProductListlength = async () => {
		const res = await getApplyProductLength()
		paginationData.applyProductTotal = res.length
		paginationData.applyProductCount = Math.ceil(res.length / 10)
	}
	getApplyProductListlength()
	
	// 默认获取产品列表第一页的数据
	const getProductFirstPageList = async () => {
		tableData.value = await returnProductListData(1)
	}
	getProductFirstPageList()
	
	// 默认获取审核列表第一页的数据
	const getApplyProductFirstPageList = async () => {
		applytableData.value = await returnApplyProductListData(1)
	}
	getApplyProductFirstPageList()
	
	// 更新产品列表及审核列表的第一页数据
	const changeTwoPageList = () => {
		getProductFirstPageList()
		getApplyProductFirstPageList()
	}
	
	// 产品列表监听换页
	const ProductcurrentChange = async (value: number) => {
		paginationData.productCurrentPage = value
		tableData.value = await returnProductListData(paginationData.productCurrentPage)
	}

	// 申请列表监听换页
	const applyProductcurrentChange = async (value: number) => {
		paginationData.applyProductCurrentPage = value
		tableData.value = await returnApplyProductListData(paginationData.applyProductCurrentPage)
	}
	
	
	// // 获取产品列表
	// const getProductlist = async()=>{
	// 	tableData.value = await getProductList()
	// }
	// getProductlist()
	
	// // 获取产品审核列表
	// const getApplyProductList = async()=> {
	// 	applytableData.value = await applyProductList()
	// }
	// getApplyProductList()
	
	// // 更新产品列表及审核列表的第一页数据
	// const changeProductlist = () => {
	// 	getProductlist()
	// 	getApplyProductList()
	// }
	
	// 通过产品入库ID去搜索
	const searchProduct = async() => {
		tableData.value = await searchProductForId(productId.value)
	}
	
	// 通过产品申请出库ID去搜索
	const searchApplyProduct = async() => {
		// tableData.value = await searchProductForApplyId(productId.value)
		const res = await searchProductForApplyId(productId.value)
		console.log(res)
	}
	
	
	// 打开产品入库
	const inware = ref()
	const productInWarehouse = ()=>{
		inware.value.open()
	}
	
	// 产品申请出库
	const applyp = ref()
	const applyOut = ( row : any ) => {
		bus.emit('applyId' , row)
		applyp.value.open()
	}
	
	// 编辑产品信息
	const editp = ref()
	const editProduct = (row : any) => {
		bus.emit('editProductId', row)
		editp.value.open()
	}
	
	// 删除产品
	const deletep = ref()
	const deleteProduct = (id : number) => {
		bus.emit('deleteProductId' , id)
		deletep.value.open()
	}
	
	// 审核产品
	const auditP = ref()
	const auditProduct = (row : any) =>{
		bus.emit('auditProductInfor', row)
		auditP.value.open()
	}
	
	// 撤回产品申请
	const withdrawP = ref()
	const withdrawProduct = (id : number) => {
		bus.emit('withdrawId', id)
		withdrawP.value.open()
	}
	
	// 再次申请产品出库
	const againP = ref()
	const againApply = (row : any) => {
		bus.emit('againId', row)
		againP.value.open()
	}
	
	onBeforeUnmount(() => {
		bus.all.clear()
	})
</script>

<style lang="scss" scoped>
	
	:deep(.el-table .cell) {
		font-weight: 400;
	}
</style>