<template>
  <Modal v-model="modal" title="添加分类" :mask-closable="false">
    <div class="row" style="margin: 15px;">
      <span>分类名称：</span>
      <Input v-model="groupName" placeholder="请输入分类名称..." style="width:420px;" />
    </div>
    <div slot="footer" style="text-align: right;padding: 8px 10px 8px 0;">
      <Button type="text" @click="cancel">取消</Button>&nbsp;&nbsp;&nbsp;&nbsp;
      <Button type="primary" @click="ok">保存</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  data() {
    return {
      modal: false,
      groupName: "",
      id: 0
    };
  },
  created() {
  },
  methods: {
    show(id, name) {
      if (name) {
        this.groupName = name;
      }
      this.id = id;
      this.modal = true;
    },
    ok() {
      if (this.groupName == "") {
        this.$error("请填写分组名称！");
        return;
      }
      let templateList = this.$parent.templateList;
      if (
        !this.id &&
        templateList.findIndex(item => item.name == this.groupName) >= 0
      ) {
        this.$error("分组已存在！");
        return;
      }
      if (this.id) {
        let index = templateList.findIndex(it => it.id == this.id);
        let item = templateList[index];
        item['name'] = this.groupName;
        templateList[index] = item;
      } else {
        templateList.push({
          id: this.$genId(),
          name: this.groupName,
          template: []
        });
      }
      this.groupName = "";
      this.$root.saveConfig();
      this.$success("保存成功！");
      this.modal = false;
      this.$emit('success');
    },
    cancel() {
      this.modal = false;
      this.groupName = "";
    }
  }
};
</script>
<style scoped>
</style>
