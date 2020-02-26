<template>
<div class="goodsDetail">
	<div class="button">
		<el-button @click="details">返回</el-button>
		<el-button type="success" @click="loadExcel">数据导出</el-button>
	</div>
	<div class="firstpart">
		<div class="leftpart">
			<p>商品名称：<span class="bold">{{$store.state.user.tempData.goodsInfor.name}}</span></p>
			<p>限兑数量：<span class="bold">{{$store.state.user.tempData.goodsInfor.limitNum}}</span></p>
			
		</div>
		<div class="rightpart">
			<p>商品状态：<span class="bold">{{params.state}}</span></p>
			<p>总兑换数量：<span class="bold">{{$store.state.user.tempData.goodsInfor.exchangeAmount}}</span></p>
			
		</div>
	    <div class="rightpart">
			<p>商品来源：<span class="bold">{{$store.state.user.tempData.goodsInfor.goodsSrcDict}}</span></p>
			<p>时间段：<span class="bold">{{$store.state.user.tempData.goodsInfor.data_list[0]}} 至 {{$store.state.user.tempData.goodsInfor.data_list[1]}}</span></p>
			
		</div>
		<div class="rightpart">
			<p>商品积分值：<span class="bold">{{$store.state.user.tempData.goodsInfor.score}}</span></p>
		
		</div>
	</div>
	<div class="secondpart">
		<template-page class='goodsStatistics' :param="params" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">
		<div slot="pageRegion">
			<template>
				<el-table :data="params.infor" border style="width: 100%">
					
					<el-table-column prop="name" label="序号">
						<template slot-scope="scope">
							<p >{{(params.pagination.pageNum - 1)*Number(params.pagination.pageSize) + scope.$index+1}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="memberId" label="会员ID"></el-table-column>
					<el-table-column prop="nickname" label="昵称"></el-table-column>
					<el-table-column prop="name" label="会员真实姓名"></el-table-column>
				
					<el-table-column prop="mobile" label="会员手机号" ></el-table-column>
					<el-table-column prop="amount" label="兑换数量" ></el-table-column>
					<el-table-column prop="createTime" label="兑换时间" ></el-table-column>
				
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
	</div>

	
</div>	
</template>

<script>
import http from "@/utils/http.js";
import URL from "@/utils/url.js";
import common from "@/utils/common.js";
import validation from "@/utils/validation.js";
import templatePage from '../template/templatePage'
	export default {
		data() {
			return {
				params: {	
					inforlist:[],
					infor: [{}],
					state:this.$store.state.user.tempData.goodsInfor.status==1?'上架':'下架',
					goodId:this.$store.state.user.tempData.goodsInfor.id,
					data_list: this.$store.state.user.tempData.goodsInfor.data_list,
						pagination: {
						currentPage: 1,
						pageNum: 1,
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
		props: {
          param: {
				default: function() {
					return {}
				}
			}
   },
		methods: {
				details() {
				let _self = this;
				
				let url = "/goodsStatistics"
				_self.$router.push(url)

			},
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
            	loadExcel() {
				let _self = this;
				
				
				let url = URL.PROJECT.SCORE + URL.PORTNAME.GOODSDETAILS_EXPORT;
				let msg = {
					id:_self.params.goodId,
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
			loadMessage() {
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.GOODS_DETAILS;
				let msg = {
					id: 0,
					goodId: _self.params.goodId,
					pageNum: pagination.pageNum,
					pageSize: pagination.pageSize,
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest('get', url, '', function(res) {
					_self.params.pagination.total = validation.total(res)
					let result = res.body.data;
					_self.params.infor = result;
					console.log(_self.params.infor )
				}, function(res) {})
			},
	


		},
		created() {
			let _self = this;
			console.log(_self.$store.state.user.tempData.goodsInfor)
			
			//console.log("111111111111",this.param.orderdetail.orderNO)
			/this.loadMessage()
			//this.loadExchange()
		}
	};
</script>

<style lang="less" scoped>
.goodsDetail{
	padding-bottom: 30px;
	.button{
		padding:10px;
		background-color: #FFFFFF;
		border-bottom: 1px solid #BBBBBB;
		display: flex;
		justify-content:space-between;
	}
	.firstpart{
         	background-color: #FFFFFF;	
         	padding: 10px; 
	        color: #444444;
			display: flex;
		    line-height: 47px;
			text-align: left;
			font-size: 14px;
			
			.bold{
				font-weight:700;
			}
		.leftpart{
			word-wrap:break-word ;
			width: 35%;
			padding-right: 15px;
			margin-left:3px;
			
		}
		.rightpart{
			width: 28%;
			word-wrap:break-word ;
			padding-right: 15px;
			margin-left: 20px;
			/*border-right: 1px dotted #BBBBBB;*/
		}
		
		
	}
	.secondpart{
		margin-top: 10px;
	}

}
</style>