import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';
import { GroupModule } from './group/group.module';
import { ServicesController } from './services.controller';

@Module({
  imports: [UserModule, ContactModule, GroupModule],
  controllers: [ServicesController]
})
export class ServicesModule {}
