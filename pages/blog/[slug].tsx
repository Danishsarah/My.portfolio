import Head from "next/head";
import { useRouter } from "next/router";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React, { useRef, useState } from "react";

import { stagger } from "../../animations";
import BlogEditor from "../../components/BlogEditor";
import Button from "../../components/Button";
import ContentSection from "../../components/ContentSection";
import Cursor from "../../components/Cursor";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import portfolioData from "../../data/portfolio.json";
import type { BlogField, BlogPost } from "../../types/blog";
import type { PortfolioData } from "../../types/portfolio";
import { useIsomorphicLayoutEffect } from "../../utils";
import { getAllPosts, getPostBySlug } from "../../utils/api";

interface BlogPostPageProps {
  post: BlogPost;
}

const data = portfolioData as PortfolioData;

const BlogPostPage: NextPage<BlogPostPageProps> = ({ post }) => {
  const [showEditor, setShowEditor] = useState(false);
  const textOne = useRef<HTMLHeadingElement | null>(null);
  const textTwo = useRef<HTMLHeadingElement | null>(null);
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    const headings = [textOne.current, textTwo.current].filter(Boolean) as HTMLElement[];
    if (headings.length) {
      stagger(headings, { y: 30 }, { y: 0 });
    }
  }, []);

  return (
    <>
      <Head>
        <title>{`Blog - ${post.title}`}</title>
        <meta name="description" content={post.preview} />
      </Head>
      {data.showCursor && <Cursor />}

      <div
        className={`container mx-auto mt-10 ${
          data.showCursor && "cursor-none"
        }`}
      >
        <Header isBlog={true} />
        <div className="mt-10 flex flex-col">
          <img
            className="w-full h-96 rounded-lg shadow-lg object-cover"
            src={post.image}
            alt={post.title}
          />
          <h1
            ref={textOne}
            className="mt-10 text-4xl mob:text-2xl laptop:text-6xl text-bold"
          >
            {post.title}
          </h1>
          <h2
            ref={textTwo}
            className="mt-2 text-xl max-w-4xl text-darkgray opacity-50"
          >
            {post.tagline}
          </h2>
        </div>
        <ContentSection content={post.content} />
        <Footer />
      </div>
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-6 right-6">
          <Button onClick={() => setShowEditor(true)} type={"primary"}>
            Edit this blog
          </Button>
        </div>
      )}

      {showEditor && (
        <BlogEditor
          post={post}
          close={() => setShowEditor(false)}
          refresh={() => router.reload(router.asPath)}
        />
      )}
    </>
  );
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const fields: BlogField[] = [
    "date",
    "slug",
    "preview",
    "title",
    "tagline",
    "image",
    "content",
  ];
  const post = getPostBySlug(slug, fields) as BlogPost;

  return {
    props: {
      post: { ...post },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug as string,
      },
    })),
    fallback: false,
  };
};

export default BlogPostPage;
