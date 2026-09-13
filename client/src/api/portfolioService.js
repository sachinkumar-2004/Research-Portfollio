import api from './axios';

export const portfolioService = {
  // Profile
  getProfile: async () => {
    const res = await api.get('/profile');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/profile', data);
    return res.data;
  },

  // Research
  getResearch: async () => {
    const res = await api.get('/research');
    return res.data;
  },
  getResearchById: async (id) => {
    const res = await api.get(`/research/${id}`);
    return res.data;
  },
  createResearch: async (data) => {
    const res = await api.post('/research', data);
    return res.data;
  },
  updateResearch: async (id, data) => {
    const res = await api.put(`/research/${id}`, data);
    return res.data;
  },
  deleteResearch: async (id) => {
    const res = await api.delete(`/research/${id}`);
    return res.data;
  },

  // Publications
  getPublications: async (params = {}) => {
    const res = await api.get('/publications', { params });
    return res.data;
  },
  getPublicationById: async (id) => {
    const res = await api.get(`/publications/${id}`);
    return res.data;
  },
  createPublication: async (data) => {
    const res = await api.post('/publications', data);
    return res.data;
  },
  updatePublication: async (id, data) => {
    const res = await api.put(`/publications/${id}`, data);
    return res.data;
  },
  deletePublication: async (id) => {
    const res = await api.delete(`/publications/${id}`);
    return res.data;
  },

  // Expertise & Instrumentation
  getExpertise: async () => {
    const res = await api.get('/expertise');
    return res.data;
  },
  getExpertiseById: async (id) => {
    const res = await api.get(`/expertise/${id}`);
    return res.data;
  },
  createExpertise: async (data) => {
    const res = await api.post('/expertise', data);
    return res.data;
  },
  updateExpertise: async (id, data) => {
    const res = await api.put(`/expertise/${id}`, data);
    return res.data;
  },
  deleteExpertise: async (id) => {
    const res = await api.delete(`/expertise/${id}`);
    return res.data;
  },
  reorderExpertise: async (orderedIds) => {
    const res = await api.put('/expertise/reorder', { orderedIds });
    return res.data;
  },

  // Talks
  getTalks: async () => {
    const res = await api.get('/talks');
    return res.data;
  },
  getTalkById: async (id) => {
    const res = await api.get(`/talks/${id}`);
    return res.data;
  },
  createTalk: async (data) => {
    const res = await api.post('/talks', data);
    return res.data;
  },
  updateTalk: async (id, data) => {
    const res = await api.put(`/talks/${id}`, data);
    return res.data;
  },
  deleteTalk: async (id) => {
    const res = await api.delete(`/talks/${id}`);
    return res.data;
  },

  // Conferences
  getConferences: async () => {
    const res = await api.get('/conferences');
    return res.data;
  },
  getConferenceById: async (id) => {
    const res = await api.get(`/conferences/${id}`);
    return res.data;
  },
  createConference: async (data) => {
    const res = await api.post('/conferences', data);
    return res.data;
  },
  updateConference: async (id, data) => {
    const res = await api.put(`/conferences/${id}`, data);
    return res.data;
  },
  deleteConference: async (id) => {
    const res = await api.delete(`/conferences/${id}`);
    return res.data;
  },

  // Awards
  getAwards: async () => {
    const res = await api.get('/awards');
    return res.data;
  },
  getAwardById: async (id) => {
    const res = await api.get(`/awards/${id}`);
    return res.data;
  },
  createAward: async (data) => {
    const res = await api.post('/awards', data);
    return res.data;
  },
  updateAward: async (id, data) => {
    const res = await api.put(`/awards/${id}`, data);
    return res.data;
  },
  deleteAward: async (id) => {
    const res = await api.delete(`/awards/${id}`);
    return res.data;
  },

  // Education
  getEducation: async () => {
    const res = await api.get('/education');
    return res.data;
  },
  getEducationById: async (id) => {
    const res = await api.get(`/education/${id}`);
    return res.data;
  },
  createEducation: async (data) => {
    const res = await api.post('/education', data);
    return res.data;
  },
  updateEducation: async (id, data) => {
    const res = await api.put(`/education/${id}`, data);
    return res.data;
  },
  deleteEducation: async (id) => {
    const res = await api.delete(`/education/${id}`);
    return res.data;
  },

  // Experience
  getExperience: async () => {
    const res = await api.get('/experience');
    return res.data;
  },
  getExperienceById: async (id) => {
    const res = await api.get(`/experience/${id}`);
    return res.data;
  },
  createExperience: async (data) => {
    const res = await api.post('/experience', data);
    return res.data;
  },
  updateExperience: async (id, data) => {
    const res = await api.put(`/experience/${id}`, data);
    return res.data;
  },
  deleteExperience: async (id) => {
    const res = await api.delete(`/experience/${id}`);
    return res.data;
  },

  // Gallery
  getGallery: async () => {
    const res = await api.get('/gallery');
    return res.data;
  },
  getGalleryById: async (id) => {
    const res = await api.get(`/gallery/${id}`);
    return res.data;
  },
  createGallery: async (data) => {
    const res = await api.post('/gallery', data);
    return res.data;
  },
  updateGallery: async (id, data) => {
    const res = await api.put(`/gallery/${id}`, data);
    return res.data;
  },
  deleteGallery: async (id) => {
    const res = await api.delete(`/gallery/${id}`);
    return res.data;
  },

  // Upload (ImageKit)
  uploadFile: async (file, folder = '/academic-portfolio/general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  getUploadStatus: async () => {
    const res = await api.get('/upload/status');
    return res.data;
  },
};

export default portfolioService;
