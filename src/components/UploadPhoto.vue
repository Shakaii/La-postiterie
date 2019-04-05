<template>
  <div class="upload-container">
    <el-button
      type="primary" 
      plain 
      @click="uploadClick"
    >
      Exporter sur google drive <i class="material-icons">cloud_upload</i>
    </el-button>
    <div class="input">
      <div class="checkboxContainer">
        <el-checkbox
          id="checkbox"
          v-model="useGmail"
          type="checkbox"
          @change="updateGmail"
        >
          Envoyer le lien sur mon adresse gmail
        </el-checkbox>
      </div>
      <el-input
        v-if="useGmail == false"
        id="email"
        :class="{
          formValid: isEmailValid && email.length >= 1,
          formInvalid: !isEmailValid && email.length >= 1
        }"
        v-model="email"
        placeholder="adresse email"
        type="text"
        @change="checkEmail"
      >
        <template slot="prepend">
          <i class="material-icons">email</i>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: "UploadPhoto",
  data() {
    return {
      email: "",
      useGmail: true,
      isEmailValid: false
    };
  },
  created: function() {
    if (localStorage.getItem("email")) {
      this.email = localStorage.getItem("email");
      this.checkEmail();
    }
  },
  methods: {
    checkEmail() {
      let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
      if (regex.test(this.email)) {
        this.isEmailValid = true;
      } else {
        this.isEmailValid = false;
      }
      this.inputChange();
    },
    updateGmail() {
      this.$emit("updateGmail", this.useGmail);
    },
    uploadClick() {
      this.$emit("uploadClick");
    },
    inputChange() {
      this.$emit("inputChange", this.email, this.isEmailValid);
    }
  }
};
</script>

<style scoped>
.checkboxContainer {
  margin-top: 1em;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.formInvalid {
  border-color: #e6a23c !important;
  border-style: solid;
  border-width: 1px;
  border-radius: 5px;
}

.formValid {
  border-color: #67c23a !important;
  border-style: solid;
  border-width: 1px;
  border-radius: 5px;
}

.upload-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.upload-container .input {
  width: initial;
}

.upload-container {
  flex-direction: column;
}

.checkboxContainer {
  margin-bottom: 1em;
}

#email {
  margin-bottom: 1em;
}
</style>
