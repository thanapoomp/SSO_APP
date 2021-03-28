/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import * as CONST from "../../../../Constants";
import { Grid, Card, CardActions, Checkbox, FormControlLabel, Button } from '@material-ui/core';
import { assignRoles } from "../_redux/authCrud";
import FormikTextField from "../../../modules/_FormikUseFormik/components/FormikTextField";
import * as swal from "../../Common/components/SweetAlert";
import { useFormik } from "formik";

function AssignRolesV2(props) {
	const authReducer = useSelector(({ auth }) => auth)
	const history = useHistory();
	const api_get_role_url = `${CONST.API_URL}/Auth/role/get`;
	const [role, setRole] = useState([]);

	useEffect(() => {
		if (authReducer.edit.id !== 0) {

			loadRole();
		} else {

			history.push("/User/UserTable");
		}
	}, [authReducer.edit]);

	const loadRole = () => {
		//Load Role
		Axios.get(api_get_role_url)
			.then((res) => {
				if (res.data.isSuccess) {
					console.log("loadRole", res.data.data)
					setRole(res.data.data);
				} else {
					alert(res.data.message);
				}
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			userId: authReducer.edit,
			rolesId: []
		},
		validate: (values) => {
			const errors = {};

			return errors;
		},

		onSubmit: (values, { setSubmitting }) => {

			console.log(values)
			handleSave({ setSubmitting }, values);
		},
	});


	const handleSave = ({ setSubmitting }, values) => {
		debugger
		setSubmitting(false);
		assignRoles(values.userId, values.rolesId)
			.then((res) => {
				if (res.data.isSuccess) {
					swal.swalSuccess("Success", `success.`).then(() => {
						history.push("/User/UserTable");
					});;
				} else {
					alert(res.data.message);
				}
			})
			.catch((err) => {
				alert(err.message);
			})
			.finally(() => {

			});

	}

	return (
		<div>
			<Grid item xs={12} lg={6}>
				<Card style={{ overflow: 'auto', padding: 10 }}>
					<FormikTextField formik={formik} name="userId" label="userName" disabled />
					<Grid
						container
						direction="row"
						justify="center"
						alignItems="center"
					>
						<Grid container spacing={1}>
							{role.map((item) => (
								<Grid item key={item.id}>
									<FormControlLabel
										control={
											<Checkbox
												formik={formik}
												name="rolesId"
												checked={formik.values[props.name]}
												onChange={(e) => {
													let newValue = [...formik.values.rolesId];
													if (e.target.checked) {
														newValue.push(item.id);
													} else {
														const idx = newValue.indexOf(
															item.id
														);
														newValue.splice(idx, 1)
															;
													}
													formik.setFieldValue('rolesId', newValue)
												}}
												color="primary"
												inputProps={{ "aria-label": "primary checkbox" }}
											/>
										}
										label={item.roleName}
									/>
								</Grid>
							))}
						</Grid>
					</Grid>

					<Grid item xs={12} lg={12}>
						<Grid
							container
							direction="row"
							justify="flex-end"
							alignItems="center"
						>
							<CardActions>
								<Button variant="contained"
									className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
									type="submit"
									onClick={formik.handleSubmit}
									// disabled={isSubmitting}
									color="primary"
								// startIcon={<AddShoppingCartIcon style={{ color: blue[50] }} />}
								>
									Save
                    		</Button>

							</CardActions>
						</Grid>
					</Grid>
				</Card>
			</Grid>
		</div >
	)
}

export default AssignRolesV2
