/**
 * Хранилище данных о заявках в памяти
 */
const { v4: uuidv4 } = require('uuid');
const { ApiError } = require('../middleware/errorMiddleware');
const { getJobById } = require('./jobModel');

// Хранилище заявок в памяти
let applications = [
  {
    id: '101',
    jobId: '1',
    studentName: 'Анна Смирнова',
    studentEmail: 'anna.smith@student.university.edu',
    phoneNumber: '555-123-4567',
    coverLetter: 'Я очень заинтересована в этой должности исследовательского ассистента, так как она соответствует моим академическим интересам в психологии. Я выполнила все необходимые курсы и имею опыт работы с SPSS из проекта по методам исследования.',
    resumeUrl: 'https://studentportal.university.edu/resumes/annasmith',
    availability: 'Понедельник, среда и пятница',
    status: 'reviewed',
    appliedAt: new Date('2025-03-18')
  },
  {
    id: '102',
    jobId: '3',
    studentName: 'Михаил Иванов',
    studentEmail: 'michael.johnson@student.university.edu',
    phoneNumber: '555-987-6543',
    coverLetter: 'Как студент специальности Маркетинг с опытом управления социальными сетями для студенческих организаций, я считаю, что отлично подхожу для этой стажировки. Я владею Adobe Creative Suite и создавал рекламные материалы для различных мероприятий кампуса.',
    resumeUrl: 'https://studentportal.university.edu/resumes/michaeljohnson',
    availability: 'Вторник-четверг, после обеда',
    status: 'contacted',
    appliedAt: new Date('2025-03-17')
  },
  {
    id: '103',
    jobId: '2',
    studentName: 'Елена Чен',
    studentEmail: 'emily.chen@student.university.edu',
    phoneNumber: '555-456-7890',
    coverLetter: 'Я подаю заявку на должность в IT-поддержке, потому что мне нравится помогать другим решать технические проблемы. У меня есть опыт работы как с Windows, так и с Mac OS, и я уже выступала в роли неофициальной технической поддержки для своих соседей по комнате и членов семьи.',
    resumeUrl: 'https://studentportal.university.edu/resumes/emilychen',
    availability: 'Вечера в будние дни и выходные',
    status: 'pending',
    appliedAt: new Date('2025-03-20')
  },
  {
    id: '104',
    jobId: '5',
    studentName: 'Давид Вильсон',
    studentEmail: 'david.wilson@student.university.edu',
    phoneNumber: '555-234-5678',
    coverLetter: 'Я получил оценку A как по курсу "Введение в программирование", так и по "Структурам данных". Я хотел бы применить свои знания, помогая другим студентам понять концепции программирования, одновременно развивая собственные навыки преподавания и коммуникации.',
    resumeUrl: 'https://studentportal.university.edu/resumes/davidwilson',
    availability: 'Понедельник-пятница, утро',
    status: 'accepted',
    appliedAt: new Date('2025-03-15')
  },
  {
    id: '105',
    jobId: '4',
    studentName: 'София Мартинез',
    studentEmail: 'sophia.martinez@student.university.edu',
    phoneNumber: '555-876-5432',
    coverLetter: 'Я частый посетитель библиотеки, который ценит организацию и помощь другим. У меня есть опыт работы в сфере обслуживания клиентов, и я считаю, что мои навыки хорошо подойдут для помощи посетителям библиотеки.',
    resumeUrl: 'https://studentportal.university.edu/resumes/sophiamartinez',
    availability: 'Вторник и четверг, весь день',
    status: 'rejected',
    appliedAt: new Date('2025-03-16')
  }
];

/**
 * Получить все заявки
 * @param {Object} filters - Опциональные фильтры для заявок
 * @returns {Array} - Массив заявок, соответствующих фильтрам
 */
const getAllApplications = (filters = {}) => {
  let result = [...applications];
  
  // Применяем фильтры, если они предоставлены
  if (filters.jobId) {
    result = result.filter(app => app.jobId === filters.jobId);
  }
  
  if (filters.status) {
    result = result.filter(app => app.status === filters.status);
  }
  
  if (filters.studentEmail) {
    result = result.filter(app => app.studentEmail.toLowerCase() === filters.studentEmail.toLowerCase());
  }
  
  // Сортировка по последним первыми (по умолчанию)
  return result.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
};

/**
 * Получить заявку по ID
 * @param {string} id - ID заявки
 * @returns {Object} - Заявка с указанным ID
 * @throws {ApiError} - Если заявка не найдена
 */
const getApplicationById = (id) => {
  const application = applications.find(app => app.id === id);
  
  if (!application) {
    throw new ApiError(`Заявка с ID ${id} не найдена`, 404);
  }
  
  return application;
};

/**
 * Создать новую заявку
 * @param {Object} applicationData - Данные заявки
 * @returns {Object} - Созданная заявка
 * @throws {ApiError} - Если вакансия не существует или не проходит другие проверки
 */
const createApplication = (applicationData) => {
  // Проверяем, что вакансия существует
  try {
    const job = getJobById(applicationData.jobId);
    
    // Проверяем, активна ли вакансия
    if (!job.isActive) {
      throw new ApiError('Эта вакансия больше не принимает заявки', 400);
    }
    
    // Проверяем, не истек ли срок подачи
    if (job.deadline && new Date(job.deadline) < new Date()) {
      throw new ApiError('Срок подачи заявок на эту вакансию истек', 400);
    }
  } catch (error) {
    // Передаем дальше ошибки из getJobById
    throw error;
  }
  
  // Проверяем, не подал ли студент уже заявку на эту вакансию
  const existingApplication = applications.find(
    app => app.jobId === applicationData.jobId && 
           app.studentEmail.toLowerCase() === applicationData.studentEmail.toLowerCase()
  );
  
  if (existingApplication) {
    throw new ApiError('Вы уже подали заявку на эту вакансию', 409);
  }
  
  const newApplication = {
    id: uuidv4(),
    ...applicationData,
    status: 'pending',
    appliedAt: new Date()
  };
  
  applications.push(newApplication);
  return newApplication;
};

/**
 * Обновить заявку
 * @param {string} id - ID заявки
 * @param {Object} applicationData - Данные заявки для обновления
 * @returns {Object} - Обновленная заявка
 * @throws {ApiError} - Если заявка не найдена
 */
const updateApplication = (id, applicationData) => {
  const index = applications.findIndex(app => app.id === id);
  
  if (index === -1) {
    throw new ApiError(`Заявка с ID ${id} не найдена`, 404);
  }
  
  const updatedApplication = {
    ...applications[index],
    ...applicationData,
    id // ID не должен меняться
  };
  
  applications[index] = updatedApplication;
  return updatedApplication;
};

/**
 * Удалить заявку
 * @param {string} id - ID заявки
 * @returns {boolean} - True, если удаление прошло успешно
 * @throws {ApiError} - Если заявка не найдена
 */
const deleteApplication = (id) => {
  const index = applications.findIndex(app => app.id === id);
  
  if (index === -1) {
    throw new ApiError(`Заявка с ID ${id} не найдена`, 404);
  }
  
  applications.splice(index, 1);
  return true;
};

module.exports = {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication
}; 
