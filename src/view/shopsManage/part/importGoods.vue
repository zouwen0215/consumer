<template>
	<template-page :param="params" class="importGoods" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">
		<div slot="buttonRegion">
			<span>商品名称：</span>
			<el-input v-model="params.search.goodsProductName" placeholder="商品名称"></el-input>
			<el-button class="ml10" type="primary" @click.native="loadMessage">搜索</el-button>
			<el-button @click.native="reset">重置</el-button>
		</div>
		<div slot="pageRegion" class="pageRegion">
			<template>
				<el-table :data="params.infor" border style="width: 100%">
					<el-table-column prop="imageUrl" label="商品图片" >
						<template slot-scope="scope">
							<img class="img" :src="scope.row.imageUrl" />
						</template>
					</el-table-column>
					<el-table-column prop="name" label="商品名称"></el-table-column>
					<el-table-column prop="goodsSrcDictId" label="商品来源" width="100">
						<template slot-scope="scope">
							<p v-if="scope.row.goodsSrcDictId=1">美胜商品</p>
						</template>
					</el-table-column>
					<el-table-column prop="price" label="进货价" width="100"></el-table-column>
					<el-table-column label="操作" width="180">
						<template slot-scope="scope">
							<div style=" cursor: pointer;">
								<p v-if="scope.row.state==0" @click="addmenu(scope.row)" style="color: #F78989">加入积分商城</p>
								<p v-else disabled style="color: #8CC5FF;">已加入积分商城</p>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</div>
		<!--弹窗-->
		<div class="pageDialog" slot="pageDialog">
			<el-dialog v-if="params.addMenu"  title="加入积分商城" :visible.sync="params.addMenu" width="38%" back-backdrop='static' :modal="false" center @close="closechange">
				<el-form ref="form" :model="params.ruleForm" :rules="rules">
					<el-form-item label="请输入商品积分值：" prop="score">
						<el-input v-model="params.ruleForm.score" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="请输入商品限兑数量：" prop="num">
						<el-input v-model="params.ruleForm.num" autocomplete="off"></el-input>
					</el-form-item>
					<p style="text-align: left;font-size: 14px;">注：商品积分值表示消费者在积分商城兑换该商品所使用的积分值，商品限兑数量表示每个用户最大兑换数量，不填或0表示不限量，<span style="color: red;">*</span>为必填选项。</p>
				</el-form>
				<div class="button">
					<el-button type="primary" @click="onSubmite('form')">确定</el-button>
					<el-button @click="concel">取消</el-button>
				</div>
			</el-dialog>
		</div>
	</template-page>
</template>

<script>
	import templatePage from '../../template/templatePage'
	import http from "@/utils/http.js";
	import URL from "@/utils/url.js";
	import common from "@/utils/common.js";
	import validation from "@/utils/validation.js";
	export default {
		data() {
			return {
				rules: {
					score: [{
							required: true,
							message: '请输入商品积分值',
							trigger: 'blur'
						},
						{
							pattern: /^[1-9]{1}[0-9]{0,4}$/,
							message: "商品积分值必须为大于0小于99999的整数"
						}
					],
					num: [{
							validator: this.limitNum,
							trigger: "blur"
					}
					]
				},
				params: {
					addMenu: false,
					ruleForm: {
						score: '',
						num: ''
					},
					//----------------------------

					infor: [],
					search: {
						goodsProductName: "",
					},

					dataForm: {

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
		},
		methods: {
			addmenu(val) {
				let _self = this;
				_self.params.addMenu = true;
				_self.params.dataForm = val;

			},
			limitNum: function(rule, value, callback) {
				let _self = this;

				if(_self.params.ruleForm.num == '') {
					callback();
				}
				if(_self.params.ruleForm.num != '' && !/^[0-9]\d*$/.test(_self.params.ruleForm.num)) {
					callback(new Error("商品限兑数量必须为数值型"));
				} else {
					callback();
				}
			},
			onSubmite(formData) {
				let _self = this;
				_self.$refs[formData].validate(valid => {
					if(valid) {
						_self.addmenuconfirm();
					}
				});
			},
			concel(){
				let _self = this;
				_self.params.ruleForm.score = ''
				_self.params.ruleForm.num =''
				_self.params.addMenu=false
			},
			closechange() {
				let _self = this;
				_self.params.ruleForm.score = ''
				_self.params.ruleForm.num =''
			},
			
			addmenuconfirm() {
				let _self = this;
				if(_self.params.ruleForm.num==''){_self.params.ruleForm.num=0}
				let url = URL.PROJECT.SCORE + URL.PORTNAME.ADD_SHOP;
				let body = {
					goodsSrcDictId: "",
					goodsSrcDictNO: _self.params.dataForm.goodsSrcDictNO,
					name: _self.params.dataForm.name,
					imageUrl: _self.params.dataForm.imageUrl,
					score: Number(_self.params.ruleForm.score),
					limitNum: Number(_self.params.ruleForm.num),

				};
				http.publicRequest("put", url, body, function(res) {
					_self.params.addMenu = false;
					_self.loadMessage()
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
				_self.params.search.goodsId = "";
				_self.loadMessage();
			},
			loadGoodsSrc() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.GOODS_LIST;
				let params = http.params;
				http.publicRequest('get', url, '', function(res) {
					let result = res.body.data;
					_self.params.dataForm.goodsList = result;
				}, function(res) {})
			},
			loadMessage() {
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.MEISHENG_GOOD;
				let msg = {
					id: 0,
					pageNum: pagination.pageNum,
					pageSize: pagination.pageSize,
					goodsProductName: search.goodsProductName,
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest('get', url, '', function(res) {
					_self.params.pagination.total = validation.total(res)
					let result = JSON.parse(JSON.stringify(res.body.data));;
					_self.$emit("reload");
					_self.params.infor = result;
					console.log(_self.params.infor)
				}, function(res) {})
			},
		},
		created() {
			this.loadMessage();
		}
	}
</script>

<style lang="less" scoped>
	.importGoods {
		.img {
			width: 30%;
		}
		.pageRegion{
			overflow:auto ;
			height: 350px;
			margin-top: -20px;
		}
		.pageDialog {
			
			.el-input {
				margin-left: -150px;
			}
			.button {
				margin-top: 40px;
			}
		}
	}
</style>