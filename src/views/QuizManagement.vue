<template>
    <div class="flex-1 p-6">
      <div v-if="loading" class="text-center text-gray-600">
        กำลังโหลดข้อมูล...
      </div>
      <div v-else class="p-6 bg-white  text-black grid grid-cols-1 gap-6 border border-gray-300">
        <table-component
          :textHeader="textQuiz"
          :headers="QuizHeaders"
          :data="QuizData"
          @add="handleAdd"
          @delete="handleDelete"
          @update="handleUpdate"
        />
      </div>
      <div v-if="error" class="text-red-600 text-center mt-4">
        {{ error }}
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import { QuizAPI} from '@/services/api'
  import TableComponent from "@/components/TableComponent.vue"
  
  export default defineComponent({
    name: "QuizManagement",
    
    components: {
      TableComponent,
    },
  
    data() {
      return {
        textQuiz: "ข้อมูลแบบทดสอบ",
        QuizHeaders: ["ID", "หัวข้อ", "link"],
        QuizData: [],
        loading: false,
        error: null,
      }
    },
  
    async created() {
      await this.fetchQuizData()
    },
  
    methods: {
      async fetchQuizData() {
        this.loading = true
        this.error = null
        try {
          const { data } = await QuizAPI.getAll()
          this.QuizData = data.map((Quiz) => [
          Quiz.Quiz_id,
          Quiz.Quiz_name,
          Quiz.Quiz_url
          ])
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูลแบบทดสอบ", error)
          this.error = "ไม่สามารถดึงข้อมูลแบบทดสอบได้"
        } finally {
          this.loading = false
        }
      },
  
      async handleAdd(newRow) {
        const [Quiz_name, Quiz_url] = newRow
        if (!Quiz_name || !Quiz_url) {
          this.error = "กรุณากรอกข้อมูลให้ครบถ้วน"
          return
        }
  
        try {
          await QuizAPI.create({ 
            Quiz_name,
            Quiz_url 
          })
          await this.fetchQuizData()
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล", error)
          this.error = error.response?.data || "ไม่สามารถเพิ่มข้อมูลได้"
        }
      },
  
      async handleDelete(id) {
        try {
          await QuizAPI.delete(id)
          await this.fetchQuizData()
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการลบข้อมูล", error)
          this.error = error.response?.data || "ไม่สามารถลบข้อมูลได้"
        }
      },
  
      async handleUpdate({ updatedRow }) {
        const [id, Quiz_name, Quiz_url] = updatedRow
        if (!id || !Quiz_name || !Quiz_url ) {
          this.error = "กรุณากรอกข้อมูลให้ครบถ้วน"
          return
        }
        try {
          await QuizAPI.update(id, { 
            Quiz_name, 
            Quiz_url
          })
          await this.fetchQuizData()
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล", error)
          this.error = error.response?.data || "ไม่สามารถอัปเดตข้อมูลได้"
        }
      },
    },
  })
  </script>
  
  <style scoped>
  .colorBG {
    background-color: #f4f6ff;
  }
  </style>