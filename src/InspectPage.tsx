import { Stage, Layer, Image, Rect, Text } from 'react-konva';
import { useState, useEffect, useRef } from 'react';
import type { InspectState } from "./types.ts";

interface Props {
    inspectState: InspectState;
}

// 置信度颜色映射函数
const getDefectColor = (confidence: number) => {
    const hue = (1 - confidence) * 120; // 从红色(0)到绿色(120)
    return `hsl(${hue}, 100%, 50%)`;
};

export default function InspectPage({ inspectState }: Props) {
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    const [selectedDefect, setSelectedDefect] = useState<number | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    // 图片加载处理
    useEffect(() => {
        const img = new window.Image();
        img.src = "data:image/png;base64,"+inspectState.image;
        img.onload = () => {
            setImgSize({ width: img.width, height: img.height });
            imgRef.current = img;
        };
    }, [inspectState.image]);

    // 处理缺陷点击
    const handleDefectClick = (index: number) => {
        setSelectedDefect(index);
        // 可以在此处添加滚动到对应列表项的逻辑
    };

    return (
        <section className="bg-sodium-100 w-full flex flex-col items-center gap-4 pt-2">
            <header className="w-full h-[37px] bg-sodium-200 rounded-full ml-4 mr-4" />

            <div className="flex w-full gap-4 pl-4 pr-4">
                {/* 图像标注区域 */}
                <div className="h-[500px] w-[800px] rounded-2xl inset-shadow-2xs bg-sodium-400">
                    <Stage
                        width={800}
                        height={500}
                        style={{ borderRadius: '1rem' }}
                    >
                        <Layer>
                            <Image
                                image={imgRef.current}
                                width={800}
                                height={500}
                                listening={false}
                            />

                            {inspectState.defects.map((defect, index) => {
                                const [x1, y1, x2, y2, maxConf, ...classConfs] = defect;
                                const width = x2 - x1;
                                const height = y2 - y1;

                                return (
                                    <Rect
                                        key={index}
                                        x={x1 * 800 / imgSize.width}
                                        y={y1 * 500 / imgSize.height}
                                        width={width * 800 / imgSize.width}
                                        height={height * 500 / imgSize.height}
                                        stroke={selectedDefect === index ? 'yellow' : getDefectColor(maxConf)}
                                        strokeWidth={selectedDefect === index ? 3 : 2}
                                        opacity={0.8}
                                        onClick={() => handleDefectClick(index)}
                                        onTap={() => handleDefectClick(index)}
                                    />
                                );
                            })}
                        </Layer>
                    </Stage>
                </div>

                {/* 检测结果侧边栏 */}
                <aside className="w-[292px] h-[500px] rounded-2xl shadow-2xs">
                    <header className="bg-sodium-300 rounded-t-2xl w-full h-[10%] m-0 flex items-center justify-center">
                        <p>检测结果</p>
                    </header>

                    <div className="rounded-b-xl w-full overflow-y-scroll h-[90%]">
                        {inspectState.defects.map((defect, index) => {
                            const [_, __, ___, ____, maxConf, ...classConfs] = defect;
                            const classes = ['缺陷A', '缺陷B', '缺陷C', '缺陷D'];

                            return (
                                <div
                                    key={index}
                                    className={`grid-cols-6 border-b-2 border-b-sodium-400 flex flex-row justify-start items-center p-2 ${
                                        selectedDefect === index ? 'bg-sodium-200' : ''
                                    }`}
                                    onClick={() => handleDefectClick(index)}
                                >
                                    <svg width="50" height="50">
                                        <circle
                                            cx="25"
                                            cy="25"
                                            r="10"
                                            fill={getDefectColor(maxConf)}
                                        />
                                    </svg>
                                    <div className="col-span-4 text-sm">
                                        {classes.map((cls, i) => (
                                            <span key={cls} className="mr-2">
                        {cls}: {(classConfs[i] * 100).toFixed(1)}%
                      </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </aside>
            </div>

            <footer className="w-full h-[46px] bg-sodium-200 text-sodium-300 rounded-full flex justify-start items-center p-4 ml-4 mr-4">
                <p>检出缺陷数量：{inspectState.defects.length.toString().padStart(4, '0')}</p>
            </footer>
        </section>
    );
}
