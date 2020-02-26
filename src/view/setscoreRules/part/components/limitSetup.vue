<template>
	<el-form :model="params" :rules="rules" ref="params" class="demo-ruleForm">

		<div class="limitSetup">
			<span class="fonttwe" style="margin-left: 30px;">日期选择：</span>
			<el-date-picker v-model="params.data_list" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" :editable="false" :picker-options="params.pickerOptions" :disabled="params.readOnly"></el-date-picker>

			</el-date-picker>

			<div class="check">

				<div style="padding-bottom: 20px;padding-left:55px;text-align: left;">
					<el-checkbox-group v-model="params.checkedCities" @change="change">
						<el-form-item prop="holdone">
							<el-checkbox :label="params.ruleList[0].type"><span class="fonttwe">当日到店最多购买</span>
								<el-input v-model.number="params.ruleList[0].number" :disabled="!params.ruleList[0].selected" ></el-input><span class="fonttwe">包卷烟，此后不再获得积分。</span></el-checkbox>
						</el-form-item>
						<el-form-item prop="holdtwo">
							<el-checkbox :label="params.ruleList[1].type"><span class="fonttwe">当日到店最多购买</span>
								<el-input v-model.number="params.ruleList[1].number" :disabled="!params.ruleList[1].selected" ></el-input><span class="fonttwe">条卷烟，此后不再获得积分。</span></el-checkbox>
						</el-form-item>
						<el-form-item prop="holdthree">
							<el-checkbox :label="params.ruleList[2].type"><span class="fonttwe">当日最多可获得</span>
								<el-input v-model.number="params.ruleList[2].number" :disabled="!params.ruleList[2].selected"></el-input><span class="fonttwe">积分，此后不再获得积分。</span></el-checkbox>
						</el-form-item>
						<el-form-item prop="holdfour">
							<el-checkbox :label="params.ruleList[3].type"><span class="fonttwe">当月到店最多购买</span>
								<el-input v-model.number="params.ruleList[3].number" :disabled="!params.ruleList[3].selected" ></el-input><span class="fonttwe">包卷烟，此后不再获得积分。</span></el-checkbox>
						</el-form-item>
						<el-form-item prop="holdfive">
							<el-checkbox :label="params.ruleList[4].type"><span class="fonttwe">当月到店最多购买</span>
								<el-input v-model.number="params.ruleList[4].number" :disabled="!params.ruleList[4].selected" ></el-input><span class="fonttwe">条卷烟，此后不再获得积分。</span></el-checkbox>
						</el-form-item>
						<el-form-item prop="holdsix">
							<el-checkbox :label="params.ruleList[5].type"><span class="fonttwe">当月最多可获得</span>
								<el-input v-model.number="params.ruleList[5].number" :disabled="!params.ruleList[5].selected" ></el-input><span class="fonttwe">积分，此后不再获得积分。</span></el-checkbox>
						</el-form-item>
					</el-checkbox-group>
				</div>

				<el-form-item>
					<div class="button">
						<el-button type="primary" @click="onSubmite('params')">确定</el-button>
						<el-button @click="param.addlimitMenu=false">取消</el-button>
					</div>
				</el-form-item>
			</div>

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
					holdone: [{
							validator: this.holdone,
							trigger: "blur"
						},

					],
					holdtwo: [{
						validator: this.holdtwo,
						trigger: "blur"
					}, ],
					holdthree: [{
							validator: this.holdthree,
							trigger: "blur"
						},

					],
					holdfour: [{
							validator: this.holdfour,
							trigger: "blur"
						},

					],
					holdfive: [{
						validator: this.holdfive,
						trigger: "blur"
					}, ],
					holdsix: [{
							validator: this.holdsix,
							trigger: "blur"
						},

					],
				},
				params: {
					checkedCities: [],
					content: "",
					configJson: {},
					pickerOptions: {
						disabledDate(time) {
							return time.getTime() < Date.now();
						}
					},
					ruleList: [{
							type: "day-slave",
							number: "",
							selected: false
						},
						{
							type: "day-master",
							number: "",
							selected: false
						},
						{
							type: "day-point",
							number: "",
							selected: false
						},
						{
							type: "month-slave",
							number: "",
							selected: false
						},
						{
							type: "month-master",
							number: "",
							selected: false
						},
						{
							type: "month-point",
							number: "",
							selected: false
						}

					],
					data_list: [],

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
			confirmNum(e) {
				let boolean = new RegExp((!/^[0-9]\d*$/).test(e.target.value));　　　
				if(boolean) {
					e.target.value = ""
				}　　
			},
			check(formData) {
				let _self = this;
				_self.$refs['params'].validate(valid => {});
			},
			onSubmite(formData) {
				let _self = this;
				_self.$refs[formData].validate(valid => {
					if(valid) {
						_self.addmenu();
					}
				});
			},
			holdone(rule, value, callback) {
				let _self = this;
				if(_self.params.ruleList[0].selected == true && _self.params.ruleList[0].number == "") {
					callback(new Error("卷烟包数必须为大于0的数值型"));

				}
				if(_self.params.ruleList[0].selected == true && !/^[1-9]\d*$/.test(_self.params.ruleList[0].number)) {
					callback(new Error("卷烟包数必须为大于0的数值型"));
				} else {
					callback();
				}

			},
			holdtwo(rule, value, callback) {
				let _self = this;
				if(_self.params.ruleList[1].selected == true && _self.params.ruleList[1].number == "") {
					callback(new Error("卷烟条数必须为大于0的数值型"));

				}
				if(_self.params.ruleList[1].selected == true && !/^[1-9]\d*$/.test(_self.params.ruleList[1].number)) {
					callback(new Error("卷烟条数必须为大于0的数值型"));
				} else {
					callback();
				}

			},
			holdthree(rule, value, callback) {
				let _self = this;
				if(_self.params.ruleList[2].selected == true) {
					if(_self.params.ruleList[2].number == "") {
						callback(new Error("积分值必须为大于0小于99999的整数"));
					}
					if(!/^[1-9]{1}[0-9]{0,4}$/.test(_self.params.ruleList[2].number)) {
						callback(new Error("积分值必须为大于0小于99999的整数"));
					} else {
						callback();
					}
				} else {
					callback();
				}

			},
			holdfour(rule, value, callback) {
				let _self = this;
				if(_self.params.ruleList[3].selected == true && _self.params.ruleList[3].number == "") {
					callback(new Error("卷烟包数必须为大于0的数值型"));

				}
				if(_self.params.ruleList[3].selected == true && !/^[1-9]\d*$/.test(_self.params.ruleList[3].number)) {
					callback(new Error("卷烟包数必须为大于0的数值型"));
				} else {
					callback();
				}

			},
			holdfive(rule, value, callback) {
				let _self = this;
				if(_self.params.ruleList[4].selected == true && _self.params.ruleList[4].number == "") {
					callback(new Error("卷烟条数必须为大于0的数值型"));

				}
				if(_self.params.ruleList[4].selected == true && !/^[1-9]\d*$/.test(_self.params.ruleList[4].number)) {
					callback(new Error("卷烟条数必须为大于0的数值型"));
				} else {
					callback();
				}

			},
			holdsix(rule, value, callback) {
				let _self = this;
				if(_self.params.ruleList[5].selected == true && _self.params.ruleList[5].number == "") {
					callback(new Error("积分值必须为大于0小于99999的整数"));

				}
				if(_self.params.ruleList[5].selected == true && !/^[1-9]{1}[0-9]{0,4}$/.test(_self.params.ruleList[5].number)) {
					callback(new Error("积分值必须为大于0小于99999的整数"));
				} else {
					callback();
				}

			},
			change(e) {
				let _self = this;

				for(let values in this.params.ruleList) {
					this.params.ruleList[values].selected = false;
				}

				for(let key in e) {
					console.log(key)
					for(let values in this.params.ruleList) {
						if(e[key] == this.params.ruleList[values].type) {
							this.params.ruleList[values].selected = true;
						}

					}
				}
				//				_self.holdsix();
				_self.check();
				console.log(this.params.ruleList)

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
				let data = _self.param.limitDetail.configJson;
				console.log(_self.param.limitDetail)

				_self.params.data_list[0] = data.startTime.length ? data.startTime : '';
				_self.params.data_list[1] = data.endTime.length ? data.endTime : '';

				_self.params.ruleList = data.ruleList;

				_self.params.optType = data.optType;

				let typeArr = [];
				for(let key of data.ruleList) {
					if(key.selected) {
						typeArr.push(key.type);
					}
				}
				_self.params.checkedCities = typeArr;

			},
			dealdata() {
				//				debugger
				let _self = this;
				let con, con1, con2, con3, con4, con5, con6 = "";
				if(_self.params.ruleList[0].number != '') {
					con1 = "当日到店最多购买" + _self.params.ruleList[0].number + "包卷烟,"
					console.log(con1)
				} else {
					con1 = ""
				}
				if(_self.params.ruleList[1].number != '') {
					con2 = "当日到店最多购买" + _self.params.ruleList[1].number + "条卷烟,"
					console.log(con2)
				} else {
					con2 = ""
				}
				if(_self.params.ruleList[2].number != '') {
					con3 = "当日最多可获得" + _self.params.ruleList[2].number + "积分,"
					console.log(con3)
				} else {
					con3 = ""
				}
				if(_self.params.ruleList[3].number != '') {
					con4 = "当月到店最多购买" + _self.params.ruleList[3].number + "包卷烟,"
					console.log(con4)
				} else {
					con4 = ""
				}
				if(_self.params.ruleList[4].number != '') {
					con5 = "当月到店最多购买" + _self.params.ruleList[4].number + "条卷烟,"
					console.log(con5)
				} else {
					con5 = ""
				}
				if(_self.params.ruleList[5].number != '') {
					con6 = "当月最多可获得" + _self.params.ruleList[5].number + "积分,"
					console.log(con6)
				} else {
					con6 = ""
				}
				con = con1 + con2 + con3 + con4 + con5 + con6;
				_self.params.content = con + "此后不再获得积分。";
				let contenttep = {
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",
					ruleList: _self.params.ruleList,
				}
				_self.params.configJson = JSON.stringify(contenttep)
			},

			addmenu() {
				let _self = this;
				if(_self.params.ruleList[0].number != '' && _self.params.ruleList[3].number != '') {
					if(_self.params.ruleList[0].number > _self.params.ruleList[3].number) {
						common.messageFunc("当月购买卷烟数不得小于当日购买卷烟数", "error")
						return false;
					}
				}
				if(_self.params.ruleList[1].number != '' && _self.params.ruleList[4].number != '') {
					if(_self.params.ruleList[1].number > _self.params.ruleList[4].number) {
						common.messageFunc("当月购买卷烟数不得小于当日购买卷烟数", "error")
						return false;
					}
				}
				if(_self.params.ruleList[2].number != '' && _self.params.ruleList[5].number != '') {
					if(_self.params.ruleList[2].number > _self.params.ruleList[5].number) {
						common.messageFunc("当月购买卷烟数不得小于当日购买卷烟数", "error")
						return false;
					}
				}
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
					id: _self.param.limitDetail.id,
					type: 1,
					points: 0,
					content: _self.params.content,
					configJson: _self.params.configJson.replace(/\"/g, '\\\"'),
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",
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

			console.log(_self.param.optType)
			if(_self.param.optType == "edit") {
				_self.modifydata();
			}
			if(_self.param.optType == "creat") {
				_self.getDate();
			}
		}

	}
</script>

<style lang="less" scoped>
	.limitSetup {
			.el-button:first-child{
			margin-right: 20%;
			
		}
		.fonttwe {
			font-size: 12px;
		}
		.button {
			margin-top: 20px;
		}
		.check {
			display: block;
			margin-top: 20px;
			.el-checkbox:first-child {
				margin-left: 30px;
			}
			.el-input {
				margin-left: 10px;
				margin-right: 10px;
				width: 100px;
			}
		}
	}
</style>