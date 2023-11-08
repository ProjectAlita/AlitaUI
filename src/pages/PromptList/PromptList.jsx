import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { usePromptListQuery } from "../../api/prompts.js";
import PromptCard from "@/components/Card.jsx";
import Categories from "./Categories.jsx";

const SOURCE_PROJECT_ID = 9;
const PromptList = () => {
  const { filteredList } = useSelector((state) => state.prompts);
  const { isError } = usePromptListQuery(SOURCE_PROJECT_ID);
  if (isError) return <>error</>;
  return (
    <Grid container style={{ flexGrow: 1, width: "75%" }}>
      {[...filteredList, ...filteredList, ...filteredList, ...filteredList, ...filteredList].map(
        (promptData) => {
          return (
            <Grid
              item
              key={promptData.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={1}
              sx={{
                background: "#181F2A",
                margin: "1rem 1rem 0 0",
                minWidth: "318px",
                height: "192px",
                borderRadius: "8px",
                border: "1px solid #26323D",
                display: "flex",
                alignItems: "center"
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
        <Categories />
      </Grid>
    </Grid>
  );
};

export default PromptList;
