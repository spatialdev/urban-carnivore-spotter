import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

const showButton = (buttonProps) => buttonProps && buttonProps.onClick && buttonProps.message;

const FormInfoDialog = (props) => {
    const { open, onClose, message, noButton, yesButton } = props;
    return <Dialog
        open={open}
        onClose={onClose}
    >
        <DialogContent>
            <DialogContentText>
                { message }
            </DialogContentText>
        </DialogContent>
        { showButton(noButton) || showButton(yesButton) ?
            <DialogActions>
                { showButton(noButton) ?
                    <Button onClick={noButton.onClick} color="primary">
                        {noButton.message}
                    </Button>: null }
                { showButton(yesButton) ?
                    <Button onClick={yesButton.onClick} color="primary">
                        {yesButton.message}
                    </Button>: null }
            </DialogActions> : null
        }
    </Dialog>
};

export default FormInfoDialog;