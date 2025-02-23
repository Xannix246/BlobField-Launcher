const images: images[] = [
    { url: "src/assets/test/1.png" },
    { url: "src/assets/test/2.png" },
    { url: "src/assets/test/3.png" },
    { url: "src/assets/test/4.png" }
]

const news: news[] = [
    {
        data: "Awesome news!",
        time: "2025-02-24 1:59:00"
    },
    {
        data: "Another awesome news!",
        time: "2025-02-23 1:59:00"
    },
    {
        data: "And some very looooooooooooong news?",
        time: "2025-02-22 1:59:00"
    },
    {
        data: "Idk (shrug)",
        time: "2025-02-21 1:59:00"
    }
]

export type news = {
    data: string;
    time: string;
}

export type images = {
    url: string;
}

export async function getImages(): Promise<images[]> {
    setTimeout(() => {}, 5000);
    return [
        ...images
    ]
}

export async function getNews(): Promise<news[]> {
    setTimeout(() => {}, 5000);
    return [
        ...news
    ]
}