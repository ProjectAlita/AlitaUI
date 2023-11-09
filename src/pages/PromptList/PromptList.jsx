import PromptCard from "@/components/Card.jsx";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { usePromptListQuery } from "../../api/prompts.js";
import Categories from "./Categories.jsx";
import TrendingAuthors from "./TrendingAuthors.jsx";

const SOURCE_PROJECT_ID = 9;
const PromptList = () => {
  const { filteredList, tagList } = useSelector((state) => state.prompts);
  const { isError } = usePromptListQuery(SOURCE_PROJECT_ID);
  if (isError) return <>error</>;
  return (
    <Grid container style={{ flexGrow: 1, width: "75%" }}>
      {filteredList.map(
        (promptData) => {
          return (
            <Grid
              item
              key={promptData.id}
              sx={{
                background: "#181F2A",
                margin: "1rem 1rem 0 0",
                minWidth: "260px",
                width: {
                  xl: "23.5%",
                  lg: "31%",
                  md: "45%",
                  sm: "100%",
                  xs: "100%"
                },
                height: "192px",
                borderRadius: "8px",
                border: "1px solid #26323D",
                display: "flex",
                alignItems: "center",
                flexGrow: "0",
              }}
            >
              <PromptCard data={promptData} />
            </Grid>
          );
        }
      )}
      <Grid
        item
        xs={3}
        style={{
          position: "fixed",
          right: 0,
          height: "100vh",
          minWidth: "25%"
        }}
      >
        <Categories tagList={tagList}/>
        <TrendingAuthors />
      </Grid>
    </Grid>
  );
};

export default PromptList;
