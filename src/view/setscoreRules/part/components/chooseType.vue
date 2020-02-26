<style lang="less" scoped>
.chooseType {
		.el-button:first-child{
			margin-right: 20%;
			
		}
  .selectBox {
    display: inline-block;
    width: 580px;
    // text-align: left;
    margin: 10px 10px 0;
    padding: 10px;
  }
  .transfer {
    box-sizing: content-box;
    border: 2px solid rgba(64, 158, 255, 0.3);
    .select {
      display: flex;
      justify-content: space-between;
    }
    .chooseBox {
      display: inline-flex;
      width: 650px;
      padding: 10px;
    }
    .title {
      text-align: left;
      display: flex;
      font-size: 20px;
      font-weight: 700;
      justify-content: space-around;
      p {
        padding: 10px 10px 0;
        flex: 1;
      }
    }
  }
  .button {
    text-align: center;
  }
}
</style>

<template>
  <div class="chooseType">
    <!-- <div class="selectBox">
      <el-radio-group v-model="param.popup.radioIndex" border @change="selectChange">
        <el-radio label="1" border>商品名称</el-radio>
        <el-radio label="2" border>品牌系列</el-radio>
        <el-radio label="3" border>品牌拥有者</el-radio>
      </el-radio-group>
    </div>-->
    <div class="transfer">
      <div class="title">
        <p>待选区</p>
        <p>已选区</p>
      </div>
      <div class="select pt10 pl10 pr10 alignLeft">
        <el-select
          v-model="value9"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          @change="handleChange"
        >
          <el-option
            v-for="(item,index) in options4"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button @click="delAll">删除全部</el-button>
      </div>
      <div class="chooseBox">
        <el-table
          ref="multipleTable"
          :data="params.datasList"
          border
          class="mr10"
          height="250"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"  width="30" ></el-table-column>
          <el-table-column  prop="name" label="卷烟品牌"></el-table-column>
         
        </el-table>
        <el-table :data="params.selectList" border height="250">
          <el-table-column  prop="name" label="卷烟品牌"></el-table-column>
        
          <el-table-column fixed="right" label="操作" width="55">
            <template slot-scope="scope">
              <i class="el-icon-delete" @click="deleteItem([scope.row],scope.$index)"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="button mt20">
      <el-button @click="primary" type="primary">确定</el-button>
      <el-button @click="param.checkedType=false">取消</el-button>
    </div>
  </div>
</template>


<script>
import http from "@/utils/http.js";
import common from "@/utils/common.js";
import URL from "@/utils/url.js";
import validation from "@/utils/validation.js";
import templatePage from "@/view/template/templatePage";
export default {
  data() {
    return {
      options4: [],
      value9: [],
      list: [],
      loading: false,
      params: {
        radio: {
          active: ""
        },
        typeList: ["goods", "brand", "owner", "priceType"],
        datasList: [],
        selectList: []
      }
    };
  },
  props: {
    param: {
				default: function() {
					return {}
				}
			}
  },
  components: {
    templatePage
  },
  mounted() {
//  let _self = this;
//     _self.list = _self.params.datasList.map(item => {
//       return { value: item, label: item.name };
//     });
  },
  methods: {
//	 checkboxT(row,index){
//	 	
//          if(row.status==1){
//              return false;
//          }else{
//              return true;
//          }
//      },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
        
          this.options4 = this.list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options4 = [];
      }
    },
    cancel() {
      console.log("1", this.params.selectList);
      this.param.popup.show1 = false;
    },
    primary() {
      console.log("2", this.params.selectList);
      let _self = this;
      if (_self.params.selectList.length<=10) {
        
        http.$emit("selectList", this.params.selectList);
        _self.param.checkedType=false
        common.messageFunc("操作成功", "success");
      } else if(_self.params.selectList.length==0){
        common.messageFunc("请先选择选项", "warning");
      }else{
      	 common.messageFunc("最多选择十种卷烟", "warning");
      }
    },
    delAll() {
      let _self = this;
      _self.params.selectList = [];
      for (let index of _self.params.datasList) {
        _self.$refs.multipleTable.toggleRowSelection(index, false);
      }
    },
    deleteItem(rows, index) {
      console.log("3", this.params.selectList);
      let _self = this;
      if (rows) {
        _self.params.selectList.splice(index, 1);
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        _self.params.selectList = [];
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(rows) {
      let _self = this;
      if (_self.params.datasList.length) {
        _self.params.selectList = rows;
      }
      if(_self.params.datasList.length) {
					if(rows.length <= 10) {
						_self.params.selectList = rows;
					} else {
						for(let index of _self.params.datasList) {
							if(rows[rows.length-1].code == index.code) {
								_self.$refs.multipleTable.toggleRowSelection(index, false);
							}
						}
						_self.$message({
							showClose: true,
							message: "最多可选择10项",
							type: 'warn'
						});
					}

				}
    },
    handleChange(e) {
    	
      let _self = this;
      console.log(_self.params.value9)
      let has = {};
      
      for (let index of _self.params.datasList) {
        if (e == index.code) {
          _self.$refs.multipleTable.toggleRowSelection(index, true);
        }
      }
      _self.params.selectList.forEach(function(item, index, arr) {
        if (e == item.code) {
            has = item
        }
      });
      if(!has){
        _self.params.selectList.push(has)
      }
      _self.value9 = [];
    },
    selectChange(e) {
      let _self = this;
      _self.params.datasList = [];
      _self.loadMessage(_self.params.typeList[e]);
    },
    loadMessage(type) {
      console.log("6", this.params.selectList);
      let _self = this;
      let url = URL.PROJECT.SCORE + URL.PORTNAME.SMOKE_LIST;
      let urlData = {
           id: 0,
           type:_self.param.type,
					 name:"",
      };
      url = http.filterUrl(urlData, url);
      http.publicRequest(
        "GET",
        url,
        "",
        function(res) {
          let result = res.body.data;
          console.log("jieguo",result)
          _self.params.datasList = result;
          if(_self.param.type=='goods'){
          	if(_self.param.unit=='slave'){
          		_self.params.datasList=result.map(item => {
            return { code: item.slaveBarCode, name: item.name };
          });
          	_self.list=result.map(item => {
            return { value: item.slaveBarCode, label: item.name };
          });
         
          	}
          	else{
          		_self.params.datasList=result.map(item => {
            return { code: item.masterBarCode, name: item.name };
          });
          	_self.list= result.map(item => {
            return { value: item.masterBarCode, label: item.name };
          });
          	}
          }else{
            	_self.params.datasList=result
          	 _self.list = _self.params.datasList.map(item => {
            return { value: item.code, label: item.name };
          });
         
          }
        
     
          setTimeout(function() {
            for (let key of _self.param.selectList) {
              for (let index of _self.params.datasList) {
                if (key.code == index.code) {
                  _self.$refs.multipleTable.toggleRowSelection(index, true);
                  break;
                }
              }
            }
          }, 200);
        },
        function(res) {}
      );
    }
  },
  created() {
   this.loadMessage()
  }
};
</script>
