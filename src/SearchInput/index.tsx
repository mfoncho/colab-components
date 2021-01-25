import React, { useState } from "react";
import clx from "classnames";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import { SearchIcon } from "@colab/icons";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
    searchBar: {
        padding: theme.spacing(0, 0.5),
        display: "flex",
        alignItems: "center",
    },
    searchInput: {
        ...theme.typography.body2,
        flex: 1,
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
        color:
            theme.palette.type === "light"
                ? theme.palette.grey["A700"]
                : undefined,
    },
    searchIcon: {
        padding: theme.spacing(0.5),
        fontSize: theme.spacing(4),
        color: theme.palette.grey["A700"],
    },
    searchIconFocused: {
        padding: theme.spacing(0.5),
        fontSize: theme.spacing(4),
    },
}));

interface ISearchInput {
    value: string;
    loading?: boolean;
    classes?: any;
    fullWidth?: boolean;
    elevation?: number;
    onFocus?: (
        event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onChange?: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    autoFocus?: boolean;
    onKeyPress?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    placeholder?: string;
}

export default React.memo<ISearchInput>((props) => {
    const classes = useStyles();

    const pclasses = props.classes ? props.classes : {};

    const [focused, setFocused] = useState(false);

    function handleInputFocused(e: any) {
        setFocused(true);
        return props.onFocus ? props.onFocus(e) : null;
    }

    function handleLostFocus() {
        setFocused(false);
    }

    return (
        <Paper
            className={clx(classes.searchBar, pclasses.root)}
            elevation={props.elevation}>
            {props.loading === true ? (
                <CircularProgress
                    size={28}
                    className={clx(classes.searchIcon, pclasses.icon)}
                />
            ) : (
                <SearchIcon
                    className={
                        focused ? classes.searchIconFocused : classes.searchIcon
                    }
                />
            )}
            <InputBase
                onBlur={handleLostFocus}
                onFocus={handleInputFocused}
                className={clx(classes.searchInput, pclasses.input)}
                value={props.value}
                onChange={props.onChange}
                autoFocus={props.autoFocus}
                fullWidth={props.fullWidth}
                onKeyPress={props.onKeyPress}
                placeholder={props.placeholder}
            />
        </Paper>
    );
});
