<template>
	<el-form :model="params" :rules="rules" ref="params" class="demo-ruleForm">
		<div class="limitSetdown">
			<span class="fonttwe" style="margin-left: 20px;">日期选择：</span>
						<el-date-picker v-model="params.data_list" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" :editable="false" :picker-options="params.pickerOptions" :disabled="params.readOnly"></el-date-picker>
			

			<div class="check">
				<el-form-item prop="holdup" style="margin-left: 60px;">
					<div >
						<span class="fonttwe">1积分可抵扣</span>
						<el-input v-model="params.money" ></el-input><span class="fonttwe">元人民币</span>
					</div>
						</el-form-item>
					<div style="margin-left: 60px;">

						<el-checkbox v-model="params.canGetPoint"><span class="fonttwe">使用积分抵扣商品金额时，仍可获得积分</span></el-checkbox>

					</div>
			
			</div>
				<el-form-item>
			<div class="button">
				<el-button type="primary" @click="onSubmite('params')">确定</el-button>
				<el-button @click="param.addlimitMenu = false">取消</el-button>
			</div>
</el-form-item>
		</div>
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
					holdup: [{
							message: "您还有未填写的积分值",
							trigger: "blur"
						}, {
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
					edit: true,
					content: "",
					canGetPoint: false,
					money: "",
					checkedCities: '',
					data_list: [],
					configJson: {},
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
			holdup(rule, value, callback) {
				let _self = this;
				if( _self.params.money == "") {
					callback(new Error("您还有未填写的抵扣金额"));
				}if( !/^(([1-9]{1}[0-9]{0,4})|[0]{0,1})([.]{0}|(([.]{1})([0-9]{0,2})))$/.test( _self.params.money)) {
					callback(new Error("金额必须为数值型，格式x.xx"));
				}
				else {
					callback();
				}
			},
			dealdata() {
				let _self = this;
				let con, con1, con2 = "";
				if(_self.params.money != "") {
					con1 = "1积分可抵扣" + _self.params.money + "元人民币;"
				} else {
					con1 = ""
				}
				if(_self.params.canGetPoint == true) {
					con2 = "使用积分抵扣商品金额时,仍可获得积分"
				} else {
					con2 = ""
				}
				con = con1 + con2
				_self.params.content = con
				let contenttep = {
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",
					money: _self.params.money,
					canGetPoint: _self.params.canGetPoint
				}
				_self.params.configJson = JSON.stringify(contenttep)
				console.log(_self.params.configJson);
			},
			modifydata() {
				let _self = this;
				console.log(_self.param.limitDetail)
				let data = _self.param.limitDetail.configJson;
				console.log("qqqqqqqqqqqqqqqqqqqqqq")

				_self.params.data_list[0] = data.startTime;
				_self.params.data_list[1] = data.endTime;
				_self.params.money = data.money
				_self.params.canGetPoint = data.canGetPoint
				_self.params.optType = data.optType;

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

				let body = {
					id: _self.param.limitDetail.id,
					type: 3,
					points: 0,
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",
					content: _self.params.content,
					configJson: _self.params.configJson.replace(/\"/g, '\\\"')
				};
				http.publicRequest(methodType, url, body, function(res) {
					_self.param.addlimitMenu = false;
					common.messageFunc("操作成功", "success");
					_self.$emit("reload");

				}, function(res) {})
			},
		},
		created() {
			let _self = this;
			if(_self.param.optType == "edit") {
				_self.modifydata();
			}
			if(_self.param.optType == "creat") {
				_self.getDate();
			}
		}
	};
</script>

<style lang="less" scoped>
	.limitSetdown {
			.el-button:first-child{
			margin-right: 20%;
			
		}
		.fonttwe{
			font-size: 12px;
		}
		.button {
			margin-top: 20px;
		}
		.check {
			display: block;
			margin-top: 20px;
			margin-left: -35%;
			.el-checkbox {
				margin-top:10px;
				margin-left: -20px;
			}
			.el-input {
				margin-top: 10px;
				margin-left: 10px;
				margin-right: 10px;
				width: 120px;
			}
		}
	}
</style>