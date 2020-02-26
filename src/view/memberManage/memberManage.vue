<template>
	<template-page class='memberManage' :param="params" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">
	
		<div slot="buttonRegion">
			<span class="ml10">昵称或真实姓名：</span>
			<el-input  placeholder="请输入昵称或真实姓名"  v-model="params.search.nickname"></el-input>
			<span class="ml10">会员手机号：</span>
			<el-input placeholder="请输入会员手机号"  v-model="params.search.mobile"></el-input>
			<span class="ml10">发展途径：</span>
			<el-select v-model="params.search.source">
				<el-option label="全部" value=""></el-option>
				<el-option label="门店发展" value="1" ></el-option>
				<el-option label="自行搜索" value="3"></el-option>
				<el-option label="会员发展" value="2"></el-option>		
			</el-select>
			<el-button class="ml10" type="primary" @click.native="loadMessage">搜索</el-button>
			<el-button  @click.native="reset">重置</el-button>
		</div>

		<div slot="pageRegion">
			<template>
				<el-table :data="params.infor" border style="width: 100%">
					
					<el-table-column prop="id" label="会员ID" width="100px"></el-table-column>
					<el-table-column prop="nickname" label="昵称"></el-table-column>
					<el-table-column prop="name" label="会员真实姓名"></el-table-column>
					<el-table-column prop="mobile" label="会员手机号" width="120px"></el-table-column>
					<el-table-column prop="points" label="积分值"></el-table-column>
					<el-table-column prop="createTime" label="注册时间" width="180px"></el-table-column>
					<el-table-column prop="source" label="发展途径"></el-table-column>
					<el-table-column prop="referName" label="加入途径"></el-table-column>
					<el-table-column  label="操作" width="100">
						<template slot-scope="scope" >
							<p @click="details(scope.row)" class="editText">查看</p>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</div>
		<!--弹窗-->

		<div class="pageDialog" slot="pageDialog">
			<el-dialog v-if="params.detailMenu" title="查看详情" :visible.sync="params.detailMenu" width="800px" back-backdrop='static' center>
			<memberDetail :param="params"></memberDetail>
			</el-dialog>
		</div>
	</template-page>
</template>

<script>
	import templatePage from '../template/templatePage'
	import http from '../../utils/http.js'
	import URL from '../../utils/url.js'
	import validation from '@/utils/validation.js'
    import memberDetail from "./part/memberDetail"
	export default {
		data() {
			return {
				params: {
					
					detailMenu:false,
					infor: [],	
					search: {
					   nickname:"",
					   mobile:"",
					   source:""
					},
					memberId:1,
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
			memberDetail
			
		},
		methods: {
			details(val){
				let _self = this;
				console.log(val)
				_self.params.detailMenu=true;
				_self.params.memberId=val.id;
				
			},
			//----------------------------------------
			
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
				let url = URL.PROJECT.SCORE + URL.PORTNAME.MEMBER_LIST;
				let msg = {
					id: 0,
					pageNum: pagination.pageNum,
					pageSize: pagination.pageSize,
					nickname: search.nickname,
					mobile: search.mobile,
					source: search.source,
				
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest('get', url, '', function(res) {
					_self.params.pagination.total = validation.total(res)
					let result = res.body.data;
					console.log(result)
					_self.params.infor = result;
				}, function(res) {})
			},

		},
		created() {
			this.loadMessage();
		
		}
	}
</script>

<style lang="less" scoped>
	.memberManage {
		
		.search {
			text-align: left;
		}
	}
	
	
</style>