// import { Plugin } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';

type AliasesMap = {
  [key: string]: string;
};

type Options = {
  prefix?: string;
  root?: string;
};

const defaultOptions: Options = {
  prefix: '@',
  root: 'src'
};

export default function createPlugin(options = defaultOptions) {
  const { prefix, root } = options;

  return {
    name: 'vite-plugin-aliases',
    async config() {
      const aliasesMap = await composeAliasesMap(root!);
      const aliases = decorativePrefix(prefix!, aliasesMap);
      return {
        resolve: { alias: aliases }
      };
    }
  };
}

async function composeAliasesMap(root: string) {
  root = path.resolve(process.cwd(), root);
  const fileArr = await fs.readdir(root);
  const dirMap: AliasesMap = {};
  for (const dir of fileArr) {
    const stat = await fs.stat(`${root}/${dir}`);
    if (stat.isDirectory()) {
      dirMap[dir] = path.join(root, dir);
    }
  }
  return dirMap;
}

function decorativePrefix(prefix: string, aliasesMap: AliasesMap) {
  const prefixAliases = Object.entries(aliasesMap).map(([key, value]) => ({
    [`${prefix}${key}`]: value
  }));
  return prefixAliases.reduce((acc, cur) => ({ ...acc, ...cur }), {});
}
