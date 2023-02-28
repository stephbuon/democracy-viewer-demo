import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";

//MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import { TableBody, TableHead, FormControl, MenuItem, Select, InputLabel, TableRow, TableCell } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


//Other Imports
import './AdvancedFilter.css'

export const AdvancedFilter = (props) => {
    const navigate = useNavigate();
    const params = useParams()

    //values
    // const [searchTerm, setSearchTerm] = useState('');
    const [title, setTitle] = useState('');
    const [username, setUsername] = useState('');
    const [publicPrivate, setPublicPrivate] = useState(true);
    const [totalTags, setTotalTags] = useState([]);
    const [description, setDescription] = useState('');

    const filterResults = () => {
        let tags = ''
        for (let tag in totalTags) {
            tags += `&tag=${tag}`;
        }
        let filter = {
            title: title ? title : '',
            description: description ? description : '',
            username: username ? username : '',
            type: publicPrivate ? 'public' : 'private',
            tags: tags
        }
        props.advancedFilterResults(filter);

    }

    const loggedIn = () => {
        //check if user is logged in
        //for now will return false since system is not hooked up
        return false;
    }


    useEffect(() => {

    }, []);


    return (
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
                        <TableCell
                            sx={{
                                textAlign: 'center'
                            }}>
                            <h2>Advanced Filter</h2>
                        </TableCell>
                    </TableRow>
                </TableHead>
            </Table>
            <Table 
            sx={{
                
            }}>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            Dataset Title:
                        </TableCell>
                        <TableCell>
                            <TextField
                                id="Title"
                                label="Title"
                                variant="filled"
                                sx={{
                                    background: 'rgb(255, 255, 255)',
                                    color: 'rgb(0, 0, 0)'
                                }}
                                value={title}
                                onChange={event => { setTitle(event.target.value) }}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Dataset Description:
                        </TableCell>
                        <TableCell>
                            <TextField
                                id="Description"
                                label="Description"
                                variant="filled"
                                sx={{
                                    background: 'rgb(255, 255, 255)',
                                    color: 'rgb(0, 0, 0)'
                                }}
                                value={description}
                                onChange={event => { setDescription(event.target.value) }}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Dataset Owner:
                        </TableCell>
                        <TableCell>
                            <TextField
                                id="Owner"
                                label="Owner"
                                variant="filled"
                                sx={{
                                    background: 'rgb(255, 255, 255)',
                                    color: 'rgb(0, 0, 0)'
                                }}
                                value={username}
                                onChange={event => { setUsername(event.target.value) }}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Privacy:
                        </TableCell>
                        <TableCell>
                            <FormControl>
                                <Select
                                    value={publicPrivate}
                                    onChange={event => setPublicPrivate(event.target.value)}
                                    sx={{
                                        background: 'rgb(255, 255, 255)',
                                        color: 'rgb(0, 0, 0)'
                                    }}
                                >
                                    <MenuItem value={true}>Public</MenuItem>
                                    <MenuItem value={false} >Private</MenuItem>{/*onClick={() => openSnackbar()} MAY NEED THIS IN FUTURE*/}
                                </Select>
                            </FormControl>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Tags:
                        </TableCell>
                        <TableCell>
                            <FormControl sx={{ m: 1, width: 300 }}>
                                {/* <InputLabel id="tag-checkbox-label">Tag</InputLabel>
                                <Select
                                    labelId="tag-checkbox-label"
                                    id="tag-checkbox"
                                    multiple
                                    value={personName}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Tag" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                >
                                    {names.map((name) => (
                                        <MenuItem key={name} value={name}>
                                            <Checkbox checked={personName.indexOf(name) > -1} />
                                            <ListItemText primary={name} />
                                        </MenuItem>
                                    ))}
                                </Select> */}
                            </FormControl>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            &nbsp;
                        </TableCell>
                        <TableCell>
                            <Button
                                variant="contained"
                                primary
                                // sx={{
                                //     background: 'rgb(255, 255, 255)',
                                //     color: 'rgb(0, 0, 0)',
                                //     '&:hover': {
                                //         background: 'rgb(200, 200, 200)'
                                //     }
                                // }}
                                onClick={() => filterResults()}
                            >
                                Apply Filters
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Box>
    )

}