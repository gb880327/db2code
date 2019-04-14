<template>
  <Modal
    v-model="modal"
    title="系统设置"
    :mask-closable="false"
    @on-ok="ok"
    @on-cancel="cancel"
  >
  <div class="row" style="margin: 15px;">
      <pathChoose v-model="dataPath" title="系统数据存储目录:" :width="300"></pathChoose>
  </div>
  <div slot="footer" style="text-align: right;padding: 8px 10px 8px 0;">
      <Button type="text" @click="cancel">取消</Button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Button type="primary" @click="ok">保存</Button>
  </div>
  </Modal>
</template>
<script>
import config from "@/libs/config";
import pathChoose from "@/components/PathChoose";

export default {
  name: "Setting",
  components:{
      pathChoose
  },
  data() {
    return {
      modal: false,
      dataPath: ''
    };
  },
  methods: {
    show(){
        this.dataPath = config.dataPath;
        this.modal = true;
    },
    ok() {
        localStorage.setItem('basePath', this.dataPath);
        this.$success("保存成功！",()=>{
            location.reload();
        });
    },
    cancel() {
        this.modal = false;
    }
  }
};
</script>
<style scoped>
</style>
