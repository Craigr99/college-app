<template>
  <div class="home">
    <ImageLinks />
  </div>
</template>

<script>
import ImageLinks from "../components/ImageLinks.vue";

export default {
  components: { ImageLinks },
  name: "Home",
};
</script>

<style scoped>
.home {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
