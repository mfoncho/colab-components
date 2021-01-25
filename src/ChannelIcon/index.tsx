import React from "react";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import { BoardIcon, ChatIcon, UserIcon } from "@colab/icons";

type IIcon = React.ComponentProps<typeof Avatar> & {
    elevation?: number;
    children?: any;
    type?: "board" | "chat" | "direct";
};

function initial(str: string, value = "p") {
    if (str && str.length > 0) {
        value = str[0];
    }
    return value.toUpperCase();
}

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: ({ type }: IIcon) =>
            type == "direct" ? "50%" : `${theme.spacing(4)}%`,
    },
    colorDefault: {
        color: theme.palette.common.white,
        backgroundColor: ({ src, srcSet }: IIcon) =>
            src || srcSet ? "transparent" : (theme.palette.primary as any)["A400"],
    },
}));

export default React.memo<IIcon>(({ classes: pclasses, type, ...props }) => {
    const classes = useStyles(props);
    const aclasses = { ...classes, ...pclasses };
    return (
        <Avatar
            component={props.elevation ? (Paper as any) : undefined}
            classes={aclasses}
            {...props}>
            {type == "board" && <BoardIcon />}
            {type == "direct" && <UserIcon />}
            {type == "chat" && <ChatIcon />}
            {!Boolean(type) && props.alt && initial(props.alt)}
        </Avatar>
    );
});
