<template>
  <div id="login">
    <div class="login_box">
      <h2>账号注册</h2>
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
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model.trim="ruleForm.checkPass"
            placeholder="再次输入密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="email"
          label="邮箱"
          :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ]"
        >
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="button">
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
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
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        user: "",
        checkPass: "",
        email: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        user: [{ validator: checkAge, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
        console.log(formName)
      if (!this.ruleForm.email)
        return this.$alert("邮箱不能为空", {
          confirmButtonText: "确定",
          callback: action => {}
        });
      if (this.ruleForm.pass !== this.ruleForm.checkPass)
        return this.$alert("两次密码必须相同!", {
          confirmButtonText: "确定",
          callback: action => {}
        });
      if (!this.ruleForm.pass)
        return this.$alert("密码不能为空", {
          confirmButtonText: "确定",
          callback: action => {}
        });
      this.$refs[formName].validate(valid => {
        let username = this.ruleForm.user;
        let password = this.ruleForm.pass;
        let pwdL = this.ruleForm.checkPass;
        let email = this.ruleForm.email;
        let message = {
          username,
          password,
          email
        };
        this.$ajax({
          method: "POST",
          url: this.$api.register,
          data: this.$qs.stringify(message)
        }).then(res => {
          if (res.data.state) {
            this.$alert(res.data.msg, {
              confirmButtonText: "确定",
              callback: action => {
                this.$router.push({
                  name: "login",
                  params: {
                    title: "登录"
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
  max-height: 350px;
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