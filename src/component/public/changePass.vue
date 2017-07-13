<template>
<div id="changePass">
  <div class="mt-80 tc loadInFirst">
    <div class="psy-changePass-content bg-color-white disinblock">
      <el-form label-width="100px" :model="changePass" :rules="changePassRules" ref="changePass" :label-position="labelPosition" class="demo-ruleForm tc bc p20">
        <div class="mb-30 change-pass-title">
          <div class="f16 color-6">
            修改密码
          </div>
          <div class="f12 mt-5 mb-20 change-pass-title-small">为了账户安全，请及时绑定您的手机和邮箱</div>
        </div>
        <div class="w60 bc">
          <el-form-item label="原密码：" prop="oldPass">
            <el-input id="changeOldPass" size="small" type="password" v-model="changePass.oldPass" auto-complete="off" placeholder="请输入原密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码：" prop="pass">
            <el-input size="small" type="password" v-model="changePass.pass" auto-complete="off" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="checkPass">
            <el-input size="small" type="password" v-model="changePass.checkPass" auto-complete="off" placeholder="请确认新密码"></el-input>
          </el-form-item>
          <el-form-item class="mt-25">
            <el-button type="primary" @click="submitForm('changePass')">确定</el-button>
          </el-form-item>
        </div>

      </el-form>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: "changePass",
  data() {
    var validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.changePass.checkPass !== '') {
          this.$refs.changePass.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.changePass.pass) {
        callback(new Error('两次输入不一致!'));
      } else {
        callback();
      }
    };
    return {
      labelPosition: "right",
      changePass: {
        oldPass: '',
        pass: '',
        checkPass: '',
      },
      changePassRules: {
        oldPass: [{
          validator: validateOldPass,
          trigger: 'blur',
          required: true
        }],
        pass: [{
          validator: validatePass,
          trigger: 'blur',
          required: true
        }],
        checkPass: [{
          validator: validatePass2,
          trigger: 'blur',
          required: true
        }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let changePass = {
            "newPassword": this.changePass.pass,
            "oldPassword": this.changePass.oldPass,
            "businessUserId": JSON.parse(localStorage.psyCompanyInfo).mlamsUserId
          }
          this.publicFun.httpRequest("post", '/mlams/businessUser/resetPassword', JSON.stringify(changePass), (status, data, message) => {
            if (status == 200) {
              let changePassLogin = {
                loginName: JSON.parse(localStorage.psyLoginInfo).loginName,
                password: this.changePass.pass
              }
              this.publicFun.httpRequest("post", '/mlams/businessUser/login', JSON.stringify(changePassLogin), (status, data, message) => {
                if (status == 200) {
                  window.localStorage.psyLoginInfo = JSON.stringify(changePassLogin);
                  this.$msgbox({
                    title: '操作成功',
                    type: "success",
                    message: `恭喜您，密码修改成功`,
                    confirmButtonText: '确定',
                  });
                }
              });
            }else{
              this.$message.error(`${message}`);
              document.querySelector("#changeOldPass input").focus();
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
<style lang="stylus">
#changePass
  .psy-changePass-content
    border 1px solid #e4e4e4
    padding 10px 0 20px 0
    width 800px
    .change-pass-title
      border-bottom 1px dashed #ccc
      .change-pass-title-small
        color #999
    label,input
      font-size 13px
    input
      border 1px solid #ccc
      border-radius 0
    button
      padding 10px 40px
    .el-form-item
      margin-bottom 10px
    .el-form-item__error
      position absolute
      top 8px
      left 390px
      width 120px
      text-align left

</style>
