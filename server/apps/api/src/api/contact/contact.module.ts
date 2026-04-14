import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { Contact } from './contact';
import { CommonModule } from 'src/utils/common/common.module';

@Module({
  imports: [CommonModule],
  providers: [ContactService, Contact],
  controllers: [ContactController],
})
export class ContactModule {}
