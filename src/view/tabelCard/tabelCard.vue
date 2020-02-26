<template>
  <template-page
    :param="params"
    v-on:handleSize="handleSizeChange"
    v-on:handleCurrent="handleCurrentChange"
  >
    <div class="buttonRegion" slot="buttonRegion">
      <div class="search">
        <span class="ml10" style="margin-left: -15px;">营业状态：</span>
        <el-select v-model="params.search.isStop" >
            <el-option v-for="item in params.stateOption"
            :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      
        <span class="ml10">门店名或编码：</span>
        <el-input v-model="params.search.shopNameOrCode" placeholder="门店名或编码"></el-input>
       <el-button style="margin-left: 20px;" type="primary" @click.native="loadMess">搜索</el-button>
        <el-button @click.native="reset">重置</el-button>
        <el-button style="float: right;" type="success" @click.native="ShowMultiDown()">批量台卡下载</el-button>
      </div>
      <div class="downLoad" >
      	  <span style="margin-left: -15px;">创建时间：</span>
        <el-date-picker style="width: 280px;"
          v-model="params.search.dateTimeList"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      	 
      </div>
    </div>
    <div slot="pageRegion">
      <el-table :data="params.info" @selection-change="tableSelectChange" border>
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="门店编码" prop="shopId"></el-table-column>
        <el-table-column label="门店名称" prop="shopName"></el-table-column>
        <el-table-column label="门店负责人" prop="shopUser"></el-table-column>
        <el-table-column label="联系方式" prop="mobile"></el-table-column>
        <el-table-column label="线上营业状态" prop="isStop">
          <template slot-scope="scope">
            <p v-if="scope.row.isStop==false">未开启</p>
            <p v-else>开启</p>
          </template>
        </el-table-column>
        <el-table-column label="门店地址" prop="address"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click.native="ShowSingleDown(scope.row)">下载台卡</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--弹窗-->
    <div class="pageDialog" slot="pageDialog">
      <el-dialog class="DownLoadDialog" title="批量下载" :visible.sync="params.MultiDownShow" width="30%">
        <div class="title">请选择批量台卡二维码下载格式</div>
        <div class="body">
          <label class="context">200*200</label>
          <el-button id="mutliSmall" class="button" @click="downLoadTableMulti(1)">下载</el-button>
        </div>
        <!--<div class="body">
          <label class="context">400*400</label>
          <el-button id="mutliBig" class="button" @click="downLoadTableMulti(0)">下载</el-button>
        </div>-->
      </el-dialog>
      <el-dialog class="DownLoadDialog" title="单个下载" :visible.sync="params.SingleDownShow" width="30%">
        <div class="title">请选择台卡二维码下载的格式</div>
        <div class="body">
          <label class="context">200*200</label>
          <el-button id="singlSmall" class="button" @click="downLoadTableSingle(1)">下载</el-button>
        </div>
        <!--<div class="body">
          <label class="context">400*400</label>
          <el-button id="singlBig" class="button" @click="downLoadTableSingle(0)">下载</el-button>
        </div>-->
      </el-dialog>
    </div>
  </template-page>
</template>

<script>
import templatePage from "../template/templatePage";
import http from "../../utils/http.js";
import URL from "../../utils/url.js";
import validation from "../../utils/validation.js";
import common from "../../utils/common.js";

export default {
  data() {
    return {
      params: {
        info: [],
        multiSelect: [],
        MultiDownShow: false,
        SingleDownShow: false,
        DownLoadShopID: "",
        stateOption:[{value:"",label:"全部"},{value:"0",label:"未启用"},{value:'1',label:"启用"}],
        state:{false:"未启用",true:"启用"},
        search: {
          isStop: "",
          shopNameOrCode: "",
          dateTimeList: [],          
        },
        //分页组建
        pagination: {
          currentPage: 1,
          pageNum: "1",
          pageSize: "10",
          total: 1,
          hasPage: true,
          hasMenu: false
        }
      }
    };
  },
  //包含的组件
  components: {
    templatePage
  },
  methods: {
    //获取店铺数据列表
    loadMess() {
      let _self = this;
      let url = URL.PROJECT.SCORE + URL.PORTNAME.TABLECARD_LIST;
      let message = {
        pageNum: _self.params.pagination.pageNum,
        id: 0,
        pageSize: _self.params.pagination.pageSize,
        isStop: _self.params.search.isStop,
        beginTime: _self.params.search.dateTimeList.length
          ? _self.params.search.dateTimeList[0]
          : "",
        endTime: _self.params.search.dateTimeList.length
          ? _self.params.search.dateTimeList[1]
          : "",
        shopNameOrCode: _self.params.search.shopNameOrCode
      };
      console.log(message);
      url = http.filterUrl(message, url);
      console.log(url);
      http.publicRequest(
        "get",
        url,
        "",
        function(res) {
          _self.params.pagination.total = validation.total(res);
          let result = res.body.data;
          _self.params.info = result;   
        },
        ""
      );
    },
    //选中数据改变时触发事件
    tableSelectChange(val) {
      let _self = this;
      _self.params.multiSelect = val;
    },
    //分页显示数量发生改变触发事件
    handleSizeChange(index) {
      let _self = this;
      _self.params.pagination.pageSize = index;
      _self.loadMess();
    },
    //翻页触发事件
    handleCurrentChange(index) {
      let _self = this;
      _self.params.pagination.pageNum = index;
      _self.loadMess();
    },
    //显示批量下载
    ShowMultiDown() {
      let _self = this;
    if(_self.params.multiSelect.length>0) {
    	 _self.params.MultiDownShow = _self.params.MultiDownShow ? false : true;
    }
    else{
    	 common.messageFunc("您还未勾选要下载的台卡", "warning");
    }
      	 
      
    
    },
    //显示单个下载
    ShowSingleDown(item) {
      let _self = this;
      _self.params.SingleDownShow = _self.params.SingleDownShow ? false : true;
      _self.params.DownLoadShopID = item.shopId;
    },
    //下载单个台卡
    downLoadTableSingle(mode) {
      let _self = this;
      let url = URL.PROJECT.SCORE + URL.PORTNAME.DOWNLOAD_SINGLE;
      let message = {
        shopId: _self.params.DownLoadShopID,
        type:mode
      };
      url = http.filterUrl(message, url);
      http.publicRequest(
        "put",
        url,
        "",
        "",
        function(res) {
        	 common.messageFunc("下载成功", "success");
        	  _self.params.SingleDownShow=false
          _self.downLoadFile(res,_self.params.DownLoadShopID);
         
        },
        "blob"
      );
    },
    //批量下载台卡
    downLoadTableMulti(mode) {
      let _self = this;
      let url = URL.PROJECT.SCORE + URL.PORTNAME.DOWNLOAD_MULTI;
      let message={
        type:mode
      }
      url=http.filterUrl(message,url);
      var idList = new Array();
      _self.params.multiSelect.forEach(key => {
        idList.push(key.shopId);
      });
      http.publicRequest(
        "put",
        url,
        idList,
        "",
        function(res) {
        	  common.messageFunc("下载成功", "success");
        	   _self.params.MultiDownShow=false
          _self.downLoadFile(res);
        
        },
        "blob"
      );
    },
    //保存下载二维码
    downLoadFile: function(data,name=null) {
      if (data.body == "") {
        return;
      }
      let blob = new Blob([data.body], { type: "octet/stream" });
      let downloadUrl = window.URL.createObjectURL(blob);
      let anchor = document.createElement("a");
      let filename = data.headers.get("Content-Disposition");
      anchor.href = downloadUrl;
      if(name==null){
        if(filename!=null){
          filename = filename.replace("attachment;","");
          anchor.download = filename.replace("filename=", "");
        }
        else{
          anchor.download="picture.zip";
        }
      }
      else{
        anchor.download = name+".png";
      }
      
      anchor.click();
      window.URL.revokeObjectURL(blob);
    },
    //重置
    reset(){
        let _self = this;
        _self.params.search = validation.reset(_self.params.search);
        _self.loadMess();
    }
  },
  //加载界面获取数据
  created() {
    this.loadMess();
  }
};
</script>

<style lang="less" scoped>
.buttonRegion {
  .search {
  
    margin-top: -10px;
    margin-bottom: -10px;
  
  .downLoad {
    text-align:right;
    margin-right: 20px;
    margin-top: -10px;
    margin-bottom: -10px;
  }
  .el-button{
  
  }
}
}
.pageDialog {
  .DownLoadDialog {
    .body {
      margin-top: 40px;
      margin-bottom:30px;
      .context {
       
      }
      .button {
        margin-left:80px;
      }
    }
  }
}
</style>