import React from "react";
import cls from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import { colors } from "@colab/utils";

type ColorType = keyof typeof colors;

export interface IStatus {
    color: ColorType;
    children: React.ReactNode | string;
}

export type StatusThemes = Record<
    ColorType,
    { color: string; backgroundColor: string }
>;

const statusThemes = (Object.keys(colors) as ColorType[]).reduce(
    (acc, color: ColorType) => {
        return {
            [color]: {
                color: colors[color]["900"],
                backgroundColor: colors[color]["50"],
            },
            ...acc,
        };
    },
    {} as StatusThemes
);

const useStyles = makeStyles((theme) => {
    return {
        ...statusThemes,
        root: {
            padding: theme.spacing(0.5, 1),
            borderRadius: theme.spacing(1),
        },
    };
});

export default React.memo<IStatus>((props) => {
    const classes = useStyles();
    return (
        <span className={cls(classes.root, classes[props.color])}>
            {props.children}
        </span>
    );
});
