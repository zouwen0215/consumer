<template>
	<div class="setscoreRulesSet">
    <el-tabs v-model="params.activeName" @tab-click="handleClick">
    <el-tab-pane label="会员积分基本设置" name="first"><memberScore v-if="params.activeName=='first'"></memberScore></el-tab-pane>
    <el-tab-pane label="会员积分获取设置" name="second"><scoreGet v-if="params.activeName=='second'"></scoreGet></el-tab-pane>
    <el-tab-pane label="会员积分消耗设置" name="third"><scoreUse v-if="params.activeName=='third'"></scoreUse></el-tab-pane>
    <el-tab-pane label="零售户积分设置" name="fourth"><shopSet v-if="params.activeName=='fourth'"></shopSet></el-tab-pane>
  </el-tabs>
	</div>
   
</template>

<script>

import memberScore from "./part/memberScore";
import scoreGet from "./part/scoreGet";
import scoreUse from "./part/scoreUse";
import shopSet from "./part/shopSet";
export default {
    data(){
        return{
            params:{
                disabled:true,
                activeName: 'first'
 
                
            }
        }
    },
    components:{
        memberScore,
        scoreGet,
        scoreUse,
        shopSet
    },
     methods: {
      handleClick(tab, event) {
            
      }
    },
    created(){
    	
       
    
}
   }
</script>

<style lang="less" scoped>
.setscoreRulesSet{
	background-color: white;
}
</style>
