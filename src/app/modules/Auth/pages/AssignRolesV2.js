/* eslint-disable no-restricted-imports */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Grid, Card, CardActions, FormControlLabel, Switch, Button, CardContent, CardHeader, Typography, Popover } from '@material-ui/core';
import { assignRoles, getRole, getUserByCode, getRoleByUserId, getRoleGroup } from "../_redux/authCrud";
import FormikCheckBoxGroup from "../../../modules/_FormikUseFormik/components/FormikCheckBoxGroup";
import SaveButton from "../../../modules/Common/components/Buttons/SaveButton";
import * as swal from "../../Common/components/SweetAlert";
import Divider from '@material-ui/core/Divider';
import { useFormik } from "formik";
import * as auth from "../_redux/authRedux";

const useStyles = makeStyles((theme) => ({
	typography: {
		padding: theme.spacing(2),
	},
}));

function AssignRolesV2(props) {

	const classes = useStyles();
	const authReducer = useSelector(({ auth }) => auth)

	let { userGuid, employeeCode } = useParams();


	const dispatch = useDispatch()
	const history = useHistory();
	const [role, setRole] = React.useState([]);
	const [userDetail, setUserDetail] = React.useState([]);
	const [roleGroup, setRoleGroup] = React.useState([])
	const [roleD, setRoleD] = React.useState([])
	const [roleId, setRoleId] = React.useState([])
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	React.useEffect(() => {

		getRoleGroup()
			.then((res) => {

				if (res.data.isSuccess) {
					// setRoleId([...authReducer.roleId])
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

	//set role ใหม่ทุกครั้ง ที่ state เปลี่ยน
	React.useEffect(() => {
		formik.setFieldValue('rolesId', [...roleId])
	}, [roleId])


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


			handleSave({ setSubmitting }, values);
		},
	});

	//save role user
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

	// open Popover
	const handleClick = (event, id) => {
		handleGet(id)
		setAnchorEl(event.currentTarget);
	};

	//close Popover
	const handleClose = () => {
		setAnchorEl(null);
	};

	//reset role user
	const handleReset = () => {
		formik.setFieldValue('rolesId', [...[]])
		setRoleId([]);
	};

	//get role Default user
	const handleDefault = () => {
		formik.setFieldValue('rolesId', [...authReducer.roleId])
		setRoleId([...authReducer.roleId]);
	};

	const handleGet = (id) => {
		if (roleGroup.length > 0) {
			//เช็ค id roleGroup ต้อง != 0
			if (roleGroup.id !== 0) {
				//fine หา roleId จาก roleGroup id
				let objRole = roleGroup.find(obj => obj.id === id);

				if (objRole !== null) {

					let objRoleId = []

					let objRoleName = []
					objRole.roleGroupDetail.forEach(element => {

						//setState RoleName (Popover)
						objRoleName.push(element.role.roleName)
						setRoleD(objRoleName)

						//find role
						let i = roleId.indexOf(element.role.id);

						//find ไม่เจอ role push roleId
						if (i === -1) objRoleId.push(element.role.id)

						//objRoleId ไม่เท่ากับ ว่าง set state
						if (objRoleId !== []) setRoleId([...roleId, ...objRoleId]);


					});

				}
			}
		}
	}

	return (
		<div>
			<Card elevation={3}>
				<CardHeader title={userDetail.fullName} />
				<CardActions>
					<Button variant="contained" style={{ backgroundColor: "#42a5f5" }} onClick={() => { handleReset() }}>RESET</Button>
					<Button variant="contained" style={{ backgroundColor: "#42a5f5" }} onClick={() => { handleDefault() }}>Default Role User</Button>
				</CardActions>
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
							<Grid item xs={6} lg={2} key={`role_${item.id}`}>
								<Button variant="contained" style={{ backgroundColor: "#42a5f5" }} onClick={(event) => { handleClick(event, item.id) }}>
									{item.name}
								</Button>
								<Popover
									id={item.id}
									open={open}
									anchorEl={anchorEl}
									onClose={handleClose}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'center',
									}}
									transformOrigin={{
										vertical: 'top',
										horizontal: 'center',
									}}
								>
									{(roleD.length <= 0 ? <Typography variant="subtitle2" color="textSecondary" component="p" className={classes.typography}></Typography> :
										roleD.map((nameRole) => (
											<Typography variant="subtitle2" color="textSecondary" component="p" className={classes.typography}>{nameRole}</Typography>
										))
									)}
								</Popover>
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
