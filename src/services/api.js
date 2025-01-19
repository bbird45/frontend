import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

export const flowchartAPI = {
  getAll() {
    return apiClient.get('/flowchart')
  },
  create(data) {
    return apiClient.post('/flowchart', data)
  },
  update(id, data) {
    return apiClient.put(`/flowchart/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/flowchart/${id}`)
  }
}

export const PseudocodeAPI = {
  getAll() {
    return apiClient.get('/Pseudocode')
  },
  create(data) {
    return apiClient.post('/Pseudocode', data)
  },
  update(id, data) {
    return apiClient.put(`/Pseudocode/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/Pseudocode/${id}`)
  }
}

export const QuizAPI = {
  getAll() {
    return apiClient.get('/Quiz')
  },
  create(data) {
    return apiClient.post('/Quiz', data)
  },
  update(id, data) {
    return apiClient.put(`/Quiz/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/Quiz/${id}`)
  }
}

export const ScoreAPI = {
  getAll() {
    return apiClient.get('/Score')
  },
  create(data) {
    return apiClient.post('/Score', data)
  },
  update(id, data) {
    return apiClient.put(`/Score/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/Score/${id}`)
  }
}

export const intentAPI = {
  getAll() {
    return apiClient.get('/intents')
  },
  create(data) {
    return apiClient.post('/intents', data)
  },
  update(id, data) {
    return apiClient.put(`/intents/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/intents/${id}`)
  }
}

export const trainingPhraseAPI = {
  getAll() {
    return apiClient.get('/training_phrases')
  },
  create(data) {
    return apiClient.post('/training_phrases', data)
  },
  update(id, data) {
    return apiClient.put(`/training_phrases/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/training_phrases/${id}`)
  }
}

export const adminAPI = {
  getAll() {
    return apiClient.get('/admin')
  },
  create(data) {
    return apiClient.post('/admin', data)
  },
  update(id, data) {
    return apiClient.put(`/admin/${id}`, data)
  },
  delete(id) {
    return apiClient.delete(`/admin/${id}`)
  }
}