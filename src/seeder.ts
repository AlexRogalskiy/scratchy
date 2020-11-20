import "dotenv/config";
import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "~/app/app.module";
import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { User } from "~/app/user/entities/user.entity";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { ProductRepo } from "~/app/store/payments/repositories/product.repository";
import { Product, ProductType } from "~/app/store/payments/entities/product.entity";

const exampleUserId = "dcaecd32-00e7-4505-bf90-db917fff7c89";
const exampleClientId = "39ce3891-7e0f-4f87-9bc0-db7cc2902266";
const exampleClientRedirectUri = "http://localhost:8080/oauth/callback";
const exampleScope1Name = "contacts.read";
const exampleScope2Name = "contacts.write";
const examplePaymentId = "3d5f4d7c-5815-4798-ab44-4bce19ae93ec";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepository = app.get(UserRepo);
  const clientRepository = app.get(ClientRepo);
  const scopeRepository = app.get(ScopeRepo);
  const productRepository = app.get(ProductRepo);

  let user: User;
  try {
    user = await userRepository.findById(exampleUserId);
  } catch (e) {
    user = await User.create({
      id: "dcaecd32-00e7-4505-bf90-db917fff7c89",
      email: "jason@raimondi.us",
      password: "jasonraimondi",
      firstName: "Jason",
      lastName: "Raimondi",
      createdIP: "127.0.0.1",
    });
    user.isEmailConfirmed = true;
    user = await userRepository.create(user);
  }

  let client: Client;
  let scope1: Scope;
  let scope2: Scope;

  try {
    scope1 = await scopeRepository.findById(1);
  } catch (e) {
    scope1 = await scopeRepository.create(
      new Scope({
        id: 1,
        name: exampleScope1Name,
        description: "Can read your contacts",
      }),
    );
  }

  try {
    scope2 = await scopeRepository.findById(2);
  } catch (e) {
    scope2 = await scopeRepository.create(
      new Scope({
        id: 2,
        name: exampleScope2Name,
        description: "Can make changes to your contacts",
      }),
    );
  }

  try {
    client = await clientRepository.findById(exampleClientId);
  } catch (e) {
    client = new Client({
      id: exampleClientId,
      name: "Scratchy Next.js",
      redirectUris: [exampleClientRedirectUri],
      allowedGrants: ["authorization_code", "refresh_token"],
    });
    client.scopes = [];
    client.scopes.push(scope1, scope2);
    client = await clientRepository.create(client);
  }

  let product: Product;

  try {
    product = await productRepository.findById(examplePaymentId);
  } catch (e) {
    product = new Product({
      id: examplePaymentId,
      type: ProductType.TUMBLER,
      unitPrice: 2499,
    });
    product = await productRepository.create(product);
  }

  console.log({ client, scope1, scope2, user, product });
}

bootstrap();