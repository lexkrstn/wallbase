/**
 * @file knexfile.ts
 *
 * Workaround for Knex to execute migrations and seeds in TypeScript from CLI.
 *
 * Note, Knex CLI expects for the module to be CommonJS, which is not the case
 * for TypeScript. This file works as an adapter over the regular knexfile
 * module.
 */

import knexfile from './knexfile.module';

module.exports = knexfile;
