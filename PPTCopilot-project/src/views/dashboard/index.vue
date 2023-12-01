<template>
  <div class="dashboard-container">
    <DashPlate />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DashPlate from "./components/DashPlate.vue";
export default {
  name: 'Dashboard',
  components: {
    DashPlate
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {

  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
