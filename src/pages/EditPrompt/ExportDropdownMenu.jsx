import * as React from 'react';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { styled } from '@mui/system';
import ExportIcon from '@/components/Icons/ExportIcon';
import { Typography } from '@mui/material';
import { useExportPromptMutation, useExportCollectionMutation } from '@/api/prompts';
import { downloadJSONFile } from '@/common/utils';
import { useProjectId } from '../hooks';

const MenuSection = styled('div')(({theme, withIcon = false}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: `.5rem ${withIcon? '1': '2.5'}rem`,

  '& svg': {
    marginRight: '8px',
  },

  '&:hover': {
    backgroundColor: withIcon? '': theme.palette.background.select.hover,
    cursor: 'pointer'
  }
}));

const DropdownMenuContainer = styled('div')(() => {
    return {
        position: 'relative'
    }
})

const StyledDropdown = styled(Menu)(() => {
    return {
        position: 'absolute',
        zIndex: '999',
        right: '-19px',
        width: '12.625rem',
    }
})

export const useExport = ({id, name, isCollection}) => {
  const [exportPrompt] = useExportPromptMutation();
  const [exportCollection] = useExportCollectionMutation();
  const projectId = useProjectId();

  const doExport = React.useCallback(({isDial}) => 
    async () => {
    let data;
    if(isCollection){
      data = await exportCollection({projectId, collectionId: id, isDial})
    }else if(projectId){
      data = await exportPrompt({projectId, promptId: id, isDial})
    }
    downloadJSONFile(data, name)
  }, [exportCollection, exportPrompt, id, isCollection, name, projectId])

  return doExport
}

export default function ExportDropdownMenu({ children, id, name, isCollection }) {
  const [openDropDown, setOpenDropDown] = React.useState(false);

  const handleDropdownSwitch = React.useCallback((event) => {
    event.stopPropagation();
    setOpenDropDown((preStatus) => {
      return !preStatus;
    });
  }, []);

  const closeDropdown = React.useCallback(() => {
    setOpenDropDown(false)
  }, [])


  const doExport = useExport({
    id,
    name,
    isCollection,
  })

  React.useEffect(() => {
    window.addEventListener('click', closeDropdown)
    return () => {
      window.removeEventListener('click', closeDropdown)
    }
  })

  return (
    <Dropdown open={openDropDown}>
      <DropdownMenuContainer onClick={handleDropdownSwitch}>
        {children}
        <StyledDropdown slots={{ listbox: Listbox }}>
          <MenuSection withIcon>
            <ExportIcon style={{width: '1rem', height: '1rem'}}/>
            <Typography style={{cursor: 'pointer'}} variant='headingMedium'>Export</Typography>
          </MenuSection>
          <MenuSection onClick={doExport({isDial: false})}>
            [Alita format]
          </MenuSection>
          <MenuSection onClick={doExport({isDial: true})}>
            [DIAL format]
          </MenuSection>
        </StyledDropdown>
      </DropdownMenuContainer>
    </Dropdown>
  );
}

const Listbox = styled('ul')(
  ({ theme }) => `
    box-sizing: border-box;
    padding: 0;
    margin: 12px 0;
    min-width: 200px;
    border-radius: 0.5rem;
    overflow: auto;
    outline: 0px;
    background: ${theme.palette.background.secondary};
    border: 1px solid ${theme.palette.border.lines};
    color: ${theme.typography.headingMedium.color};
    box-shadow: 0px 4px 30px ${
      theme.palette.background.secondary
    };
    z-index: 1;
    `
);


