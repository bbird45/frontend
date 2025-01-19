<template>
    <div class="flex-1 p-6">
      <div v-if="loading" class="text-center text-gray-600">
        กำลังโหลดข้อมูล...
      </div>
      <div v-else class="p-6 bg-white  text-black grid grid-cols-1 gap-6 border border-gray-300">
        <table-component
          :textHeader="textPseudocode"
          :headers="PseudocodeHeaders"
          :data="PseudocodeData"
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
  import { PseudocodeAPI} from '@/services/api'
  import TableComponent from "@/components/TableComponent.vue"
  
  export default defineComponent({
    name: "PseudocodeManagement",
    
    components: {
      TableComponent,
    },
  
    data() {
      return {
        textPseudocode: "ข้อมูลรหัสเทียม",
        PseudocodeHeaders: ["ID", "หัวข้อ", "ข้อมูล", "link"],
        PseudocodeData: [],
        loading: false,
        error: null,
      }
    },
  
    async created() {
      await this.fetchPseudocodeData()
    },
  
    methods: {
      async fetchPseudocodeData() {
        this.loading = true
        this.error = null
        try {
          const { data } = await PseudocodeAPI.getAll()
          this.PseudocodeData = data.map((Pseudocode) => [
          Pseudocode.Pseudo_id,
          Pseudocode.Pseudo_name,
          Pseudocode.Pseudo_description,
          Pseudocode.Pseudo_URL
          ])
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูลรหัสเทียม", error)
          this.error = "ไม่สามารถดึงข้อมูลรหัสเทียมได้"
        } finally {
          this.loading = false
        }
      },
  
      async handleAdd(newRow) {
        const [Pseudo_name, Pseudo_description, Pseudo_URL] = newRow
        if (!Pseudo_name || !Pseudo_description|| !Pseudo_URL) {
          this.error = "กรุณากรอกข้อมูลให้ครบถ้วน"
          return
        }
  
        try {
          await PseudocodeAPI.create({ 
            Pseudo_name, 
            Pseudo_description,
            Pseudo_URL 
          })
          await this.fetchPseudocodeData()
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล", error)
          this.error = error.response?.data || "ไม่สามารถเพิ่มข้อมูลได้"
        }
      },
  
      async handleDelete(id) {
        try {
          await PseudocodeAPI.delete(id)
          await this.fetchPseudocodeData()
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการลบข้อมูล", error)
          this.error = error.response?.data || "ไม่สามารถลบข้อมูลได้"
        }
      },
  
      async handleUpdate({ updatedRow }) {
        const [id, Pseudo_name, Pseudo_description, Pseudo_URL] = updatedRow
        if (!id || !Pseudo_name || !Pseudo_description || !Pseudo_URL ) {
          this.error = "กรุณากรอกข้อมูลให้ครบถ้วน"
          return
        }
        try {
          await PseudocodeAPI.update(id, { 
            Pseudo_name, 
            Pseudo_description, 
            Pseudo_URL
          })
          await this.fetchPseudocodeData()
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