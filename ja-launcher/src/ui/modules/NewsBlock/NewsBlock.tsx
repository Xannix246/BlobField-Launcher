import clsx from "clsx";
import SimpleImageSlider from "react-simple-image-slider";
import { useEffect, useState } from "react";
import { getNews, getImages, news, images } from "./Request";

const NewsBlock = () => {
    const [news, setNews] = useState<news[]>();
    const [images, setImages] = useState<images[]>();
    const className = clsx('absolute bottom-0 left-0 p-28 z-5 flex gap-5 justify-center place-items-center font-second');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const newsData = await getNews();
                const imagesData = await getImages();

                setNews(newsData);
                setImages(imagesData);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={className}>
            <div className="w-[320px] h-[180px] bg-black/25 rounded-lg overflow-hidden place-content-center">
                {images?.length == 0 && <div className="text-center">Failed to fetch news ☹️</div>}
                {images?.length !== 0 && <SimpleImageSlider
                    images={images || []}
                    width={320}
                    height={180}
                    showNavs={true}
                    showBullets={true}
                    autoPlay={true}
                    navSize={32}
                    navStyle={2}
                    navMargin={15}
                    useGPURender={true}
                />}
            </div>
            <div className="w-[600px] h-[170px] bg-black/25 rounded-lg overflow-hidden grid">
                <div className="bg-black/50 h-fit">
                    <div className="p-2 bg-ak-yellow text-black w-fit rounded-br-lg font-default">News</div>
                </div>
                <div className="overflow-y-scroll">
                    {news?.length == 0 && <div className="text-center">Failed to fetch news ☹️</div>}
                    {
                        news?.map((title, index) => (
                            <div className="p-2 flex w-full">
                                {title.url ? (
                                    <a className="flex-1 hover:text-ak-yellow transition duration-150"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={title.url}
                                        key={index}
                                    >{title.data}</a>
                                ) : (
                                    <div className="flex-1" key={index}>{title.data}</div>
                                )}
                                <div className="right-0 text-gray-300">{new Date(title.time).toLocaleString(undefined, { dateStyle: 'short' })}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default NewsBlock;