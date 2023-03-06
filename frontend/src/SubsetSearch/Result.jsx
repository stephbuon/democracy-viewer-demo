
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { TableBody, TableHead, FormControl, MenuItem, Select, InputLabel, TableRow, TableCell } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";

export const Result = (props) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigate = useNavigate();

    const [keys] = useState(props.result.keys());

    useEffect(() => {
    }, []);

    return <div>

        <Box onClick={() => handleOpen()}>
            {props.result}
        </Box>
        <Modal
            open={open}
            onClose={() => handleClose()}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '15%',
                    left: '15%',
                    height: "70%",
                    overflow: "scroll",
                    width: "70%",
                    bgcolor: 'background.paper',
                    border: '1px solid #000',
                    borderRadius: ".5em .5em"
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {props.dataset.title}
                            </TableCell>
                            <TableCell>
                                &nbsp;
                            </TableCell>
                            <TableCell>
                                &nbsp;
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {keys.map((key) => {
                            return <TableRow id={key}>

                            </TableRow>
                        })}
                    </TableBody>
                </Table>
                {/* <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '2em'
                    }}>
                    <Button
                        variant="contained"
                        primary
                        sx={{

                        }}
                        onClick={() => {
                            chooseDataset()
                            navigate('/subsetSearch');
                        }}
                    >
                        Use Dataset
                    </Button>
                </Box> */}

            </Box>
        </Modal>

    </div>
}