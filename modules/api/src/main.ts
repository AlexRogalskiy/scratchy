process.env.TZ = "UTC";

// import "reflect-metadata";
// import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { registerEnums } from "@modules/prisma/models";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { BullMqServer } from "bull-mq-transport";

import { AppModule } from "~/app/app.module";
import { ENV } from "~/config/environment";
import { attachMiddlewares } from "~/lib/middleware/attach_middlewares";
import { validateEnv } from "~/lib/utils/validate_env";

async function connectBullMQ(app: NestFastifyApplication) {
  const strategy = app.get(BullMqServer);
  app.connectMicroservice({ strategy }, { inheritAppConfig: true });
  await app.startAllMicroservices();
}

void (async () => {
  await validateEnv();

  if (ENV.isDebug) console.log(ENV);

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  await registerEnums();
  await attachMiddlewares(app);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableShutdownHooks();

  await connectBullMQ(app);
  await app.listen(ENV.port, "0.0.0.0");
  console.log(`Listening on ${await app.getUrl()}`);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
