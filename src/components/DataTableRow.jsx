import { SortFields } from '@/common/constants';
import { filterProps } from '@/common/utils';
import { useDataViewMode } from '@/pages/hooks';
import {
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import AuthorContainer from './AuthorContainer';
import Like from './Like';
import useCardNavigate from './useCardNavigate';

const StyledTableCell = styled(
  TableCell, filterProps('customPadding')
)(({
  theme,
  customPadding = false
}) => ({
  padding: customPadding || '6px 24px',
  borderBottom: `1px solid ${theme.palette.secondary.main}`,
}))

export default function DataTableRow({
  columns,
  data: row,
  cardType,
  viewMode,
  collectionName
}) {
  const { id, ownerId, name } = row;
  const dataViewMode = useDataViewMode(viewMode, row);
  const doNavigate = useCardNavigate({ viewMode: dataViewMode, id, ownerId, type: row.cardType || cardType, name, collectionName });

  const renderCell = (column) => {
    const value = row[column.id];
    if (column.format) return column.format(value);
    if (column.id === 'name') {
      return (
        <>
          <Typography variant='headingSmall' component='div'>{row.name}</Typography>
          <Typography variant='bodySmall' component='div'>{row.description}</Typography>
        </>
      );
    }
    if (column.id === SortFields.Authors) {
      if (row.authors) {
        return <AuthorContainer authors={row.authors} />
      } else if (row.author) {
        return <AuthorContainer authors={[row.author]} />
      }
    }
    if (column.id === SortFields.Likes) {
      return <Like viewMode={dataViewMode} type={cardType} data={row} />
    }
    return value;
  }
  return (
    <TableRow hover role="checkbox" tabIndex={-1} key={row?.id}>
      {columns.map((column) => {
        const isNameColumn = column.id === 'name';
        return (
          <StyledTableCell
            key={column.id}
            align={column.align}
            customPadding={column?.rowCellPadding}
            onClick={isNameColumn ? doNavigate : undefined}
            sx={{
              cursor: isNameColumn ? 'pointer' : 'default',
            }}
          >
            {renderCell(column)}
          </StyledTableCell>
        );
      })}
    </TableRow>
  );
}