import {Box, Card, CardContent, Grid, Stack, Typography} from "@mui/material";
import Markdown from "@/components/Markdown.jsx";
import React, {useEffect, useState} from "react";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

function groupData(data) {
  if (!data) {
    return data
  }
  return data.map(item => {
    const newItem = {};
    for (const key in item) {
      const [newKey, number] = key.split(' #')
      if (number) {
        if (!newItem[newKey]) {
          newItem[newKey] = [null, null]
        }
        newItem[newKey][parseInt(number) - 1] = item[key]
      } else {
        newItem[key] = item[key]
      }
    }
    return newItem;
  });
}

const PrettyContentItem = ({itemData, showOnlyDiff = false}) => {
  const [filteredData, setFilteredData] = useState([])
  useEffect(() => {
    if (itemData) {
      const result = Object.entries(itemData).filter(i => i[0] !== 'score')
      if (showOnlyDiff) {
        setFilteredData(result.filter(i => i[1][0].toString() !== i[1][1].toString()))
      } else {
        setFilteredData(result)
      }
      
    }
  }, [itemData, showOnlyDiff])
  
  return (
    <Card sx={{display: 'flex', my: 1, maxWidth: '100%'}} variant={'outlined'}>
      <CardContent sx={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
        <Box><Typography variant={"headingMedium"} color={'text.secondary'}>
          Score: {itemData?.score}
        </Typography></Box>
        <Grid container>
          {filteredData.map(([k, v]) => {
            return (
              <Grid item key={k} xs={12}>
                <Box textAlign={"center"}>
                  <Typography variant={'labelSmall'}>{k}</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                  <Box flexGrow={1} component={Markdown}>{v[0].toString()}</Box>
                  <Box fontSize={'16px'} mx={2}>
                    <CompareArrowsIcon fontSize={'inherit'} sx={{verticalAlign: 'middle'}}/>
                  </Box>
                  <Box flexGrow={1} component={Markdown}>{v[1].toString()}</Box>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </CardContent>
    </Card>
  )
}
const CardPrettyContent = ({data, showOnlyDiff}) => {
  const [groupedData, setGroupedData] = useState([])
  useEffect(() => {
    if (data) {
      setGroupedData(groupData(data))
    }
  }, [data])
  return (
    <Stack>
      {groupedData.map((i, index) => <PrettyContentItem itemData={i} key={index} showOnlyDiff={showOnlyDiff}/>)}
    </Stack>
  )
}

const DeduplicateResultContent = ({data, pretty, showOnlyDiff}) => {
  return (
    <Box display={"flex"}>
      {pretty ?
        <CardPrettyContent data={data} showOnlyDiff={showOnlyDiff}/> :
        <Box component={"pre"} flexGrow={1} sx={{textWrap: 'pretty'}}>{JSON.stringify(data, null, 2)}</Box>
      }
    </Box>
  );
}
export default DeduplicateResultContent