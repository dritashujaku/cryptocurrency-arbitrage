import React, {useEffect, useRef, useState} from 'react'
import {makeStyles} from '@material-ui/core'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import * as echarts from 'echarts'

const useStyles = makeStyles(({palette, spacing, typography, transitions}) => ({
	root: {
		width: props => props.width || '100%',
		height: props => props.height || 380,
		// margin: spacing(),
		// paddingTop: spacing(2)
	}
}))

const configureGraph = (type, data) => {
	switch (type) {
		case 'bar':
			return {
				xAxis: {
					type: 'category',
					data: data.map(item => item.name),
					axisLabel: {
						lineHeight: 16
					},
					axisTick: {
						alignWithLabel: true,
					},
				},
				yAxis: {
					type: 'value',
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				color: [
					'#8679cb',
					'#0dffe7',
					'#0CC3E8',
					'#0C4FE8',
					'#008FFF',
					// '#b6f6c7',
					'#366AA2',
					'#117099',
					'#27996F',
					'#BBA1D3',
					'#4ab08c',// '#00AC91',
					'#00AC83',
					'#8277A2',
					'#7D69EB',
				],
				backgroundColor: 'transparent',
				textStyle: {
					color: '#c9d2da', // '#20242a'
				}
				// lineStyle: {color: '#fafafa'}
			}
		default:
			return {}
	}
}


const Chart = props => {

	const {data, type, onClick, className} = props

	const classes = useStyles(props)

	const [chart, setChart] = useState(null)
	const ref = useRef()

	useEffect(() => {
		// if (!echarts) {
		// 	return
		// }
		setChart(echarts.init(ref.current))
		return () => {
			chart?.dispose()
			// chart = null
		}
	}, [])

	useEffect(() => {
		if (!(chart && data.length)) {
			return
		}
		chart.setOption({
			...configureGraph(type, data),
			series: [{
				// name: 'Data',
				data,
				type: type.toLowerCase()
			}]
		})
		chart.on('click', params => {
			if (!onClick) {
				return
			}
			onClick(params.dataIndex)
		})
	}, [chart, data])


	return (
		<div className={classNames(classes.root, className)} ref={ref}/>
	)
}

Chart.defaultProps = {
	type: 'bar',
	data: []
}

Chart.propTypes = {
	type: PropTypes.string,
	data: PropTypes.array
}

export default Chart