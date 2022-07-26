import React from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

// create styles
// create page styles
const styles = (theme) => ({
  root: {
    backgroundColor: `rgba(49,49,49,1)`,
    borderRadius: 4,
    zIndex: 1200,
    padding: 15,
    maxWidth: 300,
  },
  popoverTitle: {
    color: theme.palette.primary.main,
  },
  popoverSubtitle: {
    color: `#ffffff`,
  },
  popoverListItem: {
    marginTop: 5,
    display: `flex`,
    color: `#ffffff`,
  },
  popoverSymbolPoint: {
    border: `1.5px solid #333333`,
    borderRadius: `50%`,
    width: 20,
    height: 20,
  },
  popoverText: {
    marginLeft: 5,
    fontSize: "0.8rem",
  },
  noDataText: {
    color: `#c2c2c2`,
    marginTop: 5,
  },
});

const BenchmarkPopover = ({ classes, data, lowIsBad }) => {
  const popoverColors = [
    typeof data.bmk_line3 === "number" && data.bmk_color4
      ? {
          name: `>${data.bmk_line3} ${data.units}`,
          color: data.bmk_color4,
        }
      : "",
    typeof data.bmk_line2 === "number" &&
    typeof data.bmk_line3 === "number" &&
    data.bmk_color3
      ? {
          name: `${data.bmk_line2} - ${data.bmk_line3} ${data.units}`,
          color: data.bmk_color3,
        }
      : "",
    typeof data.bmk_line1 === "number" &&
    typeof data.bmk_line2 === "number" &&
    data.bmk_color2
      ? {
          name: `${data.bmk_line1} - ${data.bmk_line2} ${data.units}`,
          color: data.bmk_color2,
        }
      : "",
    typeof data.bmk_line0 === "number" &&
    typeof data.bmk_line1 === "number" &&
    data.bmk_color1
      ? {
          name: `${data.bmk_line0} - ${data.bmk_line1} ${data.units}`,
          color: data.bmk_color1,
        }
      : "",
    data.bmk_color0
      ? {
          name: `${data.param_abbrev} below detection limits`,
          color: data.bmk_color0,
        }
      : {
          name: `No benchmarks available`,
          color: "cornflowerBlue",
        },
  ];

  const popoverColorsReverse = [
    typeof data.bmk_line0 === "number" && data.bmk_color0
      ? { name: `>${data.bmk_line0} ${data.units}`, color: data.bmk_color0 }
      : "",
    typeof data.bmk_line0 === "number" &&
    typeof data.bmk_line1 === "number" &&
    data.bmk_color1
      ? {
          name: `${data.bmk_line1} - ${data.bmk_line0}  ${data.units}`,
          color: data.bmk_color1,
        }
      : "",
    typeof data.bmk_line1 === "number" &&
    typeof data.bmk_line2 === "number" &&
    data.bmk_color2
      ? {
          name: `${data.bmk_line2} - ${data.bmk_line1} ${data.units}`,
          color: data.bmk_color2,
        }
      : "",
    typeof data.bmk_line2 === "number" &&
    typeof data.bmk_line3 === "number" &&
    data.bmk_color3
      ? {
          name: `${data.bmk_line3} - ${data.bmk_line2}  ${data.units}`,
          color: data.bmk_color3,
        }
      : "",
    typeof data.bmk_line3 === "number" &&
    typeof data.bmk_line4 === "number" &&
    data.bmk_color4
      ? {
          name: `${data.bmk_line4} - ${data.bmk_line3} ${data.units}`,
          color: data.bmk_color4,
        }
      : "",
  ];

  return (
    <div className={classes.root}>
      <div className="mb6">
        <Typography
          variant="h6"
          color="secondary"
          className={classes.popoverTitle}
        >
          {`${data.param_abbrev} Benchmarks`}
        </Typography>
        <div className={classes.popoverList}>
          {lowIsBad
            ? popoverColorsReverse.map((el) =>
                el ? (
                  <div className={classes.popoverListItem} key={el.name}>
                    <div
                      className={classes.popoverSymbolPoint}
                      style={{ backgroundColor: el.color }}
                    />
                    <div className={classes.popoverText}>{el.name}</div>
                  </div>
                ) : null
              )
            : popoverColors.map((el) =>
                el ? (
                  <div className={classes.popoverListItem} key={el.name}>
                    <div
                      className={classes.popoverSymbolPoint}
                      style={{ backgroundColor: el.color }}
                    />
                    <div className={classes.popoverText}>{el.name}</div>
                  </div>
                ) : null
              )}
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(BenchmarkPopover);
