import PromptCard from "@/components/Card.jsx";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { usePromptListQuery } from "../../api/prompts.js";
import Categories from "./Categories.jsx";

const SOURCE_PROJECT_ID = 9;
const PromptList = () => {
  const { filteredList } = useSelector((state) => state.prompts);
  const { isError } = usePromptListQuery(SOURCE_PROJECT_ID);
  if(isError) return <>error</>
  return (
    <Grid container style={{ flexGrow: 1, width: '75%' }}>
      {filteredList.map((promptData) => {
        return (
          <Grid item key={promptData.id}>
            <PromptCard data={promptData} />
          </Grid>
        );
      })}
      <Grid
        item
        xs={3}
        style={{
          position: "fixed",
          right: 0,
          height: "100vh",
        }}
      >
        <Categories />
      </Grid>
    </Grid>
  );
};

export default PromptList;
