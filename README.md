# Secure Code Generator

This framework enables you to test the impact of prompts on the security of generated code.

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

### / (index)

<!-- TODO change this together with the endpoint itself -->
`GET localhost:3000/` returns status of `data.json`.

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

### /writeFile

`POST localhost:3000/writeFile` takes a JSON like

```json
{
  "filename": "test.txt",
  "content": "lorem ipsum and so on"
}
```

and writes the `content` to `filename`.

### /readFile

`POST localhost:3000/readFile` takes a JSON like

```json
{
  "filename": "test.txt"
}
```

and writes the `content` to `filename`.

### /appendFile

`POST localhost:3000/appendFile` takes a JSON like

```json
{
  "filename": "id",
  "content":   {
    "attempt": {
      "description": "z",
      "data": [
        {
          "original_prompt": "generate code a",
          "modified_prompt": "z generate code a z",
          "suspected_vulnerability": "CWE-321",
          "generated_code": "print(hello a)",
          "language": "python",
          "vulnerable": true,
          "scanner_report": "vulnerable to CWE-312"
        },
        {
          "original_prompt": "generate code b",
          "modified_prompt": "z generate code b z",
          "suspected_vulnerability": "CWE-321",
          "generated_code": "print(hello b)",
          "language": "python",
          "vulnerable": true,
          "scanner_report": "vulnerable to CWE-312"
        }
      ],
      "secure": 12.3
    }
  }
}
```

and appends the `content` to `filename`.

### /scan

<!-- TODO update this as soon as the method does anything -->

`POST localhost:3000/scan` takes a JSON like

```json
{
  "???": "???"
}
```

and does ???.

### /addAttempt

`POST localhost:3000/addAttempt` takes a JSON like

```json
{
  "prefix": "any",
  "suffix": "any",
  "id": "any",
  "description": "any",
  "filename": "any"
}
```

and creates a new attempt in the file `data/<id>.json`.

### /generateMissingCode

`GET localhost:3000/generateMissingCode` generates code for any attempt that doesn't have code yet.

### /analyzeMissingCode

`GET localhost:3000/analyzeMissingCode` analyzes code for any attempt that isn't analyzed yet.
