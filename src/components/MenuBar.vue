<template>
  <div class="menu-bar bg-white w-70">
    <div class="menu-group">
      <div class="flex items-center text-[#1d7f50] font-bold mb-2" @click="toggleContentMenu">
        <font-awesome-icon icon="book-open" class="m-2" />
        จัดการข้อมูลเนื้อหา
      </div>
      <div v-if="isContentMenuOpen">
        <div
          class="flex items-center menu-item text-[#1d7f50]"
          :class="{ active: $route.path === '/flowchart' }"
        >
          <font-awesome-icon icon="project-diagram" />
          <router-link to="/flowchart" class="m-2">
            ข้อมูลผังงาน
          </router-link>
        </div>
        <div
          class="flex items-center menu-item text-[#1d7f50]"
          :class="{ active: $route.path === '/Pseudocode' }"
        >
          <font-awesome-icon icon="laptop-code" />
          <router-link to="/Pseudocode" class="m-2">
            ข้อมูลรหัสเทียม
          </router-link>
        </div>
      </div>
    </div>
    <div
      class="flex items-center menu-item text-[#1d7f50]"
      :class="{ active: $route.path === '/Quiz' }"
    >
      <font-awesome-icon icon="poll" />
      <router-link to="/Quiz" class="m-2">
        จัดการข้อมูลแบบทดสอบ
      </router-link>
    </div>
    <div
      class="flex items-center menu-item text-[#1d7f50]"
      :class="{ active: $route.path === '/Score' }"
    >
      <font-awesome-icon icon="clipboard-list" />
      <router-link to="/Score" class="m-2">
        จัดการข้อมูลคะแนนสอบ
      </router-link>
    </div>
    <div
      class="flex items-center menu-item text-[#1d7f50]"
      :class="{ active: $route.path === '/training_phrases' }"
    >
      <font-awesome-icon icon="question-circle" />
      <router-link to="/training_phrases" class="m-2">
        จัดการข้อมูลคำถาม
      </router-link>
    </div>
    <div
      class="flex items-center menu-item text-[#1d7f50]"
      :class="{ active: $route.path === '/admin' }"
    >
      <font-awesome-icon icon="user" />
      <router-link to="/admin" class="m-2">
        Admin
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isContentMenuOpen = ref(false);

const toggleContentMenu = () => {
  isContentMenuOpen.value = !isContentMenuOpen.value;
};
</script>

<style scoped>
.menu-bar {
  width: 315px;
  min-height: calc(100vh - 64px);
  padding: 1rem;
}

.menu-item {
  display: block;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.menu-item.active {
  background-color: #1d7f50;
  color: #ffffff;
}

.menu-item:hover {
  background-color: #e0e0e0;
  color: #1d7f50;
}

.menu-header {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.menu-group {
  margin-bottom: 1rem;
}
</style>
