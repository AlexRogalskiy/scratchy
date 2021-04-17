import { TestingModule } from "@nestjs/testing";

import { EmailConfirmationService } from "~/app/user/email_confirmation/email_confirmation.service";
import { Permission } from "~/entities/permission.entity";
import { Role } from "~/entities/role.entity";
import { EmailConfirmationToken } from "~/entities/email_confirmation.entity";
import { ForgotPasswordToken } from "~/entities/forgot_password.entity";
import { User } from "~/entities/user.entity";
import { EmailConfirmationRepository } from "~/lib/database/repositories/email_confirmation.repository";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { generateUser } from "~test/generators/generateUser";

describe(EmailConfirmationService.name, () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let moduleRef: TestingModule;
  let resolver: EmailConfirmationService;
  let userRepository: UserRepository;
  let emailConfirmationRepository: EmailConfirmationRepository;

  beforeAll(async () => {
    moduleRef = await createTestingModule(
      {
        imports: [AccountModule],
      },
      entities,
    );
    userRepository = moduleRef.get(UserRepository);
    emailConfirmationRepository = moduleRef.get(EmailConfirmationRepository);
    resolver = moduleRef.get(EmailConfirmationService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  // describe("verify user emails confirmation", () => {
  //   test("resolve user by id", async () => {
  //     // arrange
  //     const user = await userGenerator();
  //     await userRepository.create(user);
  //     const emailConfirmation = new EmailConfirmationToken(user);
  //     await emailConfirmationRepository.save(emailConfirmation);
  //
  //     // act
  //     await resolver.verifyEmailConfirmation(user.email, emailConfirmation.id);
  //     const result = emailConfirmationRepository.findByEmail(user.email);
  //
  //     // assert
  //     await expect(result).rejects.toThrowError('Could not find any entity of type "EmailConfirmationToken"');
  //   });
  // });
});