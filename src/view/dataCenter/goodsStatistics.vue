<template>
	<template-page class='goodsStatistics' :param="params" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">

		<div slot="buttonRegion">
			<span class="ml10">商品状态：</span>
			<el-select v-model="params.search.status">
				<el-option label="全部" value=""></el-option>
				<el-option label="已上架" value="1"></el-option>
				<el-option label="已下架" value="0"></el-option>

			</el-select>
			<span class="ml10">商品来源：</span>
			<el-select v-model="params.search.goodsSrcDictId">
				<el-option label="全部" value=""></el-option>
				<el-option label="美胜" value="1"></el-option>
				<el-option label="自建" value="2"></el-option>

			</el-select>
			<span class="ml10">商品名称：</span>
			<el-input placeholder="请输入商品名称" v-model="params.search.name"></el-input>
			<span class="fonttwe" style="margin-left: 10px;">时间段：</span>
			<el-date-picker v-model="params.data_list" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="params.pickerOptions"></el-date-picker>

			</el-date-picker>
			<el-button class="ml10" type="primary" @click.native="loadMessage">搜索</el-button>
			<el-button @click.native="reset">重置</el-button>
			<el-button type="success" style="float: right;" @click="loadExcel">数据导出</el-button>
		</div>

		<div slot="pageRegion">
			<template>
				<el-table :data="params.infor" border style="width: 100%">

					<el-table-column prop="name" label="商品名称" width="200"></el-table-column>
					<el-table-column prop="status" label="商品状态">
						<template slot-scope="scope" width="100px">
							<p v-if="scope.row.status==0">已下架</p>
							<p v-else>已上架</p>
						</template>
					</el-table-column>
					<el-table-column prop="goodsSrcDict" label="商品来源"></el-table-column>
					<el-table-column prop="score" label="商品积分值"></el-table-column>

					<el-table-column prop="limitNum" label="限兑数量"></el-table-column>
					<el-table-column prop="exchangeAmount" label="总兑换数量"></el-table-column>

					<el-table-column label="操作" width="100">
						<template slot-scope="scope">
							<p @click="details(scope.row)" class="editText">查看</p>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</div>
		<!--弹窗-->

		<div class="pageDialog" slot="pageDialog">
			<!--<el-dialog v-if="params.detailMenu" title="查看详情" :visible.sync="params.detailMenu" width="800px" back-backdrop='static' center>
			<goodDetails :param="params"></goodDetails>
			</el-dialog>-->
		</div>
	</template-page>
</template>

<script>
	import templatePage from '../template/templatePage'
	import http from '../../utils/http.js'
	import URL from '../../utils/url.js'
	import validation from '@/utils/validation.js'
   
	export default {
		data() {
			return {
				params: {
                    pickerOptions: {
						disabledDate(time) {
							var curDate = new Date();
							return time.getTime() >  curDate;
						}
					},
					infor: [],
					value: {},
					data_list: [],
					search: {
						goodsSrcDictId: "",
						name: "",
						status: '',
					},
					memberId: 1,
					//分页组建
					pagination: {
						currentPage: 1,
						pageNum: '1',
						pageSize: '10',
						total: 0,
						hasPage: true,
						hasMenu: false,
					},

				},
			}
		},
		components: {
			templatePage,
			//goodDetails
		},
		methods: {
			details(val) {
				let _self = this;
				val.data_list=_self.params.data_list
				
				let tempData = {
					name: 'goodsInfor',
					param: val
				}
				_self.$store.commit('tempData', tempData);
				let url = "/goodDetails"
				_self.$router.push(url)

			},
			//----------------------------------------
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
			loadExcel() {
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.GOODSSTITISTICS_EXPORT;
				let msg = {
					id: 0,
					
					name: search.name,
					goodsSrcDictId: search.goodsSrcDictId,
					status: search.status,
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",
				};
				url = http.filterUrl(msg, url);
				url = window.location.origin + url;
				window.open(url);
			},
			handleSizeChange(index) {
				let _self = this;
				_self.params.pagination.pageSize = index;
				_self.loadMessage();

			},
			handleCurrentChange(index) {
				let _self = this;
				_self.params.pagination.pageNum = index;
				_self.loadMessage();
			},
			reset() {
				let _self = this;
				_self.params.search = validation.reset(_self.params.search);
				_self.loadMessage();
			},
			loadMessage() {
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.GOODS_STATISTICS;
				let msg = {
					id: 0,
					pageNum: pagination.pageNum,
					pageSize: pagination.pageSize,
					name: search.name,
					goodsSrcDictId: search.goodsSrcDictId,
					status: search.status,
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest('get', url, '', function(res) {
					_self.params.pagination.total = validation.total(res)
					let result = res.body.data;
					console.log(result)
					_self.params.infor = result;
				}, function(res) {})
			},

		},
		created() {
			let _self = this;
			_self.getDate()
			this.loadMessage();

		}
	}
</script>

<style lang="less" scoped>
	.goodsStatistics {
		
	
		.search {
			text-align: left;
		}
	}
	


	

</style>