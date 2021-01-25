import React from "react";
import Text from "../Text";
import { makeStyles } from "@material-ui/core/styles";

export type MarkerT = "highlight" | "channel" | "bot" | "user";

export interface IMarker {
    text: string;
    type?: MarkerT;
    props?: React.HTMLProps<HTMLSpanElement>;
}

export interface IHighlighted {
    text: string;
    index: number;
}

export type MarkersT = (string | IMarker)[];

type MarkerPropsT = React.HTMLProps<HTMLSpanElement>;

interface IHmap {
    [key: string]: MarkerPropsT;
}

interface IHighlight {
    markers: string | MarkersT;
    children: string | React.ReactChildren;
    onClick?: (e: React.MouseEvent, node: IHighlighted) => void;
}

const useStyles = makeStyles((theme) => ({
    user: {
        cursor: "pointer",
        fontSize: "90%",
        fontWeight: 600,
        paddingLeft: theme.spacing(0.5),
        paddingRight: theme.spacing(0.5),
        paddingBottom: 1,
        borderRadius: theme.spacing(2),
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
    },

    bot: {
        cursor: "pointer",
        fontSize: "90%",
        fontWeight: 600,
        paddingLeft: theme.spacing(0.5),
        paddingRight: theme.spacing(0.5),
        paddingBottom: 1,
        borderRadius: theme.spacing(2),
        color: theme.palette.common.white,
        backgroundColor: theme.palette.secondary.main,
    },

    channel: {
        cursor: "pointer",
        color:
            theme.palette.type === "light"
                ? theme.palette.primary.main
                : theme.palette.primary.light,
        borderRadius: theme.spacing(0.5),
        fontWeight: 600,
        backgroundColor:
            theme.palette.type === "light"
                ? theme.palette.primary.light
                : `${theme.palette.primary.main}04`,
    },

    highlight: {
        marginLeft: 0.5,
        marginRight: 0.5,
        paddingLeft: 0.5,
        paddingRight: 0.5,
        borderRadius: 4,
        backgroundColor: `${theme.palette.primary.main}3F`,
    },
}));

export default React.memo<IHighlight>(function ({
    markers,
    children,
    onClick,
}) {
    const parsed = [];

    const hmap: IHmap = {};

    const classes = useStyles();

    if (typeof children != "string")
        return <React.Fragment>{children}</React.Fragment>;

    const content = children;

    function handleClick(text: string, index: number) {
        if (onClick) {
            return (e: React.MouseEvent) => {
                onClick(e, { text, index });
            };
        }
        return undefined;
    }

    const highlight = typeof markers == "string" ? [markers] : markers;

    const patterns = highlight.reduce(
        (acc: string, marker: string | IMarker) => {
            // Could be abstracted to run once
            // with a function based component
            if (typeof marker == "string") {
                marker = {
                    type: "highlight",
                    text: marker,
                } as IMarker;
            }

            if (marker.text in hmap) return acc;

            hmap[marker.text] = marker.props
                ? marker.type && !Boolean(marker.props.className)
                    ? { ...marker.props, className: classes[marker.type] }
                    : marker.props
                : { className: classes.highlight };

            return acc != "" ? `${acc}|(${marker.text})` : `(${marker.text})`;
        },
        ""
    );

    if (patterns) {
        let prev: RegExpExecArray | null = null;

        let match: RegExpExecArray | null = null;

        const regex = RegExp(patterns, "g");

        while ((match = regex.exec(content)) !== null) {
            const text = match[0];
            const props = hmap[text];

            if (match.index !== 0) {
                if (prev) {
                    parsed.push(
                        <Text key={`highlight-pre-${match.index}`}>
                            {content.substring(
                                prev.index + prev[0].length,
                                match.index
                            )}
                        </Text>
                    );
                } else {
                    parsed.push(
                        <Text key={`highlight-pre-${match.index}`}>
                            {content.substring(0, match.index)}
                        </Text>
                    );
                }
            }

            parsed.push(
                <span
                    key={`mkdwn-${match.index}`}
                    onClick={handleClick(text, match.index)}
                    {...props}>
                    <Text>
                        {content.substring(
                            match.index,
                            match.index + text.length
                        )}
                    </Text>
                </span>
            );

            prev = match;
        }

        if (prev && prev.index + prev[0].length < content.length - 1) {
            parsed.push(
                <Text key={`highlight-suf-${prev.index}`}>
                    {content.substring(
                        prev.index + prev[0].length,
                        content.length
                    )}
                </Text>
            );
        }

        return prev ? (
            <React.Fragment>{parsed}</React.Fragment>
        ) : (
            <Text>{content}</Text>
        );
    }

    return <Text>{content}</Text>;
});
