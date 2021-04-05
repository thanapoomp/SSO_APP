/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Grid, Card, CardActions, Typography } from '@material-ui/core';
import { assignRoles, getRole, getUserByCode, getRoleByUserId } from "../_redux/authCrud";
import FormikCheckBoxGroup from "../../../modules/_FormikUseFormik/components/FormikCheckBoxGroup";
import SaveButton from "../../../modules/Common/components/Buttons/SaveButton";
import * as swal from "../../Common/components/SweetAlert";
import { useFormik } from "formik";
import * as auth from "../_redux/authRedux";

function AssignRolesV2(props) {

	const authReducer = useSelector(({ auth }) => auth)
	var employeeCode = authReducer.employeeCode;
	var userGuid = authReducer.userGuid;


	const dispatch = useDispatch()
	const history = useHistory();
	const [role, setRole] = React.useState([]);
	const [userDetail, setUserDetail] = React.useState([]);

	React.useEffect(() => {
		console.log(authReducer);

		if (userGuid) {

			if (employeeCode) {

				loadRole();
				getRoleUserId(userGuid)
			} else {

				history.push("/User/UserTable");
			}

		} else {

			history.push("/User/UserTable");
		}
	}, [authReducer.employeeCode]);


	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			userId: `${employeeCode} ${userDetail.fullName}`,

			//default role user
			rolesId: [...authReducer.roleId]
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

		setSubmitting(false);
		assignRoles(userGuid, values.rolesId)
			.then((res) => {
				if (res.data.isSuccess) {
					swal.swalSuccess("Success", `success.`).then(() => {
						history.push("/User/UserTable");
					});;
				} else {
					swal.swalError("Error", res.data.message);
				}
			})
			.catch((err) => {
				swal.swalError("Error", err.message);
			})
			.finally(() => {

			});

	}

	const loadRole = () => {
		getRole()
			.then((res) => {
				if (res.data.isSuccess) {

					setRole(res.data.data);
					loadUserDetail(employeeCode)
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

	const loadUserDetail = (id) => {

		getUserByCode(id)
			.then((res) => {
				if (res.data.isSuccess) {
					// console.log("loadRole", res.data.data)
					setUserDetail({ ...userDetail, fullName: `${res.data.data.title}${res.data.data.firstName} ${res.data.data.lastName} แผนก : ${res.data.data.department}` });
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


	//โหลด default role user
	const getRoleUserId = (id) => {

		getRoleByUserId(id)
			.then((res) => {
				if (res.data.isSuccess) {
					let roles = []
					//forEach push roleId 
					res.data.data.forEach(element => {
						roles.push(element.roleId)
					});
					//save roleId redux
					dispatch(auth.actions.saveRoles(roles));
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
		<div>
			<Grid item xs={12} lg={12}>
				<Card style={{ overflow: 'auto', padding: 10 }}>
					<Typography variant="h6" component="h2">{userDetail.fullName}</Typography>
					<Grid
						container
						direction="row"
						justify="center"
						alignItems="center"
					>
						<Grid container spacing={1}>
							<Grid item xs={12} lg={1}>
								<FormikCheckBoxGroup
									formik={formik}
									name="rolesId"
									label=""
									displayFieldName="roleName"
									data={role}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={12} lg={12}>
						<Grid
							container
							direction="row"
							justify="center"
							alignItems="center"
						>
							<CardActions>
								<SaveButton
									fullWidth
									size="large"
									type="submit"
									onClick={formik.handleSubmit}
									color="primary"
								>
									Save
                    			</SaveButton>
							</CardActions>
						</Grid>
					</Grid>
				</Card>
			</Grid>
		</div >
	)
}

export default AssignRolesV2
