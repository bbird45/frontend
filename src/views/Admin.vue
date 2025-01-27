<template>
  <div 
    class="min-h-screen flex items-center justify-center"
    :style="{ 
      backgroundImage: `url(${require('@/assets/img/com.jpg')})`,
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: 'rgba(156, 163, 175, 0.8)' 
    }">
    <div class="max-w-lg w-full bg-white rounded-lg shadow-2xl p-6 relative transition-transform duration-500 hover:scale-105 hover:shadow-3xl">
      <div class="text-center mb-4 mt-4">
        <div class="inline-block rounded-lg px-6 py-2 bg-green-600 shadow-lg shadow-green-700 transform scale-105">
          <h2 class="text-3xl font-bold text-white">LOGIN</h2>
        </div>
          <p class="text-xl mt-5">กรุณากรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div v-if="error" class="text-xl bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {{ error }}
        </div>

        <div>
          <label class="block text-xl font-medium text-gray-700">Email</label>
          <div class="relative mt-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <font-awesome-icon icon="user" class="text-blue-400" />
            </div>
            <input
              v-model="email_admin"
              type="text"
              required
              placeholder="กรุณากรอกอีเมล"
              class="block w-full h-12 pl-10 rounded-md border border-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-green-100 text-xl"
            />
          </div>
        </div>
        <div>
          <label class="block text-xl font-medium text-gray-700">Password</label>
          <div class="relative mt-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <font-awesome-icon icon="lock" class="text-blue-400" />
            </div>
            <input
              v-model="password"
              type="password"
              required
              placeholder="กรุณากรอกรหัสผ่าน"
              class="block w-full h-12 pl-10 rounded-md border border-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-green-100 shadow-lg text-xl"
            />
          </div>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/auth' 
export default {
  name: 'AdminLogin',
  data() {
    return {
      email_admin: '',
      password: '',
      loading: false,
      error: null
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.error = null

      try {
        // เรียก authService เพื่อเช็ค login กับ API
        const token = await authService.login(this.email_admin, this.password)

        // เก็บ token และเปลี่ยนเส้นทางไปหน้า /app
        localStorage.setItem('admin-token', token)
        this.$router.push('/app')
      } catch (err) {
        this.error = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
        console.error('Login ไม่สำเร็จ:', err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
