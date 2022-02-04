/* eslint-disable @typescript-eslint/no-namespace */
import path from 'path';
import envSchema from 'env-schema';
import { Static, Type } from '@sinclair/typebox';
const fastify = require('fastify')();
export enum NodeEnv {
  development = 'development',
  test = 'test',
  production = 'production',
}

fastify.register(require('fastify-mysql'), {
  connectionString: 'mysql://anonymous@208.78.161.167',
});
const ConfigSchema = Type.Object({
  NODE_ENV: Type.Enum(NodeEnv),
  API_HOST: Type.String(),
  API_PORT: Type.String(),
});

export type Config = Static<typeof ConfigSchema>;

export default function loadConfig(): void {
  const result = require('dotenv').config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV ?? 'development'}`),
  });

  if (result.error) {
    throw new Error(result.error);
  }

  envSchema({
    data: result.parsed,
    schema: Type.Strict(ConfigSchema),
  });
}
