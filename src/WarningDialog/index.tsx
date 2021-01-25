import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Typography } from "@material-ui/core";

interface IDialog {
    text: string;
    loading?: boolean;
    disabled?: boolean;
    onClose: () => any | void;
    onConfirm: () => any | void;
}

export default React.memo<IDialog>(({ text, loading = false, ...props }) => {
    return (
        <Dialog open onClose={loading ? undefined : props.onClose}>
            <DialogContent>
                <Typography>{text}</Typography>
            </DialogContent>

            <DialogActions>
                <Button
                    color="primary"
                    onClick={props.onClose}
                    disabled={props.disabled || loading}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={props.onConfirm}
                    disabled={props.disabled || loading}
                    color="secondary">
                    {loading ? (
                        <CircularProgress size={24} color="primary" />
                    ) : (
                        "Confirm"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
});
