import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  Response,
  SuccessResponse,
  Example,
} from "tsoa";
import { User, UUID } from "./user";
import { UserService, UserCreationParams } from "./userService";
import { provideSingleton } from "../util/provideSingleton";

interface ValidateErrorJSON {
  message: "Validation failed";
  details: { [name: string]: unknown };
}

interface Bug {
  facebook: {};
  twitter: {};
  google: {};
}

@Route("users")
@provideSingleton(UsersController)
export class UsersController extends Controller {
  @Get("/test")
  @Response<Bug>("ok")
  public test(): Bug {
    return {
      facebook: {},
      google: {},
      twitter: {},
    };
  }

  @Get("/test2")
  public test2(): { fooBar: number } {
    return {
      fooBar: 3,
    };
  }

  @Get("/hi")
  public async getHi() {
    return;
  }
  /**
   * Retrieves the details of an existing user.
   * Supply the unique user ID from either and receive corresponding user details.
   * @param userId The user's identifier
   * @param name Provide a username to display
   *
   * @example userId "52907745-7672-470e-a803-a2f8feb52944"
   *
   */
  @Example<User>({
    id: "52907745-7672-470e-a803-a2f8feb52944",
    name: "tsoa user",
    email: "hello@tsoa.com",
    phoneNumbers: [],
    status: "Happy",
  })
  @Get("{userId}")
  public async getUser(
    @Path() userId: UUID,
    @Query() name: string
  ): Promise<User> {
    return new UserService().get(userId, name);
  }

  /**
   * Add a new user. Remember that the demo API will not persist this data.
   *
   */
  @Post()
  @SuccessResponse("201", "Created") // Custom success response
  @Response<ValidateErrorJSON>(422, "Validation Failed", {
    message: "Validation failed",
    details: {
      requestBody: {
        message: "id is an excess property and therefore not allowed",
        value: "52907745-7672-470e-a803-a2f8feb52944",
      },
    },
  })
  public async createUser(
    @Body() requestBody: UserCreationParams
  ): Promise<void> {
    this.setStatus(201); // set return status 201
    new UserService().create(requestBody);
    return;
  }
}
