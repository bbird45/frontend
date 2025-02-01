<template>
  <div class="flex-1 p-6 bg-red">
    <div v-if="loading" class="text-center text-gray-600">
      กำลังโหลดข้อมูล...
    </div>
    <div v-else class="p-6 bg-white text-black grid grid-cols-1 gap-6 border border-gray-300">
      <TableComponent
        :textHeader="textcourses"
        :headers="adminHeaders"
        :data="adminData"
        @add="handleAdd"
        @delete="handleDelete"
        @update="handleUpdate"
      />
    </div>
    <div v-if="error" class="text-red-600 text-center mt-4">
      {{ error }}
    </div>
    <div v-if="!loading && adminData.length === 0" class="text-center text-gray-600">
      ไม่พบข้อมูลแอดมิน
    </div>
  </div>
</template>

<script>
import { adminAPI } from '@/services/api'
import TableComponent from "@/components/TableComponent.vue"

export default {
  name: "adminManagement",
  components: {
    TableComponent,
  },

  data() {
    return {
      textcourses: "ข้อมูลผู้ดูแลระบบ",
      adminHeaders: ["ID", "name", "password", "Email", "Phone"],
      adminData: [],
      loading: false,
      error: null,
    }
  },

  created() {
    this.fetchadminData()
  },

  methods: {
    async fetchadminData() {
      this.loading = true
      this.error = null
      try {
        const { data } = await adminAPI.getAll()
        if (data && data.length > 0) {
          this.adminData = data.map((admin) => [
            admin.admin_id,
            admin.username,
            admin.password,
            admin.email_admin,
            admin.Phone
          ])
        } else {
          this.error = "ไม่พบข้อมูลแอดมิน"
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลแอดมิน", error)
        this.error = "ไม่สามารถดึงข้อมูลแอดมินได้"
      } finally {
        this.loading = false
      }
    },

    async handleAdd(newRow) {
      const [username, password, email_admin, Phone] = newRow

      // ตรวจสอบข้อมูลที่กรอก
      if (!username) {
        this.error = "กรุณากรอกชื่อ"
        return
      }
      if (!password) {
        this.error = "กรุณากรอกรหัสผ่าน"
        return
      }
      if (!email_admin) {
        this.error = "กรุณากรอกอีเมล"
        return
      }
      if (!Phone) {
        this.error = "กรุณากรอกเบอร์โทร"
        return
      }

      // ตรวจสอบรูปแบบอีเมล
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailPattern.test(email_admin)) {
        this.error = "กรุณากรอกอีเมลให้ถูกต้อง"
        return
      }

      // ตรวจสอบรูปแบบเบอร์โทรศัพท์ (ตัวเลข 10 หลัก)
      const phonePattern = /^[0-9]{10}$/
      if (!phonePattern.test(Phone)) {
        this.error = "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (ตัวเลข 10 หลัก)"
        return
      }

      try {
        await adminAPI.create({ username, password, email_admin, Phone })
        await this.fetchadminData()
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล", error)
        this.error = error.response?.data || "ไม่สามารถเพิ่มข้อมูลได้"
      }
    },

async handleDelete(id) {
  try {
    await adminAPI.delete(id); // ลบข้อมูลผ่าน API
    await this.fetchadminData(); // ดึงข้อมูลใหม่
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการลบข้อมูล", error);
    this.error = error.response?.data || "ไม่สามารถลบข้อมูลได้";
  }
  },

    async handleUpdate({ updatedRow }) {
      const [id, username, password, email_admin, Phone] = updatedRow

      // ตรวจสอบข้อมูลที่กรอก
      if (!username) {
        this.error = "กรุณากรอกชื่อ"
        return
      }
      if (!password) {
        this.error = "กรุณากรอกรหัสผ่าน"
        return
      }
      if (!email_admin) {
        this.error = "กรุณากรอกอีเมล"
        return
      }
      if (!Phone) {
        this.error = "กรุณากรอกเบอร์โทร"
        return
      }

      // ตรวจสอบรูปแบบอีเมล
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailPattern.test(email_admin)) {
        this.error = "กรุณากรอกอีเมลให้ถูกต้อง"
        return
      }

      // ตรวจสอบรูปแบบเบอร์โทรศัพท์ (ตัวเลข 10 หลัก)
      const phonePattern = /^[0-9]{10}$/
      if (!phonePattern.test(Phone)) {
        this.error = "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (ตัวเลข 10 หลัก)"
        return
      }

      try {
        await adminAPI.update(id, { username, password, email_admin, Phone })
        await this.fetchadminData()
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล", error)
        this.error = error.response?.data || "ไม่สามารถอัปเดตข้อมูลได้"
      }
    },
  },
}
</script>

<style scoped>
.colorBG {
  background-color: #f4f6ff;
}
</style>