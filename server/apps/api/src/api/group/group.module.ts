import { Module } from '@nestjs/common';
import { Group } from './group';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { CommonModule } from 'src/utils/common/common.module';

@Module({
  imports: [CommonModule],
  providers: [Group, GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
