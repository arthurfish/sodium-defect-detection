export  default  function Inspect(){
    return (
        <section className="bg-sodium-100 w-full flex flex-col items-center gap-4 pt-2">
            <header className="w-full h-[37px] bg-sodium-200 rounded-full ml-4 mr-4"></header>
            <div className="flex w-full gap-4 pl-4 pr-4">
                <div className="h-[500px] w-[800px] rounded-2xl inset-shadow-2xs bg-sodium-400"></div>
                <aside className="w-[292px] h-[500px] rounded-2xl shadow-2xs ">
                    <header className="bg-sodium-300 rounded-t-2xl w-full h-[10%] m-0 flex items-center justify-center"><p>检测结果</p></header>
                    <div className="rounded-b-xl w-full overflow-y-scroll h-[90%]">
                        <div className="grid-cols-6 border-b-2 border-b-sodium-400 flex flex-row justify-start items-center">
                            <svg width="50" height="50">
                                <circle cx="25" cy="25" r="10" fill="red" />
                            </svg>
                            <div className="col-span-4">缺陷A:12%|缺陷B:50% <br/>缺陷C:30%|缺陷D:42%</div>
                        </div>
                    </div>
                </aside>
            </div>
            <footer className="w-full h-[46px] bg-sodium-200 text-sodium-300 rounded-full flex justify-start items-center p-4 ml-4 mr-4"><p>检出缺陷数量：0721</p></footer>
        </section>
    )
}