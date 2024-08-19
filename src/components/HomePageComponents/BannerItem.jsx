import { Fab, Paper, Typography } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
export function BannerItem(props) {
  return (
    <Paper className="flex flex-col items-center px-5 rounded-lg relative overflow-hidden">
      <img
        className="max-w-8xl max-h-96 w-full object-cover py-5"
        src={props.item.imgPath}
        alt={props.item.label}
        style={{
          filter: "brightness(0.5)",
        }}
      />
      <div className="absolute bottom-20 left-10 flex flex-col items-start text-white space-y-2">
        <Typography className="items-center" variant="h6">
          {props.item.label}
        </Typography>
        <Fab variant="extended">
          <MenuBookIcon sx={{ mr: 1 }} />
          Check it out!
        </Fab>
      </div>
    </Paper>
  );
}
