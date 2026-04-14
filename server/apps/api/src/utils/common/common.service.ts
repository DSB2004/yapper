import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  handleResponse(result: any) {
    const { status, ...rest } = result;
    const responseBody = { ...rest };
    if (status >= 400) {
      throw new HttpException(responseBody, status);
    }
    return responseBody;
  }
}
