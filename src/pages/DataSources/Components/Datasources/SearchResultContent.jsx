import {Box, Card, CardActions, CardContent, Typography} from "@mui/material";
import ArticleIcon from '@mui/icons-material/Article';
import Markdown from "@/components/Markdown.jsx";
import CopyIcon from "@/components/Icons/CopyIcon.jsx";
import IconButton from "@mui/material/IconButton";
import React, {useCallback} from "react";

const CardPrettyContent = ({data}) => {
  return (
    <>
      <Box mr={2}>
        <ArticleIcon/>
      </Box>
      <Box flexGrow={1}>
        <Typography variant="bodyMedium" component="pre" color="text.secondary">
          <Markdown>
            {data.page_content}
          </Markdown>
        </Typography>
        <Typography variant="labelSmall">
          {data?.metadata?.source}
        </Typography>
      </Box>
    </>
  )
}

const SearchResultContent = ({data, pretty}) => {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  }, [data])
  
  return (
    <Card>
      <CardContent>
        <Box display={"flex"} alignItems={"center"}>
          {pretty ? 
            <CardPrettyContent data={data}/> : 
            <Box component={"pre"} flexGrow={1}>{JSON.stringify(data, null, 2)}</Box>
          }
          <CardActions>
            <IconButton onClick={handleCopy}>
              <CopyIcon sx={{fontSize: '1.13rem'}}/>
            </IconButton>
          </CardActions>
        </Box>
        
      </CardContent>
      
    </Card>
  );
}
export default SearchResultContent