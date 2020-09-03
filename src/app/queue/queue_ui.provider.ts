import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { setQueues } from "bull-board";

import { QUEUE } from "~/lib/config/keys";

@Injectable()
export class QueueUIProvider {
  constructor(@InjectQueue(QUEUE.email) private readonly emailQueue: Queue) {
    setQueues([emailQueue]);
  }
}
