<template>
	<div class="scoreruleShow">
        <p class="title">积分规则内容设置</p> 
        <div style="background-color: #FFFFFF;padding: 40px;">
        	<div id="editor" >
			<p>欢迎使用 <b>wangEditor</b> 富文本编辑器</p>

		</div>
		<div class="operate">
			<el-button class="firstbutton" type="primary" @click="submit">保存</el-button>
			<el-button @click="loadMessage">取消</el-button>
		</div>
        </div>
		
	</div>
</template>

<script>
	import edit from 'wangeditor'
	import http from "@/utils/http.js";
	import URL from "@/utils/url.js";
	import common from "@/utils/common.js";
	import validation from "@/utils/validation.js";
	export default {
		name: 'editor',
		data() {
			return {
				params: {
					infor: '',
				},
				editorContent: "",
				id: "",
				title: ""
			}
		},

		methods: {
			loadMessage() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.RULE_INFODETAIL;
				http.publicRequest('GET', url, "", function(suc) {
					let result = suc.data.data;
					_self.id = result.id;
					_self.title = result.title;
					_self.editorContent = "<p>" + result.content + "</p>";
					var editor = new edit('#editor')
					editor.customConfig.menus = [
						'bold', // 粗体
						'fontSize', // 字号
						'fontName', // 字体
						'italic', // 斜体
						'underline', // 下划线
						'strikeThrough', // 删除线
						'foreColor', // 文字颜色
						'justify',  // 对齐方式
						'image',  // 插入图片
					]
					editor.customConfig.onchange = (html) => {
						_self.editorContent = html
					}
					editor.create();
					var heightUpdate = document.getElementsByClassName("w-e-text-container");
					for(var i = 0; i < heightUpdate.length; i++) {
						heightUpdate[i].style.height = "400px";
					}
					editor.txt.html(_self.editorContent);
					if(editor.txt.text() == "" || editor.txt.text() == "null") {
						editor.txt.clear();
						editor.txt.append('<p>请编辑积分规则内容</p>');
					}
					/*editor.$textElem.attr('contenteditable', false)*/
				}, function(res) {})
			},
			submit(formData) {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.SAVE_RULECONTENT;
				let body = {
					content: _self.editorContent
				}
				http.publicRequest("POST", url, body, function(res) {
					common.messageFunc("操作成功", "success");

				}, function(res) {})
			},

		},
		created() {
			this.loadMessage();
		}
	}
</script>

<style lang="less" scoped>
	.scoreruleShow {
		
		width: 100%;
		
	}
	.title{
		font-size: 24px;
	text-align: left;
margin-top: 10px;
margin-bottom: 20px;
	
	
	color: #475669;
	}
	.el-button:first-child{
			margin-right: 5%;
			
		}
	.operate {
		margin-top: 20px;
	}
</style>