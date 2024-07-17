import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// material-ui
import {
    Grid,
    TextField,
    FormHelperText,
    Button,
    Stack
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'store';
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import axios from 'utils/axios';
import useAuth from 'hooks/useAuth';

// assets

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

/**
 * 'Enter your email'
 * yup.string Expected 0 arguments, but got 1 */
const validationSchema = yup.object({
    name: yup.string()
        .required('Group name is required')
        .min(3, 'Group name must be at least 3 characters')
        .max(24, 'Group name must not exceed 24 characters'),
});

// ==============================|| Columns Layouts ||============================== //
function GroupDetails() {
    const { id } = useParams();
    const { logout } = useAuth();
    const [groupDetails, setGroupDetails] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await axios.get('studentGroup/getStudentGroup?id=' + id, { withCredentials: true });

            setGroupDetails(response.data);
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
            navigate('/group/group-list', { replace: true });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            name: groupDetails?.groupName ?? ''
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                values.id = groupDetails?.id
                values.status = true

                await axios.post('studentGroup/update', values, { withCredentials: true });

                setIsLoading(true)
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
                setTimeout(() => {
                    navigate('/group/group-list', { replace: true });
                }, 1300);
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
                navigate('/group/group-list', { replace: true });
            } finally {
                // Reset form state after submission (if needed)
                setSubmitting(false);
            }
        }
    });

    // Watch for groupDetails changes since api returns is slower than initial rendering
    useEffect(() => {
        if (groupDetails) {
            formik.setValues({
                name: groupDetails.groupName || ''
            });
        }
    }, [groupDetails]);

    return (
        <MainCard title="Group Details">
            {
                !isLoading ?
                    groupDetails ?
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} lg={6}>
                                    <InputLabel>Name</InputLabel>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter group name"
                                        id="name"
                                        name="name"
                                        label="Group Name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        error={formik.touched.name && Boolean(formik.errors.name)}
                                        helperText={formik.touched.name && formik.errors.name}
                                    />
                                    <FormHelperText>Please enter name</FormHelperText>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction="row" justifyContent="flex-end">
                                        <AnimateButton>
                                            <Button variant="contained" type="submit">
                                                Verify & Submit
                                            </Button>
                                        </AnimateButton>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </form>
                        : <></>
                    : <CustomSkeleton />
            }
        </MainCard>
    );
}

export default GroupDetails;
