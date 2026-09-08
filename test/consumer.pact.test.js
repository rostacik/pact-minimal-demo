import { PactV4, MatchersV3 } from '@pact-foundation/pact';
import { UserClient } from '../src/client.js';

const pact = new PactV4({
  consumer: 'UserWebApp',
  provider: 'UserApi',
  dir: 'pacts',
  logLevel: 'warn'
});

await pact
  .addInteraction()
  .given('user 1 exists')
  .uponReceiving('a request for user 1')
  .withRequest('GET', '/users/1')
  .willRespondWith(200, (response) => {
    response.jsonBody({
      id: MatchersV3.integer(1),
      name: MatchersV3.string('Leanne Graham'),
      username: MatchersV3.string('Bret'),
      email: MatchersV3.string('Sincere@april.biz')
    });
  })
  .executeTest(async (mockServer) => {
    const client = new UserClient(mockServer.url);
    const user = await client.getUser(1);

    if (user.id !== 1 || user.name !== 'Leanne Graham') {
      throw new Error(`Unexpected user returned: ${JSON.stringify(user)}`);
    }
  });
