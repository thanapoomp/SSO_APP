import React from 'react'
import { useFormik } from "formik";
import { Grid, TextField, Card, CardContent, CardActions } from "@material-ui/core/";
import FormikCheckBoxGroup from "../../../modules/_FormikUseFormik/components/FormikCheckBoxGroup";
import SaveButton from "../../../modules/Common/components/Buttons/SaveButton";
import { getRole, addRolesGroup } from "../_redux/authCrud";
import * as swal from "../../Common/components/SweetAlert";

function AddGroupRoleTeamPage() {

	const [role, setRole] = React.useState([]);

	React.useEffect(() => {
		loadRole();
	}, [])

	const validateLastName = (input) => {

		return input.charAt(0) === input.charAt(0).toUpperCase()
	}

	const formik = useFormik({
		enableReinitialize: true,
		validate: (values) => {
			const errors = {};
			if (!values.roleGroupName) {
				errors.roleGroupName = "required";
			}

			if (!validateLastName(values.roleGroupName)) {
				errors.roleGroupName = "First Upper Case";
			}

			return errors;
		},
		initialValues: {
			roleGroupName: "",
			rolesId: []
		},
		onSubmit: (values, { setSubmitting, resetForm }) => {
			handleSave({ setSubmitting, resetForm }, values);
		},
	});

	const handleSave = ({ setSubmitting }, values) => {

		addRolesGroup(values.roleGroupName, values.rolesId)
			.then((res) => {
				if (res.data.isSuccess) {
					setSubmitting(false);
					swal.swalSuccess("Success", `success.`);
				} else {

					swal.swalError("Error", res.data.message);
				}
			})
			.catch((err) => {
				swal.swalError("Error", err.message);
			});

	}

	const loadRole = () => {
		getRole()
			.then((res) => {
				if (res.data.isSuccess) {

					setRole(res.data.data);
				} else {
					alert(res.data.message);
				}
			})
			.catch((err) => {
				alert(err.message);
			})
			.finally(() => {
			})
	};
	return (
		<form onSubmit={formik.handleSubmit}>
			<Card>
				<CardContent>
					<Grid container spacing={3}>
						<Grid item xs={12} lg={3}>
							<TextField
								name="roleGroupName"
								label="Role Group Name"
								required
								fullWidth
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								value={formik.values.roleGroupName}
								error={(formik.errors.roleGroupName && formik.touched.roleGroupName)}
								helperText={(formik.errors.roleGroupName && formik.touched.roleGroupName) && formik.errors.roleGroupName}
							/>
						</Grid>
						<CardActions>
							<SaveButton
								fullWidth
								size="medium"
								type="submit"
								onClick={formik.handleSubmit}
								color="primary"
							>
								Save
                    			</SaveButton>
						</CardActions>
					</Grid>
				</CardContent>
			</Card>
			<Card style={{ marginTop: 10 }}>
				<CardContent>
					<Grid container
						direction="column"
						justify="center"
						alignItems="flex-start"
						spacing={3}>
						<Grid item xs={12} lg={2}>
							<FormikCheckBoxGroup
								formik={formik}
								required
								name="rolesId"
								label=""
								displayFieldName="roleName"
								data={role}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</form>
	)
}

export default AddGroupRoleTeamPage
