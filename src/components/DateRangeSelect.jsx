import { ALL_TIME_DATE } from '@/common/constants';
import SingleSelect from '@/components/SingleSelect';
import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import { useCallback, useMemo } from 'react';

const SelectContainer = styled(Box)(() => (`
  display: flex;
  margin-left: 0.5rem;
  z-index: 1001;
  display: flex;
  align-items: flex-end;
  height: 100%;
`));

export default function DateRangeSelect ({trendRange, setTrendRange}) {
  const theme = useTheme();
  const trendRangeOptions = useMemo(() => {
    const theDate = new Date();
    const dateString = theDate.toISOString().split('T')[0];
    const monthString = dateString.substring(0, dateString.lastIndexOf('-'));
    const firstDataOfThisWeek = theDate.getDate() - theDate.getDay();
    const theDateOfMonday = new Date(new Date().setDate(firstDataOfThisWeek)).toISOString().split('T')[0]
    return [
      {
        label: 'Today',
        value: dateString + 'T00:00:00'
      },
      {
        label: 'This week',
        value: theDateOfMonday + 'T00:00:00',
      },
      {
        label: 'This Month',
        value: monthString + '-01T00:00:00',
      },
      {
        label: 'All time',
        value: ALL_TIME_DATE,
      }
    ]
  }, []);


  const onChangeTrendRange = useCallback(
    (newRange) => {
      setTrendRange(newRange);
    },
    [setTrendRange],
  );

  return <SelectContainer>
  <SingleSelect
    onValueChange={onChangeTrendRange}
    value={trendRange}
    options={trendRangeOptions}
    customSelectedColor={`${theme.palette.text.primary} !important`}
    customSelectedFontSize={'0.875rem'}
  />
</SelectContainer>
}