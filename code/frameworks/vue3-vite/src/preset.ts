import type { StorybookConfig } from '@storybook/builder-vite';
import { hasVitePlugins } from '@storybook/builder-vite';
import { vueDocgen } from './plugins/vue-docgen';

export const core: StorybookConfig['core'] = {
  builder: '@storybook/builder-vite',
  renderer: '@storybook/vue3',
};

export const viteFinal: StorybookConfig['viteFinal'] = async (config, { presets }) => {
  const { plugins = [] } = config;

  // Add vue plugin if not present
  if (!(await hasVitePlugins(plugins, ['vite:vue']))) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const { default: vue } = await import('@vitejs/plugin-vue');
    plugins.push(vue());
  }

  // Add docgen plugin
  plugins.push(vueDocgen());

  const updated = {
    ...config,
    plugins,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        vue: 'vue/dist/vue.esm-bundler.js',
      },
    },
  };
  return updated;
};
