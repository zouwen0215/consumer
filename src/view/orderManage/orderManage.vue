<template>
	<template-page class='orderList' :param="params" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">
	
		<div slot="buttonRegion">
			<span  class="ml10">订单号：</span>
			<el-input v-model="params.search.orderNO" placeholder="请输入订单号"></el-input>
			<span  class="ml10">收货人姓名、手机号：</span>
			<el-input v-model="params.search.customerPhone" placeholder="请输入收货人姓名、手机号"></el-input>
			<span class="ml10">会员手机号：</span>
			<el-input v-model="params.search.memberPhone" placeholder="请输入会员手机号"></el-input>
			<el-button class="ml10" type="primary" @click.native="loadMessage">搜索</el-button>
			<el-button  @click.native="reset">重置</el-button>
		</div>

		<div slot="pageRegion">
			<template>
				<el-table :data="params.infor" border style="width: 100%">
					
					<el-table-column prop="orderNO" label="订单号" width="180px"></el-table-column>
					<el-table-column prop="customerName" label="收货人姓名" >
					</el-table-column>
					<el-table-column prop="customerPhone" label="收货人手机号"></el-table-column>
					<el-table-column prop="memberPhone" label="会员手机号"></el-table-column>
					<el-table-column prop="points" label="订单价值" width="120px"></el-table-column>
					<el-table-column prop="createTime" label="订单时间" width="180px"></el-table-column>
					<el-table-column fixed="right" label="操作" width="180">
						<template slot-scope="scope" >
							<p class="editText" @click="details(scope.row)">查看</p>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</div>
		<!--弹窗-->

		<div class="pageDialog" slot="pageDialog">
			<el-dialog v-if="params.detailMenu" title="查看订单" :visible.sync="params.detailMenu" width='800px' back-backdrop='static' center>
			<orderDetail :param="params"></orderDetail>
			</el-dialog>
		</div>
	</template-page>
</template>

<script>
	import templatePage from '../template/templatePage'
	import http from '../../utils/http.js'
	import URL from '../../utils/url.js'
	import validation from '@/utils/validation.js'
     import orderDetail from "./part/orderDetail"
	
	export default {
		data() {
			return {
				params: {
				
					detailMenu:false,
				    orderdetail:{},
					//-----------------------------
				
					amount: '',
					
				
					menuList: false,
				
					activitys: [],
				
					goodsId: 0,
					delMenu: false,
				
					infor: [],
				
					state: "",
					info: {
						points: "",
					
					},
					search: {
						orderNO:"",
						customerPhone:"",
						memberPhone:"",
					},

				

					//分页组建
					pagination: {
						currentPage: 1,
						pageNum: '1',
						pageSize: '10',
						total: 1,
						hasPage: true,
						hasMenu: false,
					},

				},
			}
		},
		components: {
			templatePage,
			orderDetail
			
		},
		methods: {
			details(val){
				let _self = this;
				_self.params.detailMenu=true;
				_self.params.orderdetail=val;
			},
			//----------------------------------------
	
			doLogin() {
				let _self = this;
				_self.params.amount = _self.params.amount.replace(/([^0-9])+/g, '');
				//				      _self.params.points=_self.params.points.replace('-','');
			},
		
			
			deleteGoods() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.DELETE_SHOPSLIST;
				let msg = {
					id: _self.params.goodsId,
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest('DELETE', url, '', function(res) {
					_self.params.delMenu = false;
					_self.params.menuList = false;
					_self.loadMessage();
				}, function(res) {})
			},
			handleSizeChange(index) {
				let _self = this;
				_self.params.pagination.pageSize = index;
				_self.loadMessage();

			},
			handleCurrentChange(index) {
				let _self = this;
				_self.params.pagination.pageNum = index;
				_self.loadMessage();
			},
			reset() {
				let _self = this;
				_self.params.search = validation.reset(_self.params.search);
				_self.loadMessage();
			},
			loadMessage() {
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.ORDER_LIST;
				let msg = {
					id: 0,
					pageNum: pagination.pageNum,
					pageSize: pagination.pageSize,
					orderNO: search.orderNO,
					customerPhone: search.customerPhone,
					memberPhone: search.memberPhone,
				
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest('get', url, '', function(res) {
					_self.params.pagination.total = validation.total(res)
					let result = res.body.data;
					_self.params.infor = result;
				}, function(res) {})
			},

		},
		created() {
			this.loadMessage();
			//			this.loadGoodsList();
		}
	}
</script>

<style lang="less" scoped>
	.orderList {
		.operate{
			display: flex;
		 
			&>p{
				text-align: center;
				margin-left: 10px;
			}
			
		}
		.add {
			text-align: left;
			margin-bottom: 10px;
		}
		.search {
			text-align: left;
		}
	}
	
	.img {
		width: auto;
		height: 60px;
	}
	
	.activitys {
		/*display: flex;*/
	}
	
	.btn {
		margin-bottom: 20px;
		.el-button {
			width: 200px;
		}
	}
</style>