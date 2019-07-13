<template>
  <div>
    <div class="row" style="margin: 15px;">
      <pathChoose v-model="dataPath" title="系统数据存储目录" :width="300"></pathChoose>
    </div>
    <div class="row">
      <Button type="primary" @click="ok" style="width:300px;margin-left:122px;">保存</Button>
    </div>
  </div>
</template>
<script>
import config from "@/libs/config";
import pathChoose from "@/components/PathChoose";

export default {
  components: {
    pathChoose
  },
  data() {
    return {
      modal: false,
      dataPath: ""
    };
  },
  created() {
    this.dataPath = config.dataPath;
  },
  methods: {
    ok() {
      localStorage.setItem("basePath", this.dataPath);
      this.$success("保存成功！", () => {
        location.reload();
      });
    }
  }
};
</script>
<style scoped>
</style>
