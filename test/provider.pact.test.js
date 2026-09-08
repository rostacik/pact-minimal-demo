import { Verifier } from '@pact-foundation/pact';
import { startProvider } from '../src/provider.js';

const provider = await startProvider();

try {
  const verifier = new Verifier({
    provider: 'UserApi',
    providerBaseUrl: provider.baseUrl,
    pactFilesOrDirs: ['pacts'],
    logLevel: 'warn'
  });

  await verifier.verifyProvider();
} finally {
  await provider.close();
}
