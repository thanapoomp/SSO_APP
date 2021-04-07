/* eslint-disable no-restricted-imports */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Grid, Card, CardActions, FormControlLabel, Switch, Button, CardContent, CardHeader, Typography } from '@material-ui/core';
import { assignRoles, getRole, getUserByCode, getRoleByUserId, getRoleGroup } from "../_redux/authCrud";
import FormikCheckBoxGroup from "../../../modules/_FormikUseFormik/components/FormikCheckBoxGroup";
import SaveButton from "../../../modules/Common/components/Buttons/SaveButton";
import * as swal from "../../Common/components/SweetAlert";
import Divider from '@material-ui/core/Divider';
import { useFormik } from "formik";
import * as auth from "../_redux/authRedux";

function AssignRolesV2(props) {

	const authReducer = useSelector(({ auth }) => auth)

	let { userGuid, employeeCode } = useParams();


	const dispatch = useDispatch()
	const history = useHistory();
	const [role, setRole] = React.useState([]);
	const [userDetail, setUserDetail] = React.useState([]);
	const [roleGroup, setRoleGroup] = React.useState([])
	const [roleD, setRoleD] = React.useState([])

	const [state, setState] = React.useState({
		checkedA: false,
	})

	React.useEffect(() => {
		getRoleGroup()
			.then((res) => {

				if (res.data.isSuccess) {

					setRoleGroup(res.data.data)
				} else {
					//internal error
					swal.swalError("Error", res.data.message);
				}
			}).catch((err) => {
				//physical error
				swal.swalError("Error", err.message);
			})
	}, [])

	React.useEffect(() => {

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
			// rolesId: [...roleD]

		},
		validate: (values) => {
			const errors = {};

			return errors;
		},

		onSubmit: (values, { setSubmitting }) => {


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
					});
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

	//load role ทั้งหมด จาก api
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

	//load full name
	const loadUserDetail = (id) => {

		getUserByCode(id)
			.then((res) => {
				if (res.data.isSuccess) {

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
			});
	};

	const handleGet = (id) => {
		if (roleGroup.length > 0) {
			//เช็ค id roleGroup ต้อง != 0
			if (roleGroup.id !== 0) {
				//fine หา roleId จาก roleGroup id
				let objRole = roleGroup.find(obj => obj.id === id);

				if (objRole !== null) {
					let objRoleId = [...authReducer.roleId]
					objRole.roleGroupDetail.forEach(element => {
						//push roleId
						objRoleId.push(element.role.id)
					});

					setRoleD(objRoleId);
					console.log("objRoleId", objRoleId)
					formik.setFieldValue('rolesId', [...objRoleId])
				}
			}
		}
	}

	//disable enable source
	const handleChange = (event) => {
		setState({ ...state, [event.target.name]: event.target.checked });

		// if (event.target.checked) {

		// 	enableUser(userGuid)
		// 		.then((res) => {
		// 			if (res.data.isSuccess) {

		// 				alert("true ok")
		// 				return true;
		// 			} else {

		// 				swal.swalError("Error", res.data.message);
		// 			}
		// 		})
		// 		.catch((error) => {
		// 			swal.swalError("Error", error.message);
		// 		});

		// } else if (event.target.checked === false) {

		// 	disableUser(userGuid)
		// 		.then((res) => {
		// 			if (res.data.isSuccess) {

		// 				alert("false ok")
		// 				return true;
		// 			} else {

		// 				swal.swalError("Error", res.data.message);
		// 			}
		// 		})
		// 		.catch((error) => {
		// 			swal.swalError("Error", error.message);
		// 		});

		// } else {
		// 	swal.swalError("Error", "Status Undefined");

		// }

	};

	return (
		<div>
			<Card elevation={3}>
				<CardHeader title={userDetail.fullName} />
				<Divider />
				<CardContent>
					<Typography variant="subtitle1" color="textSecondary" component="p">
						Team Page
        			</Typography>
					<br />
					<Grid
						container
						direction="row"
						justify="flex-start"
						alignItems="center"
						spacing={3}>
						{roleGroup.map((item) => (
							<Grid item xs={6} lg={2} key={`product_${item.id}`}>
								<Button variant="contained" style={{ backgroundColor: "#448aff" }} onClick={() => {
									handleGet(item.id);
								}}>
									{item.name}
								</Button>
							</Grid>
						))}
						<Grid item xs={12} lg={12}>
							<Typography variant="subtitle2" color="textSecondary" component="p">
								Customize
        					</Typography>
							<FormikCheckBoxGroup
								formik={formik}
								name="rolesId"
								label=""
								displayFieldName="roleName"
								data={role}
							/>
						</Grid>
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
					</Grid >
				</CardContent>
			</Card>
		</div >
	)
}

export default AssignRolesV2
