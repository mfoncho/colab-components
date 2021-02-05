import React, {useRef} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip";

function arrowGenerator(color: any) {
    return {
        '&[x-placement*="bottom"] $arrow': {
            top: 0,
            left: 0,
            marginTop: "-0.95em",
            width: "3em",
            height: "1em",
            "&::before": {
                borderWidth: "0 1em 1em 1em",
                borderColor: `transparent transparent ${color} transparent`,
            },
        },
        '&[x-placement*="top"] $arrow': {
            bottom: 0,
            left: 0,
            marginBottom: "-0.95em",
            width: "3em",
            height: "1em",
            "&::before": {
                borderWidth: "1em 1em 0 1em",
                borderColor: `${color} transparent transparent transparent`,
            },
        },
        '&[x-placement*="right"] $arrow': {
            left: 0,
            marginLeft: "-0.95em",
            height: "3em",
            width: "1em",
            "&::before": {
                borderWidth: "1em 1em 1em 0",
                borderColor: `transparent ${color} transparent transparent`,
            },
        },
        '&[x-placement*="left"] $arrow': {
            right: 0,
            marginRight: "-0.95em",
            height: "3em",
            width: "1em",
            "&::before": {
                borderWidth: "1em 0 1em 1em",
                borderColor: `transparent transparent transparent ${color}`,
            },
        },
    };
}

const useStyles = makeStyles((theme) => ({
    arrow: {
        position: "absolute",
        width: "3em",
        height: "3em",
        "&::before": {
            content: '""',
            margin: "auto",
            display: "block",
            width: 0,
            height: 0,
            borderStyle: "solid",
        },
    },
    popper: arrowGenerator(theme.palette.common.black),
    tooltip: {
        position: "relative",
        backgroundColor: theme.palette.common.black,
    },
    tooltipPlacementLeft: {
        margin: "0 8px",
    },
    tooltipPlacementRight: {
        margin: "0 8px",
    },
    tooltipPlacementTop: {
        margin: "8px 0",
    },
    tooltipPlacementBottom: {
        margin: "8px 0",
    },
}));

export default function PointingTooltip(props: any) {
    const { arrow, ...classes } = useStyles();
    const ref = useRef<HTMLSpanElement>(null);
    const title = typeof props.title == "string" ? (
                    <Typography variant="subtitle2">
                        {props.title}
                    </Typography>
                    ) : props.title
    return (
        <Tooltip
            classes={classes}
            PopperProps={{
                popperOptions: {
                    modifiers: {
                        arrow: {
                            enabled: true,
                            element: ref.current,
                        },
                    },
                },
            }}
            {...props}
            placement={props.placement || "top"}
            title={
                <React.Fragment>
                    {title}
                    <span className={arrow} ref={ref} />
                </React.Fragment>
            }
        />
    );
}
