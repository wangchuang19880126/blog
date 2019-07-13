<template>
  <div id="login">
    <div class="login_box">
      <h2>账号登录</h2>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="60px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="user">
          <el-input v-model.trim="ruleForm.user" placeholder="字母和数字组成的5-10位字符，以字母开头"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input
            type="password"
            v-model.trim="ruleForm.pass"
            placeholder="请输入密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="button">
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button type="info" @click="regist">注册</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      }
      setTimeout(() => {
        if (!/^[a-zA-Z][a-zA-Z0-9]{4,10}$/.test(value)) {
          callback(new Error("账号不符合要求"));
        } else {
          callback();
        }
      }, 500);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        user: ""
      },

      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        user: [{ validator: checkAge, trigger: "blur" }],
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let message = {
            username: this.ruleForm.user,
            password: this.ruleForm.pass
          };
          this.$ajax({
            method: "GET",
            url: this.$api.login,
            params: message,
            withCredentials:true,
          }).then(res => {
            if (res.data.state) {
              this.$alert(res.data.msg, {
                confirmButtonText: "确定",
                callback: action => {
                  res.data.dataList.token = res.data.token
                  console.log(res.data)
                  this.$store.commit("changeLogin",false)
                  this.$store.commit("increment", res.data.dataList);
                  this.$router.push({
                    name: "index",
                    params: {
                      title: "首页"
                    }
                  });
                }
              });
            } else {
              this.$alert(res.data.msg, {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
          });
        } else {
          this.$alert("请按要求填写", {
            confirmButtonText: "确定",
            callback: action => {}
          });
          return false;
        }
      });
    },
    regist() {
      this.$router.push({
        name: "regist",
        params: {
          title: "注册"
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
#login {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  box-shadow: 0 0 2px #aaa;
  border-radius: 5px;
  background-color: rgba(255, 255, 2555, 0.6);
  width: 40%;
  min-width: 350px;
  max-height: 280px;
  .login_box {
    width: 90%;
    margin: 0 auto;
    h2 {
      text-align: center;
      margin: 15px 0;
    }
    .button {
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>