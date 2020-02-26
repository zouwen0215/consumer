<template>
	<div class="addPrivilege">
		<el-form ref="form" :model="param.addInfor" label-width="100px" :rules="rules">
			<el-form-item label="用户名" prop="userName">
				<el-input v-model="param.addInfor.userName" placeholder="请输入用户名" :disabled="param.optType=='edit'"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password" v-if="param.optType=='creat'">
				<el-input placeholder="请输入密码" type="password" v-model="param.addInfor.password" show-password :disabled="param.optType=='edit'"></el-input>
			</el-form-item>
			<el-form-item label="姓名" prop="cnName">
				<el-input v-model="param.addInfor.cnName" placeholder="请输入姓名" :disabled="param.optType=='edit' "></el-input>
			</el-form-item>
			<el-form-item label="手机号" prop="mobile">
				<el-input type="number" v-model="param.addInfor.mobile" placeholder="请输入手机号" @keyup.native="doLogin" :disabled="param.optType=='edit'"></el-input>
			</el-form-item>
			<!--<el-form-item label="">
				<el-radio-group v-model="param.addInfor.loginType">
					<el-radio :label="String(0)">公众号端</el-radio>
					<el-radio :label="String(1)">后台管理端</el-radio>
				</el-radio-group>
			</el-form-item>-->
			<el-form-item  label="角色" prop="roleId">
				<el-select v-model="param.addInfor.roleId" placeholder :disabled="params.disableflag">
					<el-option v-for="item in params.roleList" :key="item.value" :label="item.name" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-button v-if="!params.disableflag" type="primary" @click="onSubmites('form')" style="margin-right:40px;">保存</el-button>
			<el-button @click="param.addMenu = false">取 消</el-button>
		</el-form>
	</div>
</template>

<script>
	import http from "@/utils/http.js";
	import URL from "@/utils/url.js";
	import common from "@/utils/common.js";
	import validation from "@/utils/validation.js";
	import md5 from "js-md5";
	export default {
		data() {
			return {
				rules: {
					userName: [{
							required: true,
							message: "用户名不能为空",
							trigger: "blur"
						},
						{
							min: 1,
							max: 30,
							message: "用户名不超过30个字"
						}
					],
					password: [{
							required: true,
							message: "密码不能为空",
							trigger: "blur"
						},
						{
							min: 1,
							max: 30,
							message: "密码不超过30个字"
						}
					],
					cnName: [{
							required: true,
							message: "姓名不能为空",
							trigger: "blur"
						},
						{
							min: 1,
							max: 30,
							message: "姓名不超过30个字"
						}
					],
					roleId: [{
						required: true,
						message: "请选择角色",
						trigger: "blur"
					}],
					mobile: [{
							required: true,
							message: "手机号不能为空",
							trigger: "blur"
						},
						{
							min: 11,
							max: 11,
							message: "请输入11位手机号码"
						}
					],
					gridCode: [{
						required: true,
						message: "管理区域内容不能为空",
						trigger: "blur"
					}]
				},
				params: {
					roleList: [],
					loginType: '1',
					flag: false,
					disableflag:false
				}
			};
		},
		props: {
			param: {
				default: function() {
					return {}
				}
			}
		},
		methods: {
			onSubmites(formData) {
				let _self = this;
				_self.$refs[formData].validate(valid => {
					if(valid) {
						_self.onSubmite();
					}
				});
			},

			doLogin() {
				let _self = this;
				_self.param.addInfor.mobile = _self.param.addInfor.mobile.replace(
					/([^0-9])+/g,
					""
				);
			
			},
			
			onSubmite() {
				let _self = this;
				let url = URL.PROJECT.SCORE
			    let methodType = "POST";
				if("edit" == _self.param.optType) {
					console.log("edit")
					url += URL.PORTNAME.UPDATE_USER
					methodType = "PUT";
				} else {
					url += URL.PORTNAME.ADD_USER
				}
			
				let body = {
					id: _self.param.addInfor.id,
					userName: _self.param.addInfor.userName,
					cnName: _self.param.addInfor.cnName,
					mobile: _self.param.addInfor.mobile,
					remark: _self.param.addInfor.remark,
					loginType:'opc',
					roleId: _self.param.addInfor.roleId,
					gridCode: _self.param.addInfor.gridCode,
					password: _self.param.addInfor.id ? _self.param.addInfor.password : md5(_self.param.addInfor.password)
				};
				http.publicRequest(
					methodType,
					url,
					body,
					function(res) {
						_self.param.addMenu = false;
						_self.$emit("reload");
					},
					function(res) {}
				);
			},
     
			addRoles() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.SELECT_ROLE_LIST;
				let msg = {
					id: 0,
					roleName:'',
					isStop:'',
					pageNum:1,
					pageSize:10000,
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest(
					"get",
					url,
					"",
					function(res) {
						let result = res.body.data;
						for(let key of result) {
							let roles = {
								value: key.id,
								name: key.roleName
							};
							_self.params.roleList.push(roles);
						}
					},
					function(res) {}
				);
			}
		},
		created() {
			let _self = this;
           if(_self.param.optType=='creat'){
           	_self.param.addInfor={}
           }else{
           	if(	_self.param.addInfor.userName=='admin'){
           		_self.params.disableflag=true
           	}
           }
            
			_self.addRoles();

		}
	};
</script>

<style lang="less" scoped>
	.addPrivilege {
		.el-form-item {
			text-align: left;
			textarea {
				resize: none;
			}
		}
	}
</style>