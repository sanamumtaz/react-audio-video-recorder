import { useCallback, useState } from "react"
import { AudioRecorder } from "./components/AudioRecorder/Recorder"
import { VideoRecorder } from "./components/VideoRecorder/VideoRecorder"

function App() {
	const [view, setView] = useState("audio")

	const toggleView = useCallback(() => {
      view === 'video' ? setView('audio') : setView('video')
  }, [view])

	return (
		<div className="App">
			<button onClick={toggleView}>
				Switch to {view === "video" ? "Audio" : "Video"} Recorder
			</button>
			{view === "video" ? <VideoRecorder /> : <AudioRecorder />}
		</div>
	)
}

export default App
