const Joi = require('joi');
const { ApiError } = require('../middleware/errorMiddleware');

/**
 * Проверяет данные запроса по схеме Joi
 * @param {Object} data - Данные для проверки 
 * @param {Joi.Schema} schema - Схема Joi для проверки
 * @returns {Object} - Проверенные данные
 * @throws {ApiError} - Если проверка не прошла
 */
const validateRequest = (data, schema) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    // Формируем ошибки валидации в более читабельный объект
    const validationErrors = error.details.reduce((acc, err) => {
      const key = err.path[0];
      if (!acc[key]) acc[key] = [];
      acc[key].push(err.message);
      return acc;
    }, {});
    
    throw new ApiError(
      'Ошибка валидации. Пожалуйста, проверьте предоставленные данные.',
      422,
      validationErrors
    );
  }
  
  return value;
};

// Схема валидации вакансии
const jobSchema = Joi.object({
  title: Joi.string().min(3).max(100).required()
    .messages({
      'string.base': 'Название должно быть текстовой строкой',
      'string.empty': 'Название обязательно',
      'string.min': 'Название должно содержать минимум 3 символа',
      'string.max': 'Название не может превышать 100 символов',
      'any.required': 'Название обязательно'
    }),
  department: Joi.string().required()
    .messages({
      'string.base': 'Отдел должен быть текстовой строкой',
      'string.empty': 'Отдел обязателен',
      'any.required': 'Отдел обязателен'
    }),
  description: Joi.string().min(10).required()
    .messages({
      'string.base': 'Описание должно быть текстовой строкой',
      'string.empty': 'Описание обязательно',
      'string.min': 'Описание должно содержать минимум 10 символов',
      'any.required': 'Описание обязательно'
    }),
  requirements: Joi.string().required()
    .messages({
      'string.base': 'Требования должны быть текстовой строкой',
      'string.empty': 'Требования обязательны',
      'any.required': 'Требования обязательны'
    }),
  salary: Joi.number().min(0)
    .messages({
      'number.base': 'Зарплата должна быть числом',
      'number.min': 'Зарплата не может быть отрицательной'
    }),
  hoursPerWeek: Joi.number().min(1).max(40)
    .messages({
      'number.base': 'Часы в неделю должны быть числом',
      'number.min': 'Часы в неделю должны быть не менее 1',
      'number.max': 'Часы в неделю не могут превышать 40'
    }),
  deadline: Joi.date().greater('now')
    .messages({
      'date.base': 'Дедлайн должен быть действительной датой',
      'date.greater': 'Дедлайн должен быть датой в будущем'
    }),
  isActive: Joi.boolean().default(true)
    .messages({
      'boolean.base': 'Статус должен быть логическим значением'
    }),
  jobType: Joi.string().valid('part-time', 'full-time', 'internship').required()
    .messages({
      'string.base': 'Тип работы должен быть текстовой строкой',
      'any.only': 'Тип работы должен быть одним из: part-time, full-time или internship',
      'any.required': 'Тип работы обязателен'
    }),
  location: Joi.string().required()
    .messages({
      'string.base': 'Местоположение должно быть текстовой строкой',
      'string.empty': 'Местоположение обязательно',
      'any.required': 'Местоположение обязательно'
    }),
  contactEmail: Joi.string().email()
    .messages({
      'string.base': 'Контактный email должен быть текстовой строкой',
      'string.email': 'Контактный email должен быть действительным адресом электронной почты'
    })
});

// Схема валидации заявки
const applicationSchema = Joi.object({
  jobId: Joi.string().required()
    .messages({
      'string.base': 'ID вакансии должен быть текстовой строкой',
      'string.empty': 'ID вакансии обязателен',
      'any.required': 'ID вакансии обязателен'
    }),
  studentName: Joi.string().min(2).max(100).required()
    .messages({
      'string.base': 'Имя должно быть текстовой строкой',
      'string.empty': 'Имя обязательно',
      'string.min': 'Имя должно содержать минимум 2 символа',
      'string.max': 'Имя не может превышать 100 символов',
      'any.required': 'Имя обязательно'
    }),
  studentEmail: Joi.string().email().required()
    .messages({
      'string.base': 'Email должен быть текстовой строкой',
      'string.email': 'Email должен быть действительным адресом электронной почты',
      'string.empty': 'Email обязателен',
      'any.required': 'Email обязателен'
    }),
  phoneNumber: Joi.string().pattern(/^[0-9+()-\s]{10,20}$/)
    .messages({
      'string.base': 'Номер телефона должен быть текстовой строкой',
      'string.pattern.base': 'Номер телефона должен быть в правильном формате (10-20 цифр, может включать +, -, (), и пробелы)'
    }),
  coverLetter: Joi.string().min(50).max(1000)
    .messages({
      'string.base': 'Сопроводительное письмо должно быть текстовой строкой',
      'string.min': 'Сопроводительное письмо должно содержать минимум 50 символов',
      'string.max': 'Сопроводительное письмо не может превышать 1000 символов'
    }),
  resumeUrl: Joi.string().uri()
    .messages({
      'string.base': 'URL резюме должен быть текстовой строкой',
      'string.uri': 'URL резюме должен быть действительным URL'
    }),
  availability: Joi.string()
    .messages({
      'string.base': 'Доступность должна быть текстовой строкой'
    }),
  status: Joi.string().valid('pending', 'reviewed', 'contacted', 'rejected', 'accepted').default('pending')
    .messages({
      'string.base': 'Статус должен быть текстовой строкой',
      'any.only': 'Статус должен быть одним из: pending, reviewed, contacted, rejected или accepted'
    })
});

module.exports = {
  validateRequest,
  jobSchema,
  applicationSchema
}; 