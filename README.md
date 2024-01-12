# GraphQL Demeter 🌾

**Alpha mode warning** This is in alpha mode, but releasing soon!

[![npm](https://img.shields.io/npm/v/graphql-demeter.svg)](https://www.npmjs.com/package/graphql-demeter)

GraphQL Demeter is a TypeScript package and server that allows you to mock GraphQL Server responses. It provides various features such as auto-mock, AI-based mocks using OpenAI, and manual mock configuration.

## Getting Started

To get started with GraphQL Demeter, follow the installation instructions below.

## Installation

Install the package via npm:

```
npm install graphql-demeter
```

## Running
Just run the CLI on your schema.

```
demeter schema.graphql
```

Mock server should be running on port 4000

## Configuration
Demeter will automatically create config file on the first start `.graphql.demeter.js`.
As you can see if you provide type it will autocomplete faker values

```js
/** @type {import('graphql-demeter-core').FakerConfig} */
const config = {
  objects: {
    Card:{
      description:{
        values:["Very powerful card", "Most fire resistant character", "Good melee fighter"]
      },
      name:{
        values:["Zeus", "Athena", "Hera", "Ares", "Kronos"]
      },
      image:{
        fake:"internet.avatar"
      }
    }
  },
  scalars: {},
};
module.exports = config
```

## Development & Examples

1. Clone this repository
2. Install dependencies
3. Run npm run run-example

You should have your server running on port 4000 with sample schema. Feel free to modify schema locally to just test it with your schema.

## Roadmap
[ ] - reload on config change
[ ] - add ai possibilities with OpenAI Key