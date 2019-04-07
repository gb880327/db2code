<template>
  <div :style="{height: getHeight+'px'}">asdfasd</div>
</template>
<script>
export default {
  data() {
    return {
      height: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.height = this.$parent.$el.clientHeight;
    });
  },
  computed: {
    getHeight() {
      return this.height;
    }
  }
};
</script>
<style scoped>
</style>
