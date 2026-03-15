import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { HealthCheckResponse } from '@yapper/types';

@Controller()
export class ServicesController {
  @GrpcMethod('Chatroom')
  async healthCheck(): Promise<HealthCheckResponse> {
    return {
      status: 200,
      success: true,
      message: 'Chatroom Service working fine',
    };
  }
}
