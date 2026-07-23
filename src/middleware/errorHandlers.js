function notFoundHandler(req, res) {
  return res.status(404).json({ message: 'Not Found' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({ message: 'Internal Server Error' });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};

