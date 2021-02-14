import React from "react";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { Story, Meta } from "@storybook/react/types-6-0";
import Theme from "./Main";
import { colors, createTheme } from "@colab/utils";
import { Button } from "@material-ui/core";

export default {
    title: "Theme",
    component: Theme,
    argTypes: {
        mode: {
            control: {
                type: "radio",
                options: ["light", "dark"],
            },
        },
        theme: {
            control: {
                type: "select",
                options: Object.keys(colors),
            },
        },
    },
} as Meta;

type ITheme = keyof typeof colors;

interface IStoryTheme {
    mode: "light" | "dark";
    theme: ITheme;
}

const Template: Story<IStoryTheme> = (args) => {
    const theme = createTheme(
        { palette: { primary: colors[args.theme] } },
        args.mode
    );
    return (
        <Theme theme={theme}>
            <Box
                flex={1}
                display="flex"
                margin={2}
                component={Paper}
                flexDirection="row"
                flexWrap="wrap"
                padding={2}>
                <Button color="primary" variant="contained">
                    Button
                </Button>
            </Box>
        </Theme>
    );
};

export const index = Template.bind({});
index.args = {
    mode: "light",
    theme: "blue",
};
