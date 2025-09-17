import express from "express";
import routes from "./router/index";
import cors from "cors";
import errorHandler from "./middleware/error-handler";

const createApp = () => {
  const app = express();

  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  app.use(cors());
  app.use(express.json());

  app.use("/api", routes);
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  app.use(errorHandler);

  return app;
};

export default createApp;
