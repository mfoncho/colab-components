import React from "react";
import clsx from "classnames";
import { makeStyles, Theme } from "@material-ui/core/styles";
import InputBase, { InputBaseProps } from "@material-ui/core/InputBase";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor:
            theme.palette.type === "light"
                ? theme.palette.grey[200]
                : theme.palette.grey[700],
        padding: theme.spacing(0.25, 1),
        borderRadius: theme.shape.borderRadius,
    },
}));

interface IInputProps extends InputBaseProps {
    InputProps?: object;
    helperText?: string;
}

export default React.memo(
    ({ helperText, InputProps, ...props }: IInputProps) => {
        const classes = useStyles();

        return (
            <InputBase
                {...props}
                className={clsx(classes.root, props.className)}
            />
        );
    }
);
