import React, {useEffect, useState} from 'react'
import {
	Button,
	makeStyles,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from '@material-ui/core'
import PropTypes from 'prop-types'
import moment from 'moment'
import {roundNumber} from 'utils/helper-functions'
import classNames from 'classnames'

const useStyles = makeStyles(({palette, size, transitions}) => ({
	tableContainer: {
		boxShadow: `0px 0px 2px ${palette.background.light}`
	},
	row: {
		'& th': {
			color: palette.text.default
		},
		'& td': {
			cursor: 'pointer'
		},
		'& td, & th': {
			borderBottom: 'none',
			boxShadow: `0px 0px 2px ${palette.background.light}`
		},
		'&:hover td': {
			color: palette.text.default,
			transition: transitions.create('all', transitions.duration.shorter, transitions.easing.easeInOut),
		}
	},
	selectedRow: {
		'& td': {
			color: palette.text.default
		},
	}
}))

const HistoryTable = props => {

	const {items, selected, limit, onCellClick, className} = props

	const classes = useStyles()

	const formatNodes = items => items.join(' - ')

	return (
		<TableContainer className={classNames(classes.tableContainer, className)}>
			<Table sx={{minWidth: 650}} size='small'>
				<TableHead>
					<TableRow className={classes.row}>
						<TableCell>Time</TableCell>
						<TableCell align='left'>Profit</TableCell>
						<TableCell align='center'>Cycle</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{items.filter((_, i) => i < limit).map((row) => (
						<TableRow
							key={row.id}
							className={classNames(classes.row, selected === row.id && classes.selectedRow)}
							sx={{'&:last-child td, &:last-child th': {border: 0}}}
							onClick={() => onCellClick(row)}
						>
							<TableCell align={'right'}>
								{moment.unix(row.timestamp).format("D MMM YYYY HH:mm:ss Z")}
							</TableCell>
							<TableCell align='left'>{roundNumber(row.profit, 8)}</TableCell>
							<TableCell align='center' onClick={() => onCellClick(row.cycle)}>{formatNodes(row.cycle.nodes)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

HistoryTable.propTypes = {
	items: PropTypes.array,
	selected: PropTypes.string,
	limit: PropTypes.number,
	onCellClick: PropTypes.func
}

HistoryTable.defaultProps = {
	items: [],
	limit: 10
}

export default HistoryTable