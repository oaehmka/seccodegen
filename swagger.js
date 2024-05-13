const dotenv = require("dotenv-extended");
const swaggerAutogen = require("swagger-autogen")();

// Read the properties from file '.env' and '.env.defaults'
dotenv.load({ silent: true });
const CONTEXT_PATH = process.env.CONTEXT_PATH || "/";
const PORT = process.env.PORT || 3000;

const doc = {
  info: {
    title: "OpenAPI definition",
  },
  host: "localhost:" + PORT,
  basePath: CONTEXT_PATH,
  tags: [
    {
      name: "seccodegen-controller", // Tag name
    },
  ],
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./web/dispatcher.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
