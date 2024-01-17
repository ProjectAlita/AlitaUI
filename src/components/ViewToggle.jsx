import { SearchParams, ViewOptions } from '@/common/constants';
import { useSetUrlSearchParams } from '@/components/useCardNavigate';
import {
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import CardsViewIcon from './Icons/CardsViewIcon';
import TableViewIcon from './Icons/TableViewIcon';

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  padding: '6px 8px',
  border: 'none',
  color: theme.palette.icon.fill.primary,
  background: theme.palette.background.tabButton.default,
  '&.Mui-selected': {
    color: theme.palette.icon.fill.secondary,
    background: theme.palette.background.tabButton.active,
  },
  '& svg': {
    fontSize: '1rem',
  }
}));

export default function ViewToggle() {
  const [searchParams] = useSearchParams();
  const setUrlSearchParams = useSetUrlSearchParams();
  const view = useMemo(() => searchParams.get(SearchParams.View) || ViewOptions.Cards, [searchParams]);

  const onChange = useCallback((_, newValue) => {
    if (newValue !== null && newValue !== view) {
      setUrlSearchParams({
        [SearchParams.View]: newValue
      });
    }
  }, [setUrlSearchParams, view]);

  return <ToggleButtonGroup
    size="small"
    value={view}
    onChange={onChange}
    exclusive={true}
    aria-label="Small View Toggler"
    sx={{ ml: 1 }}
  >
    <StyledToggleButton
      value={ViewOptions.Table}
      key={ViewOptions.Table}
      sx={{ borderRadius: '8px 0 0 8px' }}
    >
      <TableViewIcon />
    </StyledToggleButton>
    <StyledToggleButton
      value={ViewOptions.Cards}
      key={ViewOptions.Cards}
      sx={{ borderRadius: '0 8px 8px 0' }}
    >
      <CardsViewIcon />
    </StyledToggleButton>
  </ToggleButtonGroup>
}