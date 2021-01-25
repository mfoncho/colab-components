import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import { CloseIcon } from "@colab/icons";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Effect from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import { useScreen } from "@colab/utils";

interface IDialog {
    icon?: JSX.Element;
    open?: boolean;
    title: string;
    fullHeight?: boolean;
    fullScreen?: boolean;
    fullWidth?: boolean;
    children?: any;
    actions?: JSX.Element;
    maxWidth?: "sm" | "md" | "xs" | "lg" | "xl";
    onClose?: (e: any, reason: string) => void;
    onExited?: () => void;
}

const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.up("md")]: {
            height: ({ fullHeight = true }: IDialog) =>
                fullHeight ? "80%" : undefined,
        },
    },
    appBar: {
        position: "relative",
    },
    title: {
        ...theme.typography.h6,
        flex: 1,
        fontWeight: 600,
        marginLeft: theme.spacing(2),
    },
}));

const Transition = React.forwardRef(function Transition(
    props: TransitionProps,
    ref
) {
    return <Effect ref={ref} {...props} />;
});

export default React.memo<IDialog>(
    ({ open = true, maxWidth = "sm", fullWidth = true, ...props }) => {
        let classes = useStyles(props);
        const screen = useScreen();

        function handleClose(event: React.MouseEvent) {
            if (props.onClose) {
                props.onClose(event, "closed");
            }
        }

        return (
            <Dialog
                open={open}
                scroll="paper"
                fullScreen={
                    props.fullScreen === undefined
                        ? screen.mobile
                        : props.fullScreen
                }
                maxWidth={maxWidth}
                onExited={props.onExited}
                classes={{ paper: classes.root }}
                fullWidth={fullWidth}
                onClose={props.onClose}
                TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        {props.icon}
                        <Typography className={classes.title}>
                            {props.title}
                        </Typography>
                        {props.actions}
                        {props.onClose && (
                            <IconButton
                                size="small"
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        )}
                    </Toolbar>
                </AppBar>
                {props.children}
            </Dialog>
        );
    }
);
