<template>
  <div>
    <div class="flex justify-between">
      <h2 class="text-2xl font-bold mt-4">{{ textHeader }}</h2>
      <button @click="openAddDialog" class="add-button">เพิ่มข้อมูล</button>
    </div>
    <table>
      <thead>
        <tr class="h-color text-center">
          <th v-for="header in headers" :key="header">{{ header }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in displayedData" :key="rowIndex">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex" v-html="getDisplayName(headers[cellIndex], cell)"></td>
          <td width="100px">
            <div class="flex">
              <button class="bg-[#228B22]" @click="openEditDialog(row, rowIndex)"> <font-awesome-icon icon="edit" /></button>
              <button class="bg-red-500" @click="openDeleteConfirm(rowIndex)"> <font-awesome-icon icon="trash" /></button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showAddDialog" class="modal-overlay">
    <div class="modal-content">
      <div class="bg-[#1d7f50] p-4 border border-[#1d7f50] rounded-t-md">
        <p class="text-2xl text-white">เพิ่มข้อมูล</p>
      </div>
      <div class="m-4">
        <div v-for="(header, index) in headers.slice(1)" :key="index" class="flex flex-col mt-4">
          <div class="flex">
            <label>{{ header }}</label>
            <p class="text-red-500">*</p>
          </div>
          <template v-if="isSelectionField(header)">
            <select v-model="newRow[index]">
              <option value="" disabled>เลือก{{ header }}</option>
              <option v-for="option in getOptionsForField(header)" :key="option.id" :value="option.id">
                {{ option.name }}
              </option>
            </select>
          </template>
          <template v-else>
            <textarea class="border border-gray-300 mt-1 p-2 rounded" v-model="newRow[index]"
              :placeholder="'กรอก ' + header" />
          </template>
        </div>
        <div class="flex justify-center mt-4 w-full">
          <button class="bg-[#1d7f50] w-full " @click="addRow">เพิ่ม</button>
          <button class="bg-[#ff6666] w-full" @click="closeAddDialog">ยกเลิก</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showEditDialog" class="modal-overlay">
    <div class="modal-content">
      <div class="bg-[#1d7f50] p-4 border border-[#1d7f50] rounded-t-md">
        <p class="text-2xl text-white">แก้ไขข้อมูล</p>
      </div>
      <div class="m-4 ">
        <div v-for="(header, index) in headers.slice(1)" :key="index" class="flex flex-col mt-4">
          <div class="flex">
            <label>{{ header }}</label>
            <p class="text-red-500">*</p>
          </div>
          <template v-if="isSelectionField(header)">
            <select v-model="editRow[index + 1]">
              <option value="" disabled>เลือก{{ header }}</option>
              <option v-for="option in getOptionsForField(header)" :key="option.id" :value="option.id">
                {{ option.name }}
              </option>
            </select>
          </template>
          <template v-else>
            <textarea class="border border-gray-300 mt-1 p-2 rounded" v-model="editRow[index + 1]"
              :placeholder="'แก้ไข ' + header" />
          </template>
        </div>
        <div class="flex justify-center mt-4 w-full">
          <button class="bg-[#1d7f50] mt-4 w-full" @click="saveRow">บันทึก</button>
          <button class="bg-[#ff6666] mt-4 w-full" @click="closeEditDialog">ยกเลิก</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showDeleteConfirm" class="modal-overlay">
  <div class="modal-content">
    <div class="bg-[#ff6666] p-4 border border-[#ff6666] rounded-t-md">
      <p class="text-2xl text-white">ลบข้อมูล</p>
    </div>
    <div class="m-4">
      <p class="text-center text-lg">คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?</p>
      <div class="flex justify-center mt-4">
        <button class="bg-[#1d7f50] px-6 py-2 rounded text-white mr-4" @click="confirmDelete">
          ตกลง
        </button>
        <button class="bg-[#ff6666] px-6 py-2 rounded text-white" @click="cancelDelete">
          ยกเลิก
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    textHeader: String,
    headers: Array,
    data: Array,
    flowchartOptions: {
      type: Array,
      default: () => []
    },
    PseudocodeOptions: {
      type: Array,
      default: () => []
    },
    QuizOptions: {
      type: Array,
      default: () => []
    },
    ScoreOptions: {
      type: Array,
      default: () => []
    },
    trainingPhraseOptions: {
      type: Array,
      default: () => []
    },
    intentOptions: {
      type: Array,
      default: () => []
    },

  },

  data() {
    return {
      internalData: [...this.data],
      editRowIndex: null,
      editRow: [],
      showAddForm: false,
      newRow: Array(this.headers.length - 1).fill(""),
      errorMessage: "",
      showAddDialog: false,
      showEditDialog: false,
      indexs: 1,
      showDeleteConfirm: false,
      deleteRowIndex: null 
    };
  },

  watch: {
    data(newData) {
      this.internalData = [...newData];
    }
  },

  methods: {
    isSelectionField(header) {
      return ['ข้อมูลผังงาน', 'ข้อมูลรหัสเทียม', 'ข้อมูลแบบทดสอบ', 'ข้อมูลคะแนนสอบ', 'Intent (หมวดหมู่)'].includes(header);
    },

    getOptionsForField(header) {
      switch (header) {
        case 'ข้อมูลผังงาน':
          return this.flowchartOptions.map(flowchart => ({
            id: flowchart.flow_id,
            name: flowchart.flow_name
          }));
        case 'ข้อมูลรหัสเทียม':
          return this.PseudocodeOptions.map(Pseudocode => ({
            id: Pseudocode.Pseudo_id,
            name: Pseudocode.Pseudo_name,
          }));
        case 'ข้อมูลแบบทดสอบ':
          return this.QuizOptions.map(Quiz => ({
            id: Quiz.Quiz_id,
            name: Quiz.Quiz_name,
          }));
        case 'ข้อมูลคะแนนสอบ':
          return this.ScoreOptions.map(Score => ({
            id: Score.score_id,
            name: Score.score_name,
          }));
        case 'Intent (หมวดหมู่)':
          return this.intentOptions.map(intent => ({
            id: intent.intent_id,
            name: intent.intent_description
          }))
        default:
          return [];
      }
    },

    getDisplayName(header, value) {
      if (!value) return "ไม่ระบุ";

      // ตรวจสอบว่าคอลัมน์เป็น URL
      if (header === "link" || header.toLowerCase().includes("url")) {
        return `<a href="${value}" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">${value}</a>`;
      }
      const options = this.getOptionsForField(header);
      const option = options.find(opt => opt.id === parseInt(value));
      return option ? option.name : value;
    },

    toggleAddRow() {
      this.showAddForm = !this.showAddForm;
      this.newRow = Array(this.headers.length - 1).fill("");
      this.errorMessage = "";

    },

    openAddDialog() {
      this.showAddDialog = true;
      this.newRow = Array(this.headers.length - 1).fill("");
    },
    closeAddDialog() {
      this.showAddDialog = false;
    },

    addRow() {
      if (this.newRow.some(field => !field)) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }
      this.$emit("add", this.newRow);
      this.closeAddDialog();
    },

    openEditDialog(row, index) {
      this.showEditDialog = true;
      this.editRowIndex = index;
      this.editRow = [...row];
      console.log("editRow", this.editRow);

    },
    closeEditDialog() {
      this.showEditDialog = false;
    },
    saveRow() {
      if (this.editRow.some(field => !field)) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }
      this.$emit("update", { updatedRow: this.editRow });
      this.closeEditDialog();
    },

    deleteRow(index) {
      const id = this.internalData[index][0];
      this.$emit("delete", id);
    },
    openDeleteConfirm(index) {
      this.deleteRowIndex = index; 
      this.showDeleteConfirm = true; 
    },
    cancelDelete() {
      this.deleteRowIndex = null; 
      this.showDeleteConfirm = false; 
    },
    confirmDelete() {
      if (this.deleteRowIndex !== null) {
        const id = this.internalData[this.deleteRowIndex][0];
        this.$emit("delete", id); 
        this.internalData.splice(this.deleteRowIndex, 1); 
        this.deleteRowIndex = null; 
        this.showDeleteConfirm = false; 
      }
    },

    cancelAddRow() {
      this.showAddForm = false;
      this.errorMessage = "";
    },
  },

  computed: {
    displayedData() {
      return this.internalData.slice().sort((a, b) => a[0] - b[0]);
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: rgb(240, 240, 240);
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

button {
  margin: 5px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

th,
td {
  border: 1px solid #1d7f50;
  padding: 8px;
  text-align: left;

}

th {
  background-color: #1d7f50;
}

button {
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 4px;
  transition: background-color 0.3s;
}

.add-button {
  margin-top: 1rem;
  background-color: #1d7f50;
  padding: 10px;
  margin-right: 10px;
}

.add-form {
  width: 30%;
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #1d7f50;
  border-radius: 8px;
  background-color: #f9f9f9;
}

select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 4px;
}

.error-message {
  color: red;
  margin-top: 1rem;
}

.h-color {
  color: #ffffff;
}
</style>