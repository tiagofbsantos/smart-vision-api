export default class ApiError extends Error {
  code = 400;
  message = "";

  constructor(message: string, code?: number) {
    super(message);

    this.message = message;
    if (typeof code === "number") this.code = code;
  }
}
