z<template>
<div id="appraise" class="p30 loadInFirst" @keyup.enter="inviteAdd">
  <nav class="f16 tc mb-30" v-if="modelPositionStatus">
    第二步：邀请参与测评的人员
  </nav>
  <header class="cb psy-appraise-title">
    <span class="f14 fl">当前可测评人数：{{invitePerson}}</span><span class="cb"><el-button class="ml-20 mr-5 f13 fl bg-color-blue" type="primary" size="small" @click="uploadDialog = true"><i class="iconfont f13">&#xe665;</i>批量上传</el-button><small class="f12 fl mt-5">支持.xls或.xlsx格式文件导入</small></span>
  </header>
  <section class="mt-5">
    <div class="tr f12 mb-15">
      测评截止日期：
      <el-date-picker v-model="inviteDeadLine" size="small" type="date" placeholder="选择截止日期" :picker-options="pickerOptions" :clearable="false"></el-date-picker>
    </div>
    <header class="p10 psy-index-table-header">
      <el-row :gutter="20" class="tc f14">
        <el-col :span="2">
          <div>序号</div>
        </el-col>
        <el-col :span="3">
          <div><small>*</small>姓名</div>
        </el-col>
        <el-col :span="2">
          <div><small>*</small>性别</div>
        </el-col>
        <el-col :span="6">
          <div><small>*</small>邮箱</div>
        </el-col>
        <el-col :span="4">
          <div><small>*</small>测评职位</div>
        </el-col>
        <el-col :span="4">
          <div>电话</div>
        </el-col>
        <el-col :span="3">
          <div>操作</div>
        </el-col>
      </el-row>
    </header>
    <ul class="psy-index-list" v-if="true">
      <li class="p8" v-for="(invite, i) in inviteData">
        <el-row :gutter="20" class="tc f13">
          <el-col :span="2">
            <div>{{i+1}}</div>
          </el-col>
          <el-col :span="3">
            <div class="pr noErrorShow" :class="{ psy_appraise_error: invite.nameError }"><input class="color-main tc w" type="text" v-model="invite.name" @blur="checkName(invite)" /></div>
          </el-col>
          <el-col :span="2">
            <div class="pr noErrorShow" :class="{ psy_appraise_error: invite.genderError }"><input class="color-main tc w" type="text" v-model="invite.gender" @blur="checkGender(invite)" /></div>
          </el-col>
          <el-col :span="6">
            <div :class="{ psy_appraise_error: invite.emailError }" class="pr"><input class="color-main" type="text" v-model="invite.email" @blur="checkEmail(invite)" /></div>
          </el-col>
          <el-col :span="4">
            <div class="pr noErrorShow" :class="{ psy_appraise_error: invite.positionError }"><input class="color-main tc" type="text" v-model="invite.position" @blur="checkPosition(invite)"/></div>
          </el-col>
          <el-col :span="4">
            <div :class="{ psy_appraise_error: invite.telError }" class="pr"><input class="color-main tc invite-tel-show" type="text" v-model="invite.tel" @blur="checkPhone(invite)" /></div>
          </el-col>
          <el-col :span="3">
            <el-popover placement="bottom" width="200" trigger="click">
              <p class="tc">确认删除？</p>
              <div class="tc pb-10 mt-5">
                <el-button class="psy-popover-btn" type="primary" size="mini" @click="inviteDelConfirm(invite)"> 确 定 </el-button>
                <el-button class="psy-popover-btn psy-popover-border-btn" size="mini" @click="inviteDelCancel($event)"> 取 消 </el-button>
              </div>
              <el-button size="small" slot="reference" type="text" class="color-red f13">删除</el-button>
            </el-popover>
          </el-col>
        </el-row>
      </li>
    </ul>
    <nav class="p5 bg-color-white bd-1 mt-5 psy-appraise-cont-edit">
      <el-row :gutter="20" class="tc f13">
        <el-col :span="2" class="p10">

        </el-col>
        <el-col :span="3">
          <div>
            <el-input id="psy-add-name" placeholder="请输入姓名" v-model="inviteAddName"></el-input>
          </div>
        </el-col>
        <el-col :span="2">
          <div>
            <el-select id="psy-add-gender" v-model="gender" placeholder="请输入性别">
              <el-option :label="man" :value="man"></el-option>
              <el-option :label="woman" :value="woman"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-input id="psy-add-email" placeholder="请输入邮箱" v-model="inviteAddEmail"></el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-input id="psy-add-position" placeholder="请输入职位" v-model="inviteAddPosition"></el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-input id="psy-add-tel" placeholder="请输入电话" v-model="inviteAddTel"></el-input>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="color-blue cp"><button class="bg-color-blue color-white cp f12" type="button" name="button" @click="inviteAdd">添加</button></div>
        </el-col>
      </el-row>
    </nav>
    <div class="cb">
      <div class="fl mt-10">
        <el-checkbox class="psy-appraise-cont-check color-main" v-model="checked">测评完成发送报告给测评人</el-checkbox>
      </div>
      <div class="tr mt-15 fr">
        <span class="color-red mr-10 f12" v-if="uploadError">上传信息有{{uploadErrorCounts}}处错误，请修改</span>
        <el-button class="f13" type="primary" :disabled="inviteBtnDisabled" @click="submitExcel" :loading="submitInviteLoading"><i class="iconfont color-white mr-5 f14">&#xe652;</i>发送邀请</el-button>
      </div>
    </div>
    <div class="f12 mt-20">
      <div>
        说明
      </div>
      <div>
        1.测评邀请将通过邮件的方式发送给候选人
      </div>
      <div>
        2.候选人通过邮箱和验证码可登录进行测评，在测评邀请邮件中可查看验证码
      </div>
    </div>
  </section>
  <el-dialog title="批量上传" v-model="uploadDialog" size="small">
    <div>
      <div>第一步 下载模板：</div>
      <div class="mt-10">
        请使用<span class="color-red">我们的提供的表格模板填写邀请人</span>信息 ,否则可能导致批量上传不成功
      </div>
      <div class="tc mt-30">
        <a href="http://milipdf.oss-cn-hangzhou.aliyuncs.com/muban/example.xlsx">
          <el-button class="f13" type="primary"><i class="iconfont f14">&#xe66b;</i>下载模板</el-button>
        </a>
      </div>
      <div class="bt-1 mt-30 p15">
        <div class="mt-10 cb">
          <span class="fl">第二步 上传文件：</span>
          <span class="fr f12 color-red">注意：一次最多支持上传200人</span>
        </div>
        <div class="mt-20 tc psy-appraise-upload-btn cp color-blue p10 pr">
          <div class="cb disinblock">
            <i class="iconfont mr-5 fl">&#xe668;</i>
            <el-button size="small" class="f13 fl mt-15" type="text">点击此处选择文件</el-button>
          </div>
          <input id="excelFile" @change="excelChange($event)" class="pa" type="file" name="" value="上传">
        </div>
      </div>
    </div>
  </el-dialog>
  <el-dialog title="下列邮箱已存在，发送会覆盖之前的测评记录，是否继续？" v-model="emailComfirm" size="small">
  <ul class="emailTips" v-for="email in emailArray">
    <li>{{email}}</li>
  </ul>
  <span slot="footer" class="dialog-footer" lock-scroll="true">
    <el-button @click="emailComfirm = false">取 消</el-button>
    <el-button type="primary" @click="emailComfirmSubmit">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>
<script>
var appraiseTotal = 0;
var today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);
export default {
  name: "appraise",
  data: function data() {
    return {
      inviteData: [],
      inviteDeadLine: new Date(today.getTime() + 7 * 24 * 3600 * 1000),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      invitePerson: "-",
      checked: true,
      uploadDialog: false,
      visible2: false,
      model: true,
      inviteAddName: "",
      inviteAddEmail: "",
      inviteAddPosition: "",
      inviteAddTel: "",
      inviteAppraiseError: false,
      testData: "",
      excelData: "",
      uploadError: false,
      inviteBtnDisabled: true,
      uploadErrorCounts: "",
      gender: "",
      man: "男",
      woman: "女",
      emailComfirm: false,
      emailArray: [],
      postExcelData: "",
      modelPosition: "",
      modelPositionStatus: false,
      submitInviteLoading: false,
      widthHand: false,
    }
  },
  methods: {
    inviteDelCancel(event) {
      document.querySelector("#app").click();
      // this.showPopper = false;
      // document.querySelector(".el-popover").style.display = "none";
    },
    inviteDelConfirm(invite) {
      this.inviteData.splice(this.inviteData.indexOf(invite), 1); //删除对应条目
      console.log(invite)
      if (invite.emailError == true) {
        this.uploadErrorCounts--;
      }
      if (invite.telError == true) {
        this.uploadErrorCounts--;
      }
      if (invite.nameError == true) {
        this.uploadErrorCounts--;
      }
      if (invite.positionError == true) {
        this.uploadErrorCounts--;
      }
      if (invite.genderError == true) {
        this.uploadErrorCounts--;
      }
      if (this.uploadErrorCounts == 0) {
        this.inviteBtnDisabled = false;
        this.uploadError = false;
      }
      document.querySelector("#app").click();
      if (this.inviteData.length == 0) {
        this.inviteBtnDisabled = true;
      }
    },
    inviteAdd() { //添加信息
      let inviteAddInfo = {
        name: this.inviteAddName,
        email: this.inviteAddEmail,
        position: this.inviteAddPosition,
        tel: this.inviteAddTel,
        emailError: false,
        telError: false,
        gender: this.gender
      };
      if (inviteAddInfo.name == "") {
        this.$message.error('请填写姓名');
        document.querySelector("#psy-add-name input").focus();
      } else if (inviteAddInfo.gender == "") {
        this.$message.error('请选择性别');
        document.querySelector("#psy-add-gender input").focus();
      } else if (inviteAddInfo.email == "") {
        this.$message.error('请填写邮箱');
        document.querySelector("#psy-add-email input").focus();
      } else if (this.publicFun.verityEmail(inviteAddInfo.email)) {
        this.$message.error('邮箱格式不正确，请检查');
        document.querySelector("#psy-add-email input").focus();
      } else if (inviteAddInfo.position == "") {
        this.$message.error('请填写职位');
        document.querySelector("#psy-add-position input").focus();
      } else if ((/^\d+$/).test(inviteAddInfo.position)) {
        this.$message.error('职位不允许填写纯数字');
        document.querySelector("#psy-add-position input").focus();
      } else if (inviteAddInfo.tel != "" && this.publicFun.verityMobile(inviteAddInfo.tel)) {
        this.$message.error('手机号格式不正确，请检查');
        document.querySelector("#psy-add-tel input").focus();
      } else {
        console.log(this.inviteData);
        for (let i = 0; i < this.inviteData.length; i++) {
          if (inviteAddInfo.email == this.inviteData[i].email) {
            this.$message.error('您填写的邮箱有重复，请检查');
            document.querySelector("#psy-add-email input").focus();
            return false;
          }
        }
        this.inviteData.push(inviteAddInfo);
        this.widthHand = true;
        this.inviteAddName = "";
        this.inviteAddEmail = "";
        this.inviteAddPosition = "";
        this.inviteAddTel = "";
        this.gender = "";
        if (appraiseTotal > 200) {
          that.$msgbox({
            title: '操作未成功',
            type: "error",
            message: '批量导入最多一次支持200人，您已超出最大限额，请重新上传',
            confirmButtonText: '确定',
          });
        } else {
          appraiseTotal++;
          this.inviteBtnDisabled = false;
        }
      }
    },
    checkEmail(invite) { //检查邮箱
      if (this.publicFun.verityEmail(invite.email)) {
        invite.emailError = true;
        this.inviteBtnDisabled = true;
        this.uploadErrorCounts++;
      } else {
        if (invite.emailError == true) {
          this.uploadErrorCounts--;
          invite.emailError = false;
        }
        if (this.uploadErrorCounts <= 0) {
          this.uploadError = false;
          this.inviteBtnDisabled = false;
        }
      }
    },
    checkPhone(invite) { //检查电话号码
      if (this.publicFun.verityMobile(invite.tel)) {
        invite.telError = true;
        this.inviteBtnDisabled = true;
        this.uploadErrorCounts++;
      } else {
        if (invite.telError == true) {
          this.uploadErrorCounts--;
          invite.telError = false;
        }
        console.log(this.uploadErrorCounts)
        if (this.uploadErrorCounts <= 0) {
          this.uploadError = false;
          this.inviteBtnDisabled = false;
        }
      }
    },
    checkName(invite) {
      if (invite.name == undefined || invite.name == "") {
        if (invite.nameError != true) {
          this.uploadErrorCounts++;
        }
        invite.nameError = true;
        this.inviteBtnDisabled = true;
      } else {
        if (invite.nameError == true) {
          this.uploadErrorCounts--;
          invite.nameError = false;
        }
        if (this.uploadErrorCounts <= 0) {
          this.uploadError = false;
          this.inviteBtnDisabled = false;
        }
      }
    },
    checkGender(invite) {
      if (invite.gender == "" || invite.gender == undefined || invite.gender != "男" && invite.gender != "女") {
        if (invite.genderError != true) {
          this.uploadErrorCounts++;
        }
        this.inviteBtnDisabled = true;
        invite.genderError = true;
      } else {
        if (invite.genderError == true) {
          this.uploadErrorCounts--;
          invite.genderError = false;
        }
        if (this.uploadErrorCounts <= 0) {
          this.uploadError = false;
          this.inviteBtnDisabled = false;
        }
      }
    },
    checkPosition(invite) {
      if (invite.position == undefined || invite.position == "") {
        if (invite.positionError != true) {
          this.uploadErrorCounts++;
        }
        invite.positionError = true;
        this.inviteBtnDisabled = true;
      } else {
        if (invite.positionError == true) {
          this.uploadErrorCounts--;
          invite.positionError = false;
        }
        console.log(this.uploadErrorCounts);
        if (this.uploadErrorCounts <= 0) {
          this.uploadError = false;
          this.inviteBtnDisabled = false;
        }
      }
    },
    excelChange(event) { //excel转化成JSON
      if (typeof require !== 'undefined') var XLSX = require('xlsx');
      handleFile(event);

      function to_json(workbook) {
        var result = {};
        workbook.SheetNames.forEach(function(sheetName) {
          var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          if (roa.length > 0) {
            result[sheetName] = roa;
          }
        });
        return result;
      }
      var that = this;

      function handleFile(e) {
        var files = e.target.files;
        var i, f;
        for (i = 0; i != files.length; ++i) {
          f = files[i];
          var reader = new FileReader();
          var name = f.name;
          reader.onload = function(e) {
            var data = e.target.result;
            var workbook;
            workbook = XLSX.read(data, {
              type: 'binary'
            });
            let excelData = to_json(workbook);
            console.log(excelData);
            let xlsxData = excelData.Sheet1;
            if (xlsxData.length > 200) {
              that.$msgbox({
                title: '操作未成功',
                type: "error",
                message: '批量导入最多一次支持200人，您已超出最大限额，请重新上传',
                confirmButtonText: '确定',
              });
              document.querySelector("#excelFile").value = "";
            } else {
              that.uploadDialog = false; //关闭dialog
              let finalDataObj = [];
              let errorCounts = 0;
              for (let i = 0; i < xlsxData.length; i++) {
                var finalData = {
                  name: xlsxData[i]["姓名"],
                  email: xlsxData[i]["邮箱"],
                  position: xlsxData[i]["职位"],
                  positionError: that.verityPosition(xlsxData[i]["职位"]),
                  tel: xlsxData[i]["手机号"],
                  emailError: that.publicFun.verityEmail(xlsxData[i]["邮箱"]),
                  telError: that.publicFun.verityMobile(xlsxData[i]["手机号"]),
                  nameError: that.verityName(xlsxData[i]["姓名"]),
                  gender: xlsxData[i]["性别"],
                  genderError: that.verityGender(xlsxData[i]["性别"]),
                };
                if (finalData.name == undefined && finalData.email == undefined && finalData.position == undefined) {} else {
                  if (finalData.emailError == true) {
                    errorCounts++;
                  };
                  if (finalData.telError == true) {
                    errorCounts++;
                  };
                  if (finalData.genderError == true) {
                    errorCounts++;
                  };
                  if (finalData.nameError == true) {
                    errorCounts++;
                  };
                  if (finalData.positionError == true) {
                    errorCounts++;
                  };
                  finalDataObj.push(finalData);
                }

              };
              if (errorCounts > 0) {
                that.uploadError = true;
                that.inviteBtnDisabled = true;
                that.uploadErrorCounts = errorCounts
              } else {
                that.uploadError = false;
                that.inviteBtnDisabled = false;
                that.uploadErrorCounts = errorCounts
              }

              console.log("Excel数据", finalDataObj);
              if (that.widthHand) {
                for (let item in finalDataObj) {
                  that.inviteData.push(finalDataObj[item])
                }
                that.widthHand = false;
              } else {
                that.inviteData = finalDataObj;
              }

              appraiseTotal = finalDataObj.length;
              that.$msgbox({
                title: '操作成功',
                type: "success",
                message: `您已成功导入 ${finalDataObj.length} 人`,
                confirmButtonText: '确定',
              });
              document.querySelector("#excelFile").value = "";
              if (that.uploadErrorCounts != 0) {
                that.inviteBtnDisabled = true;
              }
            }
          };
          reader.readAsBinaryString(f);
        }
        return false;
      }
    },
    verityName(name) {
      if (name == undefined) {
        return true;
      } else {
        return false;
      }
    },
    verityGender(gender) {
      if (gender == undefined) {
        return true;
      } else {
        if (gender != "男" && gender != "女") {
          return true
        } else {
          return false;
        }
      }
    },
    verityPosition(position) {
      if (position == undefined) {
        return true;
      } else {
        if ((/^\d+$/).test(position)) {
          return true;
        } else {
          return false;
        }

      }
    },
    submitExcel() {
      console.log(this.inviteData);

      let excelArray = [];
      let excelEmailCheck = [];
      for (let i = 0; i < this.inviteData.length; i++) {
        let excelObj = {
          "name": this.inviteData[i].name,
          "gender": this.inviteData[i].gender === "男" ? 1 : 2,
          "email": this.inviteData[i].email.toLowerCase(),
          "positionName": this.inviteData[i].position,
          "mobileNumber": this.inviteData[i].tel
        };
        excelArray.push(excelObj);
        excelEmailCheck.push(excelObj.email);
      }

      let excelData = {
        "personalUsersInfo": excelArray,
        "deadline": new Date(this.inviteDeadLine).valueOf() + 24 * 3600 * 1000 - 1,
        "invitationType": this.modelPositionStatus ? 2 : 1,
        "isSendMail": this.checked ? 0 : 1,
        "performanceModelPositionName": this.modelPositionStatus ? this.modelPosition : null,
        "companyId": JSON.parse(localStorage.psyCompanyInfo).companyId,
        "performanceModelId": this.$route.query.performanceModelId ? this.$route.query.performanceModelId : null
      }
      this.postExcelData = excelData;
      let emailCheckData = {
        "emails": excelEmailCheck,
        "companyId": JSON.parse(localStorage.psyCompanyInfo).companyId
      }
      console.log(excelData);
      let emailAgain = 0;
      let emailAgainNum = [];
      for (let i = 0; i < excelData.personalUsersInfo.length; i++) {
        emailAgainNum.push(excelData.personalUsersInfo[i].email);
      }
      let emailAgainArray = emailAgainNum.sort();
      for (let j = 0; j < emailAgainArray.length - 1; j++) {
        if (emailAgainArray[j] == emailAgainArray[j + 1]) {
          emailAgain++;
        }
      }
      if (emailAgain > 0) {
        this.$message.error('有重复的测评人员信息，请删除后再次发送！');
      } else {
        this.publicFun.httpRequest("post", '/mlams/business/getExistedUsernames', JSON.stringify(emailCheckData), (status, data, message) => {
          if (status == 200) {
            // console.log("邮箱返回信息", data);
            if (data.length == 0) {
              this.submitData(excelData);
            } else {
              this.emailComfirm = true;
              this.emailArray = data;
            }
          }
        });
      }
    },
    emailComfirmSubmit() {
      this.submitData(this.postExcelData);
    },
    getAccounts() {
      this.publicFun.httpRequest("get", '/mlams/company/getCompanyBasicInfo/' + JSON.parse(localStorage.accountInfo).companyId, null, (status, data, message) => {
        if (status == 200) {
          // console.log("账号信息", data);
          this.invitePerson = data.assessmentCount;
        }
      });
    },
    submitData(excelData) {
      if (this.invitePerson == 0) {
        this.$msgbox({
          title: '操作未成功',
          type: "error",
          message: '发送失败，您的可测评数已不足，请联系客服充值',
          confirmButtonText: '确定',
        });
      } else if (this.invitePerson < this.inviteData.length) {
        this.$msgbox({
          title: '操作未成功',
          type: "error",
          message: `您最多可邀请${this.invitePerson}人，现已超出，请重新上传或充值`,
          confirmButtonText: '确定',
        });
      } else {

        // console.log(excelData)
        this.submitInviteLoading = true;
        this.publicFun.httpRequest("post", '/mlams/business/sendAssessInvitationByMail', JSON.stringify(excelData), (status, data, message) => {
          if (status == 200) {
            this.emailComfirm = false;
            this.submitInviteLoading = false;
            // console.log("发送测评信息", data);
            this.$confirm(`已成功发送 ${this.inviteData.length} 个测评邀请`, '操作成功', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'success'
            }).then(() => {
              let modelPosition = this.$route.query.positionName;
              if (modelPosition != undefined) {
                this.$router.push({
                  path: '/invite',
                });
              };
              this.inviteData = [];
              this.getAccounts();
              this.inviteBtnDisabled = true;
            })
          } else {
            this.submitInviteLoading = false;
            this.$msgbox({
              title: '操作未成功',
              type: "error",
              message: '发送失败，请检查邮件是否存在',
              confirmButtonText: '确定',
            });
            this.getAccounts();
          }
        });


      }
    }
  },
  mounted() {
    this.$parent.activeIndex = "2";
    this.getAccounts() //获取账号等信息
    let modelPosition = this.$route.query.positionName;
    if (modelPosition == undefined) {
      this.modelPositionStatus = false;
    } else {
      this.modelPosition = modelPosition
      this.modelPositionStatus = true;
    }

  }
}
</script>
<style lang="stylus">
@import "../../assets/css/style.styl"
.psy-appraise-title button
  margin-top -5px

.psy-appraise-cont-check .el-checkbox__inner
  width 17px
  height 17px

.psy-appraise-cont-edit input
  text-align center
  height 25px
  border-radius 2px
  font-size 12px
  border-color #e2e2e2

.psy-appraise-cont-edit button
  border none
  padding 3px 10px
  border-radius 50px
  margin-top 1px

.el-dialog__body
  border-top 1px solid #eaeaea
  margin-top 15px

.psy-appraise-upload-btn
  border 1px dashed mainColor
  border-radius 3px
  height 60px
  line-height 60px
  input
    left 37%
    top 20px
    opacity 0
    height 40px
    cursor pointer
  i.iconfont
    font-size 45px

.psy-index-list
  input
    border none
    font-size 13px
  button
    padding 0 5px
  .psy_appraise_error
    input
      color #FF2020
  .psy_appraise_error:before
    content "\e66f"
    font-family "iconfont"
    font-size 16px
    top -1px
    color #FFBF6F
    position absolute
    left 10px
  .noErrorShow.psy_appraise_error:before
    left -22px
#appraise
  .el-button.is-disabled
    background-color #b1b1b1
    color #fff
    border none
  .el-checkbox__label
    font-size 13px
  .emailTips
    max-height 170px
    overflow auto
  li
    line-height 2
  .el-input__icon+.el-input__inner
    padding-right 22px
  .psy-index-list input
    border 1px solid transparent
    transition all .6s
    border-radius 2px
    padding 2px 5px
  .psy-index-list input:focus,.psy-index-list input:hover
    border 1px solid #379aff
  .psy_appraise_error input:focus,.psy_appraise_error input:hover
    border 1px solid #ff2020
  input.invite-tel-show
      margin-left 40px
      text-align left
      width 80%

.el-message-box
  .el-message-box__btns
    text-align center
    margin-bottom 10px
    button
      padding 10px 20px

</style>
