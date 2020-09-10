import { Module } from "@nestjs/common";

import { MeResolver } from "~/app/user/resolvers/me.resolver";
import { UserResolver } from "~/app/user/resolvers/user.resolver";
import { EmailModule } from "~/lib/emails/email.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { RepositoryModule } from "~/lib/repositories/repository.module";

@Module({
  imports: [EmailModule, LoggerModule, RepositoryModule],
  providers: [MeResolver, UserResolver],
})
export class UserModule {}
