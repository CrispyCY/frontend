// react
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Button, Card, Grid,
    // ListItemIcon, 
    // Menu,
    // MenuItem, 
    Typography,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// animation
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// project imports
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import axios from 'utils/axios';
import { gridSpacing } from 'store/constant';
import DropDownActions from './DropDownActions';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import useAuth from 'hooks/useAuth';

// assets
import DeleteIcon from '@mui/icons-material/Delete';

// ==============================|| SOCIAL PROFILE - FOLLOWER CARD ||============================== //

const ClassDetailsCard = () => {
    const theme = useTheme();
    const [classData, setClassData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const { logout } = useAuth();
    const dispatch = useDispatch();

    const fetchData = async () => {
        try {
            const response = await axios.get('class/list', { withCredentials: true });

            setClassData(response.data);
            setIsLoading(false)
        } catch (error) {
            if (error?.response?.status === 401) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Login Expired! Please re-login!',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: true
                    })
                );
                await logout();
            } else {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Error Occurred!',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: true
                    })
                );
            }
            console.log(error)
        }
    };

    useEffect(() => {
        fetchData(); // Call the API function when the component mounts
    }, []);

    function getDayName(day) {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Check if the input is a valid day number
        if (day >= 0 && day <= 6) {
            return daysOfWeek[day];
        } else {
            return 'Invalid day number';
        }
    }

    // Delete Process
    const [toDelete, setToDelete] = useState();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            await axios.post('class/delete?id=' + toDelete.id, { withCredentials: true });

            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Submit Success',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
        } catch (error) {
            if (error?.response?.status === 401) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Login Expired! Please re-login!',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: true
                    })
                );
                await logout();
            } else {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Error Occurred!',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: true
                    })
                );
            }
            console.log(error)
        } finally {
            // Reset form state after submission (if needed)
            handleCloseDialog()
            setTimeout(() => {
                fetchData()
            }, 1300);
        }
    };

    return (
        <>
            {
                !isLoading ? (
                    classData?.length ? (
                        <>
                            <Grid container spacing={gridSpacing}>
                                {Array.from(classData)?.map((classItem) => (
                                    <Grid item xs={12} md={6} key={classItem.id}>
                                        <Card
                                            sx={{
                                                padding: '16px',
                                                background:
                                                    theme.palette.mode === 'dark'
                                                        ? theme.palette.dark.main
                                                        : theme.palette.grey[50],
                                                border:
                                                    '1px solid',
                                                borderColor:
                                                    theme.palette.mode === 'dark'
                                                        ? theme.palette.dark.main
                                                        : theme.palette.grey[100],
                                                '&:hover': {
                                                    border: `1px solid${theme.palette.primary.main}`,
                                                },
                                            }}
                                        >
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs zeroMinWidth>
                                                            <Typography
                                                                variant="h3"
                                                                component="div"
                                                                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                                                            >
                                                                {classItem.name}
                                                            </Typography>
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{ mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                                                            >
                                                                <CalendarMonthIcon sx={{ mr: '6px', fontSize: '16px', verticalAlign: 'text-top' }} />
                                                                {getDayName(classItem.day)}
                                                            </Typography>
                                                        </Grid>
                                                        <DropDownActions prop={classItem} />
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button sx={{
                                                        color: theme.palette.error.main,
                                                        borderColor: theme.palette.error.main,
                                                        '&:hover': {
                                                            background: theme.palette.error.light + 25,
                                                            borderColor: theme.palette.error.main
                                                        }
                                                    }}
                                                        variant="outlined" fullWidth startIcon={<DeleteIcon />}
                                                        onClick={() => { handleClickOpen(); setToDelete(classItem) }}>
                                                        Delete
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            <Dialog
                                open={open}
                                TransitionComponent={Transition}
                                keepMounted
                                onClose={handleCloseDialog}
                                aria-labelledby="alert-dialog-slide-title1"
                                aria-describedby="alert-dialog-slide-description1"
                            >
                                {open && (
                                    <>
                                        <DialogTitle id="alert-dialog-slide-title1">Hold On...</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-slide-description1">
                                                <Typography variant="body2" component="span">
                                                    Are you sure to delete&nbsp;<Typography component="span" variant="subtitle1" color="secondary">
                                                        {toDelete.name}
                                                    </Typography>? This action cannot be undone.
                                                </Typography>
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions sx={{ pr: 2.5 }}>
                                            <Button
                                                sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                                                onClick={handleDelete}
                                                color="secondary"
                                            >
                                                OK
                                            </Button>
                                            <Button variant="contained" size="small" onClick={handleCloseDialog}>
                                                Cancel
                                            </Button>
                                        </DialogActions>
                                    </>
                                )}
                            </Dialog>
                        </>
                    ) : (
                        <Typography align="left" variant="subtitle1">
                            No Classes
                        </Typography>
                    )
                ) : (
                    <CustomSkeleton />
                )
            }
        </>
    );
};

ClassDetailsCard.propTypes = {
    avatar: PropTypes.string,
    follow: PropTypes.number,
    location: PropTypes.string,
    name: PropTypes.string
};

export default ClassDetailsCard;
