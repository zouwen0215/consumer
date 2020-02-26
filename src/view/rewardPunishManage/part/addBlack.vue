<template>
  <div class="addBlack">
    <el-form ref="form" :model="params.updateForm" :rules="rules" label-width="150px">
      <el-form-item label="加入黑名单原因：" prop="cause">
        <el-input type="textarea" rows="5" v-model="params.updateForm.cause" placeholder="请输入加入黑名单原因，仅限20字"></el-input>
      </el-form-item>
      <p>加入黑名单的门店将无法享受积分商城任何权益</p>
      <div class="dialog-footer">
        <el-button type="primary" @click.native="onSubmite('form')">保存</el-button>
        <el-button @click.native="close('form')">返回</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import http from "@/utils/http.js";
import URL from "@/utils/url.js";
import validation from "@/utils/validation.js";
export default {
  data() {
    return {
      rules: {
        cause: [
          {
            required: true,
            message: "请输入加入黑名单原因",
            trigger: "blur"
          },
          {
            min: 1,
            max: 20,
            message: "不能超过20个字符"
          }
        ],
       
      },
      params: {
      	updateForm:{}
      }
    };
  },
  props: {
    param: ""
  },
  methods: {
    close(formData) {
      let _self = this;
      _self.param.dialogFormVisible = false;
    },
    onSubmite(formData) {
      let _self = this;
      _self.$refs[formData].validate(valid => {
        if (valid) {
          let url = URL.PROJECT.SCORE + URL.PORTNAME.ADD_BLACKLIST;
          let body = {
            shopId: _self.param.listId,
            cause: _self.param.updateForm.cause,
            createUser: "",
            createUserPhone: "",
          };
          http.publicRequest(
            "POST",
            url,
            body,
            function(res) {
                 _self.param.dialogFormVisible = false;
              _self.$emit('reload')
            },
            function(res) {}
          );
        }
      });
    }
  },
  created() {}
};
</script>



<style lang="less" scoped>
.addBlack {
  text-align: left;
  .dialog-footer {
  	margin-top: 10px;
    text-align: center;
  }
}
</style>


