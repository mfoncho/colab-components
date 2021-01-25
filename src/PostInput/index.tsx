import React, { useState, useCallback, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import cls from "classnames";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import UploadDialog from "../UploadDialog";
import { Picker as EmojiPicker } from "@colab/emoji";
import {
    MultilineIcon,
    PostMessageIcon,
    FileIcon,
    EmojiIcon,
} from "@colab/icons";
import { useInput } from "@colab/utils";
import Tooltip from "../Tooltip";

export interface IPostInputState {
    text: string;
    file?: File;
}

export interface IMessagePost {
    text: string;
    file?: File;
}

export interface IUpload {
    max: number;
    accept: string;
}

export interface IPostInput {
    onChange?: (state: IPostInputState) => void;
    onSubmit?: (state: IMessagePost) => void;
    value?: string;
    // SOR is acronym for
    // Submit On Return
    rows?: number;
    multiline?: boolean;
    upload?: IUpload;
    autoFocus?: boolean;
    placeholder?: string;
    disabled?: boolean;
    passthrough?: boolean;
}

const useClasses = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        borderStyle: "solid",
        borderRadius: theme.shape.borderRadius,
        borderWidth: theme.spacing(0.2),
        borderColor: theme.palette.divider,
    },
    extra: {
        display: "flex",
        paddingTop: theme.spacing(1),
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    form: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: theme.spacing(0.5),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingBottom: theme.spacing(0.5),
    },
    footer: {},
    button: {
        margin: theme.spacing(0, 0.5),
        borderRadius: theme.shape.borderRadius,
    },
    svgIcon: {
        width: "1.2rem",
        height: "1.2rem",
    },
    active: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: (theme.palette.primary as any)["A700"],
        },
    },
    input: {
        flexGrow: 1,
        fontSize: "0.98rem",
        padding: theme.spacing(2),
        //marginLeft: theme.spacing(1),
    },
    hidden: {
        display: "none",
    },
    menuItem: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    itemIcon: {
        marginRight: 0,
    },
    itemPrimary: {
        fontSize: "0.94rem",
    },
    menu: {
        display: "flex",
        flexDirection: "row",
    },
    actionsHighlight: {
        background: theme.palette.primary.main + "10",
    },
    actions: {
        display: "flex",
        padding: theme.spacing(0.5),
        flexDirection: "row",
        justifyContent: "space-between",
    },
}));

let gcid = 0;

const transformOrigin = {
    vertical: "top",
    horizontal: "right",
};

const anchorOrigin = {
    vertical: "bottom",
    horizontal: "right",
};

const useActionStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(0, 1),
        borderRadius: theme.shape.borderRadius,
    },
    active: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: (theme.palette.primary as any)["A700"],
        },
    },
    icon: {
        width: "1.2rem",
        height: "1.2rem",
    },
}));

interface IActionButton {
    boolean?: boolean;
    disabled?: boolean;
    component?: string;
    htmlFor?: string;
    tooltip?: string;
    icon: typeof MultilineIcon;
    highlight?: boolean;
    onClick?: (e: React.MouseEvent) => any;
}

const ActionButton = React.memo<IActionButton>((props) => {
    const classes = useActionStyles();
    const Icon = props.icon;

    const icon = (
        <IconButton
            size="small"
            onClick={props.onClick as any}
            htmlFor={props.htmlFor as any}
            component={props.component as any}
            disabled={props.disabled as any}
            className={cls(classes.button, props.highlight && classes.active)}>
            <Icon className={classes.icon} />
        </IconButton>
    );
    if (props.disabled) {
        return icon;
    }

    return (
        <Tooltip
            title={<Typography variant="subtitle2">{props.tooltip}</Typography>}
            placement="top">
            {icon}
        </Tooltip>
    );
});

export default React.memo<IPostInput>((props: IPostInput) => {
    const classes = useClasses();

    const [popup, setPopup] = useState<string | null>(null);

    const text = useInput(props.value || "");

    const [fid] = useState(`${gcid}`);

    const [files, setFiles] = useState<File[]>([]);

    const [accept, setAccept] = useState<string>("");

    const [Dialog, setDialog] = useState<any>(null);

    const [anchor, setAnchor] = useState<HTMLElement>();

    const [multiline, setMultiline] = useState<boolean>(false);

    const inputEl = useRef<HTMLInputElement>();

    const file = files.length > 0 ? files[0] : undefined;

    // Increament the global counter
    // id to prevent input elemnt
    // id collision
    useEffect(() => {
        gcid = gcid + 1;
    }, []);

    useEffect(() => {
        if (!Boolean(props.multiline)) {
            setMultiline(false);
        }
    }, [props.multiline]);

    useEffect(() => {
        if (props.upload?.accept) {
            setAccept(() => {
                return props
                    .upload!.accept.split(",")
                    .map((ext) => `.${ext.trim()}`)
                    .join(",");
            });
        }
    }, [props.upload?.accept]);

    useEffect(() => {
        if (text.value.trim() != "") {
            if (props.onChange) {
                props.onChange({ text: text.value, file });
            }
        }
    }, [text.value, file]);

    const trimedText = text.value.trim();

    const handleCloseDialog = useCallback(() => {
        setDialog(null);
    }, []);

    const handleOpenEmojiPopup = useCallback((e: any) => {
        setAnchor(e.target);
        setPopup("emoji");
    }, []);

    const toggleMultiline = useCallback(() => {
        if (props.multiline === false) {
            setMultiline(false);
        } else {
            setMultiline((value) => !value);
        }
    }, []);

    function handleCancelUpload() {
        const pending = [...files];
        pending.shift();
        setFiles(pending);
    }

    function handleSubmit() {
        if (trimedText.length > 0 && props.onSubmit) {
            props.onSubmit!({ text: trimedText });
            text.setValue("");
        }
    }

    function handleKeyPress(event: any) {
        if (event.key === "Enter" && !multiline) {
            event.preventDefault();
            event.stopPropagation();
            handleSubmit();
        }
    }

    function handleFileUpload(file: File) {
        props.onSubmit!({ text: trimedText, file });
        text.setValue("");
        setFiles((files) => files.slice(1, files.length));
    }

    function handleUploadInput(payload: { text: string }) {
        text.setValue(payload.text);
    }

    function insertAtCursor(value: any) {
        const { selectionStart, selectionEnd } = inputEl.current!;

        text.setValue(
            (text) =>
                `${text.slice(0, selectionStart!)}${value}${text.slice(
                    selectionEnd!
                )}` as string
        );
        // Queue focus to fire on next event loop pass
        // and dom reconcilation hopefully
        setTimeout(() => {
            inputEl.current!.focus();
            inputEl.current!.selectionEnd = selectionStart + value.length;
        }, 0);
    }

    function handleCloseMenu() {
        setPopup(null);
    }

    function handleEmojiInput(emoji: any) {
        insertAtCursor(emoji.native);
        handleCloseMenu();
    }

    function handleFileInput(event: any) {
        let files = [];
        for (let file of event.target.files) {
            files.push(file);
        }
        setFiles(files);
        setPopup(null);
    }

    return (
        <div className={classes.root}>
            {Dialog && <Dialog onClose={handleCloseDialog} />}

            <InputBase
                multiline={true}
                rowsMax={20}
                rows={props.rows}
                value={
                    props.passthrough && props.value ? props.value : text.value
                }
                inputRef={inputEl}
                disabled={props.disabled}
                className={classes.input}
                autoFocus={props.autoFocus}
                placeholder={props.placeholder}
                onKeyPress={handleKeyPress}
                onChange={text.onChange}
            />
            <div
                className={cls(
                    classes.actions,
                    Boolean(
                        props.passthrough && props.value
                            ? props.value
                            : text.value
                    ) && classes.actionsHighlight
                )}>
                <Box
                    display="flex"
                    alignItems="center"
                    flexDirection="row"
                    justifyContent="flexStart">
                    {props.multiline && (
                        <ActionButton
                            tooltip="Markdown/Multiline"
                            icon={MultilineIcon}
                            highlight={
                                multiline &&
                                Boolean(
                                    props.passthrough && props.value
                                        ? props.value
                                        : text.value
                                )
                            }
                            onClick={toggleMultiline}
                            disabled={props.disabled}
                        />
                    )}
                </Box>
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="flexEnd"
                    alignItems="center">
                    {props.upload && props.upload.max > 0 && (
                        <>
                            <ActionButton
                                icon={FileIcon}
                                tooltip="Attach File"
                                htmlFor={fid}
                                disabled={props.disabled}
                                component="label"
                            />
                            <input
                                id={fid}
                                type="file"
                                accept={accept}
                                multiple={true}
                                onChange={handleFileInput}
                                className={classes.hidden}
                            />
                        </>
                    )}

                    <ActionButton
                        tooltip="Emoji"
                        icon={EmojiIcon}
                        onClick={handleOpenEmojiPopup}
                        disabled={props.disabled}
                    />
                    {props.onSubmit && (
                        <ActionButton
                            tooltip="Post"
                            icon={PostMessageIcon}
                            onClick={handleSubmit}
                            disabled={props.disabled}
                            highlight={Boolean(file) || trimedText.length > 0}
                        />
                    )}
                </Box>
                {popup === "attachment" && (
                    <Popover
                        open={true}
                        onClose={handleCloseMenu}
                        anchorEl={anchor}
                        className={classes.menu}
                        anchorOrigin={anchorOrigin as any}
                        transformOrigin={transformOrigin as any}></Popover>
                )}
                {popup === "emoji" && (
                    <Popover
                        open={true}
                        onClose={handleCloseMenu}
                        anchorEl={anchor}
                        anchorOrigin={anchorOrigin as any}
                        transformOrigin={transformOrigin as any}>
                        <EmojiPicker
                            set="facebook"
                            onClick={handleEmojiInput}
                        />
                    </Popover>
                )}
                {!props.disabled && file && props.upload && (
                    <UploadDialog
                        title={"Upload file"}
                        max={props.upload.max}
                        file={file}
                        text={text.value}
                        accept={accept}
                        onChange={handleUploadInput}
                        onUpload={handleFileUpload}
                        onCancel={handleCancelUpload}
                        multiline={props.multiline}
                        placeholder={props.placeholder}
                    />
                )}
            </div>
        </div>
    );
});
