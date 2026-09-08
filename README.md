# Pact minimal demo

This is a deliberately small example of **consumer-driven contract testing** with [Pact](https://docs.pact.io/).

The example has two sides:

- `UserWebApp` is the **consumer**. It uses `UserClient` to request a user.
- `UserApi` is the **provider**. The sample provider exposes the endpoint and forwards it to the public [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API.

The consumer test does not call the real API. Pact starts a local mock server, the test makes the request it expects to make, and Pact records the request and the response as `pacts/UserWebApp-UserApi.json`. That file is the contract.

The provider test starts the sample API locally and replays every request in the pact against it. Verification fails if the provider does not return the response shape and status promised by the consumer. In a real project, the provider verification normally runs against the deployed provider and the pact is exchanged through a Pact Broker.

## Prerequisites

- Node.js 18 or newer (the sample uses the built-in `fetch`)
- Internet access for provider verification, because the sample provider forwards to JSONPlaceholder

## Run it

```powershell
npm install
npm test
```

`npm test` runs the two stages in order:

1. `npm run test:consumer` creates or updates the pact file using a mock provider.
2. `npm run test:provider` starts the provider and verifies that it satisfies that pact.

You can run either stage on its own:

```powershell
npm run test:consumer
npm run test:provider
```

## Why this is useful

An ordinary consumer unit test can prove that the client handles a response, but it cannot prove that the independently deployed provider will return that response. Pact makes the consumer's expectation explicit and executable. The provider gets an automated compatibility check before deployment, without needing an end-to-end environment containing both applications.

The consumer owns the expectation: it defines only the fields it uses (`id` and `name` are checked by the test; the other fields demonstrate Pact matchers). The provider remains free to add extra response fields, but it must continue satisfying the agreed contract.

## What to look at

- `src/client.js` - the consumer-side HTTP client.
- `src/provider.js` - a tiny provider backed by a public endpoint.
- `test/consumer.pact.test.js` - interaction definition and consumer test.
- `test/provider.pact.test.js` - provider verification.
- `pacts/UserWebApp-UserApi.json` - generated contract; do not hand-edit it.

## Important Pact ideas

### Interactions

An interaction describes a provider state, request, and expected response. The `given('user 1 exists')` text is a provider state. For this demo it is descriptive; production providers implement state setup so verification can create the required data.

### Matchers

`MatchersV3.integer`, `string`, and `email` say what the consumer relies on without coupling the contract to one exact generated value. Use matchers for values such as IDs, timestamps, and tokens when their exact value is not part of the API guarantee.

### Broker and deployment safety

This repository keeps the pact file locally so the example has no external service dependency. Teams usually publish pacts to a Pact Broker and use `can-i-deploy` in CI/CD. The broker lets consumer and provider versions discover whether they are compatible before release.

### Provider states and test data

The provider must be able to arrange the data described by each `given` state. Avoid relying on whatever happens to be in a shared environment; provider-state setup makes verification repeatable.
