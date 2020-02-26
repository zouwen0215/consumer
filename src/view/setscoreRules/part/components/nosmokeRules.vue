<template>
	<el-form :model="params" :rules="rules" ref="params" class="demo-ruleForm">
		<div class="titleone">
			<p style="border-bottom: 3px solid #02af81;padding-left: 3px;padding-right: 3px;width: 50px;">内容</p>
			<div class="line"></div>
		</div>
		<el-form-item  style="margin-top: 35px;" prop="holdup">
		<p  v-if="param.addGetoruse==2">每购买<el-input v-model="params.buyMoney" maxlength="8"></el-input>元非烟商品，获得<el-input v-model="params.points"></el-input>积分。</p>
		<p v-if="param.addGetoruse==4">每购买<el-input v-model="params.buyMoney" maxlength="8"></el-input>元非烟商品，可使用<el-input v-model="params.points"></el-input>积分。</p>
		</el-form-item>
		<div class="titleone" style="margin-top:25px;margin-bottom: 45px;">
			<p style="border-bottom: 3px solid #02af81;padding-left: 3px;padding-right: 3px;width: 100px;">生效时间</p>
			<div class="line"></div>
		</div>
		<el-form-item >
			<span style="font-size: 12px;">日期选择：</span>
	     <el-date-picker v-model="params.data_list" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" :editable="false" :picker-options="params.pickerOptions" :disabled="params.readOnly"></el-date-picker>
		</el-date-picker>
		</el-form-item>
		<el-form-item>
		<div class="button">
		<el-button type="primary" @click="onSubmite('params')">确定</el-button>
		<el-button @click="param.addnosmokeMenu=false">取消</el-button>
		</div>
		</el-form-item>
	</el-form>
</template>

<script>
	import http from "@/utils/http.js";
	import URL from "@/utils/url.js";
	import common from "@/utils/common.js";
	import validation from "@/utils/validation.js";
	export default {
		data() {
			return {
				rules: {
						holdup: [ {
							validator: this.holdup,
							trigger: "blur"
						},

					]
				},
					
				params: {
						pickerOptions: {
						disabledDate(time) {
							return time.getTime() < Date.now();
						}
					},
					checkedCities: [],
					content: "",
					configJson: {},
					points:'',
					buyMoney:"",
			        data_list:[],
                    
				}
			}

		},
		props: {
			param: {
				default: function() {
					return {}
				}
			}
		},

		methods: {
			onSubmite(formData) {
				let _self = this;
				_self.$refs[formData].validate(valid => {
					if(valid) {
						_self.addmenu();
					}
				});
			},
			holdup(rule, value, callback) {
				let _self = this;
				if( _self.params.buyMoney == "") {
					callback(new Error("请输入金额"));
				}if( !/^[1-9]{1}[0-9]{0,7}$/.test( _self.params.buyMoney)) {
					callback(new Error("金额必须为整数型"));
				}if( _self.params.points == "") {
					callback(new Error("请输入积分值"));
				}if( !/^[1-9]{1}[0-9]{0,4}$/.test( _self.params.points)) {
					callback(new Error("积分值必须为大于0小于99999的整数"));
				}
				else {
					callback();
				}

			},
				getDate() {
				let _self = this;
				var date = new Date();
				date.setDate(date.getDate()+1);
				var seperator = "-";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				
				var strDate = date.getDate();
				
				month=month>9?month:"0"+month;				
				strDate=strDate>9?strDate:"0"+strDate;
				
				_self.params.data_list[0] = year + seperator + month + seperator + strDate;
				_self.params.data_list[1] = year + seperator + month + seperator + strDate;

			},
			modifydata() {
				let _self = this;
				let data = _self.param.ruleDetail.configJson;
				console.log(_self.param.ruleDetail)
				_self.params.data_list[0] = data.startTime;
				_self.params.data_list[1] = data.endTime;
				_self.params.points = data.points;
				_self.params.buyMoney=data.buyMoney;
			
			},
          dealdata() {
				//				debugger
				let _self = this;
				let con, con1, con2= "";
				if(_self.param.addGetoruse==2) {
					con1 = "每购买" + _self.params. buyMoney+ "元非烟商品,获得" + _self.params. points+ "积分"
					console.log(con1)
				} else {
					con1 = ""
				}
				if(_self.param.addGetoruse==4) {
					con2 = "每购买" + _self.params. buyMoney+ "元非烟商品,可使用" + _self.params. points+ "积分"
					console.log(con2)
				} else {
					con2 = ""
				}
				
				con = con1 + con2
				_self.params.content = con 
				let contenttep = {
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",
					points: _self.params.points,
					buyMoney: _self.params.buyMoney,
				}
				_self.params.configJson = JSON.stringify(contenttep)
			},

				addmenu() {
				let _self = this;
				_self.dealdata();
				let url = URL.PROJECT.SCORE
				let methodType = "POST";
				if("edit" == _self.param.optType) {
					console.log("edit")
					url += URL.PORTNAME.MODIFY_DELETE
					methodType = "PUT";
				} else {
					url += URL.PORTNAME.RULE_SAVE
				}
				//let url = URL.PROJECT.SCORE + URL.PORTNAME.RULE_SAVE;
				let body = {
					id: _self.param.ruleDetail.id,
					type: _self.param.addGetoruse==2?6:7,
					points: _self.params.points,
					content: _self.params.content,
					configJson: _self.params.configJson.replace(/\"/g, '\\\"'),
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",
				};
				http.publicRequest(methodType, url, body, function(res) {
					_self.param.addnosmokeMenu = false;
					common.messageFunc("操作成功", "success");
					_self.$emit("reload");
				}, function(res) {})

			},

			
		},
		created() {
			let _self = this;

			console.log(_self.param.optType)
			if(_self.param.optType == "edit") {
				_self.modifydata();
			}
			if(_self.param.optType == "creat") {
				_self.getDate()
			}
		}

	}
</script>

<style lang="less" scoped>
.button{
	margin-top: 30px;
}
   .line {
   	       
			height: 20px;
			border-bottom: 1px solid #C0C4CC;
			margin-left: 20px;
			margin-top: 2px;
			
			width: 100%;
		}
	.titleone {
		display: flex;
			margin-bottom: 10px;
			p {
				font-size: 14px;
			}
		}
.el-button:first-child{
			margin-right: 20%;
			
		}
p{
	font-size: 12px;
}
	.el-input {
				margin-left: 10px;
				margin-right: 10px;
				width: 100px;
			}
</style>