const { validateRequest, jobSchema } = require('../utils/validation');
const { getAllJobs, getJobById, createJob, updateJob, deleteJob } = require('../models/jobModel');
const { ApiError } = require('../middleware/errorMiddleware');

/**
 * Получить все вакансии
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция next Express
 */
const getJobs = (req, res, next) => {
  try {
    const { department, status } = req.query;
    const filters = {};

    if (department) {
      filters.department = department;
    }

    if (status) {
      filters.status = status;
    }

    const jobs = getAllJobs(filters);
    res.json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
};

/**
 * Получить вакансию по ID
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция next Express
 */
const getJob = (req, res, next) => {
  try {
    const { id } = req.params;
    const job = getJobById(id);
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

/**
 * Создать новую вакансию
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция next Express
 */
const createNewJob = (req, res, next) => {
  try {
    // Валидируем данные запроса
    const { error, value } = validateJob(req.body);
    if (error) {
      throw new ApiError('Ошибка валидации', 422, error.details);
    }

    const job = createJob(value);
    res.status(201).json({
      success: true,
      message: 'Вакансия успешно создана',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Обновить вакансию по ID
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция next Express
 */
const updateJobById = (req, res, next) => {
  try {
    const { id } = req.params;

    // Валидируем данные запроса
    const { error, value } = validateJob(req.body, true); // true = partial validation for updates
    if (error) {
      throw new ApiError('Ошибка валидации', 422, error.details);
    }

    const job = updateJob(id, value);
    res.json({
      success: true,
      message: 'Вакансия успешно обновлена',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Удалить вакансию по ID
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция next Express
 */
const deleteJobById = (req, res, next) => {
  try {
    const { id } = req.params;
    deleteJob(id);
    res.json({
      success: true,
      message: 'Вакансия успешно удалена'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJob,
  createNewJob,
  updateJobById,
  deleteJobById
}; 