import { useCallback, useEffect, useState } from "react"
import useRecorder from "../../utils/useRecorder"
import { Visualizer } from "./Visualizer"

export const AudioRecorder = () => {
	const [url, setUrl] = useState("")
	const [isAudioPlaying, setAudioPlaying] = useState(false) // state to show/hide visualizer canvas
	const {
		startRecording,
		pauseRecording,
		resumeRecording,
		stopRecording,
		register,
		status,
		stream,
		error,
	} = useRecorder()

	//passed to useRecorder stopRecording, receives recorded blob and url
	const onStop = useCallback((blob, blobUrl) => {
		setUrl(blobUrl)
		setAudioPlaying(false)
	}, [])

	const onInitialStart = useCallback(() => {
		setUrl("")
		//setup stream & recorder then start recording
		register(startRecording)
	}, [url])

	const urlObjectCleanUp = useCallback(() => {
		//let browser discard reference to previous audio file
		url && window.URL.revokeObjectURL(url)
	}, [url])

    //clean up audio file on unmount
    useEffect(()=>{
        return () => {
            urlObjectCleanUp()
        }
    }, [])

	const playButtonHandle = useCallback(() => {
		switch (status) {
			case "init":
				//first time click on start: initialize stream & recorder, then start recording
				onInitialStart()
				setAudioPlaying(true)
				break
			case "idle":
                urlObjectCleanUp()
				setUrl("")
				//second time recording an audio i.e. stream & recorder already initialized
				startRecording()
				setAudioPlaying(true)
				break
			case "recording":
				// pause recording
				pauseRecording()
				setAudioPlaying(false)
				break
			case "paused":
				//resume recording
				resumeRecording()
				setAudioPlaying(true)
				break
			default:
				break
		}
	}, [status])

	const getPlayButtonLabel = useCallback(() => {
		return status === "recording"
			? "Pause"
			: status === "paused"
			? "Resume"
			: "Start"
	}, [status])

	return (
		<div>
			<p>Audio Recorder</p>
			<button onClick={playButtonHandle}>{getPlayButtonLabel()}</button>
			{(status === "recording" || status === "paused") && (
				<button onClick={stopRecording(onStop)}>Stop</button>
			)}
			{url && (
				<audio
					controls
					onPlay={() => setAudioPlaying(true)}
					onPause={() => setAudioPlaying(false)}
					onStop={() => setAudioPlaying(false)}
				>
					<source src={url} />
				</audio>
			)}
			<Visualizer stream={stream} isAudioPlaying={isAudioPlaying} />
			{error && <p>{error}</p>}
		</div>
	)
}
