/**
 * Миддлвэр для обработки ошибок с детальными ответами
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorDetails = {
    message: err.message || 'Внутренняя ошибка сервера',
    status: statusCode,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  // Добавляем ошибки валидации, если они есть
  if (err.validationErrors) {
    errorDetails.validationErrors = err.validationErrors;
    errorDetails.help = 'Пожалуйста, проверьте предоставленные данные и попробуйте снова';
  }

  // Добавляем рекомендацию в зависимости от типа ошибки
  switch (statusCode) {
    case 400:
      errorDetails.suggestion = 'Пожалуйста, проверьте параметры запроса и попробуйте снова';
      break;
    case 401:
      errorDetails.suggestion = 'Требуется аутентификация. Пожалуйста, войдите в систему или предоставьте правильные учетные данные';
      break;
    case 403:
      errorDetails.suggestion = 'У вас нет разрешения на доступ к этому ресурсу';
      break;
    case 404:
      errorDetails.suggestion = 'Запрашиваемый ресурс не найден';
      break;
    case 409:
      errorDetails.suggestion = 'Этот запрос конфликтует с существующими данными';
      break;
    case 422:
      errorDetails.suggestion = 'Данные запроса недействительны. Пожалуйста, проверьте предоставленную информацию';
      break;
    default:
      errorDetails.suggestion = 'Пожалуйста, попробуйте позже или обратитесь в службу поддержки, если проблема не исчезнет';
  }

  // Добавляем трассировку стека только для разработки
  if (process.env.NODE_ENV !== 'production') {
    errorDetails.stack = err.stack;
  }

  console.error(`[Ошибка] ${statusCode} - ${err.message}`);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({ error: errorDetails });
};

/**
 * Утилита для создания пользовательских API-ошибок с кодами статуса
 */
class ApiError extends Error {
  constructor(message, statusCode, validationErrors = null) {
    super(message);
    this.statusCode = statusCode;
    this.validationErrors = validationErrors;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorHandler, ApiError }; 