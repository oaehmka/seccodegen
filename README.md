# Secure Code Generator

This framwork enables you to test the impact of prompts on the security of generated code.

## Prerequisites

create a file called `.env` with the following content:

```text
OPENAI_API_KEY="<your-openai-api-key>"
```

install dependencies: `npm install`  

## Running the code

starting the server: `npm run start`  
for developing: `npm run dev`

## Swagger

Swagger is reachable under <http://localhost:3000/doc/>

## Endpoints

### /generate

`POST localhost:3000/generate` takes a JSON like

```json
{
  "prompt" : "my prompt"
}
```

and returns LLM generated code from the prompt.

### /enrich

`POST localhost:3000/enrich` takes a JSON like

```json
{
  "prefix": "my prefix",
  "suffix": "my suffix"
}
```

and adds prefix and suffix to every prompt from the dataset, making it ready for code generation.

### /generateDataset

`POST localhost:3000/generateDataset` takes a JSON like

```json
{
  "prefix": "my prefix",
  "suffix": "my suffix"
}
```

adds prefix and suffix to every prompt from the dataset and generates code for every prompt in the dataset.
