import Vue from 'vue'

let common = new Vue({
	data: {

	},
	methods: {
		messageFunc(errorMessage, funcName) {
			let _self = this;
			if(funcName == "error") {
				_self.$message.error(errorMessage);
			} else if(funcName == "success") {
				this.$message({
					message: errorMessage,
					type: 'success',
				
				});
			}else if(funcName == "warning"){
				this.$message({
					message: errorMessage,
					type: 'warning'
				});
			}else{
				 this.$message(errorMessage);
			}
		}
	},
})

export default common;

/** 
 *             ,%%%%%%%%, 
 *           ,%%/\%%%%/\%% 
 *          ,%%%\c "" J/%%% 
 * %.       %%%%/ o  o \%%% 
 * `%%.     %%%%    _  |%%% 
 *  `%%     `%%%%(__Y__)%%' 
 *  //       ;%%%%`\-/%%%'
 * ((       /  `%%%%%%%' 
 *  \\    .'          | 
 *   \\  /       \  | | 
 *    \\/         ) | | 
 *     \         /_ | |__ 
 *     (___________))))))) 攻城湿 
 * 
 */