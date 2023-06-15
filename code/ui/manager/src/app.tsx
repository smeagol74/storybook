import React, { useMemo } from 'react';
import { useResizeDetector } from 'react-resize-detector';

import { type State } from '@storybook/manager-api';
import { Symbols } from '@storybook/components';
import { Global, createGlobal, styled } from '@storybook/theming';

import type { Page } from './components/layout/mobile';
import { Mobile } from './components/layout/mobile';
import { Desktop } from './components/layout/desktop';
import Sidebar from './containers/sidebar';
import Preview from './containers/preview';
import Panel from './containers/panel';
import Notifications from './containers/notifications';

const View = styled.div({
  position: 'fixed',
  overflow: 'hidden',
  height: '100vh',
  width: '100vw',
});

export interface AppProps {
  viewMode: State['viewMode'];
  layout: State['layout'];
  panelCount: number;
  mains: Page[];
}

const App: React.FC<AppProps> = ({ viewMode, layout, panelCount, mains }) => {
  const { width, height, ref } = useResizeDetector();
  let content;

  const props = useMemo(
    () => ({
      Sidebar,
      Preview,
      Panel,
      Notifications,
    }),
    []
  );

  if (!width || !height) {
    content = <div />;
  } else if (width < 600) {
    content = <Mobile {...props} viewMode={viewMode} options={layout} pages={mains} />;
  } else {
    content = (
      <Desktop
        {...props}
        viewMode={viewMode}
        options={layout}
        width={width}
        height={height}
        panelCount={panelCount}
        pages={mains}
      />
    );
  }

  return (
    <View ref={ref}>
      <Global styles={createGlobal} />
      <Symbols icons={['folder', 'component', 'document', 'bookmarkhollow']} />
      {content}
    </View>
  );
};

App.displayName = 'App';

export default App;
