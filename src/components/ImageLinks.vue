<template>
  <b-row cols="1" cols-md="2" cols-lg="3">
    <b-col class="mb-4 mb-lg-0">
      <router-link :to="{ name: 'courses_index' }">
        <b-card
          class="my-card"
          align="center"
          footer-tag="footer"
          footer="Courses"
          footer-bg-variant="primary"
          footer-text-variant="white"
          footer-class="h2 py-4 mb-0 border-0"
        >
          <b-card-text>
            <img src="../assets/courses.svg" alt="Courses" class="image" />
          </b-card-text>
        </b-card>
      </router-link>
    </b-col>
    <b-col class="mb-4 mb-lg-0">
      <router-link :to="{ name: 'lecturers_index' }">
        <b-card
          class="my-card"
          align="center"
          footer-tag="footer"
          footer="Lecturers"
          footer-bg-variant="primary"
          footer-text-variant="white"
          footer-class="h2 py-4 mb-0 border-0"
        >
          <b-card-text>
            <img src="../assets/lecturer.svg" alt="Lecturers" class="image" />
          </b-card-text>
        </b-card>
      </router-link>
    </b-col>
    <b-col class="mb-4 mb-lg-0">
      <router-link :to="{ name: 'enrolments_index' }">
        <b-card
          class="my-card"
          align="center"
          footer-tag="footer"
          footer="Enrolments"
          footer-bg-variant="primary"
          footer-text-variant="white"
          footer-class="h2 py-4 mb-0 border-0"
        >
          <b-card-text>
            <img src="../assets/enrolment.svg" alt="Enrolments" class="image" />
          </b-card-text>
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
.my-card {
  transition: transform 0.2s;
}
.my-card:hover {
  transform: scale(1.05);
}
</style>