import {
  CARD_LIST_WIDTH,
  CARD_LIST_WIDTH_CENTERED,
  CARD_LIST_WIDTH_FULL,
  CARD_LIST_WIDTH_FULL_CENTERED,
  MARGIN_COMPENSATION,
  PAGE_SIZE,
  SearchParams,
  SortFields,
  SortOrderOptions,
  TIME_FORMAT,
  ViewMode
} from '@/common/constants';
import { filterProps, getComparator, stableSort, timeFormatter } from '@/common/utils';
import {
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StyledConsoleIcon, StyledDataSourceIcon, StyledFolderIcon } from './Card';
import DataTableHead from './DataTableHead';
import DataTableRow from './DataTableRow';
import CalendarIcon from './Icons/CalendarIcon';
import StatusBar from './StatusBar';
import { isDataSourceCard, isPromptCard } from './useCardLike';
import { useSetUrlSearchParams } from './useCardNavigate';


const TabTableContainer = styled(
  Grid,
  filterProps('isFullWidth')
)(({ theme, isFullWidth }) => ({
  flexGrow: 1,
  width: isFullWidth ? CARD_LIST_WIDTH_FULL : CARD_LIST_WIDTH,
  overflowY: 'hidden',
  paddingRight: MARGIN_COMPENSATION,
  [theme.breakpoints.up('centered_content')]: {
    width: isFullWidth ?
      CARD_LIST_WIDTH_FULL_CENTERED :
      CARD_LIST_WIDTH_CENTERED
  }
}));

const StyledTableCell = styled(
  TableCell, filterProps('customPadding')
)(({
  theme,
  customPadding = false
}) => ({
  padding: customPadding || '6px 24px',
  borderBottom: `1px solid ${theme.palette.border.table}`,
}))

export const StyledCalendarIcon = styled(CalendarIcon)(() => ({
  width: '1rem',
  height: '1rem',
  transform: 'translate(4px, 4px)',
}));

export default function DataTable({
  data,
  mixedContent,
  isFullWidth,
  total = 0,
  isLoading,
  isLoadingMore,
  loadMoreFunc,
  cardType,
  renderCard,
}) {
  const { viewMode, collectionName } = renderCard({ metaOnly: true });
  const showLikes = useMemo(() => viewMode !== ViewMode.Owner, [viewMode]);
  const [searchParams] = useSearchParams();
  const sortBy = useMemo(() => searchParams.get(SearchParams.SortBy) || SortFields.CreatedAt, [searchParams]);
  const sortOrder = useMemo(() => searchParams.get(SearchParams.SortOrder) || SortOrderOptions.DESC, [searchParams]);

  const [order, setOrder] = useState(sortOrder);
  const [orderBy, setOrderBy] = useState(sortBy);

  const columnsMeta = useMemo(() => [
    {
      id: 'status',
      label: '',
      noSort: true,
      width: '3px',
      headCellPadding: '0',
      rowCellPadding: '0',
      hide: showLikes,
      format: (value) => <StatusBar status={value} />
    },
    {
      id: SortFields.Name,
      label: 'Name & Description',
      minWidth: 150,
      rowCellPadding: '6px 16px'
    },
    {
      id: 'cardType',
      label: 'Type',
      noSort: !mixedContent,
      format: (value) => isPromptCard(value || cardType) ? <StyledConsoleIcon /> : isDataSourceCard(value || cardType) ? <StyledDataSourceIcon/> : <StyledFolderIcon />
    },
    {
      id: SortFields.Likes,
      label: 'Likes',
      hide: !showLikes,
    },
    {
      id: SortFields.Authors,
      label: 'Authors',
    },
    {
      id: SortFields.CreatedAt,
      label: 'Create',
      minWidth: 120,
      format: value => <>
        <StyledCalendarIcon sx={{ mr: 1 }} />
        <Typography variant='bodySmall' component='span'>
          {timeFormatter(value, TIME_FORMAT.MMMDD)}
        </Typography>
      </>
    },
    {
      id: 'actions',
      label: 'Actions',
      noSort: true,
    }
  ], [cardType, mixedContent, showLikes]);
  const columns = useMemo(() => columnsMeta.filter(item => !item?.hide), [columnsMeta]);

  const [tablePage, setTablePage] = useState(0);
  const setUrlSearchParams = useSetUrlSearchParams();
  const rowsPerPageOptions = useMemo(() => [10, PAGE_SIZE, 50, 100], []);
  const rowsPerPage = useMemo(() => {
    let size
    try {
      size = parseInt(searchParams.get(SearchParams.PageSize) || PAGE_SIZE);
      if (rowsPerPageOptions.includes(size)) {
        return size;
      }
      return PAGE_SIZE;
    } catch (err) {
      return PAGE_SIZE;
    }

  }, [rowsPerPageOptions, searchParams]);

  const handleChangePage = useCallback((_, newPage) => {
    setTablePage(newPage);
    const loadLimit = (newPage + 1) * rowsPerPage
    if ((data.length !== total) && (data.length < loadLimit)) {
      loadMoreFunc();
    }
  }, [data.length, loadMoreFunc, rowsPerPage, total]);

  const handleChangeRowsPerPage = useCallback((event) => {
    const newPageSize = +event.target.value
    setUrlSearchParams({ [SearchParams.PageSize]: newPageSize });
    setTablePage(0);
  }, [setUrlSearchParams]);

  const visibleRows = useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy))
        .slice(tablePage * rowsPerPage, tablePage * rowsPerPage + rowsPerPage),
    [data, order, orderBy, rowsPerPage, tablePage]);

  return <TabTableContainer isFullWidth={isFullWidth}>
    <TableContainer>
      <Table stickyHeader aria-label="sticky table">
        <DataTableHead
          cardType={cardType}
          columns={columns}
          order={order}
          orderBy={orderBy}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
        />
        <TableBody>
          {
            (isLoading || isLoadingMore) ?
              <TableRow><StyledTableCell sx={{ border: 'none' }}><CircularProgress /></StyledTableCell></TableRow> :
              (
                visibleRows?.length > 0 ?
                  visibleRows.map((row) =>
                    <DataTableRow
                      key={row?.id + (row?.cardType || cardType)}
                      columns={columns}
                      data={row}
                      viewMode={viewMode}
                      cardType={cardType}
                      collectionName={collectionName}
                    />
                  ) :
                  <TableRow><StyledTableCell sx={{ border: 'none' }}>No Data.</StyledTableCell></TableRow>
              )
          }
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      component="div"
      count={total}
      rowsPerPage={rowsPerPage}
      page={tablePage}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </TabTableContainer>
}