import {
  SearchParams,
  SortFields,
  SortOrderOptions
} from '@/common/constants';
import { filterProps } from '@/common/utils';
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography
} from '@mui/material';
import SortDisabledIcon from './Icons/SortDisabledIcon';
import SortUpwardIcon from './Icons/SortUpwardIcon';
import { useSetUrlSearchParams } from './useCardNavigate';
import { isCollectionPromptCard } from './useCardLike';


const StyledTableHeadCell = styled(
  TableCell, filterProps('customPadding')
)(({ 
  theme, 
  customPadding = false 
}) => ({
  padding: customPadding || '6px 8px',
  borderBottom: `1px solid ${theme.palette.border.lines}`,
}))

export default function DataTableHead({ columns, orderBy, order, setOrder, setOrderBy, cardType }) {
  const setUrlSearchParams = useSetUrlSearchParams();

  const handleSort = (_, property) => {
    let newSortOrder = SortOrderOptions.DESC;
    const isCurrentActive = orderBy === property;
    if (isCurrentActive) {
      newSortOrder = order === SortOrderOptions.DESC ? SortOrderOptions.ASC : SortOrderOptions.DESC;
    }

    const isCollectionPrompt = isCollectionPromptCard(cardType);

    const remoteSortItems = [SortFields.Name, SortFields.CreatedAt, SortFields.Likes];
    if (!isCollectionPrompt && remoteSortItems.includes(property)) {
      setUrlSearchParams({
        [SearchParams.SortBy]: property,
        [SearchParams.SortOrder]: newSortOrder
      })
    } else {
      setOrder(newSortOrder);
      setOrderBy(property);
    }
  };

  const createSortHandler = (property) => (event) => {
    handleSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <StyledTableHeadCell
            key={column.id}
            align={column.align}
            customPadding={column?.headCellPadding}
            sortDirection={orderBy === column.id ? order : false}
            style={{
              top: 0,
              minWidth: column.minWidth,
              width: column.width
            }}
          >
            {
              column.id === 'status'
                ? <Typography variant='labelSmall'> {column.label}</Typography>
                : <TableSortLabel
                  active={true}
                  direction={orderBy === column.id ? order : SortOrderOptions.DESC}
                  onClick={createSortHandler(column.id)}
                  IconComponent={orderBy === column.id ? SortUpwardIcon : SortDisabledIcon}
                  style={{ flexDirection: 'row-reverse' }}
                >
                  <Typography variant='labelSmall'> {column.label}</Typography>
                </TableSortLabel>
            }
          </StyledTableHeadCell>
        ))}
      </TableRow>
    </TableHead>
  );
}