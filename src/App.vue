<template>
  <div
    v-if="isReady"
    :class="['h-screen flex flex-col w-full', route.path === '/app' ? 'bg-app' : 'bg-default w-full']">
    <template v-if="isAuthenticated">
      <HeaderBar class="fixed top-0 left-0 w-full h-28 bg-white shadow-md z-50" />
      <div class="flex pt-6">
        <main class="flex-1 p-6 mt-12">
          <router-view />
        </main>
      </div>
    </template>

    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HeaderBar from '@/components/HeaderBar.vue'

export default {
  name: 'App',
  components: {
    HeaderBar,
  },
  setup() {
    const isAuthenticated = ref(false)
    const isReady = ref(false)
    const router = useRouter()
    const route = useRoute()

    const checkAuth = () => {
      // ตรวจสอบ token ใน localStorage
      isAuthenticated.value = localStorage.getItem('admin-token') !== null
      console.log('Authenticated:', isAuthenticated.value)
    }

    const handleNavigation = () => {
      // ตั้งค่า isReady ให้เป็น true สำหรับทุกหน้า
      isReady.value = true

      // ตรวจสอบการล็อกอินเฉพาะสำหรับ /app
      if (!route.path === '/login') {
        console.log('route:', route.path.value);
        
      }
      {
        checkAuth()
      }
    }

    onMounted(() => {
      handleNavigation()

      // ตรวจสอบการเปลี่ยนเส้นทาง
      router.afterEach((to) => {
        isReady.value = true

        // ตรวจสอบการล็อกอินเมื่อเข้า /app
        if (to.path === '/app') {
          checkAuth()
        }
      })
    })

    return {
      isAuthenticated,
      isReady,
      route, 
    }
  },
}
</script>

<style>
html {
  overflow-y: scroll;
}

.bg-app {
  background-image: 
    url('@/assets/img/cmru_st.jpg'); 
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat; 
}

/* พื้นหลังเริ่มต้น */
.bg-default {
  background-color: #f3f4f6; 
  background-size: cover;
  background-position: center;
  
}
</style>
