import Image from "next/image";

export default function Home() {
    return (
        <div className="flex flex-col items-start justify-start bg-sodium-100 mt-[50px]">
            {/* 图片部分 */}
            <div className="">
                <Image
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
            {/* 上传按钮部分 */}1
            <div className="m-2 w-full flex">
                {/* 隐藏原生input */}
                <input
                    type="file"
                    id="upload-input"
                    className="hidden"
                     // 添加文件选择处理函数
                />

                {/* 自定义可视按钮 */}
                <label
                    htmlFor="upload-input"
                    className="ml-auto flex items-center bg-sodium-400 text-sodium-100 rounded-xl hover:bg-sodium-300 cursor-pointer px-4 py-2 space-x-2"
                >
                    <span className="whitespace-nowrap">上传图片开始检测</span>
                    <Image
                        src="/upload.svg"
                        alt="上传图标"
                        width={24}
                        height={24}
                        className="flex-shrink-0"
                    />
                </label>
            </div>
        </div>
    );
}
