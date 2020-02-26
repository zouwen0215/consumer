<template>
	<div class="login">

		<div>
			<div class="logo">
				<img src="../../../static/index/dl.png" />

			</div>
		</div>
		<div>
			<div class="back">
				<img src="../../../static/index/back.png" />
			</div>
			<div class="contain">

				<div class="title">
					<img src="" />
					<p>登录账号</p>
				</div>
				<el-form :model="params" :rules="rules" ref="params" class="demo-ruleForm">
				<el-form-item prop="username" >
				<div class="input">
					<span><img src="../../../static/index/user.png"/></span>
					<input class="elput" v-model="params.username" placeholder="用户名"></input>
				</div>
				</el-form-item>
				<el-form-item prop="password" >
				<div class="input">
					<span><img src="../../../static/index/password.png"/></span>
					<input  class="elput" type="password" v-model="params.password" placeholder="密码"></input>
				</div>
					</el-form-item>
					<el-form-item >
				<div class="btn">
					<el-button class="button" type="primary" v-on:click="onSubmite('params')" @keyup.enter="login"><span>登 录</span></el-button>
				</div>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import http from '@/utils/http.js'
	import URL from '@/utils/url.js'
	import validation from '@/utils/validation.js'
	import md5 from 'js-md5';
	export default {
		data() {
			
			return {
				rules:{
					username: [{
						    required: true,
							message: "请输入用户名",
							trigger: "blur"
						}, 
					],
					password: [{
						    required: true,
							message: "请输入密码",
							trigger: "blur"
						},
					],
				},
				params: {
					tokenString: "",
					randomCode: "",
					username: '',
					password: '',
				}
			}
		},
		methods: {
			onSubmite(formData) {
				let _self = this;
				_self.$refs[formData].validate(valid => {
					if(valid) {
						_self.login();
					}
				});
			},
			login: function() {
				let _self = this;
				//_self.$router.push({ path:'/plugin/home'  })
				//let pwd =self.params.password
				//let pwds = md5(_self.params.password);
				//let pwd = pwds + _self.params.tokenString + _self.params.randomCode;
				let body = {
					//userName: _self.params.username,
					//password: pwd 
					///password: pwd ? md5(pwd) : "",

				};
				
			  
				_self.$store.commit('managementLogin', body)
			},
			getToken() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.GET_TOKENS;
				http.publicRequest('get', url, '', function(res) {
					let result = res.body.data;
					_self.params.tokenString = result.tokenString;
					_self.params.randomCode = result.randomCode;
					sessionStorage.setItem("tokenString", result.tokenString)
					console.log(result)
				}, function(res) {})
			},
		},
		created() {
			//this.getToken()
		}
	}
</script>

<style lang="less" scoped>
	.login {
		width: 100vw;
		height: 100vh;
		display: flex;
		&>div:nth-child(1) {
			flex: 1;
			background-color: #28b87b;
			background-size: 100% 100%;
			position: relative;
			.logo {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				img {
					width: 50vw;
					margin-bottom: 30px;
				}
				p {
					font-size: 24px;
					color: #F0FBF7;
				}
			}
		}
		&>div:nth-child(2) {
			width: 38vw;
			min-width: 350px;
			position: relative;
			background-color: #3d3d3d;
			.back {
				img {
					width: 32vw;
					max-height:600px;
					margin-left: 24%;
				}
			}
			.contain {
				padding: 50px;
				position: absolute;
				top: 50%;
				left: 50%;
				text-align: center;
				transform: translate(-50%, -50%);
				.title {
					display: flex;
					p {
						font-size: 34px;
						color: #21bf83;
						margin: 0 auto;
						margin-bottom:35px;
					}
				}
				.input {
					display: flex;
					width: 23vw;
					margin-top: 40px;
					border: solid 1px #868686;
					border-radius: 5px;
					span {
						font-size: 48px;
						color: #aaaaaa;
						text-align: left;
						line-height: 52px;
					}
					
					.elput {
						background-color: rgba(0, 0, 0, 0);	
						border-radius: 5px;
						border: none;
						height:48px;
						width:100%;
						color: #FFFFFF;
						font-size: 18px;
						
						padding-left: 50px;
					}
					img {
						position: absolute;
						margin-left: 12px;
						margin-top: 12px;
						width: 22px;
						height: 24px;
					}
				}
				.btn {
					margin-top: 50px;
					.el-button {
						width:100%;
						height:48px;
						span {
							font-size:24px ;
							width: 24px;
							color: #ffffff;
						}
					}
				}
			}
		}
	}
</style>