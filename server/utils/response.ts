export const sendSuccess = <T>(data: T, message = 'Success') => ({
  success: true,
  message,
  data
});

export const sendError = (message: string, statusCode = 500) => ({
  success: false,
  message,
  statusCode
});
