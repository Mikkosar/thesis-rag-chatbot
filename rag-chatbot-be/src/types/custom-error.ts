// Mukautettu virhe-luokka, joka sisältää HTTP-statuksen ja mahdolliset lisätiedot
export default class CustomError extends Error {
  status: number;
  errors?: any;

  constructor(status: number, message: string, errors?: any) {
    super(message);
    this.status = status;
    this.errors = errors;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
