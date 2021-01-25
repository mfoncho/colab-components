import React from "react";
import eregex from "emoji-regex";
import { makeStyles } from "@material-ui/styles";
import emoji from "@colab/emoji";
import Image from "../Image";

function image(unified: string) {
    return `/images/emoji/${unified}.png`;
}

const useStyles = makeStyles((theme) => ({
    emoji: {
        verticalAlign: "middle",
        position: "relative",
        userSelect: "text",
        msUserSelect: "text",
        MozUserSelect: "text",
        WebkitUserSelect: "text",
    },
    emsel: {
        color: "transparent",
        position: "absolute",
    },
}));

interface IText {
    size?: number;
    children: string;
}

export default React.memo<IText>(({ size = 20, children }) => {
    const classes = useStyles();

    if (children == null || children === "") {
        return <React.Fragment>{children}</React.Fragment>;
    }

    const src = children as string;

    const parsed = [];

    let prev = null;
    let match = null;

    const regex = eregex();

    while ((match = regex.exec(src))) {
        if (match.index !== 0) {
            if (prev) {
                parsed.push(
                    src.substring(prev.index + prev[0].length, match.index)
                );
            } else {
                parsed.push(src.substring(0, match.index));
            }
        }

        let emojiSrc = emoji.imagePathFromNative(match[0]);

        if (emojiSrc) {
            parsed.push(
                <Image
                    src={emojiSrc}
                    alt={match[0]}
                    key={`emoji-${match.index}`}
                    draggable="true"
                    className={classes.emoji}
                    style={{ width: size, height: size }}
                />
            );
        } else {
            parsed.push(<span key={`emoji-${match.index}`}>{match[0]}</span>);
        }

        prev = match;
    }

    if (prev && prev.index + prev[0].length < src.length - 1) {
        parsed.push(src.substring(prev.index + prev[0].length, src.length));
    }

    if (parsed.length > 0) {
        return <React.Fragment>{parsed}</React.Fragment>;
    } else {
        return <React.Fragment>{children}</React.Fragment>;
    }
});
