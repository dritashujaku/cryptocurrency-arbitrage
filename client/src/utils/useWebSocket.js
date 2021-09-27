import {useEffect, useRef, useState} from 'react'

const useWebSocket = (id, onOpen, onMessage, onError, onClose) => {
	const webSocket = useRef()
	const [open, setOpen] = useState(false)
	
	const connect = () => {

		const ws = new WebSocket(`ws://localhost:9004/${id}`)

		ws.onopen = event => {
			if (onOpen) {
				onOpen(ws, event)
			}
			setOpen(true)
		}

		ws.onmessage = event => {
			console.log('message from server', event.data)
			onMessage(event.data)
		}

		ws.onerror = event => {
			console.log('WebSocket error:', event)
			if (onError) {
				onError(ws, event)
			}
		}

		ws.onclose = event => {
			const {code, reason} = event
			console.log('Websocket closed:', code, 'reason', reason)
			setOpen(false)
			if (onClose) {
				onClose(ws, event)
			}
		}

		webSocket.current = ws
	}


	useEffect(() => {
		connect()
	}, [id])


	return {socket: webSocket.current, open}
}
export default useWebSocket