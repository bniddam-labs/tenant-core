import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'entities/index': 'src/entities/index.ts',
    'services/index': 'src/services/index.ts',
    'decorators/index': 'src/decorators/index.ts',
    'guards/index': 'src/guards/index.ts',
    'types/index': 'src/types/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  skipNodeModulesBundle: true,
  external: [
    '@nestjs/common',
    '@nestjs/core',
    '@nestjs/typeorm',
    '@bniddam-labs/core',
    '@bniddam-labs/utils',
    '@bniddam-labs/tenant-core-shared',
    'typeorm',
    'class-transformer',
    'reflect-metadata',
  ],
});
