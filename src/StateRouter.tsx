import {useState} from "react";
import WelcomePage from "./WelcomePage.tsx";
import {InspectState} from "./types.ts";
import InspectPage from "./InspectPage.tsx";
import RealTimeDetectPage from "./RealTimeDetectPage.tsx";

export default function StateRouter() {
    const [inspectState, setInspectState] = useState<InspectState | null>(null);
    const [streamingReady, setStreamingReady] = useState<boolean>(false);
    if(streamingReady) {
        console.log("1")
        return <RealTimeDetectPage />
    }
    if (inspectState) {
        return <InspectPage inspectState={inspectState} />
    }
    return <WelcomePage setInspectState={setInspectState} setStreamingReady={setStreamingReady} />


}