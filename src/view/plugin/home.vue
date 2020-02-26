<template>
	<div class="layout">
		<el-container>
			<el-header>
				<div class="logo">运营管理后台 </div>
				<el-menu :default-active="String(userInfor.choose.first)" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#02af81" text-color="#ffffff" active-text-color="#ffffff">
					<el-menu-item :index="String(index)" v-for="(item,index) in userInfor.menu" :key="index">{{item.title}}</el-menu-item>
				</el-menu>
				<div class="userinfo">
					<img src="../../../static/index/admin.png">
					<el-dropdown trigger="hover">
						<span class="el-dropdown-link userinfo-inner">

            	 <span style="margin-left: 10px;font-size: 12px;">欢迎您！{{$store.state.user.userInfor.userName}} </span>
						<img src="../../../static/index/triangle.png" style="width: 10px;height:6px;margin-top: 28px;">
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="loginOut">修改密码</el-dropdown-item>
							<!--<el-dropdown-item divided @click.native="loggedOut">退出登录</el-dropdown-item>-->
						</el-dropdown-menu>
					</el-dropdown>
					<span @click="params.deleteMenu=true">
						<img style="margin-left: 20px;cursor: pointer;" src="../../../static/index/tchu.png" >
					</span>

				</div>
			</el-header>
			<div class="breadcrumb">
				<div class="breadcrumb_left">
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item>{{userInfor.menu[userInfor.choose.first].title}}</el-breadcrumb-item>
						<el-breadcrumb-item v-if="userInfor.menu[userInfor.choose.first].children.length !== 0 && String(userInfor.choose.second).indexOf('-')<0 ">{{userInfor.menu[userInfor.choose.first].children[userInfor.choose.second].title}}</el-breadcrumb-item>
						<el-breadcrumb-item v-if="userInfor.menu[userInfor.choose.first].children.length !== 0 && String(userInfor.choose.second).indexOf('-')>=0 ">{{userInfor.menu[userInfor.choose.first].children[userInfor.choose.second.split('-')[0]].title}}</el-breadcrumb-item>
						<el-breadcrumb-item v-if="userInfor.menu[userInfor.choose.first].children.length && String(userInfor.choose.second).indexOf('-')>0   &&  userInfor.menu[userInfor.choose.first].children[userInfor.choose.second.split('-')[0]].children.length">{{userInfor.menu[userInfor.choose.first].children[userInfor.choose.second.split('-')[0]].children[userInfor.choose.second.split('-')[1]].title}}</el-breadcrumb-item>
					</el-breadcrumb>
				</div>
			</div>
			<el-main>
				<div class="menu" style="background-color='#2a4151'">
					<el-menu :default-active="String(userInfor.choose.second)" class="el-menu-vertical-demo" :unique-opened="params.unique_opened" background-color="#2a4151" @open="handleOpen" @close="handleClose">
						<div v-for="(item,index) in userInfor.menu[userInfor.choose.first].children" :key="index">
							<el-menu-item @click="handleList([String(index),item])" :index="String(index)" v-if="item.children.length==0">
				               <img  :key="index" :src="'./static/index/simple'+(index+1)+'.png'"  style="width: 17px;height: 17px;margin-top: 5px;">
				
								<span slot="title" class="title"><span style="margin-left: 20px;">{{item.title}}</span></span>
							</el-menu-item>
							<el-submenu :index="String(index)" v-if="item.children.length">
								<template slot="title">
									  <img  :key="index" :src="'./static/index/simple'+(index+1)+'.png'" style="width: 17px;height: 17px;margin-top: 5px;">
									<span slot="title" v-if="!params.isCollapse" class="title"><span style="margin-left: 20px;">{{item.title}}</span></span>
								</template>
								<el-menu-item class="menu-item" @click="handleList([index+'-'+Number(key),i])" :index="index+'-'+Number(key)" v-for="(i,key) in userInfor.menu[userInfor.choose.first].children[index].children" :key="key"><span style="margin-left: 14px;">{{i.title}}</span></el-menu-item>
							</el-submenu>
						</div>
					</el-menu>
				</div>
				<div class="contian">
					<div class="main-contain">
						<router-view></router-view>
					</div>
				</div>
			</el-main>
			<!-- <el-footer>
				<span>2018-2026 &copy; 江西君风科技有限公司</span>
      </el-footer>-->
		</el-container>
		<el-dialog title="退出登录" :visible.sync="params.deleteMenu" width="25%" back-backdrop='static' center>
			<p>是否退出登录？</p>
			<div class="button">
				<el-button type="primary" @click="loggedOut">确定</el-button>
				<el-button @click="params.deleteMenu=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				params: {
					deleteMenu: false,
					unique_opened: true,
					isCollapse: false
				}
			};
		},
		computed: {
			userInfor() {
				return this.$store.state.user;
			}
		},
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			routerCheck(item) {
				let _self = this;
				_self.$router.push(item.path);
			},
			loggedOut() {
				let _self = this;
				_self.$store.commit("loggedOut");

			},
			loginOut() {
				let _self = this;
				let url = "/modifyPwd";
				_self.$router.push(url);
			},
			CollapseType() {
				let _self = this;
				_self.params.isCollapse = !_self.params.isCollapse;
			},
			handleSelect(key, keyPath) {
				let _self = this;
				_self.params.isCollapse = false;
				_self.$store.commit("chooseType", key);
			},
			handleList(key) {
				let _self = this;
				_self.$store.commit("handleList", key);
			}
		},
		created() {
			let _self = this;
			console.log(this.userInfor.choose.first)
			console.log(typeof this.$store.state.user.menu)
		}
	};
</script>
<style lang="less" scoped>
	.el-menu-item.is-active {
		background-color: #02af81 !important;
		color: #fff;
		border-bottom-color: #02af81 !important;
	}
	
	.button {
		margin-top: 60px;
	}
	
	.el-menu-item {
		font-size: 14px;
		color: #fff;
	}
	
	.menu {
		overflow-y: auto;
		background-color: #2a4151;
		.title {
			color: #ffffff;
		}
	}
	
	.layout {
		height: 100%;
		overflow: hidden;
		.el-header,
		.el-main,
		.el-footer {
			width: 100%;
			position: absolute;
			background-color: #363f4e;
			// background-color: #545c64;
		}
		.el-header {
			top: 0;
			text-align: left;
			line-height: 60px;
			background-color: #2a4151;
			padding: 0;
			z-index: 9999;
			.logo {
				display: inline-block;
				color: #fff;
				float: left;
				text-align: center;
				width: 200px;
				margin-right: 100px;
				font-size: 20px;
			}
			.el-menu {
				display: inline-block;
			}
			.userinfo {
				padding-right: 20px;
				float: right;
				height: 60px;
				.lineBar {
					display: inline-block;
				}
				.userinfo-inner {
					cursor: pointer;
					color: #fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
		}
		.breadcrumb {
			position: absolute;
			top: 60px;
			line-height: 30px;
			left: 0;
			width: 100%;
			background-color: #fff;
			display: flex;
			justify-content: space-between;
			.breadcrumb_left {
				padding: 9px 10px;
				display: inline-block;
			}
		}
		.el-main {
			top: 90px;
			bottom: 0px;
			padding: 0;
			height: auto;
			background-color: #fff;
			display: flex;
			.layou-left-menu {
				height: 100%;
			}
			.el-menu {
				border-right: none;
			}
			.contian {
				background-color: #f6f7f9;
				flex: 1;
				padding: 0 0 10px 0;
				overflow: auto;
				.main-contain {
					min-width: 1000px;
					padding: 15px;
				}
			}
		}
		.el-footer {
			bottom: 0;
			color: #fff;
			line-height: 60px;
		}
	}
	
	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 200px;
		min-height: 400px;
		text-align: left;
	}
</style>