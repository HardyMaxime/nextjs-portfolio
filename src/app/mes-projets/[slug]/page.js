import ProjectLayout from "@/components/projets/layout";
import { Fragment } from "react";
import { extratID } from '../../../helpers';

export async function generateStaticParams()
{
    const res = await fetch(process.env.BACKOFFICE_URL+'projects/paths', { next: { revalidate: 10 } });
    const paths = await res.json();
    return paths.slug.map((url) => ({
        slug: url
    }))
}

async function getData(slug) {
    const ID = extratID(slug);
    const res = await fetch(process.env.BACKOFFICE_URL+`projects/${ID}`, { next: { revalidate: 10 } });

    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    return res.json()
}

export async function generateMetadata({ params }) {
    const { slug } = params
    const pageID = extratID(slug);
    const object = await getData(slug);
    const data = object[pageID];

    return {
        title: data.seo.title,
        description: data.seo.meta_description,
        alternates: {
            canonical: "/",
        },
        robots: {
            index: data.seo.robots.index,
            follow:data.seo.robots.follow,
        },
        openGraph: {
            title: data.seo.open_graph_title,
            description: data.seo.open_graph_description,
            url: 'https://maximehardy.me',
            siteName: data.seo.site_name,
            images: [
            ],
            publishedTime: data.seo.open_graph_article_published_time,
            modifiedTime: data.seo.open_graph_article_modified_time,
            locale: data.seo.open_graph_locale,
            type: data.seo.open_graph_type,
            schema: data.seo.schema
        },
        twitter: {
            card: data.seo.twitter_card,
            title: data.seo.twitter_title,
            description: data.seo.twitter_description,
            siteId: data.seo.twitter_site,
            creator: data.seo.twitter_creator,
            images: data.seo.twitter_image,
          },
    };
};


export default async function Page({params}) {
    const { slug } = params
    const data = await getData(slug) || [];

    return (
        <Fragment>
            <ProjectLayout data={data[Object.keys(data)]} />
        </Fragment>
    );
}
