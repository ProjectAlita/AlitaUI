import { NormalRoundButton } from './Common';
import { HeaderContainer } from './EditModeToolBar';

export default function ModeratorToolBar() {
  return <>
    <HeaderContainer style={{ display: 'none' }}>
      <NormalRoundButton 
        variant='contained' 
        color='secondary' 
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => {}}>
        Decline
      </NormalRoundButton>
      <NormalRoundButton 
        variant='contained' 
        color='secondary' 
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => {}}>
        Approve
      </NormalRoundButton>
        
    </HeaderContainer>
  </>
}
