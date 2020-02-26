<template>
	<div>
		<ul class="imgLists">
			<li class="imgbox" v-for="(item,index) in imgUpload.imgUrlArr" :key="index">
				<i v-if="imgUpload.delete" class="el-icon-error delete" @click="deleteImg(index)"></i>
				<img class="img" :src="item" @click="bigImage(item)" />
			</li>
			
		</ul>
		<div class="imgUpload" v-show="imgUpload.imgUrlArr.length < imgUpload.length && imgUpload.delete">
			<div :id="imgUpload.id">
				<i class="el-icon-plus avatar-uploader-icon plus"></i>
			</div>
			<div style="display: none;" id="i_stream_files_queue"></div>
		</div>
	</div>
</template>

<script>
	import '../../assets/js/stream-v1.js'
	import http from '../../utils/http.js'
	export default {
		data() {
			return {

			};
		},
		props: {
			imgUpload:{
				type:Object,
				default:function(){
					return{
						href: "/upload",
						length: 9,
						delete: false,
						id: 'imgUpload',
						imgUrlArr: [],
					}
				}
			}
		},
		mounted() {
			let _self = this;
			let imagelist = [];
			let config = {
				browseFileId: _self.imgUpload.id,
				/** 选择文件的ID, 默认: i_select_files */
				browseFileBtn: "<div> </div>",
				maxSize: 1048576,
				/** 显示选择文件的样式, 默认: `<div>请选择文件</div>` */
				dragAndDropArea: _self.imgUpload.id,
				/** 拖拽上传区域，Id（字符类型"i_select_files"）或者DOM对象, 默认: `i_select_files` */
				dragAndDropTips: "<span class='plus'> </span>",
				/** 拖拽提示, 默认: `<span>把文件(文件夹)拖拽到这里</span>` */
				filesQueueId: "i_stream_files_queue",
				/** 文件上传容器的ID, 默认: i_stream_files_queue */
				filesQueueHeight: 200,
				/** 文件上传容器的高度（px）, 默认: 450 */
				messagerId: "i_stream_message_container",
				/** 消息显示容器的ID, 默认: i_stream_message_container */
				multipleFiles: false,
				extFilters: [".png", ".jpg"],
				/** 多个文件一起上传, 默认: false */
				onRepeatedFile: function(f) {
					alert("文件：" + f.name + " 大小：" + f.size + " 已存在于上传队列中。");
					return false;
				},
				onSelect: function(list) {
					imagelist = [];
					for(var i = 0; i < list.length; i++) {
						let name = list[i].name;
						let _s = name.substring(name.lastIndexOf('.'));
						list[i].name = _self.uuid(32, 16) + _s;
						imagelist.push(list[i].name)
					}
				},
				onQueueComplete: function(msg) {
					_self.handleAddImages(imagelist)
				},
				tokenURL: http.imgHref+"/tk",
				uploadURL: http.imgHref + _self.imgUpload.href,
			}
			var _t = new Stream(config);
		},
		methods: {
			handleAddImages: function(imagelist) {
				let _self = this;
				let url = http.imgUrl + imagelist[0];
				_self.imgUpload.imgUrlArr.push(url)
				console.log(_self.imgUpload.imgUrlArr);
				
			},
			deleteImg: function(index) {
				let _self = this;
				_self.imgUpload.imgUrlArr.splice(index, 1)
			},
			bigImage: function(item) {
				let _self = this;
				_self.$msgBox.showMsgBox({
					imgUrl: item,
				}).then(async(val) => {}).catch(() => {
					// ...
				});
			},
			uuid: function(len, radix) {
				var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
				var uuid = [],
					i;
				radix = radix || chars.length;
				if(len) {
					for(i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
				} else {
					var r;
					uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
					uuid[14] = '4';
					for(i = 0; i < 36; i++) {
						if(!uuid[i]) {
							r = 0 | Math.random() * 16;
							uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
						}
					}
				}
				return uuid.join('').toLowerCase();
			}
		},
		created() {
			if(!this.imgUpload.imgUrlArr) this.imgUpload.imgUrlArr = new Array();
		}
	}
</script>

<style lang="less" scoped>
	#i_select_files {
		border: 1px solid rgba(0, 0, 0, .2);
		width: 100px;
		height: 100px;
		border-radius: 7px;
		text-align: center;
		cursor: pointer;
	}
	
	.imgLists {
		margin-bottom: 10px;
		display: inline-block;
		float: left;
	
		.imgbox {
			display: inline-block;
			margin-right: 10px;
			position: relative;
			
			width: 100px;
			height: 100px;
			border-radius: 7px;
			.delete {
				position: absolute;
				right: -5px;
				top: -5px;
			}
			.img {
				
				width: 100px;
				height: 100px;
			}
		}
	}
	
	.imgUpload {
		float: left;
		margin: -10px 0;
		display: inline-block;
	}
	
	.stream-browse-files.stream-browse-drag-files-area {
		border: 1px solid rgba(230, 230, 230, .7);
		width: 100px;
		height: 100px;
		text-align: center;
		cursor: pointer;
		.plus {
			font-size: 28px;
			color: #8c939d;
			width: 100px;
			height: 100px;
			line-height: 100px;
			text-align: center;
		}
	}
	/*.stream-browse-drag-files-area {
		border: 1px solid rgba(0, 0, 0, .2);
		width: 100px;
		height: 100px;
		padding: 10px 0;
		border-radius: 7px;
		text-align: center;
		cursor: pointer;
	}*/
</style>