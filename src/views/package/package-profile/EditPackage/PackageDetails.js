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
import { useDispatch } from 'store';
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import { openSnackbar } from 'store/slices/snackbar';
import useAuth from "hooks/useAuth";
import axios from 'utils/axios';

// assets

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

/**
 * 'Enter your email'
 * yup.string Expected 0 arguments, but got 1 */
const validationSchema = yup.object({
    name: yup.string()
        .required('Package name is required')
        .min(4, 'Package name must be at least 3 characters')
        .max(24, 'Package name must not exceed 24 characters'),
    price: yup.number()
        .required('Package price is required')
        .typeError('Price number must be a number')
        .positive('Price number is invalid')
        .min(1, "minimum 1")
        .max(999, "maximum 999"),
    slot: yup.number()
        .required('Package class is required')
        .typeError('Package class must be a number')
        .integer("Package class must be an integer")
        .positive('Package class is invalid')
        .min(1, "minimum 1")
        .max(999, "maximum 999"),
    expiry_days: yup.number()
        .required('Package expiry days is required')
        .typeError('Package expiry days must be a number')
        .integer("Package class must be an integer")
        .positive('Package expiry days is invalid')
        .min(1, "minimum 1")
        .max(999, "maximum 999"),
});

// ==============================|| Columns Layouts ||============================== //
function PackageDetails() {
    const { logout } = useAuth();
    const { id } = useParams();
    const [packageDetails, setPackageDetails] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await axios.get('package/' + id, { withCredentials: true });

            setPackageDetails(response.data);
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
            navigate('/package/package-list', { replace: true });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            name: packageDetails?.name || '',
            price: packageDetails?.price || 1,
            slot: packageDetails?.slot || 0,
            expiry_days: packageDetails?.expiry_days || 1
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await axios.put('package/' + id, values, { withCredentials: true });

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
                    navigate('/package/package-list', { replace: true });
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
                navigate('/package/package-list', { replace: true });
            } finally {
                // Reset form state after submission (if needed)
                setSubmitting(false);
            }
        }
    });

    // Watch for packageDetails changes since api returns is slower than initial rendering
    useEffect(() => {
        if (packageDetails) {
            formik.setValues({
                name: packageDetails.name || '',
                price: packageDetails.price || 1,
                slot: packageDetails.slot || 0,
                expiry_days: packageDetails.expiry_days ?? 1,
            });
        }
    }, [packageDetails]);

    return (
        <MainCard title="Package Details">
            {
                !isLoading ?
                    packageDetails ?
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} lg={6}>
                                    <InputLabel>Name</InputLabel>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter package name"
                                        id="name"
                                        name="name"
                                        label="Package Name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        error={formik.touched.name && Boolean(formik.errors.name)}
                                        helperText={formik.touched.name && formik.errors.name}
                                    />
                                    <FormHelperText>Please enter name</FormHelperText>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <InputLabel>Price</InputLabel>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter package price"
                                        id="price"
                                        name="price"
                                        label="Package Price"
                                        value={formik.values.price}
                                        onChange={formik.handleChange}
                                        error={formik.touched.price && Boolean(formik.errors.price)}
                                        helperText={formik.touched.price && formik.errors.price}
                                    />
                                    <FormHelperText>Please enter price</FormHelperText>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <InputLabel>Class Count</InputLabel>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter package class count"
                                        id="slot"
                                        name="slot"
                                        label="Package Class Count"
                                        value={formik.values.slot}
                                        onChange={formik.handleChange}
                                        error={formik.touched.slot && Boolean(formik.errors.slot)}
                                        helperText={formik.touched.slot && formik.errors.slot}
                                    />
                                    <FormHelperText>Please enter class count</FormHelperText>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <InputLabel>Expiry Days</InputLabel>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter package expiry days"
                                        id="expiry_days"
                                        name="expiry_days"
                                        label="Package Expiry Days"
                                        value={formik.values.expiry_days}
                                        onChange={formik.handleChange}
                                        error={formik.touched.expiry_days && Boolean(formik.errors.expiry_days)}
                                        helperText={formik.touched.expiry_days && formik.errors.expiry_days}
                                    />
                                    <FormHelperText>Please enter expiry days</FormHelperText>
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

export default PackageDetails;
