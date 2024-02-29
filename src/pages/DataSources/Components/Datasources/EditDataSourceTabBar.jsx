import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import {
  useNavBlocker,
} from '@/pages/hooks';

import NormalRoundButton from '@/components/NormalRoundButton';
import DiscardButton from './DiscardButton';

const TabBarItems = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'reverse-row',
}));

export default function EditDataSourceTabBar({ hasChangedTheDataSource, isSaving, onSave, onDiscard }) {
  const showSaveButton = true;
  useNavBlocker({
    blockCondition: hasChangedTheDataSource,
  });

  return <>
    <TabBarItems>
      {
        showSaveButton &&
        <NormalRoundButton disabled={isSaving || !hasChangedTheDataSource} variant="contained" color="secondary" onClick={onSave}>
          Save
          {isSaving && <StyledCircleProgress size={20} />}
        </NormalRoundButton>
      }
      <DiscardButton disabled={!hasChangedTheDataSource} onDiscard={onDiscard} />
    </TabBarItems>
  </>
}