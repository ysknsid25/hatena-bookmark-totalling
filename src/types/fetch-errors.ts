export type FetchError = {
    message: string;
    status: number;
    fetcherType: "zenn" | "qiita" | "note" | "speakerdeck";
};

export type FetchErrorUnexpectedType = FetchError["fetcherType"];
