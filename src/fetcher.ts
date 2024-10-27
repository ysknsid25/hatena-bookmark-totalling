import type { Article, ZennArticle } from "./types/articles";
import type {
    FetchError,
    FetchErrorUnexpectedType,
} from "./types/fetch-errors";
import { ok, err } from "neverthrow";

export const fetchZennArticles = async (userName: string) => {
    const url = `https://zenn.dev/api/articles?username=${userName}&order=latest&count=500`;
    const res = await fetch(url);
    if (!res.ok) {
        return err<FetchError>({
            message: res.statusText,
            status: res.status,
            fetcherType: "zenn",
        });
    }
    const json = await res.json();
    if (json.articles && Array.isArray(json.articles)) {
        const articles = json.articles
            .filter((item: unknown) => {
                const article = item as ZennArticle;
                return (
                    article &&
                    typeof article.title === "string" &&
                    typeof article.path === "string" &&
                    typeof article.published_at === "string"
                );
            })
            .map((article: ZennArticle): Article => {
                return {
                    title: article.title,
                    url: `https://zenn.dev/${article.path}`,
                    publishedAt: new Date(article.published_at),
                };
            });
        return ok<Article>(articles);
    }
    return err<FetchErrorUnexpectedType>({
        fetcherType: "zenn",
    });
};
