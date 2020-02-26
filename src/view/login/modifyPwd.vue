<template>
	<div class="aaa">
		<div class="logo">
			<span>
				<img src="../../../static/index/editpass.png"/>
			</span>
       <p>修改密码</p>
		</div>

		<div class="modifyPwd">
			<div class="form" style="margin-right: 130px;">
				<el-form ref="form" :model="params.info" :rules="rules">
					<el-form-item prop="oldPwd"><span>请输入原密码:</span>
						</span>
						<el-input type="password" v-model="params.info.oldPwd" ></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<span>请输入新密码:</span>
						<el-input type="password" v-model="params.info.password" show-password></el-input>
					</el-form-item>
					<el-form-item prop="passwordTwo">
						<span>请再次输入新密码:</span>
						<el-input type="password" v-model="params.info.passwordTwo" show-password></el-input>
					</el-form-item>
					<el-form-item class="button">
					<el-button type="primary" @click="onSubmite('form')">确定</el-button>
					<el-button style="margin-left: 100px;" @click="concel">取 消</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import http from "@/utils/http.js";
	import URL from "@/utils/url.js";
	import common from "@/utils/common.js";
	import validation from "@/utils/validation.js";
	import md5 from 'js-md5';
	export default {
		data() {
			return {
				rules: {
					password: [{
							required: true,
							message: "请输入密码",
							trigger: "blur"
						},
						{
							min: 1,
							max: 30,
							message: "密码不超过30个字符"
						}
					],
					oldPwd: [{
						validator: this.validateConfig,
						trigger: 'blur'
					}],
					passwordTwo: [{
						validator: this.validateConfigs,
						trigger: 'blur'
					}],
				},
				params: {
					roleList: [],
					info: {
						oldPwd: "",
						password: "",
						passwordTwo: "",
					},
				}
			};
		},

		methods: {
			onSubmite(formData) {
				let _self = this;
				_self.$refs[formData].validate(valid => {
					if(valid) {
						_self.onSubmites();
					}
				});
			},
      concel(){
      	
      },
			validateConfig(rule, value, callback) {
				let _self = this;
				let olds = _self.$store.state.user.userInfor.password;

				if(value != "" && md5(value) == olds) {
					callback();
				} else {
					callback(new Error('密码输入错误，请重新输入'));
				}
			},
			validateConfigs(rule, value, callback) {
				let _self = this;
				if(value == _self.params.info.password) {
					callback();
				} else {
					callback(new Error('两次密码输入不一致'));
				}
			},
			onSubmites() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.PASSWARD_EDIT;
				let msg = {
					password: md5(_self.params.info.password),
				};
				url = http.filterUrl(msg, url);
				http.publicRequest('put', url, "", function(res) {
					_self.$store.commit("loggedOut");
				}, function(res) {})
			},
			concel(){
				let _self = this;
				_self.params.info.oldPwd=''
				_self.params.info.password=''
				_self.params.info.passwordTwo=''
			}

		},
		created() {
			let _self = this;

		}
	};
</script>

<style lang="less" scoped>
	.aaa {
		padding-top: 40px;
		padding-left:63px;
		padding-right: 63px;
		.logo{
			display:flex;
			img{
				width: 22px;
	         height: 24px;
			}
			p{
				margin-left: 10px;
				margin-top: 3px;
				font-size: 21px;
				color: #475669;
			}
		}
		.modifyPwd {
			margin-top: 20px;
			padding-top: 20px ;
			padding-bottom: 20px;
			
			padding-right:30%;
			background: #fff;
		
		.form{
			text-align:right;
		
			.el-input{
				width: 180px;
			
			}
		      	
		}
		
		}
	}
</style>