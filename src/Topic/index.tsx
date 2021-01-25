import React from "react";
import Markdown from "../Markdown";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(() => ({
    root: {
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    },
}));

export interface ITopic {
    topic: string;
}

export default React.memo<ITopic>(({ topic }) => {
    const classes = useStyles();
    return (
        <Typography variant="body2" className={classes.root}>
            <Markdown
                h1={false}
                h2={false}
                h3={false}
                h4={false}
                h5={false}
                h6={false}
                link={true}
                code={false}
                list={false}
                image={true}
                table={false}
                strike={true}
                heading={false}
                blockquote={false}>
                {topic}
            </Markdown>
        </Typography>
    );
});
