<template>
  <div>
    <div class="flex justify-between items-center p-4">
      <h2 class="text-xl sm:text-2xl font-bold">{{ textHeader }}</h2>
      <button @click="openAddDialog" class="bg-[#1d7f50] text-white px-4 py-2 rounded-md hover:bg-[#155a3d] focus:outline-none focus:ring-2 focus:ring-[#1d7f50] focus:ring-offset-2 flex items-center">
        เพิ่มข้อมูล
      </button>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full border-collapse border border-[#1d7f50]">
        <thead>
          <tr class="bg-[#1d7f50] text-white text-center">
            <th
              v-for="(header, index) in headers"
              :key="header"
              :class="['p-2 border border-[#1d7f50]', getColumnWidth(index)]"
            >
              {{ header }}
            </th>
            <th :class="['p-2 border border-[#1d7f50]', getColumnWidth(headers.length)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
            <td
              v-for="(cell, cellIndex) in row"
              :key="cellIndex"
              :class="['p-2 border border-[#1d7f50]', getColumnWidth(cellIndex)]"
              v-html="getDisplayName(headers[cellIndex], cell)"
            ></td>
            <td :class="['p-2 border border-[#1d7f50]', getColumnWidth(headers.length)]">
              <div class="flex space-x-2 justify-center">
                <button class="bg-[#228B22] text-white px-2 py-2 rounded-md hover:bg-[#1b6f1b] focus:outline-none focus:ring-2 focus:ring-[#228B22] focus:ring-offset-2 flex items-center" @click="openEditDialog(row, rowIndex)">
                  <font-awesome-icon icon="edit" />
                </button>
                <button class="bg-red-500 text-white px-2 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center" @click="openDeleteConfirm(rowIndex)">
                  <font-awesome-icon icon="trash" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-center items-center mt-4 space-x-2">
      <button @click="firstPage" :disabled="currentPage === 1" class="pagination-button">
        หน้าแรก
      </button>
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">
        หน้าก่อนหน้า
      </button>
      <span class="text-sm">หน้า {{ currentPage }} จาก {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">
        หน้าถัดไป
      </button>
      <button @click="lastPage" :disabled="currentPage === totalPages" class="pagination-button">
        หน้าสุดท้าย
      </button>
    </div>
    <div v-if="showAddDialog" class="modal-overlay">
      <div class="modal-content bg-white rounded-lg w-11/12 sm:w-96">
        <div class="bg-[#1d7f50] p-4 rounded-t-lg">
          <p class="text-xl text-white">เพิ่มข้อมูล</p>
        </div>
        <div class="p-4">
          <div v-for="(header, index) in headers.slice(1)" :key="index" class="mb-4">
            <label class="block text-sm font-medium">{{ header }}<span class="text-red-500">*</span></label>
            <template v-if="isSelectionField(header)">
              <select v-model="newRow[index]" class="w-full p-2 border border-gray-300 rounded mt-1">
                <option value="" disabled>เลือก{{ header }}</option>
                <option v-for="option in getOptionsForField(header)" :key="option.id" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
            </template>
            <template v-else>
              <textarea v-model="newRow[index]" class="w-full p-2 border border-gray-300 rounded mt-1" :placeholder="'กรอก ' + header"></textarea>
            </template>
          </div>
          <div class="flex space-x-2">
            <button @click="addRow" class="w-full bg-[#1d7f50] text-white px-4 py-2 rounded hover:bg-[#155a3d]">เพิ่ม</button>
            <button @click="closeAddDialog" class="w-full bg-[#ff6666] text-white px-4 py-2 rounded hover:bg-red-600">ยกเลิก</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showEditDialog" class="modal-overlay">
      <div class="modal-content bg-white rounded-lg w-11/12 sm:w-96">
        <div class="bg-[#1d7f50] p-4 rounded-t-lg">
          <p class="text-xl text-white">แก้ไขข้อมูล</p>
        </div>
        <div class="p-4">
          <div v-for="(header, index) in headers.slice(1)" :key="index" class="mb-4">
            <label class="block text-sm font-medium">{{ header }}<span class="text-red-500">*</span></label>
            <template v-if="isSelectionField(header)">
              <select v-model="editRow[index + 1]" class="w-full p-2 border border-gray-300 rounded mt-1">
                <option value="" disabled>เลือก{{ header }}</option>
                <option v-for="option in getOptionsForField(header)" :key="option.id" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
            </template>
            <template v-else>
              <textarea v-model="editRow[index + 1]" class="w-full p-2 border border-gray-300 rounded mt-1" :placeholder="'แก้ไข ' + header"></textarea>
            </template>
          </div>
          <div class="flex space-x-2">
            <button @click="saveRow" class="w-full bg-[#1d7f50] text-white px-4 py-2 rounded hover:bg-[#155a3d]">บันทึก</button>
            <button @click="closeEditDialog" class="w-full bg-[#ff6666] text-white px-4 py-2 rounded hover:bg-red-600">ยกเลิก</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDeleteConfirm" class="modal-overlay">
    <div class="modal-content bg-white rounded-lg w-11/12 sm:w-96">
      <div class="bg-[#ff6666] p-4 rounded-t-lg">
        <p class="text-xl text-white">ลบข้อมูล</p>
      </div>
      <div class="p-4">
        <p class="text-center text-lg">คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?</p>
        <div class="flex justify-center mt-4 space-x-4">
          <button @click="confirmDelete" class="bg-[#1d7f50] text-white px-6 py-2 rounded hover:bg-[#155a3d]">ตกลง</button>
          <button @click="cancelDelete" class="bg-[#ff6666] text-white px-6 py-2 rounded hover:bg-red-600">ยกเลิก</button>
        </div>
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
    newRow: Array(this.headers.length - 1).fill(""),
    showAddDialog: false,
    showEditDialog: false,
    showDeleteConfirm: false,
    deleteRowIndex: null,
    currentPage: 1,
    itemsPerPage: 7 
  };
},

watch: {
  internalData(newData) {
    if (newData) {
      this.$emit('update:data', newData);
    }
  }
},

computed: {
  displayedData() {
    return this.internalData.slice().sort((a, b) => a[0] - b[0]);
  },
  totalPages() {
    return Math.ceil(this.internalData.length / this.itemsPerPage);
  },
  paginatedData() {
    if (this.itemsPerPage <= 0) return this.internalData; 
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = Math.min(start + this.itemsPerPage, this.internalData.length);
    return this.internalData.slice(start, end);
  }
},

methods: {
  isSelectionField(header) {
    return ['ข้อมูลผังงาน', 'ข้อมูลรหัสเทียม', 'ข้อมูลแบบทดสอบ', 'ข้อมูลคะแนนสอบ', 'Intent (หมวดหมู่)'].includes(header);
},

getOptionsForField(header) {
  if (!header) return [];
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
      }));
    default:
      return [];
  }
},

getDisplayName(header, value) {
  if (!header || !value) return `<span class="text-red-500">ยังไม่มีการกรอกข้อมูลในช่องนี้</span>`;
  if (header === "Password") return "********************";
  if (header === "link" || header.toLowerCase().includes("url")) {
    return `<a href="${value}" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">${value}</a>`;
  }
  const options = this.getOptionsForField(header);
  const option = options.find(opt => opt.id === parseInt(value));
  return option ? option.name : value;
},


getColumnWidth(index) {
  const widths = [
    'w-[1%]',   
    'w-[18%]',  
    'w-[65%]',  
    'w-[4%]',  
    'w-[5%]',  
    'w-[5%]'   
  ];
  return widths[index] || 'w-auto'; 
},

openAddDialog() {
  this.showAddDialog = true;
  this.newRow = Array(this.headers.length - 1).fill("");
},

closeAddDialog() {
  this.showAddDialog = false;
},

addRow() {
  // ตรวจสอบว่าข้อมูลทุกฟิลด์ถูกกรอกครบถ้วน
  if (this.newRow.some(field => !field)) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

    // ตรวจสอบรหัสผ่าน (หากมีฟิลด์รหัสผ่าน)
    const passwordIndex = this.headers.indexOf("Password");
      if (passwordIndex !== -1) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      if (!passwordPattern.test(this.newRow[passwordIndex - 1])) { 
        alert("กรุณากรอกรหัสผ่านให้ถูกต้อง:\n- ต้องมีอย่างน้อย 6 ตัวอักษร\n- ต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว\n- ต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว\n- ต้องมีตัวเลขอย่างน้อย 1 ตัว\n- ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว");
      return;
    }
  }

    // ตรวจสอบรูปแบบอีเมล (หากมีฟิลด์อีเมล)
    const emailIndex = this.headers.indexOf("Email");
      if (emailIndex !== -1) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/;
      if (!emailPattern.test(this.newRow[emailIndex - 1])) { 
        alert("กรุณากรอกอีเมลให้ถูกต้อง A-Z, a-z, 0-9, ., _, - @ เท่านั้น");
      return;
    }
  }

  // ตรวจสอบเบอร์โทรศัพท์ (หากมีฟิลด์เบอร์โทรศัพท์)
  const phoneIndex = this.headers.indexOf("Phone");
    if (phoneIndex !== -1) {
      const phonePattern = /^[0-9]{10}$/; 
      if (!phonePattern.test(this.newRow[phoneIndex - 1])) { 
        alert("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (ตัวเลข 10 หลัก)");
      return;
    }
  }

  this.$emit("add", this.newRow);
  this.closeAddDialog();
},

openEditDialog(row, index) {
  this.showEditDialog = true;
  this.editRowIndex = index;
  this.editRow = [...row];
},

closeEditDialog() {
  this.showEditDialog = false;
},

saveRow() {
  // ตรวจสอบว่าข้อมูลทุกฟิลด์ถูกกรอกครบถ้วน
  if (this.editRow.some(field => !field)) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  // ตรวจสอบรหัสผ่าน (หากมีฟิลด์รหัสผ่าน)
  const passwordIndex = this.headers.indexOf("Password");
  if (passwordIndex !== -1) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordPattern.test(this.editRow[passwordIndex])) {
      alert("กรุณากรอกรหัสผ่านให้ถูกต้อง:\n- ต้องมีอย่างน้อย 6 ตัวอักษร\n- ต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว\n- ต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว\n- ต้องมีตัวเลขอย่างน้อย 1 ตัว\n- ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว");
      return;
    }
  }

  // ตรวจสอบรูปแบบอีเมล (หากมีฟิลด์อีเมล)
  const emailIndex = this.headers.indexOf("Email");
  if (emailIndex !== -1) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/;
    if (!emailPattern.test(this.editRow[emailIndex])) {
      alert("กรุณากรอกอีเมลให้ถูกต้อง A-Z, a-z, 0-9, ., _, - @ เท่านั้น");
      return;
    }
  }

  // ตรวจสอบเบอร์โทรศัพท์ (หากมีฟิลด์เบอร์โทรศัพท์)
  const phoneIndex = this.headers.indexOf("Phone");
  if (phoneIndex !== -1) {
    const phonePattern = /^[0-9]{10}$/; 
    if (!phonePattern.test(this.editRow[phoneIndex])) {
      alert("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (ตัวเลข 10 หลัก)");
      return;
    }
  }

  this.$emit("update", { updatedRow: this.editRow });
  this.closeEditDialog();
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
    const idToDelete = this.paginatedData[this.deleteRowIndex][0];
    const actualIndex = this.internalData.findIndex(row => row[0] === idToDelete);

    if (actualIndex !== -1) {
      this.$emit("delete", idToDelete); 
      this.internalData.splice(actualIndex, 1); 
    } else {
      console.error("ไม่พบข้อมูลที่ต้องการลบ");
    }

    this.deleteRowIndex = null; 
    this.showDeleteConfirm = false;
  }
},

firstPage() {
  this.currentPage = 1;
},

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
},

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
},

lastPage() {
  this.currentPage = this.totalPages;
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
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

button {
  transition: background-color 0.3s;
}

textarea {
  resize: vertical;
}

.pagination-button {
  background-color: #1d7f50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>