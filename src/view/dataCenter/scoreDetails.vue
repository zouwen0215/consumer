<template>
	<template-page class='scoreDetails' :param="params" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">
	
		<div slot="buttonRegion">
			<span class="ml10">会员ID：</span>
			<el-input  placeholder="请输入会员ID"  v-model="params.search.memberId"></el-input>
			<span class="ml10">手机号码：</span>
			<el-input placeholder="请输入手机号码"  v-model="params.search.mobile"></el-input>
			<span class="ml10">类型：</span>
			<el-select v-model="params.search.type">
				<el-option label="全部" value=""></el-option>
				<el-option label="获取" value="0" ></el-option>
				<el-option label="消耗" value="1"></el-option>		
			</el-select>
			<span class="fonttwe" style="margin-left: 10px;">时间段：</span>
			<el-date-picker v-model="params.data_list"
				 type="daterange" format="yyyy-MM-dd" 
				 value-format="yyyy-MM-dd" range-separator="至" 
				 start-placeholder="开始日期" end-placeholder="结束日期"
				 :picker-options="params.pickerOptions"></el-date-picker>

			</el-date-picker>
			<el-button class="ml10" type="primary" @click.native="loadMessage">搜索</el-button>
			<el-button  @click.native="reset">重置</el-button>
			
		</div>

		<div slot="pageRegion">
			<template>
				<el-table :data="params.infor" border style="width: 100%">
					
					<el-table-column prop="memberId" label="会员ID" width="80px"></el-table-column>
					<el-table-column prop="nickname" label="昵称"></el-table-column>
					<el-table-column prop="mobile" label="手机号码"></el-table-column>
					<el-table-column prop="type" label="类型" width="80px">
						<template slot-scope="scope" >
							<p v-if="scope.row.type==0" >获取</p>
							<p v-else>消耗</p>
						</template>
					</el-table-column>
					<!--<el-table-column prop="remark" label="详情" width="250px">
						<template slot-scope="scope" >
							<p v-if="scope.row.type==0" style="color:limegreen">{{scope.row.remark}}</p>
							<p v-else style="color:red">{{scope.row.remark}}</p>
						</template>
					</el-table-column>-->
					<el-table-column prop="points" label="会员获取/消耗积分值">
						<template slot-scope="scope" >
							<p v-if="scope.row.type==0" >+{{scope.row.points}}</p>
							<p v-else >-{{scope.row.points}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="消费门店"></el-table-column>
					<el-table-column prop="score" label="门店回收积分值">
						<template slot-scope="scope" >
							<p v-if="scope.row.score!=null">+{{scope.row.score}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="时间"></el-table-column>
					<!--<el-table-column  label="操作" width="100">
						<template slot-scope="scope" >
							<p @click="details(scope.row)" class="editText">查看</p>
						</template>
					</el-table-column>-->
				</el-table>
			</template>
		</div>
		<!--弹窗-->

		
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
					data_list: [],
					search: {
					   memberId:"",
					   mobile:"",
					   type:''
					},
					memberId:1,
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
			
		},
		methods: {
			
			//----------------------------------------
			 getDate(){
            	let _self = this;
            	var date = new Date();
				date.setDate(date.getDate()-1);
				var seperator = "-";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				var olddate=new Date();
				olddate.setDate(olddate.getDate()-7);
				var oldyear = olddate.getFullYear();
				var oldmonth = olddate.getMonth() + 1;
				var oldstrDate = olddate.getDate();
				month=month>9?month:"0"+month;				
				strDate=strDate>9?strDate:"0"+strDate;
				oldmonth=oldmonth>9?oldmonth:"0"+oldmonth;				
				oldstrDate=oldstrDate>9?oldstrDate:"0"+oldstrDate;
				_self.params.data_list[0] = year + seperator + oldmonth + seperator + oldstrDate;
				_self.params.data_list[1] = year + seperator + month + seperator + strDate;
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
				let url = URL.PROJECT.SCORE + URL.PORTNAME.SCORE_DETAILS;
				let msg = {
					id: 0,
					memberId:search.memberId,
					mobile: search.mobile,
					type: search.type,
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",
					pageNum: pagination.pageNum,
					pageSize: pagination.pageSize,
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
			let arr = Object.keys(this.$route.query);
			//console.log(this.$route.query)
			if(arr.length > 0){
				_self.params.data_list=this.$route.query.dataList,
				_self.params.search.type=String(this.$route.query.useorGet)
			}else{
				_self.getDate()
			}
			 
			this.loadMessage();
		
		}
	}
</script>

<style lang="less" scoped>
	.scoreDetails {
	
		.search {
			text-align: left;
		}
	
	
	
	
	}
</style>