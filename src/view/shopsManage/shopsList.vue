<template>
	<template-page class='shopsList' :param="params" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">
		
		<div slot="buttonRegion">
			<span class="ml10">商品状态：</span>
			<el-select v-model="params.search.status"  >
				<el-option label="全部" value=""></el-option>
				<el-option label="已上架" value="1"></el-option>
				<el-option label="已下架" value="0"></el-option>
			</el-select>
			<span class="ml10"  v-if="$store.state.user.userInfor.currentChannel!=20">商品来源：</span>
			<el-select v-model="params.search.goodsSrcDictId"  v-if="$store.state.user.userInfor.currentChannel!=20">
				<el-option  v-for="item in params.inforsrc" :label="item.remark" :value="item.id":key="item.value"></el-option>
				
			</el-select>
			<span class="ml10">商品名称：</span>
			<el-input v-model="params.search.name" placeholder="请输入商品名称"></el-input>
			<el-button class="ml10" type="primary" @click.native="changeData">搜索</el-button>
			<el-button  @click.native="reset">重置</el-button>
			<el-button v-if="$store.state.user.userInfor.currentChannel==20" style="float: right;" type="success" @click="createShop">新建商品</el-button>
			<el-button v-else style="float: right;" type="success" @click="params.importMenu=true">导入商品</el-button>
		</div>

		<div slot="pageRegion">
			<template>
				<el-table :data="params.infor" border style="width: 100%">
					
					<el-table-column prop="name" label="商品名称" ></el-table-column>
					<el-table-column prop="status" label="商品状态" width="80px">
						<template slot-scope="scope" >
							
							<p v-if="scope.row.status==0">下架</p>
							<p v-else>上架</p>
							
						</template>
					</el-table-column>
					<el-table-column prop="score" label="商品积分值" width="100px"></el-table-column>
					<el-table-column prop="limitNum" label="限兑数量" width="100px"></el-table-column>
					<el-table-column prop="createTime" label="创建时间"></el-table-column>
					<el-table-column prop="goodsSrcDict" label="商品来源" width="120px"></el-table-column>
					<el-table-column  label="操作" width="180">
						<template slot-scope="scope" >
							<div class="operate">
							<p @click="details(scope.row,0)" class="editText">查看</p>
							<p v-if="scope.row.status==0" @click="details(scope.row,1)" class="editText">编辑</p>
							<p v-if="scope.row.status==0" @click="deleteid(scope.row.id)"  class="deleteText">删除</p>
							<p v-if="scope.row.status==0" @click="updownid(scope.row.id,0)"  class="editText">上架</p>
							<p v-if="scope.row.status==1" @click="updownid(scope.row.id,1)" class="editText">下架</p>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</div>
		<!--弹窗-->

		<div class="pageDialog" slot="pageDialog">
			<el-dialog  title="美胜商品选择" :visible.sync="params.importMenu" width="800px" back-backdrop='static' center>
			<importGoods  v-on:reload="loadMessage"></importGoods>	
			</el-dialog>
			<el-dialog v-if="params.detailMenu" :title="params.title" :visible.sync="params.detailMenu" width="600px" back-backdrop='static' center>
			<goodsDetail :param="params" v-on:reload="loadMessage"></goodsDetail>
			</el-dialog>
            <el-dialog title="删除" :visible.sync="params.deleteMenu" width="30%" back-backdrop='static' center>
            	<div >
                <p>是否要删除该商品？</p>
                <div class="button">
                	 <el-button type="primary" @click="deleteShop">确定</el-button>
               <el-button @click="params.deleteMenu=false" >取消</el-button>
                </div>
             
              
            	</div>
			
			</el-dialog>
			<el-dialog :title="params.updownname" :visible.sync="params.upstore" width="400px" back-backdrop='static' center>
            	<div >
                <p v-if="params.updownname=='上架'">是否要上架该商品？</p>
                <p v-else>是否要下架该商品？</p>
                <div class="button">
                	 <el-button type="primary" @click="updown">确定</el-button>
               <el-button @click="params.upstore=false">取消</el-button>
                </div>
	         </div>
			
			</el-dialog>
			
		</div>
	</template-page>
</template>

<script>
	import templatePage from '../template/templatePage'
	import http from '../../utils/http.js'
	import URL from '../../utils/url.js'
	import validation from '@/utils/validation.js'
	
	import importGoods from "./part/importGoods"
	import goodsDetail from "./part/goodsDetail"
	
	export default {
		data() {
			return {
				params: {
					importMenu:false,
					detailMenu:false,
					deleteMenu:false,
					upstore:false,
					updownname:"",
					deleteID:1,
					updownID:1,
					operate:1,
					goodDetail:{},
					title:'',
					//-----------------------------
					
					infor: [],
					
				    inforsrc:[{}],
					search: {
						status: "",
						goodsSrcDictId: '',
						name: '',
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
			importGoods,
			goodsDetail
		},
		methods: {
			changeData(){
				let _self = this;
				_self.params.pagination.pageNum='1';
				_self.params.pagination.currentPage=_self.params.pagination.pageNum;
				_self.loadMessage()
			},
			createShop(){
				let _self = this;
				_self.params.detailMenu=true;
			    _self.params.title="新建商品";
			    _self.params.operate=2;
			},
			details(val,ope){
				let _self = this;
				_self.params.detailMenu=true;
				_self.params.operate=ope;
				if(ope==0){
					_self.params.title="查看商品"
				}else if(ope==1){
					_self.params.title="编辑商品"
				}
				_self.params.goodDetail=val;
			
			},
		    deleteid(val){
		    	let _self = this;
				_self.params.deleteMenu=true;
				_self.params.deleteID=val;
		    },
		    updownid(val,updown){
		    	let _self = this;
				_self.params.upstore=true;
				_self.params.updownID=val;
				if(updown==0){
					_self.params.updownname="上架"
				}else{
					_self.params.updownname="下架"
				}
		    },
			deleteShop(val){
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.GOODS_DELETE;
				let msg = {
					id:_self.params.deleteID,
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest('DELETE', url, '', function(res) {
					_self.params.deleteMenu = false;
					_self.loadMessage();
				}, function(res) {})
			},
			updown(){
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.UPDOWN_GOOD;
				let msg = {
					id:_self.params.updownID,
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest('PUT', url, '', function(res) {
					_self.params.upstore = false;
					_self.loadMessage();
				}, function(res) {})
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
			loadSRC() {
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.GOODS_SRCDICT;
				let params = http.params;
				http.publicRequest('get', url, '', function(res) {
					let result = res.body.data;
					_self.params.inforsrc = result;
					console.log(_self.params.inforsrc)
				}, function(res) {})
			},
			loadMessage() {
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.GOODS_LIST;
				let msg = {
					id: 0,
					pageNum: pagination.pageNum,
					pageSize: pagination.pageSize,
					name: search.name,
					goodsSrcDictId: search.goodsSrcDictId,
					status: search.status,
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
			this.loadSRC();
		}
	}
</script>

<style lang="less" scoped>
	.shopsList {
		.operate{
			display: flex;
		    cursor: pointer;
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
		.pageDialog{
			.button{
				margin-top: 80px;
			}
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