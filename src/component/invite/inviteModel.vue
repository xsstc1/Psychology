<template>
<div id="inviteModel" @keyup.enter="modelNext">
  <div class="tc p30 loadInFirst">
    <header class="f16">
      第一步：确定需要建模的职位
    </header>
    <article class="mt-40 pr">
      <el-input v-if="positionInputShow" id="modelInput" class="tc w60" v-model="inviteModelPosition" placeholder="请输入职位名称"></el-input>
      <el-select id="modelSelect" class="w60" v-if="positionSelectShow" v-model="inviteModelPositionSelect" placeholder="请选择模型">
        <el-option v-for="item in modelPosition" :key="item.performanceModelName" :label="item.performanceModelName" :value="item.performanceModelId">
        </el-option>
      </el-select>
      <el-checkbox @change="changePositionSelect" class="ml-15" v-model="modelChecked">选择已有模型</el-checkbox>
    </article>
    <footer class="tc mt-40">
      <el-button type="primary" @click="modelNext">下一步</el-button>
    </footer>
  </div>
</div>
</template>
<script>
export default {
  name: "inviteModel",
  data: function data() {
    return {
      inviteModelPosition: "",
      modelChecked: false,
      modelPosition: "",
      positionInputShow: true,
      positionSelectShow: false,
      inviteModelPositionSelect: ""
    }
  },
  methods: {
    modelNext() {
      if (this.modelChecked == false) {
        if (this.inviteModelPosition == "") {
          this.$message.error('请填写职位名称');
          document.querySelector("#modelInput input").focus();
        } else {
          let companyId = JSON.parse(localStorage.psyCompanyInfo).companyId;
          this.publicFun.httpRequest("get", '/mlams/performanceModel/getIsExistingPositionName/' + companyId + "/" + this.inviteModelPosition, null, (status, data, message) => {
            if (status == 200) {
              // console.log("判断职位信息", data);
              if (data == true) {
                this.$message.error('已有该职位名称，请修改输入的职位名称！');
              } else {
                this.$router.push({
                  path: '/inviteAppraise',
                  query: {
                    positionName: this.inviteModelPosition
                  }
                });
              }
            }
          });
        }
      }else{
        if (this.inviteModelPositionSelect == "") {
          this.$message.error('请选择模型');
          document.querySelector("#modelSelect input").focus();
        } else {
          this.$router.push({
            path: '/inviteAppraise',
            query: {
              positionName: this.inviteModelPosition,
              performanceModelId: this.inviteModelPositionSelect
            }
          });
        }
      }

    },
    changePositionSelect() {
      // console.log(this.modelChecked)
      if (this.modelChecked == true) {
        this.positionInputShow = false;
        this.positionSelectShow = true;
      } else {
        this.positionInputShow = true;
        this.positionSelectShow = false;
      }
    }
  },
  mounted() {
    this.$parent.activeIndex = "2";
    if (localStorage.psyCompanyInfo) {
      let companyId = JSON.parse(localStorage.psyCompanyInfo).companyId;
      this.publicFun.httpRequest("get", '/mlams/performanceModel/getAllPerformanceModelPositionName/' + companyId, null, (status, data, message) => {
        if (status == 200) {
          // console.log(data);
          this.modelPosition = data;
        }
      });
    } else {
      this.$router.push({
        path: '/login'
      });
    }

  }
}
</script>
<style lang="stylus">
#inviteModel
  input
    text-align center
    font-size 13px
    display inline-block
  .el-checkbox
    color #6c8299
    font-size 13px
  button
    padding 10px 25px
  label
    position absolute
    top 9px
</style>
