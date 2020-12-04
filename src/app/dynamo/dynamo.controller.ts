import { Controller, Get } from "@nestjs/common";
import { DynamoService } from "~/app/dynamo/dynamo.service";

@Controller('dynamo')
export class DynamoController {
  constructor(private readonly dynamoService: DynamoService) {
  }

  @Get()
  async farty() {
    return await this.dynamoService.createSession({ username: "jasonraimondi" })
  }
}
