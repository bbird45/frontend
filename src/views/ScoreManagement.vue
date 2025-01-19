<template>
    <div class="flex-1 p-6">
      <div v-if="loading" class="text-center text-gray-600">
        กำลังโหลดข้อมูล...
      </div>
      <div v-else class="p-6 bg-white  text-black grid grid-cols-1 gap-6 border border-gray-300">
        <table-component
          :textHeader="textScore"
          :headers="ScoreHeaders"
          :data="ScoreData"
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
  import { ScoreAPI} from '@/services/api'
  import TableComponent from "@/components/TableComponent.vue"
  
  export default defineComponent({
    name: "ScoreManagement",
    
    components: {
      TableComponent,
    },
  
    data() {
      return {
        textScore: "ข้อมูลคะแนนสอบ",
        ScoreHeaders: ["ID", "หัวข้อ", "link"],
        ScoreData: [],
        loading: false,
        error: null,
      }
    },
  
    async created() {
      await this.fetchScoreData()
    },
  
    methods: {
      async fetchScoreData() {
        this.loading = true
        this.error = null
        try {
          const { data } = await ScoreAPI.getAll()
          this.ScoreData = data.map((Score) => [
          Score.score_id,
          Score.score_name,
          Score.score_url
          ])
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูลคะแนนสอบ", error)
          this.error = "ไม่สามารถดึงข้อมูลคะแนนสอบได้"
        } finally {
          this.loading = false
        }
      },
  
      async handleAdd(newRow) {
        const [score_name, score_url] = newRow
        if (!score_name || !score_url) {
          this.error = "กรุณากรอกข้อมูลให้ครบถ้วน"
          return
        }
  
        try {
          await ScoreAPI.create({ 
            score_name,
            score_url 
          })
          await this.fetchScoreData()
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล", error)
          this.error = error.response?.data || "ไม่สามารถเพิ่มข้อมูลได้"
        }
      },
  
      async handleDelete(id) {
        try {
          await ScoreAPI.delete(id)
          await this.fetchScoreData()
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการลบข้อมูล", error)
          this.error = error.response?.data || "ไม่สามารถลบข้อมูลได้"
        }
      },
  
      async handleUpdate({ updatedRow }) {
        const [id, score_name, score_url] = updatedRow
        if (!id || !score_name || !score_url ) {
          this.error = "กรุณากรอกข้อมูลให้ครบถ้วน"
          return
        }
        try {
          await ScoreAPI.update(id, { 
            score_name, 
            score_url
          })
          await this.fetchScoreData()
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