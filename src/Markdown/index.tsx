import React, { Component } from "react";
import { Node } from "unist";
import classnames from "classnames";
import endsWith from "lodash/endsWith";
import { withStyles, Theme } from "@material-ui/core/styles";
import SyntaxHighlighter from "react-syntax-highlighter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { xcode, dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Highlight, { MarkersT, IHighlighted } from "../Highlight";

import markdown from "remark-parse";

type TableAlignT =
    | "-moz-initial"
    | "inherit"
    | "initial"
    | "revert"
    | "unset"
    | "center"
    | "end"
    | "justify"
    | "left"
    | "match-parent"
    | "right"
    | "start";

interface IENode extends Node {
    parent?: IENode;
    value: string;
    title: string;
    alt: string;
    checked: boolean;
    label: string;
    url: string;
    align: TableAlignT[];
    children?: IENode[];
}

class Parser extends ((markdown as any).Parser as any) {
    constructor(content: string) {
        super(null, content);
    }
}

function escapeHtml(html: string) {
    return html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    //.replace(/"/g, "&quot;")
    //.replace(/'/g, "&#039;");
}

interface IMProps {
    image?: boolean;
    code?: boolean;
    list?: boolean;
    strong?: boolean;
    emphasis?: boolean;
    table?: boolean;
    link?: boolean;
    theme: Theme;
    strike?: boolean;
    heading?: boolean;
    highlight?: MarkersT | string;
    blockquote?: boolean;
    classes: any;
    h1?: boolean;
    h2?: boolean;
    h3?: boolean;
    h4?: boolean;
    h5?: boolean;
    h6?: boolean;
    children: string | React.ReactChildren;
    onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    onHighlightClick?: (e: React.MouseEvent, node: IHighlighted) => void;
}

interface IMState {
    source: string;
    parsed: string[];
    codeStyles?: any;
    codeLineProps?: any;
}

export class Markdown extends Component<IMProps, IMState> {
    state = {
        source: "",
        parsed: [],
        codeStyles: undefined,
        codeLineProps: undefined,
    };

    codeStyles = {};

    process(node: IENode, parent?: IENode, index?: number): JSX.Element {
        node.index = index;
        node.parent = parent;
        let prev = undefined;
        let newline = false;
        let component = null;
        const key = node.position?.start.offset;
        const children: JSX.Element[] | null = node.children
            ? node.children.map((child, index) =>
                  this.process(child, node, index)
              )
            : null;

        if (parent != null && index != null && index > 0) {
            let children = parent.children;
            prev = children ? children[index - 1] : undefined;
        }

        switch (node.type) {
            case "root":
                component = children;
                break;

            case "heading":
                if (this.props.heading === false) {
                    component = children;
                    break;
                }

                switch (node.depth) {
                    case 1:
                        if (this.props.h1 === false) {
                            component = children;
                        } else {
                            component = (
                                <h1 key={key} className={this.props.classes.h1}>
                                    {this.renderText(children)}
                                </h1>
                            );
                        }
                        break;

                    case 2:
                        if (this.props.h2 === false) {
                            component = children;
                        } else {
                            component = (
                                <h2 key={key} className={this.props.classes.h2}>
                                    {this.renderText(children)}
                                </h2>
                            );
                        }
                        break;

                    case 3:
                        if (this.props.h3 === false) {
                            component = children;
                        } else {
                            component = (
                                <h3 key={key} className={this.props.classes.h3}>
                                    {this.renderText(children)}
                                </h3>
                            );
                        }
                        break;

                    case 4:
                        if (this.props.h4 === false) {
                            component = children;
                        } else {
                            component = (
                                <h4 key={key} className={this.props.classes.h4}>
                                    {this.renderText(children)}
                                </h4>
                            );
                        }
                        break;

                    case 5:
                        if (this.props.h5 === false) {
                            component = children;
                        } else {
                            component = (
                                <h5 key={key} className={this.props.classes.h5}>
                                    {this.renderText(children)}
                                </h5>
                            );
                        }
                        break;

                    case 6:
                        if (this.props.h6 === false) {
                            component = children;
                        } else {
                            component = (
                                <h6 key={key} className={this.props.classes.h6}>
                                    {this.renderText(children)}
                                </h6>
                            );
                        }
                        break;

                    default:
                        component = children;
                        break;
                }
                break;

            case "strong":
                if (this.props.strong === false) {
                    component = children;
                    break;
                }
                component = (
                    <strong key={key}>{this.renderText(children)}</strong>
                );
                break;

            case "html":
                component = (
                    <span
                        className={this.props.classes.html}
                        key={key}>{`${node.value}`}</span>
                );
                break;

            case "emphasis":
                if (this.props.emphasis === false) {
                    component = children;
                    break;
                }
                component = <em key={key}>{this.renderText(children)}</em>;
                break;

            case "paragraph":
                if (Boolean(parent) && parent!.type === "listItem") {
                    component = children;
                } else {
                    component = (
                        <span
                            key={key}
                            className={this.props.classes.paragraph}>
                            {this.renderText(children)}
                        </span>
                    );
                }
                break;

            case "inlineCode":
                if (this.props.code === false) {
                    component = children;
                    break;
                }

                component = (
                    <code key={key} className={this.props.classes.inlineCode}>
                        {node.value}
                    </code>
                );
                break;

            case "text":
                if (parent?.type === "link") {
                    component = node.value;
                } else if (node.value === "\n") {
                    newline = true;
                } else {
                    component = (
                        <span key={key} className={this.props.classes.span}>
                            {this.renderText(node.value)}
                            {endsWith(node.value, "\n") && <br />}
                        </span>
                    );
                }
                break;

            case "link":
                if (this.props.link === false) {
                    component = children;
                    break;
                }

                component = (
                    <a
                        key={key}
                        title={node.title}
                        href={node.url}
                        onClick={this.props.onLinkClick ?? this.handleLinkClick}
                        className={this.props.classes.a}>
                        {children}
                    </a>
                );
                break;

            case "blockquote":
                if (this.props.blockquote === false) {
                    component = children;
                    break;
                }

                component = (
                    <blockquote
                        key={key}
                        className={this.props.classes.blockquote}>
                        <FontAwesomeIcon
                            className={this.props.classes.quoteopen}
                            icon="quote-left"
                        />
                        {this.renderText(children)}
                        <FontAwesomeIcon
                            className={this.props.classes.quoteclose}
                            icon="quote-right"
                        />
                    </blockquote>
                );
                break;

            case "list":
                if (this.props.list === false) {
                    component = children;
                    break;
                }

                if (node.ordered) {
                    component = (
                        <ol key={key} className={this.props.classes.ol}>
                            {children}
                        </ol>
                    );
                } else {
                    component = (
                        <ul key={key} className={this.props.classes.ul}>
                            {children}
                        </ul>
                    );
                }
                break;

            case "listItem":
                if (this.props.list === false) {
                    component = children;
                    break;
                }

                if (node.checked === null) {
                    component = (
                        <li key={key} className={this.props.classes.li}>
                            {children}
                        </li>
                    );
                } else {
                    component = (
                        <li
                            key={key}
                            className={classnames(
                                this.props.classes.li,
                                node.checked
                                    ? this.props.classes.checked
                                    : this.props.classes.unchecked
                            )}>
                            <input
                                type="checkbox"
                                disabled
                                checked={node.checked}
                                className={this.props.classes.check}
                            />
                            {children}
                        </li>
                    );
                }
                break;

            case "linkReference":
                if (this.props.link === false) {
                    component = children;
                    break;
                }

                {
                    let definition = null;
                    let root: IENode | undefined = node;

                    do {
                        if (root?.children) {
                            definition = root.children.find((sub) => {
                                return (
                                    sub.type === "definition" &&
                                    sub.identifier === node.identifier
                                );
                            });
                        }
                        root = root?.parent;
                    } while (!Boolean(definition) && Boolean(root));

                    if (definition) {
                        component = (
                            <a
                                className={this.props.classes.a}
                                onClick={this.handleLinkClick}
                                id={definition.url}
                                href={definition.url}
                                key={key}
                                title={definition.title}>
                                {children}
                            </a>
                        );
                    } else {
                        component = (
                            <a
                                href="#/"
                                className={this.props.classes.a}
                                id={node.url}
                                key={key}
                                title={node.label}>
                                {children}
                            </a>
                        );
                    }
                    break;
                }

            case "table":
                if (this.props.table === false) {
                    component = children;
                    break;
                }
                component = (
                    <table key={key} className={this.props.classes.table}>
                        <thead className={this.props.classes.thead}>
                            {this.renderText(children?.shift())}
                        </thead>
                        <tbody className={this.props.classes.tbody}>
                            {this.renderText(children)}
                        </tbody>
                    </table>
                );
                break;

            case "tableRow":
                if (this.props.table === false) {
                    component = children;
                    break;
                }
                if (index === 0) {
                    component = (
                        <tr key={key} className={this.props.classes.tr}>
                            {this.renderText(children)}
                        </tr>
                    );
                } else {
                    component = (
                        <tr key={key} className={this.props.classes.tr}>
                            {this.renderText(children)}
                        </tr>
                    );
                }
                break;

            case "tableCell":
                if (this.props.table === false) {
                    component = children;
                    break;
                }
                let align = node?.parent?.parent?.align ? [index] : "left";
                let style = { textAlign: align as TableAlignT };
                if (node?.parent?.index === 0) {
                    component = (
                        <th
                            style={style}
                            key={key}
                            className={this.props.classes.th}>
                            {this.renderText(children)}
                        </th>
                    );
                } else {
                    component = (
                        <td
                            style={style}
                            key={key}
                            className={this.props.classes.td}>
                            {this.renderText(children)}
                        </td>
                    );
                }
                break;

            case "delete":
                if (this.props.strike === false) {
                    component = children;
                    break;
                }
                component = (
                    <del key={key} className={this.props.classes.del}>
                        {children}
                    </del>
                );
                break;

            case "code":
                component = (
                    <SyntaxHighlighter
                        key={key}
                        language={node.lang}
                        wrapLines={true}
                        lineProps={this.state.codeLineProps}
                        {...this.state.codeStyles}
                        style={
                            this.props.theme.palette.type === "light"
                                ? xcode
                                : dracula
                        }>
                        {node.value}
                    </SyntaxHighlighter>
                );
                break;

            case "image":
                if (this.props.image === true) {
                    component = (
                        <img
                            key={key}
                            src={node.url}
                            alt={node.alt}
                            title={node.title}
                            className={this.props.classes.img}
                        />
                    );
                } else {
                    component = children;
                }
                break;

            case "imageReference":
                if (this.props.image === true) {
                    let definition = null;
                    let root: IENode | undefined = node;

                    do {
                        if (root?.children) {
                            definition = root.children.find((sub) => {
                                return (
                                    sub.type === "definition" &&
                                    sub.identifier === node.identifier
                                );
                            });
                        }
                        root = root?.parent;
                    } while (!Boolean(definition) && Boolean(root));

                    if (definition) {
                        component = (
                            <img
                                className={this.props.classes.img}
                                src={definition.url}
                                alt={node.alt}
                                key={key}
                                title={definition.title}
                            />
                        );
                    } else {
                        component = children;
                    }
                } else {
                    component = children;
                }
                break;

            default:
                component = children;
                break;
        }

        if (
            Boolean(parent) &&
            (parent!.type === "table" || parent!.type === "paragraph")
        ) {
            newline = false;
        } else if (
            Boolean(prev) &&
            prev!.position!.end!.line <= node!.position!.start!.line - 2
        ) {
            newline = true;
        }

        if (newline) {
            component = (
                <React.Fragment key={key}>
                    <br className={this.props.classes.break} />
                    {component}
                </React.Fragment>
            );
        }

        if (typeof component in ["string", "array"]) {
            return <React.Fragment key={key}>{component}</React.Fragment>;
        }

        if (component == null) {
            return <React.Fragment key={key}>{null}</React.Fragment>;
        }

        return component as JSX.Element;
    }

    public static defaultProps = {
        children: "",
    };

    static getDerivedStateFromProps(props: IMProps, prevState: IMState) {
        if (props.children !== prevState.source) {
            let state = {} as IMState;
            state.parsed = [];
            state.source = props.children as string;
            if (state.codeStyles) {
                return state;
            }
            state.codeStyles = { className: props.classes.code };
            state.codeLineProps = {
                className: props.classes.codeLine,
            };

            return state;
        }
        return null;
    }

    renderText(
        content: string | JSX.Element | JSX.Element[] | null | undefined
    ) {
        if (typeof content === "string") {
            return (
                <Highlight
                    markers={this.props.highlight || []}
                    onClick={this.handleHighlightClick}>
                    {escapeHtml(content)}
                </Highlight>
            );
        }

        return content;
    }

    handleLinkClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        e.preventDefault();
        e.stopPropagation();
        let anchor = e.currentTarget;
        window.open(anchor.href, "_blank")?.focus();
    }

    handleHighlightClick(e: React.MouseEvent, node: IHighlighted) {
        if (this.props.onHighlightClick) {
            this.props.onHighlightClick(e, node);
        }
    }

    shouldComponentUpdate(nextProps: IMProps, nextState: IMState) {
        if (nextProps.children != this.props.children) {
            return true;
        }
        return false;
    }

    render() {
        const { children } = this.props;
        if (typeof children == "string") {
            const parser = new Parser(children);
            const parsed = parser.parse() as IENode;
            return this.process(parsed);
        }
        return children;
    }
}

export default withStyles(
    (theme: any) => ({
        a: {
            textDecoration: "none",
            color: theme.palette.primary["A400"],
            "&:visited": {
                textDecoration: "none",
                color:
                    theme.palette.type === "light"
                        ? theme.palette.primary["A400"]
                        : theme.palette.primary[100],
            },
        },
        table: {
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: theme.palette.grey[400],
            borderCollapse: "collapse",
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        check: {
            top: 2,
            position: "relative",
            marginRight: 4,
        },
        /**
	code:{
		padding: theme.spacing(1),
		marginTop: theme.spacing(1),
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: theme.palette.grey[400],
		marginBottom: theme.spacing(1),
		borderRadius: theme.spacing(0.5),
	},
	 **/
        checked: {},
        unchecked: {},
        tr: {
            "&:nth-child(even)": {},
        },
        thead: {},
        tbody: {},
        th: {
            paddingTop: theme.spacing(1.5),
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
            paddingBottom: theme.spacing(1.5),
            fontSize: theme.typography.fontSize,
        },
        h1: {
            margin: "0rem",
        },
        h2: {
            margin: "0rem",
        },
        h3: {
            margin: "0rem",
        },
        h4: {
            margin: "0rem",
        },
        h5: {
            margin: "0rem",
        },
        h6: {
            margin: "0rem",
        },
        codeLine: {
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
        },
        html: {},
        td: {
            paddingTop: theme.spacing(1.5),
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
            paddingBottom: theme.spacing(1.5),
            borderTopWidth: 1,
            borderTopStyle: "solid",
            borderTopColor: theme.palette.grey[400],
        },
        img: {
            position: "relative",
            verticalAlign: "middle",
            maxHeight: theme.spacing(20),
        },
        ul: {
            marginTop: "0.1rem",
            paddingTop: "0rem",
            paddingLeft: "1rem",
            marginBottom: "0rem",
            paddingBottom: "0rem",
        },
        ol: {
            paddingTop: theme.spacing(1),
            marginBottom: "0rem",
            paddingBottom: theme.spacing(1),
        },
        code: {
            padding: theme.spacing(1),
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: theme.palette.grey[400],
            borderRadius: theme.spacing(0.5),
            backgroundColor: theme.palette.grey[50],
        },
        inlineCode: {
            borderWidth: 1,
            borderStyle: "solid",
            paddingLeft: 2,
            paddingRight: 2,
            borderColor: theme.palette.grey[400],
            borderRadius: theme.spacing(0.5),
            backgroundColor:
                theme.palette.type === "light"
                    ? theme.palette.grey[50]
                    : undefined,
        },
        paragraph: {
            marginTop: 0,
            marginBottom: 0,
        },
        quoteopen: {
            marginRight: theme.spacing(1),
        },
        quoteclose: {
            marginLeft: theme.spacing(1),
        },
        blockquote: {
            fontStyle: "italic",
            marginTop: "0rem",
            marginLeft: "0rem",
            marginBottom: "0rem",
            paddingTop: theme.spacing(1),
            paddingLeft: theme.spacing(2),
            paddingBottom: theme.spacing(1),
        },
    }),
    { withTheme: true }
)(Markdown);
