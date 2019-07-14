<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import config from "@/libs/config";
const fs = require("fs");

export default {
  created() {
    if (!fs.existsSync(config.dataPath)) {
      fs.mkdir(config.dataPath, err => {
        if (err) {
          this.$error(err);
        }
      });
    }
    if (!fs.existsSync(config.template)) {
      fs.mkdir(config.template, err => {
        if (err) {
          this.$error(err);
        }
      });
    }
  }
};
</script>

<style scoped>
</style>