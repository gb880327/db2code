<template>
  <div>
    <div class="row">
      <div class="templateList" v-for="item,i in template" :key="i">
        <div class="item">
          <div class="col" style="width:94%;">
            <div class="row">
              <div class="col">
                <Checkbox v-model="item.checked"></Checkbox>
                <span>模板：</span>
                <Select v-model="item.templateId" style="width:120px" placement="top-start">
                  <Option
                    v-for="tmp in templateList"
                    :value="tmp.fileName"
                    :key="tmp.name"
                    :disabled="templateShow(tmp.fileName)"
                  >{{ tmp.name }}</Option>
                </Select>
              </div>
              <div class="col">
                <span class="labelName" style="min-width:65px;">文件目录：</span>
                <Input v-model="item.fileDir" style="width:120px;"></Input>
              </div>
              <div class="col">
                <span class="labelName" style="min-width:52px;">文件名：</span>
                <Input v-model="item.fileName" style="width:120px;"></Input>
              </div>
            </div>
          </div>
          <div class="col" style="width:6%;vertical-align: top;">
            <a
              class="delItem"
              href="javascript:void(0);"
              @click="delTemp(i)"
              v-if="template.length > 1"
            >删除</a>
          </div>
        </div>
      </div>
    </div>
    <Button class="add" @click="addTemp">添加</Button>
  </div>
</template>
<script>
export default {
  name: "general",
  data() {
    return {
      templateList: [],
      template: [
        {
          checked: true,
          fileName: "",
          fileDir: "",
          templateId: ""
        }
      ]
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      let tmpList = this.$getDataForObj(this.$TEMPLATE);
      tmpList = tmpList == null ? [] : tmpList;
      tmpList.forEach(item => {
        item.template.forEach(it => {
          this.templateList.push({
            id: it.id,
            name: it.name,
            fileName: it.fileName
          });
        });
      });
    },
    templateShow(id) {
      return this.template.findIndex(item => item.templateId === id) >= 0;
    },
    delTemp(index) {
      this.template.splice(index, 1);
    },
    addTemp() {
      this.template.push({
        checked: true,
        fileName: "",
        fileDir:"",
        templateId: ""
      });
    },
    getData() {
      if (this.package === "") {
        this.$error("请填写项目包名！");
        return;
      }
      for (let item of this.template) {
        if (item.templateId === "" || item.fileName === "") {
          this.$error("请填写完整的模板信息！");
          return;
        }
      }
      return {
        template: this.template
      };
    },
    setData(data) {
      this.template = data.template;
    },
    clear() {
      this.template = [
        {
          checked: true,
          fileName: "",
          fileDir:"",
          tempPath: ""
        }
      ];
    }
  }
};
</script>
<style scoped>
.add {
  width: 100%;
  border: 1px dashed #dcdee2;
}
.add:focus {
  box-shadow: none;
}
.templateList {
  padding-left: 30px;
}
.templateList .item {
  margin: 5px 0;
  padding: 0 0 0 10px;
  border: 1px dashed #8080804f;
}
.delItem {
  display: inline-block;
  height: 50px;
  vertical-align: middle;
  line-height: 50px;
  width: 100%;
  text-align: center;
  background-color: #ed4014;
  color: #ffffff;
  margin: 1px -1px;
}
.delItem:hover {
  background-color: #f16643;
}
</style>
