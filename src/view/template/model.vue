<template>
	<template-page :param="params" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">
		<div class='buttonRegion' slot="buttonRegion">

		</div>
		<div slot="pageRegion">
		</div>
		<!--弹窗-->
		<div class="pageDialog" slot="pageDialog">
		</div>
	</template-page>
</template>

<script>
	import templatePage from '../template/templatePage'
	import http from '../../common/httpService.js'
	import validation from '@/utils/validation.js'
	export default {
		data() {
			return {
				params: {
					//分页组建
					pagination: {
						currentPage: 1,
						pageNum: '1',
						pageSize: '10',
						total: 1,
					},

				}
			}
		},
		components: {
			templatePage,
		},
		methods: {
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
			loadMessage() {},
		},
		created() {
			this.loadMessage();
		}
	}
</script>

<style lang="less" scoped>

</style>