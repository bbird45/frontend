<template>
  <div class="fixed top-0 left-0 w-full h-20 bg-white shadow-md z-50">
    <div class="flex justify-between items-center px-6 h-full">
      <!-- Logo and Menu Button -->
      <div class="flex items-center">
        <div class="w-30 h-20">
          <img src="@/assets/img/cmru_logo.png" class="w-full h-full object-contain" />
        </div>
        <button 
          @click="toggleMenu" 
          class="px-4 py-2 text-3xl"
          aria-label="Toggle Menu"
        >
          ≡
        </button>
      </div>

      <div v-if="isMenuVisible" class="fixed top-20 left-0 w-72 bg-white shadow-md z-40">
        <div class="p-0"> 

          <!-- ข้อมูลผังงาน -->
          <div
            class="flex items-center menu-item text-[#1d7f50] p-2"
            :class="{ active: $route.path === '/flowchart' }"
          >
            <font-awesome-icon icon="project-diagram" />
            <router-link to="/flowchart" class="m-2">
              จัดการข้อมูลผังงาน
            </router-link>
          </div>

          <!-- ข้อมูลรหัสเทียม -->
          <div
            class="flex items-center menu-item text-[#1d7f50] p-2"
            :class="{ active: $route.path === '/Pseudocode' }"
          >
            <font-awesome-icon icon="laptop-code" />
            <router-link to="/Pseudocode" class="m-2">
              จัดการข้อมูลรหัสเทียม
            </router-link>
          </div>

          <!-- จัดการข้อมูลแบบทดสอบ -->
          <div
            class="flex items-center menu-item text-[#1d7f50] p-2"
            :class="{ active: $route.path === '/Quiz' }"
          >
            <font-awesome-icon icon="poll" />
            <router-link to="/Quiz" class="m-2">
              จัดการข้อมูลแบบทดสอบ
            </router-link>
          </div>

          <!-- จัดการข้อมูลคะแนนสอบ -->
          <div
            class="flex items-center menu-item text-[#1d7f50] p-2"
            :class="{ active: $route.path === '/Score' }"
          >
            <font-awesome-icon icon="clipboard-list" />
            <router-link to="/Score" class="m-2">
              จัดการข้อมูลคะแนนสอบ
            </router-link>
          </div>

          <!-- จัดการข้อมูลคำถาม -->
          <div
            class="flex items-center menu-item text-[#1d7f50] p-2"
            :class="{ active: $route.path === '/training_phrases' }"
          >
            <font-awesome-icon icon="question-circle" />
            <router-link to="/training_phrases" class="m-2">
              จัดการข้อมูลคำถาม
            </router-link>
          </div>

          <!-- Admin -->
          <div
            class="flex items-center menu-item text-[#1d7f50] p-2"
            :class="{ active: $route.path === '/admin' }"
          >
            <font-awesome-icon icon="user" />
            <router-link to="/admin" class="m-2">
              Admin
            </router-link>
          </div>
        </div>
      </div>

      <!-- Page Title -->
      <div class="flex-grow text-center text-2xl font-bold" style="color: #1d7f50">
        หน้าจัดการฐานข้อมูล
      </div>

      <!-- Logout Button -->
      <button
        @click="handleLogout"
        class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Logout
      </button>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirmation" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <h3 class="text-lg font-medium mb-4">ยืนยันการออกจากระบบ</h3>
        <p class="mb-4">คุณต้องการออกจากระบบใช่หรือไม่?</p>
        <div class="flex justify-end gap-4">
          <button 
            @click="showConfirmation = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ยกเลิก
          </button>
          <button 
            @click="confirmLogout"
            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// สถานะการแสดงเมนู
const isMenuVisible = ref(false);
const showConfirmation = ref(false);

// เปิด/ปิดเมนู
const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
};

// แสดงไดอะ로그ยืนยันการออกจากระบบ
const handleLogout = () => {
  showConfirmation.value = true;
};

// ยืนยันการออกจากระบบ
const confirmLogout = () => {
  localStorage.removeItem("admin-token");
  showConfirmation.value = false;
  router.push("/login").then(() => {
    window.location.reload();
  });
};
</script>

<style scoped>
.menu-item {
  display: block;
  padding: 0.75rem 1rem;
  margin: 0; /* ลบ margin ด้านซ้าย */
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

.menu-group {
  margin: 0; /* ลบ margin ด้านซ้าย */
  padding: 0; /* ลบ padding ด้านซ้าย */
}
</style>