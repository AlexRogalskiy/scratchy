import { INestApplication } from "@nestjs/common";
import { UI as bullUI } from "bull-board";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

export const attachMiddlewares = (app: INestApplication) => {
  app.use(cookieParser());

  if (process.env.NODE_ENV === "production") {
    app.use(helmet());
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
      }),
    );
  }

  if (process.env.NODE_ENV != "test") {
    app.use("/admin/queues", bullUI);
  }
};
