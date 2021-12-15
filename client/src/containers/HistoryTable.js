import React from 'react'
import {
	fade,
	makeStyles,
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
import {DATE_FORMAT} from 'Constants'

const useStyles = makeStyles(({palette, size: {rem, defaultFont}, transitions}) => ({
	tableContainer: {
		// boxShadow: `0px 0px 2px 2px ${fade(palette.stroke, 0.7)}`,
		border: `2px solid ${fade(palette.stroke, 0.7)}`,
		borderRadius: 4,
		overflow: 'hidden'
	},
	row: {
		whiteSpace: 'nowrap',
		'& td': {
			cursor: 'pointer'
		},
		'& td, & th': {
			fontSize: rem(13),
			borderBottom: 'none',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			overflow: 'hidden'
		},
		'&:hover td': {
			backgroundColor: fade(palette.highlight.secondary, 0.12),
			transition: transitions.create('all', transitions.duration.shorter, transitions.easing.easeInOut),
		}
	},
	selectedRow: {
		'& td': {
			color: palette.text.paper
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
						<TableCell align='center'>Arbitrage</TableCell>
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
							<TableCell align={'left'}>
								{moment.unix(row.timestamp).format(DATE_FORMAT)}
							</TableCell>
							<TableCell align='left'>{roundNumber(row.profit, 8)}</TableCell>
							<TableCell align='center'>{formatNodes(row.cycle.nodes)}</TableCell>
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