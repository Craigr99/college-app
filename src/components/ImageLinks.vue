<template>
  <b-row cols="1" cols-md="2" cols-lg="3">
    <b-col class="mb-4 mb-lg-0">
      <router-link :to="{ name: 'courses_index' }">
        <b-card align="center">
          <img src="../assets/courses.svg" alt="Courses" class="image" />
          <h2 class="pt-4">Courses</h2>
        </b-card>
      </router-link>
    </b-col>
    <b-col class="mb-4 mb-lg-0">
      <router-link :to="{ name: 'lecturers_index' }">
        <b-card align="center">
          <img src="../assets/lecturer.svg" alt="Lecturers" class="image" />
          <h2 class="pt-4">Lecturers</h2>
        </b-card>
      </router-link>
    </b-col>
    <b-col class="mb-4 mb-lg-0">
      <router-link :to="{ name: 'enrolments_index' }">
        <b-card align="center">
          <img src="../assets/enrolment.svg" alt="Enrolments" class="image" />
          <h2 class="pt-4">Enrolments</h2>
        </b-card>
      </router-link>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "ImageLinks",
};
</script>

<style scoped>
.image {
  height: 200px;
}
</style>