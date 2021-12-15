import React, {useEffect, useRef, useState} from 'react'
import {makeStyles, useTheme} from '@material-ui/core'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import * as echarts from 'echarts'

const useStyles = makeStyles(({size}) => ({
	root: {
		display: 'flex',
		width: '100%',
		minHeight: size.rem(340),
		justifyContent: 'center'
	}
}))

const configureGraph = (type, data, palette) => {
	switch (type) {
		case 'bar':
			return {
				xAxis: {
					type: 'category',
					data: data.map(item => item.name),
					axisLabel: {
						lineHeight: 16,
						color: palette.text.primary
					},
					axisTick: {
						alignWithLabel: true,
						color: palette.highlight.secondary
					},
					axisLine: {
						lineStyle: {color: palette.highlight.secondary}
					}
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						color: palette.text.primary
					},
					splitLine: {
						lineStyle: {color: palette.highlight.secondary}
					}
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
				color: [palette.highlight.accent, ...palette.graph],
				backgroundColor: 'transparent',
				textStyle: {
					color: palette.text.secondary //  '#c9d2da',
				}
			}
		default:
			return {}
	}
}


const Chart = props => {

	const {data, type, onClick, style, className} = props

	const classes = useStyles(props)
	const {palette} = useTheme()

	const [chart, setChart] = useState(null)
	const ref = useRef()

	useEffect(() => {
		setChart(echarts.init(ref.current))
		return () => {
			chart?.dispose()
		}
	}, [])

	useEffect(() => {
		if (!(chart && data.length)) {
			return
		}
		chart.setOption({
			...configureGraph(type, data, palette),
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
		<div className={classNames(classes.root, className)} ref={ref} style={style}/>
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