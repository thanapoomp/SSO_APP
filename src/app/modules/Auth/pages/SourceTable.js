/* eslint-disable no-restricted-imports */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import SourceTables from "mui-datatables";
import { useDispatch } from "react-redux";
import * as auth from "../_redux/authRedux";
import { useHistory } from "react-router-dom";
import { disableSource, getSourceFilter, enableSource } from "../_redux/authCrud";
import { Grid, Typography, FormControlLabel, Switch, CircularProgress, Card, CardContent } from "@material-ui/core";
import * as swal from "../../Common/components/SweetAlert";
import SourceSearch from "../components/SourceSearch";
import EditButton from '../../Common/components/Buttons/EditButton';

var flatten = require("flat");
require("dayjs/locale/th");
var dayjs = require("dayjs");
dayjs.locale("th");

function SourceTable() {

	const dispatch = useDispatch()
	const [data, setData] = React.useState([]);
	const [totalRecords, setTotalRecords] = React.useState(0);
	const [isLoading, setIsLoading] = React.useState(true);
	const history = useHistory()

	const [dataFilter, setDataFilter] = React.useState({
		page: 1,
		recordsPerPage: 10,
		orderingField: "",
		ascendingOrder: true,
		searchValues: {
			sourceName: "",
			isActive: ""
		}
	});

	React.useEffect(() => {
		//load data from api
		loadData();
	}, [dataFilter]);

	const handleEdit = (sourceId, sourceName) => {

		let payload = {
			sourceId: sourceId,
			sourceName: sourceName
		}
		dispatch(auth.actions.editSource(payload));
	};

	const loadData = () => {

		getSourceFilter(
			dataFilter.orderingField,
			dataFilter.ascendingOrder,
			dataFilter.page,
			dataFilter.recordsPerPage,
			dataFilter.searchValues.sourceName,
			dataFilter.searchValues.isActive,
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

					swal.swalError("Error", res.data.message);
				}
			})
			.catch((err) => {
				swal.swalError("Error", err.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const options = {

		setRowProps: (row, dataIndex, rowIndex) => {
			if (data[dataIndex].isActive === true) {
				return {
					style: {
						background: '#e3f2fd'
					}
				};
			} else {
				return {
					style: {
						background: '#eeeeee'
					}
				};

			}
		},
		draggableColumns: {
			enabled: true,
		},
		filter: false,
		print: false,
		download: false,
		search: false,
		selectableRows: "none",
		serverSide: true,
		count: totalRecords,
		page: dataFilter.page - 1,
		rowsPerPage: dataFilter.recordsPerPage,
		//เช็ค status
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

	const handleSearch = (values) => {

		if (values.isActive === 0) {
			values.isActive = ""
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
	}

	const columns = [
		{
			name: "id",
			label: "SourceId",
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
			name: "sourceName",
			label: "SourceName",
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
			name: "createdBy.userName",
			label: "สร้างโดย",
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
			name: "createdDate",
			label: "วันที่สร้าง",
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
		// {
		// 	name: "",
		// 	label: "สถานะ",
		// 	options: {
		// 		sort: false,
		// 		customHeadLabelRender: (columnMeta, updateDirection) => (
		// 			<Grid style={{ textAlign: "left" }}>
		// 				{columnMeta.label}
		// 			</Grid>
		// 		),
		// 		customBodyRenderLite: (dataIndex, rowIndex) => {
		// 			let g = {}
		// 			g = data[dataIndex].isActive === undefined ? true : false;
		// 			return (
		// 				<Grid style={{ padding: 0, margin: 0, textAlign: "left" }}>
		// 					<FormControlLabel control={<Switch checked={data[dataIndex].isActive} onChange={() => { handleChange(data[dataIndex].id, data[dataIndex].isActive) }} disabled={g} name="checkedA" />} />
		// 					{data[dataIndex].isActive === true ? (<span>ใช้งาน</span>) : data[dataIndex].isActive === false ? (<span>ยกเลิก</span>) : (<span>undefined</span>)}
		// 				</Grid>
		// 			);
		// 		},
		// 	},
		// },
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
							<EditButton
								style={{ marginRight: 20 }}
								onClick={() => {
									history.push(`/User/EditSource/${data[dataIndex].id}`)
								}}
							>
								Edit
                          </EditButton>
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
						<SourceSearch submit={handleSearch.bind(this)}></SourceSearch>
					</CardContent>
				</Card>

				<SourceTables
					title={
						<Typography variant="h6">
							Source
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

export default SourceTable
