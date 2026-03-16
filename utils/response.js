export const sendResponse = (res, statusCode, data, message) => {
  const responseBody = {
    status: "success",
    message,
    // If data is an array, automatically include a 'results' count
    ...(Array.isArray(data) && { results: data.length }),
    data,
  };

  return res.status(statusCode).json(responseBody);
};

export const placeholder = (req, res) => {
  const { user, params, body } = req;
  return sendResponse(res, 200, { user, params, body });
};
