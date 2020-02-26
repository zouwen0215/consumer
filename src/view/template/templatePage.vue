<template>
  <div class="templatePage">
    <div class="topRegion">
      <div class="funcRegion">
        <slot name="funcRegion"></slot>
      </div>
      <div class="border">
        <slot name="border"></slot>
      </div>
      <div class="buttonRegion">
        <slot name="buttonRegion"></slot>
      </div>
    </div>

    <div class="pageRegion">
      <slot name="pageRegion"></slot>
    </div>

    <div class="pageination" v-if="param.pagination.total && param.pagination.hasPage">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="param.pagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="param.pagination.total"
      ></el-pagination>
    </div>
    <div class="pageDialog">
      <el-dialog title="功能列表" :visible.sync="param.pagination.hasMenu" width="300px" center>
        <function-list :funcMenus="funcMenu"></function-list>
      </el-dialog>

      <slot name="pageDialog"></slot>
    </div>
  </div>
</template>

<script>
import functionList from "./functionList";
export default {
  data() {
    return {};
  },
  components: {
    functionList
  },
  props: {
    param: {
      default: function() {
        return {
          pagination: {
            currentPage: 1,
            pageNum: "10",
            pageSize: "0",
            total: 100,
            hasPage: false,
            hasMenu: false
          }
        };
      }
    },
    funcMenu: {
      type: Array,
      default: function() {
        return [
          {
            label: "常用功能1",
            limit: true,
            callback: () => {
              this.$message("这是一条消息提示");
            },
            icon: ""
          },
          {
            label: "常用功能2",
            limit: true,
            callback: () => {
              this.$message("这是一条消息提示2");
            },
            icon: ""
          }
        ];
      }
    }
  },
  methods: {
    //修改页面的显示个数pageSize
    handleSizeChange(val) {
      let _self = this;
      if (_self.param.pagination.hasPage) this.$emit("handleSize", val);
    },
    //修改显示页面pageNum
    handleCurrentChange(val) {
      let _self = this;
      if (_self.param.pagination.hasPage) this.$emit("handleCurrent", val);
    }
  },
  created() {}
};
</script>

<style lang="less" scoped>
.templatePage {
  .topRegion {
    background-color: #fff;
    padding: 0 10px;
     margin-bottom: 10px;
    .funcRegion {
      & > * {
         text-align: left;
        padding: 10px;
        background-color: #fff;
      }
      .border{
        border-bottom: 1px solid #e6e6e6;
      }
    }
    .buttonRegion {
      & > * {
        padding: 10px;
        text-align: left;
        background-color: #fff;
       
      }
    }
  }

  .pageRegion {
    background-color: #fff;
    padding: 10px 10px 10px;
  }

  .pageination {
    padding: 0  0 10px ;
    background-color: #fff;
  }
}
</style>