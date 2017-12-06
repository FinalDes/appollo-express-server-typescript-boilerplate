import bodyParser = require("body-parser");
import cors = require("cors");
import dotenv = require("dotenv");
import express = require("express");
import { graphiqlExpress, graphqlExpress } from "graphql-server-express";
import helmet = require("helmet");

import {welcomeQuery} from "./graphiQL_welcome_query";
import {schema} from "./schema";

dotenv.config();

const app: express.Application = express();

const helperMiddleware: express.RequestHandler[] = [
  cors({
    methods: ["POST"],
  }),
  bodyParser.json(),
  bodyParser.text({ type: "application/graphql" }),
  (req: express.Request, res: express.Response, next: any) => {
      if (req.is("application/graphql")) {
          req.body = { query: req.body };
      }
      next();
  },
];
app.disable("x-powered-by");
app.use("/graphql", ...helperMiddleware, graphqlExpress({ schema }));
console.log(process.env.PRODUCTION);
if (!process.env.PRODUCTION) {
  app.use("/graphiql", graphiqlExpress({
    endpointURL: "/graphql",
    query: welcomeQuery,
  }));
}

export default app;
