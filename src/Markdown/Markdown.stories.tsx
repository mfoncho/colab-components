import React from "react";
import Theme from "../Theme";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { Story, Meta } from "@storybook/react/types-6-0";
import Markdown, { IMProps } from "./Main";

export default {
    title: "Markdown",
    component: Markdown,
} as Meta;

const Template: Story<IMProps> = (args) => (
    <Theme>
        <Paper>
            <Markdown {...args} />
        </Paper>
    </Theme>
);

export const index = Template.bind({});

index.args = {
    children: `
http://github.com - automatic!
[GitHub](http://github.com)

checklist
- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del> supported
- [x] list syntax required (any unordered or ordered list supported)
- [x] this is a complete item
- [ ] this is an incomplete item

\`\`\`javascript
function fancyAlert(arg) {
    if(arg) {
        $.facebox({div:'#foo'})
    }
}
\`\`\`

table

First Header | Second Header
------------ | -------------
Content from cell 1 | Content from cell 2
Content in the first column | Content in the second column

quote 
> Coffee. The finest organic suspension ever devised... I beat the Borg with it.
> - Captain Janeway
    `,
    highlight: "checklist",
    image: true,
    code: true,
    list: true,
    strong: true,
    emphasis: true,
    table: true,
    link: true,
    strike: true,
    heading: true,
    blockquote: true,
    onLinkClick: () => {},
    onHighlightClick: () => {},
    h1: true,
    h2: true,
    h3: true,
    h4: true,
    h5: true,
    h6: true,
};
