import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { Queue } from "bullmq";
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { createBullBoard } from "@bull-board/api";
import { FastifyAdapter as BullFastifyAdapter } from "@bull-board/fastify";

import { ENV, QUEUE } from "~/config";

export async function registerBullBoard(fastify: NestFastifyApplication) {
  const serverAdapter = new BullFastifyAdapter();
  const queues = Object.keys(QUEUE).map(name => new BullMQAdapter(new Queue(name, { connection: ENV.redisQueue })));
  createBullBoard({ queues, serverAdapter });
  serverAdapter.setBasePath("/admin/queue");
  await fastify.register(serverAdapter.registerPlugin() as any, { prefix: "/admin/queue" });
}