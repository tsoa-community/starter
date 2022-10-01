import { provide } from "inversify-binding-decorators";
import { Controller, Post, Route, SuccessResponse, Tags } from "tsoa";
import { BAD_REQUEST } from "./http-codes";

@Route("sms")
@Tags("SMS")
@provide(SmsController)
export class SmsController extends Controller {
  @SuccessResponse(BAD_REQUEST, "HTTP 204 No Content")
  @Post()
  public async send(): Promise<void> {
    this.setStatus(BAD_REQUEST);
    return;
  }
}
