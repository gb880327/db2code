<template>
  <div id="app">
    <router-view/>
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
  }
};
</script>

<style scoped>
</style>