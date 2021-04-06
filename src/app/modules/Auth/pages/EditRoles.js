/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from 'react'
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Grid, Card, CardContent, FormControlLabel, Switch } from "@material-ui/core/";
import { editRole, getRoleById, disableRole, enableRole } from "../_redux/authCrud";
import * as swal from "../../Common/components/SweetAlert";
import SaveButton from "../../Common/components/Buttons/SaveButton";
import FormikTextField from "../../_FormikUseFormik/components/FormikTextField"

function EditRoles(props) {

	const [state, setState] = React.useState({
		checkedA: false,
	});
	const [dataRole, setDataRole] = React.useState({ roleName: "" })
	let { id } = useParams();
	var roleId = id;

	const history = useHistory();

	React.useEffect(() => {
		handleGet(roleId)
	}, [roleId])

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
			roleName: dataRole.roleName,
			checkedA: ""
		},
		onSubmit: (values, { setSubmitting, resetForm }) => {
			handleSave({ setSubmitting, resetForm }, values);
		},
	});

	const handleChange = (event) => {
		setState({ ...state, [event.target.name]: event.target.checked });

		if (event.target.checked) {
			enableRole(roleId)
				.then((res) => {
					if (res.data.isSuccess) {

						// alert("ok true")
						return true;
					} else {


						swal.swalError("Error", res.data.message);
					}
				})
				.catch((error) => {
					swal.swalError("Error", error.message);
				});

		} else if (event.target.checked === false) {

			disableRole(roleId)
				.then((res) => {
					if (res.data.isSuccess) {

						// alert("ok false")
						return true;
					} else {


						swal.swalError("Error", res.data.message);
					}
				})
				.catch((error) => {
					swal.swalError("Error", error.message);
				});

		} else {
			swal.swalError("Error", "Status Undefined");

		}
	};

	const handleGet = (id) => {
		getRoleById(id)
			.then((res) => {
				if (res.data.isSuccess) {

					setDataRole({ ...dataRole, roleName: res.data.data[0].roleName });
					setState({ ...state, checkedA: res.data.data[0].isActive })

				} else {
					swal.swalError("Error", res.data.message);
				}
			})
			.catch((err) => {
				//network error
				swal.swalError("Error", err.message);
			});
	}

	const handleSave = ({ setSubmitting, resetForm }, values) => {

		let playload = {
			roleName: values.roleName
		}
		editRole(roleId, playload)
			.then((res) => {
				if (res.data.isSuccess) {
					setSubmitting(false);
					swal.swalSuccess("Success", `success.`).then(() => {
						history.push("/User/RoleTable");
					});

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
							<FormikTextField
								formik={formik}
								name="roleName"
								label="Role Name"
							/>
						</Grid>
						<Grid item xs={12} lg={3}>

							<FormControlLabel control={<Switch checked={state.checkedA} onChange={handleChange} name="checkedA" />} label={state.checkedA === true ? "ใช้งาน" : "ยกเลิก"} />
						</Grid>
						<Grid item xs={12} lg={3} >
							<SaveButton type="submit" color="primary" fullWidth variant="contained" style={{ marginTop: 10 }}>Save</SaveButton>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</form>
	)
}

export default EditRoles
