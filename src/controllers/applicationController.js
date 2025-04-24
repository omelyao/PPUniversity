const {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication
} = require('../models/applicationModel');
const { validateApplication } = require('../utils/validation');
const { ApiError } = require('../middleware/errorMiddleware');

/**
 * Получить все заявки
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция next Express
 */
const getApplications = (req, res, next) => {
  try {
    const { jobId, status } = req.query;
    const filters = {};
    
    if (jobId) {
      filters.jobId = jobId;
    }
    
    if (status) {
      filters.status = status;
    }
    
    const applications = getAllApplications(filters);
    res.json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
};

/**
 * Получить заявку по ID
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция next Express
 */
const getApplication = (req, res, next) => {
  try {
    const { id } = req.params;
    const application = getApplicationById(id);
    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

/**
 * Создать новую заявку
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция next Express
 */
const createNewApplication = (req, res, next) => {
  try {
    // Валидируем данные запроса
    const { error, value } = validateApplication(req.body);
    if (error) {
      throw new ApiError('Ошибка валидации', 422, error.details);
    }
    
    const application = createApplication(value);
    res.status(201).json({ 
      success: true, 
      message: 'Заявка успешно создана',
      data: application 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Обновить заявку по ID
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция next Express
 */
const updateApplicationById = (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Валидируем данные запроса
    const { error, value } = validateApplication(req.body, true); // true = partial validation for updates
    if (error) {
      throw new ApiError('Ошибка валидации', 422, error.details);
    }
    
    const application = updateApplication(id, value);
    res.json({ 
      success: true, 
      message: 'Заявка успешно обновлена',
      data: application 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Удалить заявку по ID
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция next Express
 */
const deleteApplicationById = (req, res, next) => {
  try {
    const { id } = req.params;
    deleteApplication(id);
    res.json({ 
      success: true, 
      message: 'Заявка успешно удалена'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApplications,
  getApplication,
  createNewApplication,
  updateApplicationById,
  deleteApplicationById
}; 