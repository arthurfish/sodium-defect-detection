import UploadWidget from "./UploadWidget";
import * as React from "react";
import {InspectState} from "./types.ts";

interface Props {
    setInspectState: React.Dispatch<React.SetStateAction<InspectState | null>>;
}

export default function WelcomePage({ setInspectState }: Props) {
    return (
        <div className="p-[100px] flex flex-col items-start justify-start bg-sodium-100 mt-[50px]">
            {/* 图片部分 */}
            <div className="">
                <img
                    src="/defect.svg"
                    alt="缺陷图标"
                    width={200}
                    height={200}
                />
            </div>
            <hr className="border-sodium-400 w-full mt-3 border-2" />
            {/* 标题部分 */}
            <div className="">
                <h1 className="mb-[-1rem] text-[64px] font-bold text-sodium-400">Sodium Defect Detection</h1>
                <h2 className="mb-[-0.75rem] text-[64px] text-sodium-400 font-bold">缺陷检测</h2>
                <p className="text-[36px] text-sodium-400">使用最新的人工智能技术对材料缺陷进行检测</p>
            </div>
            <UploadWidget setInspectState={setInspectState} />
        </div>
    );
}
