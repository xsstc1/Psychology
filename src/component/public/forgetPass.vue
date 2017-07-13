<template>
<div id="forgetPass" @keyup.enter="findPass">
  <div class="psy-forget-pass tc bg-color-white p20 bd-1 loadInSecond">
    <header class="mb-20 mt-15 bbs-1 f16 pb-30">
      找回密码
    </header>
    <article class="mt-50 tc" v-if="findPassBefore">
      <div class="cb disinblock">
        <span class="fl f14 mt-10"><small class="color-red">* </small>邮箱：</span>
        <span class="fl"><el-input id="psy-forget-input" v-model="findPassInput" class="f13 forget-pass-input" placeholder="请输入邮箱号"></el-input></span>
      </div>
      <div class="mt-20 mb-30">
        <el-button @click="forgetPass" class="psy-login-btn f13" type="primary">找回密码</el-button>
      </div>
    </article>
    <article class="mt-50 tc" v-if="findPassAfter">
      <div class="cb">
        <span class="fl f14 mt-10 w30 tr"><small class="color-red">* </small>新密码：</span>
        <span class="fl w70 tl"><el-input type="password" id="psy-forget-input-new" v-model="findPassNew" class="f13 forget-pass-input" placeholder="请输入新密码"></el-input></span>
      </div>
      <div class="cb mt-15">
        <span class="fl f14 mt-10 w30 tr"><small class="color-red">* </small>确认新密码：</span>
        <span class="fl w70 tl"><el-input type="password" id="psy-forget-input-again" v-model="findPassAgain" class="f13 forget-pass-input" placeholder="请确认新密码"></el-input></span>
      </div>
      <div class="mt-20 mb-30">
        <el-button @click="findPass" class="psy-login-btn f13" type="primary" :loading="findPassLoading">确定</el-button>
      </div>
    </article>
  </div>
</div>
</template>
<script>
export default {
  name: "forgetPass",
  data: function data() {
    return {
      findPassInput: "",
      findPassBefore: true,
      findPassAfter: false,
      findPassNew: "",
      findPassAgain: "",
      findPassLoading:false
    }
  },
  mounted() {
    this.$parent.loginPage = false;
    this.$parent.customerStatus = false;
    if (this.$route.query.code != undefined) {
      this.findPassAfter = true;
      this.findPassBefore = false;
    }
  },
  methods: {
    forgetPass() {
      if (this.findPassInput == "") {
        this.$message.error('请输入邮箱');
        document.querySelector("#psy-forget-input input").focus();
      } else if (this.publicFun.verityEmail(this.findPassInput)) {
        this.$message.error('请输入正确的邮箱');
        document.querySelector("#psy-forget-input input").focus();
      } else {
        console.log(this.findPassInput)
        let forgetPassData = {
          "companyEmail": this.findPassInput
        }
        this.publicFun.httpRequest("post", '/mlams/businessUser/resetPasswordSendVerifyEmail', JSON.stringify(forgetPassData), (status, data, message) => {
          if (status == 200) {
            this.findPassInput = "";
            this.$msgbox({
              title: '操作成功',
              type: "success",
              message: `邮件发送成功，请去邮箱修改密码`,
              confirmButtonText: '确定',
            });
          } else {
            this.$message.error(message);
          }
        });

      }
    },
    findPass() {
      let code = this.$route.query.code;
      let businessUserId = this.$route.query.businessUserId;
      this.findPassLoading = true;
      this.publicFun.httpRequest("get", '/mlams/businessUser/resetPasswordCheck/' + code, null, (status, data, message) => {
        if (status == 200) {
          this.findPassLoading = false;
          if(this.findPassNew == ""){
            this.$message.error("请输入新密码");
            document.querySelector("#psy-forget-input-new input").focus();
          }else if(this.findPassAgain == ""){
            this.$message.error("请输入确认密码");
            document.querySelector("#psy-forget-input-again input").focus();
          }else if(this.findPassAgain != this.findPassNew){
            this.$message.error("两次输入的密码不一致，请检查");
            document.querySelector("#psy-forget-input-again input").focus();
          }else{
            let findPassData = {
              "newPassword": this.findPassAgain,
              "businessUserId": businessUserId
            }
            this.publicFun.httpRequest("post", '/mlams/businessUser/resetPasswordByEmail', JSON.stringify(findPassData), (status, data, message) => {
              if (status == 200) {
                  this.$confirm('请前往登陆。', '操作成功', {
                    confirmButtonText: '确定前往',
                    cancelButtonText: '取消',
                    showCancelButton:false,
                    type: 'success'
                  }).then(() => {
                    this.$router.push({
                      path: '/login'
                    });
                  }).catch(() => {

                  });

              } else {
                this.$message.error(message);
              }
            });
          }

        } else {
          this.$message.error(message);
        }
      });
    }
  }
}
</script>
<style lang="stylus">
#forgetPass
  margin-left -210px
  .psy-forget-pass
    max-width 800px
    width 60%
    margin 100px auto 0 auto
  .forget-pass-input
    width 300px
    input
      border-radius 2px
</style>
