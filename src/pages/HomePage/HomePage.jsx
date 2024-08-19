import { Grid } from "@mui/material";
import MiddlePart from "../../components/HomePageComponents/MiddlePart";
import Headbar from "../../components/HomePageComponents/Headbar";

const LandingPage = () => {
  return (
    <div>
      <div>
        <Grid item xs={12}>
          <div className="sticky top-0 z-20">
            <Headbar />
          </div>
          <Grid item container className="flex flex-col items-center my-3">
            <MiddlePart />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
export default LandingPage;
