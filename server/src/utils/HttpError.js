// An error carrying an HTTP status code. The error handler in app.js turns it
// into a JSON response.
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = HttpError;
