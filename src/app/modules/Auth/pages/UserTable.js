/* eslint-disable no-restricted-imports */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { connect, useDispatch } from "react-redux";
import { injectIntl } from "react-intl";
import UserTables from "mui-datatables";
import { Link } from "react-router-dom";
import { disableUser, getUserFilter, enableUser, reSetPassword } from "../_redux/authCrud";
import * as auth from "../_redux/authRedux";
import { Button, Grid, Typography, FormControlLabel, Switch, CircularProgress, Card, CardContent } from "@material-ui/core";
import * as swal from "../../Common/components/SweetAlert";
import UserSearch from "../components/UserSearch";
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { red, blue } from '@material-ui/core/colors';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

var flatten = require("flat");
require("dayjs/locale/th");
var dayjs = require("dayjs");
dayjs.locale("th");

function UserTable(props) {

	const dispatch = useDispatch()

	const [data, setData] = React.useState([]);
	const [totalRecords, setTotalRecords] = React.useState(0);
	const [isLoading, setIsLoading] = React.useState(true);


	const [dataFilter, setDataFilter] = React.useState({
		page: 1,
		recordsPerPage: 10,
		orderingField: "",
		ascendingOrder: true,
		searchValues: {
			userName: "",
			sourceName: "",
			mapperId: ""
		}
	});

	React.useEffect(() => {
		//load data from api
		loadData();
	}, [dataFilter]);

	const handleEdit = (userGuid, employeeCode, d) => {
		debugger
		let data = {
			userGuid: userGuid,
			employeeCode: employeeCode
		}
		dispatch(auth.actions.edit(data));
	};

	const handleReset = (userGuid, code, title, firstName, lastName) => {
		swal.swalInfo("Reset Password", `${code} ${title} ${firstName} ${lastName}`).then((res) => {
			if (res.isConfirmed) {
				debugger
				reSetPassword(userGuid)
					.then((res) => {
						if (res.data.isSuccess) {
							swal.swalSuccess("Success", `success.`)
						} else {
							alert(res.data.message);
						}
					})
					.catch((err) => {
						alert(err.message);
					})
					.finally(() => {
						setIsLoading(false);
					});
			}
		});
	};

	const loadData = () => {

		getUserFilter(
			dataFilter.orderingField,
			dataFilter.ascendingOrder,
			dataFilter.page,
			dataFilter.recordsPerPage,
			dataFilter.searchValues.userName,
			dataFilter.searchValues.sourceName,
			dataFilter.searchValues.mapperId,
		)
			.then((res) => {

				if (res.data.isSuccess) {
					//flatten data
					// if (res.data.totalAmountRecords > 0) {
					let flatData = [];
					res.data.data.forEach((element) => {
						flatData.push(flatten(element));
					});
					setData(flatData);
					// }
					setTotalRecords(res.data.totalAmountRecords);
				} else {
					alert(res.data.message);
				}
			})
			.catch((err) => {
				alert(err.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};


	//disable user enable user
	const handleChange = (id, status) => {
		debugger
		if (id) {
			if (status) {
				disableUser(id)
					.then((res) => {
						if (res.data.isSuccess) {

							return true;
						} else {

							swal.swalError("Error", res.data.message);
						}
					})
					.catch((error) => {
						loadData();
						swal.swalError("Error", error.message);
					})
					.finally(() => {
						loadData();
					});

			} else {

				enableUser(id)
					.then((res) => {
						if (res.data.isSuccess) {

							return true;
						} else {

							swal.swalError("Error", res.data.message);
						}
					})
					.catch((error) => {
						loadData();
						swal.swalError("Error", error.message);
					})
					.finally(() => {
						loadData();
					});
			}
		}
	}

	const handleSearchUser = (values) => {

		//เช็ค sourceName = 0 ('กรุณาเลือก') ให้ sourceName เป็น ว่าง
		if (values.sourceName === 0) {
			values.sourceName = ""
			setDataFilter({
				...dataFilter,
				page: 1,
				searchValues: values
			});

		} else {
			setDataFilter({
				...dataFilter,
				page: 1,
				searchValues: values
			});
		}
	};

	const options = {

		filter: false,
		print: false,
		download: false,
		search: false,
		selectableRows: "none",
		serverSide: true,
		count: totalRecords,
		page: dataFilter.page - 1,
		rowsPerPage: dataFilter.recordsPerPage,
		setRowProps: (row, dataIndex, rowIndex) => {
			if (data[dataIndex].isActive === false) {
				return {
					style: {
						background: '#d7ccc8'
					}
				};
			}
		},
		onTableChange: (action, tableState) => {
			switch (action) {
				case "changePage":
					setDataFilter({ ...dataFilter, page: tableState.page + 1 });
					break;
				case "sort":
					setDataFilter({
						...dataFilter,
						orderingField: `${tableState.sortOrder.name}`,
						ascendingOrder:
							tableState.sortOrder.direction === "asc" ? true : false,
					});
					break;
				case "changeRowsPerPage":
					setDataFilter({
						...dataFilter,
						recordsPerPage: tableState.rowsPerPage,
					});
					break;
				default:
			}
		},
	};

	const columns = [
		{
			name: "mapperId",
			label: "รหัสพนักงาน",
			options: {
				sort: false,
				customHeadLabelRender: (columnMeta, updateDirection) => (
					<Grid style={{ textAlign: "center" }}>
						{columnMeta.label}
					</Grid>
				),
				customBodyRender: (value) => (
					<Grid style={{ textAlign: "center" }}>
						{value}
					</Grid>
				)
			},
		},
		{
			name: "",
			label: "ชื้อพนักงาน",
			options: {
				sort: false,
				customHeadLabelRender: (columnMeta, updateDirection) => (
					<Grid style={{ textAlign: "center" }}>
						{columnMeta.label}
					</Grid>
				),
				customBodyRenderLite: (dataIndex, rowIndex) => {

					//check person is null
					var obj = data[dataIndex].person
					if (obj !== null) {
						let fullName = `${data[dataIndex]["person.title"]}${data[dataIndex]["person.firstName"]} ${data[dataIndex]["person.lastName"]}`;
						return (
							<Grid style={{ textAlign: "center" }}>{fullName}</Grid>
						)
					} else {
						return (
							<Grid style={{ textAlign: "center" }}>-</Grid>
						)
					}

				},
			},
		},
		{
			name: "source.sourceName",
			label: "Source",
			options: {
				sort: false,
				customHeadLabelRender: (columnMeta, updateDirection) => (
					<Grid style={{ textAlign: "center" }}>
						{columnMeta.label}
					</Grid>
				),
				customBodyRender: (value) => (
					<Grid style={{ textAlign: "center" }}>
						{value}
					</Grid>
				)
			},
		},
		{
			name: "userName",
			label: "UserName",
			options: {
				sort: false,
				customHeadLabelRender: (columnMeta, updateDirection) => (
					<Grid style={{ textAlign: "center" }}>
						{columnMeta.label}
					</Grid>
				),
				customBodyRender: (value) => (
					<Grid style={{ textAlign: "center" }}>
						{value}
					</Grid>
				)
			},
		},
		{
			name: "วันที่สร้าง",
			options: {
				sort: false,
				customBodyRenderLite: (dataIndex, rowIndex) => {
					return (
						<Grid
							style={{ padding: 0, margin: 0 }}
							container
							direction="row"
							justify="flex-start"
							alignItems="center"
						>
							{dayjs(data[dataIndex].createdDate).format("DD/MM/YYYY")}
						</Grid>
					);
				},
			},
		},
		{
			name: "",
			label: "สถาณะ",
			options: {
				selectableRows: true,
				sort: false,

				customHeadLabelRender: (columnMeta, updateDirection) => (
					<Grid style={{ textAlign: "left" }}>
						{columnMeta.label}
					</Grid>
				),
				customBodyRenderLite: (dataIndex, rowIndex) => {
					let g = {}
					g = data[dataIndex].isActive === undefined ? true : false;
					return (
						<Grid style={{ padding: 0, margin: 0, textAlign: "left" }}>
							{/* disable status undefined */}
							<FormControlLabel control={<Switch checked={data[dataIndex].isActive} onChange={() => { handleChange(data[dataIndex].id, data[dataIndex].isActive) }} disabled={g} name="checkedA" />} />
							{data[dataIndex].isActive === true ? (<span>ใช้งาน</span>) : data[dataIndex].isActive === false ? (<span>ยกเลิก</span>) : (<span>undefined</span>)}
						</Grid>
					);
				},
			},
		},
		{
			name: "",
			options: {
				filter: false,
				sort: false,
				empty: true,
				viewColumns: false,
				hight: 2,
				customBodyRenderLite: (dataIndex, rowIndex) => {
					return (
						<Grid
							container
							direction="row"
							justify="center"
							alignItems="center"
						>
							<Link to="/User/AssignRolesV2">
								<Button
									style={{ backgroundColor: blue[400] }}
									variant="contained"
									startIcon={<SupervisorAccountIcon />}
									color="secondary"
									onClick={() => {
										handleEdit(data[dataIndex].id, data[dataIndex].mapperId, data);
									}}
								>
									Assign Role
		                  </Button>
							</Link>
						</Grid>
					);
				},
			},
		},
		{
			name: "",
			options: {
				filter: false,
				sort: false,
				empty: true,
				viewColumns: false,
				hight: 2,
				customBodyRenderLite: (dataIndex, rowIndex) => {
					return (
						<Grid
							container
							direction="row"
							justify="center"
							alignItems="center"
						>
							<Button
								startIcon={<RotateLeftIcon />}
								style={{ backgroundColor: red[300] }}
								onClick={() => {
									handleReset(data[dataIndex].id, data[dataIndex].mapperId, data[dataIndex]["person.title"], data[dataIndex]["person.firstName"], data[dataIndex]["person.lastName"]);
								}}
							>
								Reset Password
		                  </Button>
						</Grid>
					);
				},
			},
		},
	];


	return (
		<div>
			<Grid container
				direction="column"
				justify="center"
				alignItems="stretch">
				<Card elevation={3} style={{ marginBottom: 5 }}>
					<CardContent>
						<UserSearch submit={handleSearchUser.bind(this)}></UserSearch>
					</CardContent>
				</Card>

				<UserTables
					title={
						<Typography variant="h6">
							User Manager
                                {isLoading && (
								<CircularProgress
									size={24}
									style={{ marginLeft: 15, position: "relative", top: 4 }}
								/>
							)}
						</Typography>
					}
					data={data}
					columns={columns}
					options={options}
				/>
			</Grid>
		</div>
	)
}

export default injectIntl(connect(null, auth.actions)(UserTable))
