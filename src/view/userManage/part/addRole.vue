<template>
	<div class="addRole">
		<el-form ref="form" :model="param.roleInfor" label-width="100px" :rules="rules">
			<div class="editBox">
				<div>
					<el-form-item label="角色名称" prop="roleName">
						<el-input v-model="param.roleInfor.roleName" placeholder="请输入内容" :disabled="param.roleInfor.flag"></el-input>
					</el-form-item>
					<el-form-item label="备注">
						<el-input class="w150" autosize resize='none' type="textarea" :rows="5" placeholder="请输入备注" v-model="param.roleInfor.remark"></el-input>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="权限" prop="config">
						<!--<textarea
          autosize
          rows="6"
          class="w200"
          v-model="params.info.config"
          placeholder="请输入内容"
            ></textarea>-->
						<el-tree class="w300" :data="params.menu" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="params.defaultProps"></el-tree>
					</el-form-item>
				</div>
			</div>
			<div>
				<el-button type="primary" v-if="param.roleInfor.id!=1" @click="onSubmite('form')" style="margin-right:40px;">保存</el-button>
				<el-button @click="param.roleMenu = false">取 消</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
	import http from "@/utils/http.js";
	import URL from "@/utils/url.js";
	import common from "@/utils/common.js";
	import validation from "@/utils/validation.js";
	import path from "@/assets/json/path.json";
	export default {
		data() {
			return {
				rules: {
					roleName: [{
							required: true,
							message: "角色名称不能为空",
							trigger: "blur"
						},
						{
							min: 1,
							max: 30,
							message: "角色名称不超过30个字"
						}
					],
					// config: [
					//   {
					//     required: true,
					//     message: "权限不能为空",
					//     trigger: "blur"
					//   }
					// ]
				},
				params: {
					flag: false,
					roleList: [],
					info: {
						roleName: "",
						remark: ""
					},
					menu: [],
					defaultProps: {
						children: "children",
						label: "label"
					}
				}
			};
		},
		props: {
			param: {
				roleInfor: {}
			}
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
			onSubmites() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.ADD_ROLES_LIST;
				let method = _self.param.roleInfor.id ? "put" : "post";
				console.log(_self.$refs.tree.getCheckedKeys())
				let body = {
					id: _self.param.roleInfor.id,
					roleName: _self.param.roleInfor.roleName,
					remark: _self.param.roleInfor.remark,
					config: JSON.stringify(_self.$refs.tree.getCheckedKeys())
				};
				http.publicRequest(
					method,
					url,
					body,
					function(res) {
						_self.param.roleMenu = false;
						_self.$emit("reload");
					},
					function(res) {}
				);
			},
			disabledSet(TreeViewNodeTmp) {
				let _self = this;
				if(TreeViewNodeTmp.length) {
					for(var i = 0; i < TreeViewNodeTmp.length; i++) {
						TreeViewNodeTmp[i].disabled = true;
						_self.disabledSet(TreeViewNodeTmp[i].children)
					}
				} else {
					TreeViewNodeTmp.disabled = true;
				}

			},
			set(TreeViewNodeTmp) {
				let _self = this;
				for(var i = 0; i < TreeViewNodeTmp.length; i++) {
					console.log(TreeViewNodeTmp[i].limit)
					if(TreeViewNodeTmp[i].limit) {
						let has = false;
						TreeViewNodeTmp[i].limit.forEach(function(obj, index) {
							if(obj == _self.$store.state.user.userInfor.currentChannel) {
								has = true;
							}
						})
						if(has) {
							if(TreeViewNodeTmp[i].children.length) {
								_self.set(TreeViewNodeTmp[i].children)
							}
						} else {
							TreeViewNodeTmp.splice(i, 1)
							i--;
						}

					} else {
						if(TreeViewNodeTmp[i].children.length) {
							_self.set(TreeViewNodeTmp[i].children)
						}
					}
				}
			},
		},

		created() {
			let _self = this;

			_self.params.menu = JSON.parse(
				JSON.stringify(path.menu).replace(/title/g, "label")
			);
			_self.set(_self.params.menu);
			if(_self.param.roleInfor.id==1){
				_self.disabledSet(_self.params.menu);
			}
			setTimeout(function() {
				//    _self.$refs.tree.setCheckedKeys([]);
				if(_self.param.roleInfor.id) {
					_self.$refs.tree.setCheckedKeys([]);
					_self.$refs.tree.setCheckedKeys(
						JSON.parse(_self.param.roleInfor.config)
					);
				} else {
					_self.$refs.tree.setCheckedKeys([]);
					_self.param.roleInfor.flag = false;
				}
			}, 200);
			//
			//  http.$on("roleInfor", function(data) {
			//  	console.log("flag",_self.param.roleInfor.flag)
			//    setTimeout(function() {
			//      if (_self.param.roleInfor.id) {
			//        _self.$refs.tree.setCheckedKeys([]);
			//        _self.$refs.tree.setCheckedKeys(
			//          JSON.parse(_self.param.roleInfor.config)
			//        );
			//      }else{
			//      	_self.param.roleInfor.flag=false;
			//      }
			//    }, 200);     
			//  });
		}
	};
</script>

<style lang="less" scoped>
	.addRole {
		.editBox {
			display: flex;
			justify-content: space-between;
		}
		.el-form-item {
			text-align: left;
			.el-tree {
				height: 400px;
				overflow-y: auto;
			}
			textarea {
				resize: none;
			}
		}
	}
</style>