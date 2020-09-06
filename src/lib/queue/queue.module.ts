import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { QueueUIProvider } from "~/lib/queue/queue_ui.provider";
import { ENV } from "~/lib/config/environment";
import { QUEUE } from "~/lib/config/keys";

const queues = [
  BullModule.registerQueue({
    name: QUEUE.email,
    redis: ENV.queueURL,
  }),
];

@Module({
  providers: [QueueUIProvider],
  imports: [...queues],
  exports: [...queues],
})
export class QueueModule {}