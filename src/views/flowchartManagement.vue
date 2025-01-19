<template>
    <div class="flex-1 p-6">
      <div v-if="loading" class="text-center text-gray-600">
        กำลังโหลดข้อมูล...
      </div>
      <div v-else class="p-6 bg-white  text-black grid grid-cols-1 gap-6 border border-gray-300">
        <table-component
          :textHeader="textflowchart"
          :headers="flowchartHeaders"
          :data="flowchartData"
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
  import { flowchartAPI} from '@/services/api'
  import TableComponent from "@/components/TableComponent.vue"
  
  export default defineComponent({
    name: "flowchartManagement",
    
    components: {
      TableComponent,
    },
  
    data() {
      return {
        textflowchart: "ข้อมูลผังงาน",
        flowchartHeaders: ["ID", "หัวข้อ", "ข้อมูล", "link"],
        flowchartData: [],
        loading: false,
        error: null,
      }
    },
  
    async created() {
      await this.fetchFlowchartData()
    },
  
    methods: {
      async fetchFlowchartData() {
        this.loading = true
        this.error = null
        try {
          const { data } = await flowchartAPI.getAll()
          this.flowchartData = data.map((flowchart) => [
            flowchart.flow_id,
            flowchart.flow_name,
            flowchart.flow_description,
            flowchart.flow_url
          ])
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผังงาน", error)
          this.error = "ไม่สามารถดึงข้อมูลผังงานได้"
        } finally {
          this.loading = false
        }
      },
  
      async handleAdd(newRow) {
        const [flow_name, flow_description, flow_url] = newRow
        if (!flow_name || !flow_description|| !flow_url) {
          this.error = "กรุณากรอกข้อมูลให้ครบถ้วน"
          return
        }
  
        try {
          await flowchartAPI.create({ 
            flow_name, 
            flow_description,
            flow_url 
          })
          await this.fetchFlowchartData()
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล", error)
          this.error = error.response?.data || "ไม่สามารถเพิ่มข้อมูลได้"
        }
      },
  
      async handleDelete(id) {
        try {
          await flowchartAPI.delete(id)
          await this.fetchFlowchartData()
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการลบข้อมูล", error)
          this.error = error.response?.data || "ไม่สามารถลบข้อมูลได้"
        }
      },
  
      async handleUpdate({ updatedRow }) {
        const [id, flow_name, flow_description, flow_url] = updatedRow
        if (!id || !flow_name || !flow_description || !flow_url ) {
          this.error = "กรุณากรอกข้อมูลให้ครบถ้วน"
          return
        }
        try {
          await flowchartAPI.update(id, { 
            flow_name, 
            flow_description, 
            flow_url
          })
          await this.fetchFlowchartData()
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