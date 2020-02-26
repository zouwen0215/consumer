<template>
	<div class="scoreStatistics">
		<div class="total">
			<p style="background-color: #FFFFFF;text-align: left;padding: 20px;color:  #666666;font-size: 16px;font-weight: bold;">积分统计</p>
			<div class="sumlist">

				<div>
					<p class="generalTitle">今日获取积分</p>

					<p class="firstnum"><span class="todayGet" @click="routerGet(0)">{{params.sumInfor.currentGet}}</span>
						<el-popover class="popper" placement="right" width="186" trigger="hover" content="所有消费者当日获得积分的总和">
							<img slot="reference" src="../../../static/index/icon1.png" alt="" class="imgs" />

						</el-popover>
					</p>

				</div>
				<div>
					<p class="generalTitle">今日消耗积分</p>

					<p class="secondnum"><span class="todayGet" @click="routerGet(1)">{{params.sumInfor.currentConsume}}</span>
						<el-popover class="popper" placement="right" width="186" trigger="hover" content="所有消费者当日消耗积分的总和">
							<img slot="reference" src="../../../static/index/icon1.png" alt="" class="imgs" />

						</el-popover>
					</p>

				</div>

			</div>
			<div class="totalone ">
				<div style="text-align: left;padding-top: 1px;display: flex;justify-content: space-between;">
					<div>
						<p class="chartTitle">日统计概况</p>
						<div class="buttonRegion">
							<el-radio-group v-model="params.type" @change="loadMessage">
								<el-radio-button label="0">获得积分</el-radio-button>
								<el-radio-button label="1">消耗积分</el-radio-button>

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
						<p class="chartTitle">总获取积分统计</p>
						<p class="sumTitle">总获取{{params.firstpiesum}}积分</p>
					</div>
					<div class="linez">

						<div id="pieChartGet" ref="chart" class="pieChartGet"></div>
					</div>
				</div>
				<div class="lineright">
					<div style="text-align: left;margin-bottom: 10px;">
						<p class="chartTitle">总消耗积分统计</p>
						<p class="sumTitle">总消耗{{params.secondpiesum}}积分</p>
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
					
					type: '0',
					firstpiesum: '',
					secondpiesum: '',
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
							smooth: true,
							barWidth: '60%',
							data: [10, 52, 200, 334, 390, 330, 220],
							itemStyle: {
								normal: {
									color: '#9DC411',
									areaStyle: {
										type: 'default',
										color: '#F5F9E6'
									}
								}
							}

						}]
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
							right: '30px',
							top: '55px',
							data: ['直接访问', '搜索引擎'],

						},
						series: [{
							name: '',
							type: 'pie',
							radius: ['60%', '35%'],
							center: ['50%', '45%'],
							itemStyle: {
								normal: {
									label: {
										position: 'inside',
										formatter: '{d}%',
										color:'black'
									},
									labelLine: {
										show: false,
										
									}
								}
							},

							labelLine: {
								normal: {
									show: true,
									length2: 50
								}
							},
							data: [],

						}],
						color: [' #D5D482', ' #8ACECC', '#BC9DDC']
					},

				}
			}
		},

		methods: {
			routerGet(val) {
				let _self = this;
				let datarange = [];
				var date = new Date();
				var seperator = "-";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				month = month > 9 ? month : "0" + month;
				strDate = strDate > 9 ? strDate : "0" + strDate;
				datarange[0] = year + seperator + month + seperator + strDate;
				datarange[1] = year + seperator + month + seperator + strDate;
				_self.$router.push({
					path: 'scoreDetails',
					query: {
						dataList: datarange,
						useorGet: val
					}
				})
				console.log('aaaaaaaaaaaaaaaa')
			},

			loadall() {
				let _self = this;
				_self.loadGeneral()
				_self.loadMessage();
				_self.loadLine();
				_self.loadPie();
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
			loadGeneral() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.TODAY_SCORE;

				http.publicRequest('get', url, '', function(res) {
					let result = JSON.parse(JSON.stringify(res.body.data));
					_self.params.sumInfor = result;
				}, function(res) {})
			},
			loadfirstsum() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.SUM_SCORE;
				let msg = {
					type: 0,
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest('get', url, '', function(res) {
					let result = JSON.parse(JSON.stringify(res.body.data));
					_self.params.firstpiesum = result.value;
				}, function(res) {})
			},
			loadsecondsum() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.SUM_SCORE;
				let msg = {
					type: 1,
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest('get', url, '', function(res) {
					let result = JSON.parse(JSON.stringify(res.body.data));
					_self.params.secondpiesum = result.value;
				}, function(res) {})
			},
			loadMessage() {
				let _self = this;
				let totalChart = echarts.init(document.getElementById('totalChart'));
				let option = JSON.parse(JSON.stringify(this.params.option));
				let url = URL.PROJECT.SCORE + URL.PORTNAME.DALIY_SCORE;
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
			loadPieGet() {
				let _self = this;
				let pieChartGet = echarts.init(document.getElementById('pieChartGet'), 'light');
				let option = JSON.parse(JSON.stringify(this.params.optionPie));
				let url = URL.PROJECT.SCORE + URL.PORTNAME.PIE_SCORE;
				let msg = {
					type: 0
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
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

					pieChartGet.setOption(option);
				}, function(res) {})

			},
			loadPieUse() {
				let _self = this;
				let pieChart = echarts.init(document.getElementById('pieChart'), 'light');
				let option = JSON.parse(JSON.stringify(this.params.optionPie));
				let url = URL.PROJECT.SCORE + URL.PORTNAME.PIE_SCORE;
				let msg = {
					type: 1
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
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

			},
		},
		created() {
			let _self = this;
			_self.getDate()
			setTimeout(function() {
				_self.loadGeneral()
				_self.loadMessage();
				_self.loadfirstsum();
				_self.loadsecondsum();
				//_self.loadLine();
				_self.loadPieGet()
				_self.loadPieUse();
			}, 0)
		}
	}
</script>

<style lang="less" scoped>
	.scoreStatistics {
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
				.popper {
					margin-left: 30px;
				}
				.generalTitle {
					color: #333333;
					font-size: 16px;
				}
				.firstnum {
					margin-left: 35px;
					cursor: pointer;
					color: #fe0f12;
					font-size: 30px;
					.imgs {
						margin-top: -8px;
					}
				}
				.secondnum {
					cursor: pointer;
					margin-left: 35px;
					color: #2bbb59;
					font-size: 30px;
					.imgs {
						margin-top: -8px;
					}
				}
				.img {
					width: 26px;
					height: 27px;
					margin-top: -5px;
					margin-left: 30px;
				}
				&>div {
					background-color: #FFFFFF;
					flex: 1;
					margin-bottom: 15px;
					height: 90px;
					border-radius: 3.5px;
					&>p {
						margin-top: -10px;
						line-height: 40px;
						text-align: center;
						color: #636363;
						font-size: 14px;
					}
				}
				/*div:not(:first-child) {
					margin-left: 10px;
				}*/
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
					.sumTitle {
						color: #000000;
						font-size: 14px;
						text-align: center;
						margin-top: 63px;
					}
					.linez {
						.pieChartGet {
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
					.sumTitle {
						color: #000000;
						font-size: 14px;
						text-align: center;
						margin-top: 63px;
					}
					.pieChart {
						height: 300px;
					}
				}
			}
		}
	}
</style>