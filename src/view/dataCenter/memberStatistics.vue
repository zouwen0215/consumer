<template>
	<div class="generalPos">
		<div class="total">

			<div class="sumlist">
				<div>
					<p class="generalTitle">今日新增会员</p>
					<p><span class="firstnum">{{params.sumInfor.newMember}}</span> </p>
					<p class="rate">同比<span style="margin-left: 15px;">{{params.sumInfor.newMemberRate}}%</span>
						<i v-if="params.sumInfor.newMemberRate>0" class="iconfont color" style="color: #fe0f12;font-weight: bold;margin-left: 10px;">&#xeb0b;</i>
						<i v-if="params.sumInfor.newMemberRate<0" class="iconfont colorf" style="color: #2bbb59;font-weight: bold;margin-left: 10px;">&#xeb0a;</i>
					</p>
				</div>
				<div>
					<p class="generalTitle">近七日（不含当日）下单会员数</p>
					<p><span class="secondnum">{{params.sumInfor.orderMember}}</span></p>
					<p class="rate">同比<span style="margin-left: 15px;">{{params.sumInfor.orderMemberRate}}%</span>
						<i v-if="params.sumInfor.orderMemberRate>0" class="iconfont color" style="color: #fe0f12;font-weight: bold;margin-left: 10px;">&#xeb0b;</i>
						<i v-if="params.sumInfor.orderMemberRate<0" class="iconfont colorf" style="color: #2bbb59;font-weight: bold;margin-left: 10px;">&#xeb0a;</i>
					</p>
				</div>

				<div class="last">
					<p class="generalTitle">累计会员数</p>
					<p class="rate"><span class="thirdnum">{{params.sumInfor.totalMember}}</span></p>

				</div>
			</div>
			<div class="totalone ">
				<div style="text-align: left;padding-top: 1px;display: flex;justify-content: space-between;">
					<div>
						<p class="chartTitle">统计明细</p>
						<div class="buttonRegion">
							<el-radio-group v-model="params.type" @change="loadMessage">
								<el-radio-button label="1">新增用户</el-radio-button>
								<el-radio-button label="2">下单会员</el-radio-button>
								<el-radio-button label="3">累计用户</el-radio-button>
							</el-radio-group>
						</div>
					</div>
					<div class="datepicker">
						<span>
							时间段：
						</span>
						<el-date-picker @change="loadMessage" v-model="params.data_list" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="params.pickerOptions"></el-date-picker>

						</el-date-picker>
					</div>
				</div>

				<div id="totalChart" ref="chart" class="totalChart"></div>
			</div>

			<div class="line">
				<div class="linedata">
					<div style="text-align: left; margin-bottom: 10px;">
						<p class="chartTitle">会员分布</p>
					</div>
					<div class="linez">

						<div id="lineChart" ref="chart" class="lineChart"></div>
					</div>
				</div>
				<div class="lineright">
					<div style="text-align: left;margin-bottom: 10px;">
						<p class="chartTitle">会员分析</p>
						<div class="buttonRegiontwo">
							<el-radio-group v-model="params.typepie" @change="loadPie">
								<el-radio-button label="1">年龄段</el-radio-button>
								<el-radio-button label="2">性别</el-radio-button>
								<el-radio-button label="4">区域</el-radio-button>
								<el-radio-button label="3">资料完善</el-radio-button>
							</el-radio-group>
						</div>
					</div>
					<div id="pieChart" ref="chart" class="pieChart"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	let echarts = require('echarts/lib/echarts')
	require('echarts/lib/chart/bar')
	require('echarts/lib/component/tooltip')
	require('echarts/lib/component/title')
	import http from '../../utils/http.js'
	import URL from '../../utils/url.js'
	import validation from '@/utils/validation.js'

	export default {
		data() {
			return {
				params: {
					type: '1',
					typepie: '1',
					data_list: [],
					sumInfor: {},
					pickerOptions: {
						disabledDate(time) {
							var curDate = new Date();
							return time.getTime() > curDate;
						}
					},

					option: {
						color: ['#3398DB'],
						title: {
							text: '',
							//subtext: '纯属虚构',
							x: 'left',
							top: '20px',
							textStyle: {
								fontStyle: 'normal',
								/*fontWeight: 'bold',*/
								fontFamily: 'sans-serif',
								fontSize: 14,
							},
						},
						tooltip: {
							trigger: 'axis',
							axisPointer: { // 坐标轴指示器，坐标轴触发有效
								type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
							}
						},
						grid: {
							left: '3%',
							right: '4%',
							bottom: '3%',
							containLabel: true
						},
						xAxis: [{
							type: 'category',
							data: [],
							axisLabel: {
								//interval: 0,
								rotate: 40
							},
							axisTick: {
								alignWithLabel: true
							}
						}],
						yAxis: [{
							type: 'value'
						}],
						series: [{
							//name: '直接访问',
							type: 'line',
							barWidth: '60%',
							data: [10, 52, 200, 334, 390, 330, 220],
							itemStyle: {
								normal: {
									color: '#2db7f5'
								}
							}

						}]
					},

					optionBar: {
						title: {
							text: '',
							//subtext: '纯属虚构',
							x: 'left',
							left: '10px',
							top: '10px',
							textStyle: {
								fontStyle: 'normal',
								/*fontWeight: 'bold',*/
								fontFamily: 'sans-serif',
								fontSize: 14,
							},
						},
						tooltip: {
							trigger: 'axis',
							axisPointer: { // 坐标轴指示器，坐标轴触发有效
								type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
							}
						},
						xAxis: {
							type: 'category',
							data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
							axisLabel: {
								//interval: 0,
								rotate: 40,
								fontSize: 8
							}
						},
						yAxis: {
							type: 'value'
						},
						series: [{
							data: [820, 932, 901, 934, 1290, 1330, 1320],
							type: 'bar',
						

						}],
						color: ' #2db7f5'
					},

					optionPie: {
						title: {
							text: '',
							//subtext: '纯属虚构',
							x: 'left',
							left: '10px',
							top: '5px',
							textStyle: {
								fontStyle: 'normal',
								/*fontWeight: 'bold',*/
								fontFamily: 'sans-serif',
								fontSize: 14,
							},
						},
						tooltip: {
							//trigger: 'item',
							formatter: "{a} {b} : {c} ({d}%)"
						},
						legend: {
							orient: 'vertical',
							right: '10px',
							top: '50px',
							data: ['直接访问', '搜索引擎'],

						},
						series: [{
							name: '',
							type: 'pie',
							radius: '60%',
							center: ['50%', '45%'],
							itemStyle: {

								normal: {
									label: {
										position: 'outside',
										formatter: ' {d}%',
										color: 'black'
									},

								}
							},

							labelLine: {
								normal: {
									show: true,

								}

							},
							data: [{
								value: 335,
								name: '直接访问'
							}, {
								value: 1548,
								name: '搜索引擎'
							}],

						}],
						//color: [' #D5D482',' #8ACECC','#BC9DDC']
					},

				}
			}
		},

		methods: {
			reset: function() {
				window.location.reload();
			},
			getDate() {
				let _self = this;
				var date = new Date();
				date.setDate(date.getDate() - 1);
				var seperator = "-";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				var olddate = new Date();
				olddate.setDate(olddate.getDate() - 7);
				var oldyear = olddate.getFullYear();
				var oldmonth = olddate.getMonth() + 1;
				var oldstrDate = olddate.getDate();
				month = month > 9 ? month : "0" + month;
				strDate = strDate > 9 ? strDate : "0" + strDate;
				oldmonth = oldmonth > 9 ? oldmonth : "0" + oldmonth;
				oldstrDate = oldstrDate > 9 ? oldstrDate : "0" + oldstrDate;
				_self.params.data_list[0] = year + seperator + oldmonth + seperator + oldstrDate;
				_self.params.data_list[1] = year + seperator + month + seperator + strDate;
			},

			loadall() {
				let _self = this;
				_self.loadGeneral()
				_self.loadMessage();
				_self.loadLine();
				_self.loadPie();
			},

			loadGeneral() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.MEMBER_TOTAL;
				http.publicRequest('get', url, '', function(res) {
					let result = JSON.parse(JSON.stringify(res.body.data));
					_self.params.sumInfor = result;
				}, function(res) {})
			},
			loadMessage() {
				let _self = this;
				let totalChart = echarts.init(document.getElementById('totalChart'));
				let option = JSON.parse(JSON.stringify(this.params.option));
				let url = URL.PROJECT.SCORE + URL.PORTNAME.LINE_MEMBER;

				let msg = {
					type: _self.params.type,
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",

				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest('get', url, '', function(res) {
					let result = JSON.parse(JSON.stringify(res.body.data));
					let valueArr = [];
					let nameArr = [];
					for(let key in result) {
						valueArr.push(result[key].value)
						nameArr.push(result[key].content)
					}

					option.xAxis[0].data = nameArr;
					option.series[0].data = valueArr;
					//	option.title.text = '单位：台';
					totalChart.setOption(option);
				}, function(res) {})
			},
			loadLine() {
				let _self = this;
				let lineChart = echarts.init(document.getElementById('lineChart'));
				let option = JSON.parse(JSON.stringify(this.params.optionBar));
				let url = URL.PROJECT.SCORE + URL.PORTNAME.MEMBER_AREA;
				let params = http.params;
				http.publicRequest('get', url, '', function(res) {
					let result = JSON.parse(JSON.stringify(res.body.data));
					let valueArr = [];
					let nameArr = [];
					for(let key in result) {
						valueArr.push(result[key].value)
						nameArr.push(result[key].content)
					}
					option.xAxis.data = nameArr;
					option.series[0].data = valueArr;

					//	option.title.text = '单位：次';
					lineChart.setOption(option);

				}, function(res) {})
				_self.loadPie();
			},
			loadPie() {
				let _self = this;
				let pieChart = echarts.init(document.getElementById('pieChart'), 'light');
				let option = JSON.parse(JSON.stringify(this.params.optionPie));
				if(_self.params.typepie < 4) {
					let url = URL.PROJECT.SCORE + URL.PORTNAME.MEMBER_INFO;
					let data = {
						type: _self.params.typepie
					};
					url = http.filterUrl(data, url);

					http.publicRequest('get', url, '', function(res) {
						let result = JSON.parse(JSON.stringify(res.body.data));
						console.log(result)
						let datas = [];
						let mapData = [];
						for(let key in result) {
							let map = {
								value: result[key].value,
								name: String(result[key].content)
							};
							datas.push(String(result[key].content));
							mapData.push(map);
						};
						option.series[0].data = mapData;
						option.legend.data = mapData;
						option.legend.formatter = function(content) {
							var total = 0;
							for(let key of option.legend.data) {
								if(key.name == content) {
									total = key.value
								}

							}
							return content + '  ' + ' (' + total + ')';
						}

						pieChart.setOption(option);
					}, function(res) {})

				} else {
					let url = URL.PROJECT.SCORE + URL.PORTNAME.MEMBER_AREA;
					//					if(_self.params.month == null || _self.params.month == undefined || _self.params.month == "")
					//						_self.params.month = validation.formatDatefor(new Date(), 'yyyy-mm');

					http.publicRequest('get', url, '', function(res) {
						let result = JSON.parse(JSON.stringify(res.body.data));
						console.log(result)
						let datas = [];
						let mapData = [];
						for(let key in result) {
							let map = {
								value: result[key].value,
								name: String(result[key].content)
							};
							datas.push(String(result[key].content));
							mapData.push(map);
						};
						option.series[0].data = mapData;
						option.legend.data = mapData;
						option.legend.formatter = function(content) {
							var total = 0;
							for(let key of option.legend.data) {
								if(key.name == content) {
									total = key.value
								}

							}
							return content + '  ' + ' (' + total + ')';
						}

						pieChart.setOption(option);
					}, function(res) {})
				}

			},
		},
		created() {
			let _self = this;
			_self.getDate()

			setTimeout(function() {
				_self.loadGeneral()
				_self.loadMessage();
				_self.loadLine();
				_self.loadPie();
			}, 0)
		}
	}
</script>

<style lang="less" scoped>
	.generalPos {
		.generalTitle {
			font-weight: bold;
			color: #000000;
			font-size: 16px;
			display: flex;
			padding-top: 10px;
			padding-bottom: 10px;
			margin-top: -10px;
			margin-left: 15px;
			border-bottom: 2px solid #f7f7f9;
		}
		.chartTitle {
			font-size: 16px;
			color: #6c6c6d;
			margin-left: 20px;
			margin-top: 15px;
			font-weight: bold;
		}
		.total {
			.sumlist {
				display: flex;
				.rate {
					margin-left: 20px;
				}
				.firstnum {
					color: #fe0f12;
					font-size: 30px;
					margin-left: 15px;
				}
				.secondnum {
					margin-left: 15px;
					color: #2bbb59;
					font-size: 30px;
				}
				.thirdnum {
					color: #000000;
					font-size: 30px;
				}
				&>div {
					background-color: #FFFFFF;
					flex: 1;
					margin-bottom: 15px;
					height: 140px;
					border-radius: 3.5px;
					&>p {
						padding-left: 10px;
						padding-top: 20px;
						display: flex;
						color: #636363;
						font-size: 14px;
					}
				}
				div:not(:first-child) {
					margin-left: 10px;
				}
			}
			.totalone {
				background-color: #FFFFFF;
				padding-bottom: 20px;
				.buttonRegion {
					margin-top: 20px;
					margin-left: 20px;
				}
				.totalChart {
					flex: 1;
					height: 300px;
					/*pointer-events: auto;*/
				}
				.datepicker {
					padding: 15px;
				}
			}
			.picker {
				padding-top: 10px;
				padding-bottom: 20px;
				padding-right: 20px;
				background-color: #FFFFFF;
				margin-top: 20px;
				text-align: right;
				span {
					color: #333333;
				}
				.datepicker {
					margin-right: 15px;
				}
			}
			.line {
				margin-top: 20px;
				display: flex;
				.linedata {
					background-color: #FFFFFF;
					flex: 1;
					.linez {
						.lineChart {
							height: 300px;
						}
					}
				}
				.lineright {
					margin-left: 10px;
					background-color: #FFFFFF;
					flex: 1;
					padding-right: 20px;
					.buttonRegiontwo {
						margin-left: 20px;
						margin-top: 20px;
					}
					.pieChart {
						height: 290px;
					}
				}
			}
		}
	}
</style>