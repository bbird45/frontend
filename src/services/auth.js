import axios from 'axios';

// สร้าง axios instance พร้อมกำหนดค่าเริ่มต้น
const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authService = {
  async login(email_admin, password) {
    try {
      const response = await api.post('/api/login', {
        email_admin,
        password
      });

      // ตรวจสอบว่ามี token ในการตอบกลับ
      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem('admin-token', token);
        return token;
      } else {
        throw new Error('Token not received from server');
      }
    } catch (error) {
      // จัดการ error ให้ละเอียดขึ้น
      if (error.response) {
        // กรณีเซิร์ฟเวอร์ตอบกลับด้วย status code นอกช่วง 2xx
        switch (error.response.status) {
          case 404:
            throw new Error('User not found');
          case 401:
            throw new Error('Invalid email_admin or password');
          case 500:
            throw new Error('Server error. Please try again later');
          default:
            throw new Error(`Login failed: ${error.response.data.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        // กรณีไม่ได้รับการตอบกลับจากเซิร์ฟเวอร์
        throw new Error('No response from server. Please check your internet connection');
      } else {
        // กรณีอื่นๆ
        throw new Error(`Login error: ${error.message}`);
      }
    }
  },

  logout() {
    localStorage.removeItem('admin-token');
    window.location.href = '/login';
  },

  getToken() {
    return localStorage.getItem('admin-token');
  },

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    // เพิ่มการตรวจสอบว่า token หมดอายุหรือยัง (ถ้าต้องการ)
    try {
      // ตรวจสอบโครงสร้างของ token
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }
};