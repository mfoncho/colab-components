import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import PostInput from "../PostInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useInput } from "@colab/utils";

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
    },
    preview: {
        flexGrow: 1,
        display: "flex",
        padding: theme.spacing(1),
        marginTop: theme.spacing(1),
        borderRadius: theme.spacing(1),
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: theme.palette.primary.light,
    },
    meta: {
        flex: 1,
        paddingTop: theme.spacing(1),
    },
    media: {
        maxHeight: 256,
    },
    icon: {
        color: theme.palette.primary.main,
    },
    content: {
        display: "flex",
        paddingTop: 24,
        flexDirection: "column",
    },
}));

let puid = 0;

export interface IUploadFile {
    max: number;
    file: File;
    text?: string;
    title?: string;
    onUpload: (file: File) => void;
    onCancel: () => void;
    onChange: (payload: { text: string; file?: File }) => void;
    accept: string;
    placeholder?: string;
    multiline?: boolean;
}

export default React.memo((props: IUploadFile) => {
    const classes = useStyles();

    const name = useInput<string>("");

    let [type, setType] = useState<string>("");

    let [invalid, setInvalid] = useState<string | null>(null);

    let [icon, setIcon] = useState<any | null>(["fa file"]);

    let [src, setSource] = useState<string | null>(null);

    let [extension, setExtension] = useState<string>("");

    useEffect(() => {
        puid++;
        if (props.file) {
            let src: string | null = null;
            let icon: Array<string> = ["fa file"];
            let invalid: string | null = "";
            let extension = "";

            let file = props.file;

            let type = file.type.split("/")[0];

            if (file.name.includes(".")) {
                extension = file.name.split(".").pop()!;
            }

            if (type === "image" || type === "video") {
                src = URL.createObjectURL(file);
            } else if (extension === "webm") {
                type = "video";
                src = URL.createObjectURL(file);
            } else {
                type = "icon";
                icon = ["fa", "file"];
            }

            if (file.size / 1000 > props.max) {
                invalid = `File too large max of ${props.max}KB allowed`;
            } else if (
                extension.trim() === "" ||
                !props.accept.split(",").includes(`.${extension}`)
            ) {
                invalid = "Invalid file extension";
            } else {
                invalid = null;
            }

            name.setValue(() => {
                const parts = file.name.split(".");
                return parts.slice(0, parts.length - 1).join(".") as string;
            });

            setType(type);

            setIcon(icon);

            setSource(src);

            setInvalid(invalid);

            setExtension(extension);

            if (src) {
                return () => {
                    URL.revokeObjectURL(src as string);
                };
            }
        }
    }, [props.file]);

    function handleUploadFile() {
        const file = new File(
            [props.file.slice()] as any,
            `${name.value}.${extension}`,
            { type: props.file.type }
        );
        props.onUpload(file);
    }

    function handleCancelUpload() {
        props.onCancel();
    }

    return (
        <Dialog open fullWidth maxWidth="sm" scroll="paper">
            <DialogTitle className={classes.title}>{props.title}</DialogTitle>
            <DialogContent className={classes.content}>
                <PostInput
                    key={String(puid)}
                    value={props.text}
                    autoFocus={true}
                    passthrough={true}
                    multiline={props.multiline}
                    onChange={props.onChange}
                    placeholder={props.placeholder}
                />

                <div className={classes.preview}>
                    {type === "image" && (
                        <img
                            src={src!}
                            alt={props.file.name}
                            className={classes.media}
                        />
                    )}
                    {type === "video" && (
                        <video src={src!} className={classes.media} />
                    )}
                    {type === "icon" && (
                        <FontAwesomeIcon
                            size="10x"
                            icon={icon}
                            className={classes.icon}
                        />
                    )}
                </div>
                <div className={classes.meta}>
                    {Boolean(invalid) ? (
                        <Typography color="error">{invalid}</Typography>
                    ) : (
                        <TextField
                            label="Filename"
                            name="name"
                            variant="filled"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {extension}
                                    </InputAdornment>
                                ),
                            }}
                            {...name.props}
                        />
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelUpload}>cancel</Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUploadFile}
                    disabled={Boolean(invalid) || !name.valid}>
                    upload
                </Button>
            </DialogActions>
        </Dialog>
    );
});
