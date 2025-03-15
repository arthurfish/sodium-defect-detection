import {useState} from "react";
import WelcomePage from "./WelcomePage.tsx";
import {InspectState} from "./types.ts";
import InspectPage from "./InspectPage.tsx";

export default function StateRouter() {
    const [inspectState, setInspectState] = useState<InspectState | null>(null);
    if (inspectState === null) {
        return <WelcomePage setInspectState={setInspectState} />
    }else{
        return <InspectPage inspectState={inspectState} />
    }
}