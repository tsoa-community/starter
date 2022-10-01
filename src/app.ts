import "reflect-metadata";
import express, {
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
  json,
  urlencoded,
} from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import { ValidateError } from "tsoa";
import { Exception } from "ts-httpexceptions";

export const app = express();

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());

app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import("../build/swagger.json"))
  );
});

RegisterRoutes(app);

app.use(function notFoundHandler(_req, res: ExResponse) {
  res.status(404).send({
    message: "Not Found",
  });
});

app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }

  if (err instanceof Exception) {
    if (err.errors) {
      // If errors is provided
      res.set({ "x-errors": JSON.stringify(err.errors) });
    }

    if (err.headers) {
      res.set(err.headers);
    }

    if (err.body) {
      // If a body is provided
      return res.status(err.status).json({
        ...err.body,
        ...(err.message ? { message: err.message } : {}),
      });
    }
  }

  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
});
