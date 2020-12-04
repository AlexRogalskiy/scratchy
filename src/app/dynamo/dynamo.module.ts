import { Module } from '@nestjs/common';

import { DynamoService } from "~/app/dynamo/dynamo.service";
import { DynamoController } from './dynamo.controller';

@Module({
  providers: [DynamoService],
  controllers: [DynamoController],
})
export class DynamoModule {}
