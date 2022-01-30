import { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function ViewCollection(props) {
    const [viewCollectionState, setViewCollectionState, following] = props.state;

    return (
        <>
            <Dialog open={viewCollectionState} onClose={() => setViewCollectionState(false)}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewCollectionState(false)}>Cancel</Button>
                    <Button onClick={() => setViewCollectionState(false)}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ViewCollection;
