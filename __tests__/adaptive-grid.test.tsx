import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { AdaptiveGrid } from '../src/components/AdaptiveGrid';
jest.mock('../src/hooks/useLayout', () => ({
  useLayout: () => ({ contentWidth: 570, fontScale: 1 }),
}));
function Draft() {
  const [text, setText] = useState('');
  return <TextInput value={text} onChangeText={setText} />;
}
test('changing unfolded, folded and landscape widths preserves mounted content and user input', async () => {
  let tree: ReactTestRenderer;
  await act(async () => {
    tree = create(
      <AdaptiveGrid>
        <Draft key="first" />
        <Draft key="second" />
      </AdaptiveGrid>,
    );
  });
  await act(async () => {
    tree.root.findAllByType(TextInput)[0].props.onChangeText('My travel note');
  });
  for (const width of [570, 292, 834, 570]) {
    await act(async () => {
      tree.root
        .findByProps({ testID: 'adaptive-grid' })
        .props.onLayout({ nativeEvent: { layout: { width } } });
    });
    expect(tree!.root.findAllByType(TextInput)[0].props.value).toBe(
      'My travel note',
    );
    expect(tree!.root.findAllByType(TextInput)[1].props.value).toBe('');
  }
  await act(async () => {
    tree.unmount();
  });
});
