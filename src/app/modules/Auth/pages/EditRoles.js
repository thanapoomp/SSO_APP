/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from 'react'
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Grid, TextField, Card, CardContent } from "@material-ui/core/";
import { editRole } from "../_redux/authCrud";
import * as swal from "../../Common/components/SweetAlert";
import SaveButton from "../../Common/components/Buttons/SaveButton";

function EditRoles(props) {
	const authReducer = useSelector(({ auth }) => auth)
	var roleName = authReducer.editRoleName;
	var roleId = authReducer.editRoleId;

	const history = useHistory();

	React.useEffect(() => {
		debugger
		console.log(authReducer)
		if (!roleName) {
			if (!roleId) {

				history.push("/User/RoleTable");
			}
		}
	}, [authReducer.editRoleName])

	const formik = useFormik({
		enableReinitialize: true,
		validate: (values) => {
			const errors = {};
			if (!values.roleName) {
				errors.roleName = "required";
			}
			return errors;
		},
		initialValues: {
			roleName: authReducer.editRoleName,
		},
		onSubmit: (values, { setSubmitting, resetForm }) => {
			handleSave({ setSubmitting, resetForm }, values);
		},
	});

	const handleSave = ({ setSubmitting, resetForm }, values) => {
		debugger
		let playload = {
			roleName: values.roleName
		}
		editRole(roleId, playload)
			.then((res) => {
				if (res.data.isSuccess) {
					setSubmitting(false);
					swal.swalSuccess("Success", `success.`)
					history.push("/User/RoleTable");
					resetForm(true);
				} else {
					swal.swalError("Error", res.data.message);
				}
			})
			.catch((err) => {
				//network error
				swal.swalError("Error", err.message);
			});

	}

	return (
		<form onSubmit={formik.handleSubmit}>
			<Card>
				<CardContent>
					<Grid container spacing={3}>
						<Grid item xs={12} lg={3}>
							<TextField
								name="roleName"
								label="Role Name"
								required
								fullWidth
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								value={formik.values.roleName}
								error={(formik.errors.roleName && formik.touched.roleName)}
								helperText={(formik.errors.roleName && formik.touched.roleName) && formik.errors.roleName}
							/>
						</Grid>
						<Grid
							container
							direction="row"
							justify="center"
							alignItems="center"
						>
							<Grid item xs={12} lg={3} >
								<SaveButton type="submit" color="primary" fullWidth variant="contained" style={{ marginTop: 10 }}>Save</SaveButton>
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</form>
	)
}

export default EditRoles
