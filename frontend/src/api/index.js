import { apiClient } from './apiClient';

export const caseApi = {
  getAll: () => apiClient.get('/cases'),
  getById: (id) => apiClient.get(`/cases/${id}`),
  uploadDocument: (formData) => apiClient.post('/cases/upload', formData),
};

export const reviewApi = {
  getAnalysis: (caseId) => apiClient.post('/review', { caseId }),
};

export const draftApi = {
  generateDraft: (caseId, templateType, customInstructions = '') =>
    apiClient.post('/draft', { caseId, templateType, customInstructions }),
};

export const researchApi = {
  searchIssues: (caseId, query = '') =>
    apiClient.post('/research', { caseId, query }),
};

export const chatApi = {
  sendMessage: (caseId, query, history = []) =>
    apiClient.post('/chat', { caseId, query, history }),
};

export const ablationApi = {
  runBenchmark: (caseId, query = '') =>
    apiClient.post('/ablation', { caseId, query }),
};

export const legalDataApi = {
  getStatutes: () => apiClient.get('/statutes'),
  getPrecedents: () => apiClient.get('/precedents'),
};
