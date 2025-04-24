const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../models/userModel');
const { validateUser } = require('../utils/validation');
const { ApiError } = require('../middleware/errorMiddleware');
const { hashPassword } = require('../utils/auth');

/**
 * Получить всех пользователей
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция next Express
 */
const getUsers = (req, res, next) => {
  try {
    const { role } = req.query;
    const filters = {};
    
    if (role) {
      filters.role = role;
    }
    
    const users = getAllUsers(filters);
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

/**
 * Получить пользователя по ID
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция next Express
 */
const getUser = (req, res, next) => {
  try {
    const { id } = req.params;
    const user = getUserById(id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * Создать нового пользователя
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция next Express
 */
const createNewUser = (req, res, next) => {
  try {
    // Валидируем данные запроса
    const { error, value } = validateUser(req.body);
    if (error) {
      throw new ApiError('Ошибка валидации', 422, error.details);
    }
    
    // Хэшируем пароль
    if (value.password) {
      value.password = hashPassword(value.password);
    }
    
    const user = createUser(value);
    res.status(201).json({ 
      success: true, 
      message: 'Пользователь успешно создан',
      data: user 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Обновить пользователя
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция next Express
 */
const updateUserById = (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Валидируем данные запроса
    const { error, value } = validateUser(req.body, true); // true = partial validation for updates
    if (error) {
      throw new ApiError('Ошибка валидации', 422, error.details);
    }
    
    // Хэшируем пароль если он был предоставлен
    if (value.password) {
      value.password = hashPassword(value.password);
    }
    
    const user = updateUser(id, value);
    res.json({ 
      success: true, 
      message: 'Пользователь успешно обновлен',
      data: user 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Удалить пользователя
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция next Express
 */
const deleteUserById = (req, res, next) => {
  try {
    const { id } = req.params;
    deleteUser(id);
    res.json({ 
      success: true, 
      message: 'Пользователь успешно удален'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  createNewUser,
  updateUserById,
  deleteUserById
}; 