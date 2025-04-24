/**
 * Хранилище данных о вакансиях в памяти
 */
const { v4: uuidv4 } = require('uuid');
const { ApiError } = require('../middleware/errorMiddleware');

// Хранилище вакансий в памяти
let jobs = [
  {
    id: '1',
    title: 'Научный ассистент - Кафедра психологии',
    department: 'Психология',
    description: 'Помощь профессорам в текущих исследовательских проектах в области когнитивной психологии. Задачи включают сбор данных, управление участниками и базовый анализ данных.',
    requirements: 'Специализация в психологии с завершенными курсами по методам исследования и статистике. Предпочтительно знание SPSS или R.',
    salary: 15.50,
    hoursPerWeek: 12,
    deadline: new Date('2025-06-30'),
    isActive: true,
    jobType: 'part-time',
    location: 'Корпус психологии, комната 305',
    contactEmail: 'psychology@university.edu',
    createdAt: new Date('2025-03-15')
  },
  {
    id: '2',
    title: 'Специалист IT-поддержки',
    department: 'Информационные технологии',
    description: 'Предоставление технической поддержки студентам и преподавателям по технологическим сервисам кампуса. Устранение неполадок программного и аппаратного обеспечения, помощь с проблемами сетевого подключения.',
    requirements: 'Базовые знания Windows и Mac OS, навыки устранения неполадок и отличные навыки обслуживания клиентов. Курсы по IT являются плюсом.',
    salary: 16.25,
    hoursPerWeek: 20,
    deadline: new Date('2025-05-15'),
    isActive: true,
    jobType: 'part-time',
    location: 'Главный IT-центр кампуса',
    contactEmail: 'itjobs@university.edu',
    createdAt: new Date('2025-03-10')
  },
  {
    id: '3',
    title: 'Стажировка по маркетингу - Университетские мероприятия',
    department: 'Связи с общественностью',
    description: 'Помощь команде маркетинга мероприятий в рекламных кампаниях для университетских мероприятий. Создание контента для социальных сетей, дизайн флаеров и помощь в координации рекламных мероприятий.',
    requirements: 'Специализация в маркетинге, коммуникациях или смежных областях. Опыт работы с платформами социальных сетей и базовые навыки дизайна (Canva, Adobe Creative Suite).',
    salary: 14.00,
    hoursPerWeek: 15,
    deadline: new Date('2025-05-01'),
    isActive: true,
    jobType: 'internship',
    location: 'Административный корпус, отдел маркетинга',
    contactEmail: 'events@university.edu',
    createdAt: new Date('2025-03-05')
  },
  {
    id: '4',
    title: 'Помощник библиотекаря',
    department: 'Университетская библиотека',
    description: 'Помощь с обязанностями на стойке регистрации, расстановка книг, помощь посетителям с вопросами по исследованиям и поддержание порядка в библиотеке.',
    requirements: 'Хорошие организационные навыки, внимание к деталям и способность работать самостоятельно. Знание систем классификации библиотек полезно, но не обязательно.',
    salary: 14.50,
    hoursPerWeek: 12,
    deadline: new Date('2025-05-20'),
    isActive: true,
    jobType: 'part-time',
    location: 'Главная университетская библиотека',
    contactEmail: 'library@university.edu',
    createdAt: new Date('2025-03-08')
  },
  {
    id: '5',
    title: 'Ассистент преподавателя - Компьютерные науки',
    department: 'Компьютерные науки',
    description: 'Помощь профессору с курсом "Введение в программирование". Обязанности включают проверку заданий, проведение офисных часов и иногда ведение лабораторных занятий.',
    requirements: 'Специализация в компьютерных науках с оценкой A или B по курсам "Введение в программирование" и "Структуры данных". Требуются хорошие коммуникативные навыки.',
    salary: 18.00,
    hoursPerWeek: 10,
    deadline: new Date('2025-04-30'),
    isActive: true,
    jobType: 'part-time',
    location: 'Корпус компьютерных наук, комната 210',
    contactEmail: 'cs@university.edu',
    createdAt: new Date('2025-03-12')
  }
];

/**
 * Получить все вакансии
 * @param {Object} filters - Опциональные фильтры для вакансий
 * @returns {Array} - Массив вакансий, соответствующих фильтрам
 */
const getAllJobs = (filters = {}) => {
  let result = [...jobs];
  
  // Применяем фильтры, если они предоставлены
  if (filters.department) {
    result = result.filter(job => job.department.toLowerCase().includes(filters.department.toLowerCase()));
  }
  
  if (filters.jobType) {
    result = result.filter(job => job.jobType === filters.jobType);
  }
  
  if (filters.isActive !== undefined) {
    result = result.filter(job => job.isActive === filters.isActive);
  }
  
  // Сортировка по новизне (по умолчанию)
  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * Получить вакансию по ID
 * @param {string} id - ID вакансии
 * @returns {Object} - Вакансия с указанным ID
 * @throws {ApiError} - Если вакансия не найдена
 */
const getJobById = (id) => {
  const job = jobs.find(job => job.id === id);
  
  if (!job) {
    throw new ApiError(`Вакансия с ID ${id} не найдена`, 404);
  }
  
  return job;
};

/**
 * Создать новую вакансию
 * @param {Object} jobData - Данные вакансии
 * @returns {Object} - Созданная вакансия
 */
const createJob = (jobData) => {
  const newJob = {
    id: uuidv4(),
    ...jobData,
    createdAt: new Date(),
    isActive: jobData.isActive !== undefined ? jobData.isActive : true
  };
  
  jobs.push(newJob);
  return newJob;
};

/**
 * Обновить вакансию
 * @param {string} id - ID вакансии
 * @param {Object} jobData - Данные вакансии для обновления
 * @returns {Object} - Обновленная вакансия
 * @throws {ApiError} - Если вакансия не найдена
 */
const updateJob = (id, jobData) => {
  const index = jobs.findIndex(job => job.id === id);
  
  if (index === -1) {
    throw new ApiError(`Вакансия с ID ${id} не найдена`, 404);
  }
  
  const updatedJob = {
    ...jobs[index],
    ...jobData,
    id // ID не должен меняться
  };
  
  jobs[index] = updatedJob;
  return updatedJob;
};

/**
 * Удалить вакансию
 * @param {string} id - ID вакансии
 * @returns {boolean} - True, если удаление прошло успешно
 * @throws {ApiError} - Если вакансия не найдена
 */
const deleteJob = (id) => {
  const index = jobs.findIndex(job => job.id === id);
  
  if (index === -1) {
    throw new ApiError(`Вакансия с ID ${id} не найдена`, 404);
  }
  
  jobs.splice(index, 1);
  return true;
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
}; 