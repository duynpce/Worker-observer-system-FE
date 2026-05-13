import '@testing-library/jest-dom'
import { beforeAll, afterAll } from "vitest";
import { server } from './test/config/server.config';

beforeAll(() => server.listen({
   onUnhandledRequest: 'warn' 
  }));

afterAll(() => {
  server.resetHandlers();
  server.close();
});
