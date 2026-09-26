export class ApiResponse<T>{
  message: string;
  data: T;
  status: boolean;

  constructor(message: string, data: T, status: boolean){
    this.message = message,
    this.data = data,
    this.status = status
  }
}