<template>
<div id="login" @keyup.enter="submitForm">
  <div class="mt-100 tc loadInSecond">
    <div class="psy-login-content bg-color-white disinblock">
      <el-form :model="loginForm" ref="loginForm" class="demo-ruleForm tc bc w70">
        <div class="mb-30">
          系统登录
        </div>
        <el-form-item prop="text">
          <el-input @change="checkName" :class="{ input_error: loginForm.nameError }" class="psy-login-user f13" type="text" v-model="loginForm.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input @change="checkPass" :class="{ input_error: loginForm.passError }" class="psy-login-pass f13" type="password" v-model="loginForm.pass" placeholder="请输入密码"></el-input>
        </el-form-item>
         <div class="tr f12 cp">
           <router-link to="/forgetPass">
           忘记密码?
           </router-link>
         </div>
        <div class="tc f13 color-red" v-if="loginForm.errorShow">
          <i class="iconfont color-red mr-5 f16">&#xe65d;</i>{{loginForm.errorMessage}}
        </div>
        <el-form-item>
          <el-button class="psy-login-btn" type="primary" v-model="loginForm.loginBtn" @click="submitForm" :loading="loginForm.loading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: "login",
  data: function data() {
    return {
      loginForm: {
        name: '',
        pass: '',
        loginBtn: '',
        errorMessage: '',
        nameError: false,
        passError: false,
        errorShow: false,
        loading: false
      },
    };
  },
  methods: {
    submitForm() {
      if (this.loginForm.name == "" && this.loginForm.pass == "") {
        this.loginForm.errorShow = true
        this.loginForm.nameError = true;
        this.loginForm.passError = true;
        this.loginForm.errorMessage = "请输入用户名和密码";
        document.querySelector(".psy-login-user input").focus();
      } else if (this.loginForm.pass == "") {
        this.loginForm.errorShow = true
        this.loginForm.errorMessage = "请输入密码";
        this.loginForm.passError = true;
        document.querySelector(".psy-login-pass input").focus();
      } else if (this.loginForm.name == "") {
        this.loginForm.errorShow = true
        this.loginForm.nameError = true;
        this.loginForm.errorMessage = "请输入用户名";
        document.querySelector(".psy-login-user input").focus();
      } else {
        this.loginForm.loading = true;
        let loginInfo = {
          loginName: this.loginForm.name,
          password: this.loginForm.pass
        };

        this.publicFun.httpRequest("post", "/mlams/businessUser/login", JSON.stringify(loginInfo), (status, data, message) => {
          if (status == 200) {
            this.loginForm.loading = false;
            window.localStorage.psyLoginInfo = JSON.stringify(loginInfo);
            window.localStorage.psyCompanyInfo = JSON.stringify(data);
            // console.log("登陆信息",data);
            const companyId = data.companyId;
            // let companyId = "008f31833ade4e72b28ab13d3a09e157";
            this.publicFun.httpRequest("get", `/mlams/businessAffairs/getBusinessAffairsInfo/${companyId}`, null, (status, data, message) => {
              if (status == 200) {
                // console.log("销售数据", data);
                localStorage.salesInfo = JSON.stringify(data);
                this.$store.state.salesmanName = data.salesmanName;
                this.$store.state.wechatQrCode = data.salesmanWechatQrCode;
                this.$store.state.salesmanMobileNumber = data.salesmanMobileNumber;
                this.$store.state.salesmanEmail = data.salesmanEmail;
                this.$store.state.salesmanMobileNumberHref = "tel:" + data.salesmanName;
                this.$store.state.salesmanEmailHref = "mailto:" + data.salesmanEmail;
                this.$store.state.customerStatus = true;
                // 获取头像
                this.publicFun.httpRequest("get",'/mlams/company/getCompanyBasicInfo/' + companyId, null, (status, data, message) => {
                  if (status == 200) {
                    // console.log("首页信息",data);
                    this.$store.state.companyLogo = data.companyLogo;
                    this.$store.state.companyInfo = true;
                    window.localStorage.accountInfo = JSON.stringify(data);
                    this.$router.push({
                      path: '/'
                    }); //向url中传递参数
                  }
                });
              }
            });

          } else {
            this.loginForm.loading = false
            this.loginForm.errorShow = true
            this.loginForm.nameError = true;
            this.loginForm.passError = true;
            this.loginForm.errorMessage = message;
            document.querySelector(".psy-login-user input").focus();
          }
        })
      }
    },
    checkName() {
      this.loginForm.nameError = false;
      this.loginForm.errorShow = false
    },
    checkPass() {
      this.loginForm.passError = false;
      this.loginForm.errorShow = false
    },
    userNameChange() {
      this.$store.state.user_name = this.loginForm.name;
    }
  },
  mounted() {
    this.$parent.loginPage=false
  }
}
</script>
<style lang="stylus">
#login
  margin-left -210px
  a
    color #6c8299
.psy-login-content
  border 1px solid #e4e4e4
  padding 40px 0 20px 0
  width 550px
  input
    border-radius 2px
  .input_error input
    border-color #E74C3C
  .el-form-item
    margin-bottom 15px

.el-form-item__error
  display inline-block
  position relative

.el-form-item__error:before
  content "\e65d"
  position absolute
  left -20px
  top 0
  font-size 18px
  font-family "iconfont"

psy_login_style()
  position absolute
  left 10px
  top 0
  font-size 25px
  font-family "iconfont"
  color #aab7c4

.psy-login-user:before
  content "\e673"
  psy_login_style()

.psy-login-pass:before
  content "\e666"
  psy_login_style()

.psy-login-user input,.psy-login-pass input
  text-indent 30px
.psy-login-btn
  margin-top 20px
  padding 10px 50px
</style>
