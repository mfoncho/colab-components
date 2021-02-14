import React from "react";
import { createTheme, Theme } from "@colab/utils";
import ScopedCssBaseline from "@material-ui/core/ScopedCssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({}, "light");

export interface ITheme {
    // themes
    theme?: Theme;
    children: React.ReactNode;
}

export default React.memo<ITheme>((props) => {
    return (
        <ThemeProvider theme={props.theme || theme}>
            {props.children}
        </ThemeProvider>
    );
});
