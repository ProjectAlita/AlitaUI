import { Tooltip } from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const TIP_CONTENT = 'Your personal space will be provisioned within 5 minutes, enjoy public prompts so far';

export const useDisablePersonalSpace = () => {
  const { personal_project_id: privateProjectId } = useSelector(state => state.user);
  const shouldDisablePersonalSpace = useMemo(() => !privateProjectId || true, [privateProjectId]);
  return { shouldDisablePersonalSpace }
}

export default function TooltipForDisablePersonalSpace({children, ...props}) {
  const { shouldDisablePersonalSpace } = useDisablePersonalSpace();
  return (
    <Tooltip {...props} title={shouldDisablePersonalSpace ? TIP_CONTENT : ''} >
      {children}
    </Tooltip>
  );
}
