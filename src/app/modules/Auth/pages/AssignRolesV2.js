/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import * as CONST from "../../../../Constants";
import { Grid, Card, Checkbox, FormControlLabel } from '@material-ui/core';
import { getUserById } from "../_redux/authCrud";
import FormikTextField from "../../../modules/_FormikUseFormik/components/FormikTextField";
import FormikCheckBox from "../../../modules/_FormikUseFormik/components/FormikCheckBox";
import { useFormik } from "formik";

function AssignRolesV2(props) {
	const authReducer = useSelector(({ auth }) => auth)
	const history = useHistory();
	const api_get_role_url = `${CONST.API_URL}/Auth/role/get`;
	const [role, setRole] = useState([])
	const [user, setUser] = useState([])
	const [isCheck, setisCheck] = useState(false)

	useEffect(() => {
		if (authReducer.edit !== 0) {
			getUser(authReducer.edit)
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

	const getUser = (id) => {
		//Load User
		getUserById(id)
			.then((res) => {
				if (res.data.isSuccess) {

					// res.data.data.forEach((element) => {
					// 	flatData.push(flatten(element));
					// });
					setUser(res.data.data);
					console.log("getUser", res.data.data);
				} else {
					alert(res.data.message);
				}
			})
			.catch((err) => {
				alert(err.message);
			})
			.finally(() => {
				// gggg();
			})
	};


	// const gggg = () => {
	// 	debugger
	// 	let objid = [];
	// 	user.map((item) => (
	// 		objid.push(item.roleId)
	// 	));

	// 	let ccc = role.filter(obj => obj.id !== objid)
	// 	setisCheck(ccc)
	// 	console.log("role.filter", role)

	// };

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			userName: authReducer.edit,
		},
		validate: (values) => {
			const errors = {};

			return errors;
		},

		onSubmit: (values, { setSubmitting }) => {

			props.submit(values);
			setSubmitting(false);
		},
	});

	const handleChange = (event) => {
		console.log(event.target.checked);
	};

	return (
		<div>
			<Grid
				container
				direction="row"
				justify="center"
				alignItems="center"
			>

				<Grid item xs={12} md={3} lg={6}>
					<Card style={{ height: 400, overflow: 'auto', padding: 10 }}>
						<FormikTextField formik={formik} name="userName" label="userName" disabled />
						<Grid container spacing={1}>
							{role.map((item) => (
								<Grid item key={item.id}>
									<FormControlLabel
										control={
											<Checkbox
												name={item.roleName}
												checked={isCheck}
												onChange={(e) => {
													let newValue = [];
													if (e.target.checked) {
													  newValue.push(item.id);
													} else {
													  const idx = newValue.indexOf(
														item.id
													  );
													  newValue.splice(idx, 1)
													  ;
													}
													// props.formik.setFieldValue(props.name, newValue)
													console.log(newValue);
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
					</Card>
				</Grid>
			</Grid>
			<br></br>
			{/* values: {JSON.stringify(formik.values)} */}
		</div >
	)
}

export default AssignRolesV2
