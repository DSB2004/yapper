import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { HealthCheckResponse } from '@yapper/types';

@Controller()
export class ServicesController {
  @GrpcMethod('User')
  async healthCheck(): Promise<HealthCheckResponse> {
    return {
      status: 200,
      success: true,
      message: 'User Service working fine',
    };
  }
}
