import { type ChangeEvent, useState } from "react";
import { type NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";

import { api } from "@/utils/api";

const urlRegex = new RegExp(
  "^((https?|ftp|file)://)?" + // protocol
    "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-zA-Z\\d_]*)?$" // fragment locator
);

const Home: NextPage = () => {
  const [url, setUrl] = useState<string>("");
  const instagramResult = api.instagram.imageFetcher.useQuery(
    { url },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  const isUrlValid = !url || urlRegex.test(url);

  const router = useRouter();

  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);

  const handleDownloadClick = async () => {
    if (!instagramResult.data?.imgSrc) return;
    const response = await fetch(instagramResult.data?.imgSrc);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    setImageBlobUrl(blobUrl);
  };

  return (
    <>
      <Head>
        <title>IG IMAGE DOWNLOADER</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary to-secondary">
        <h1 className="mb-5 text-center text-[4.2rem] font-bold text-neutral md:text-[6rem]">
          IG Image Downloader
        </h1>
        {(!instagramResult.isFetched || instagramResult.isError) && (
          <div className="flex w-1/2 min-w-[25rem] flex-wrap items-center justify-center gap-3 text-[3.2rem]">
            <div className="relative flex items-center justify-center">
              <input
                type="text"
                placeholder="Type here"
                className={`input-bordered input input-lg w-full max-w-md ${
                  isUrlValid ? "input-neutral" : "input-error"
                }`}
                value={url}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUrl(e.target.value)
                }
                disabled={instagramResult.isFetching}
              />
              {instagramResult.isFetching && (
                <progress className="progress absolute bottom-[-1px] left-1/2 h-[3px] w-[85%] -translate-x-1/2"></progress>
              )}
            </div>
            <button
              className="btn-accent btn-lg btn text-neutral"
              disabled={!isUrlValid || instagramResult.isFetching}
              onClick={() => void instagramResult.refetch()}
            >
              GET the image!!
            </button>
          </div>
        )}
        {instagramResult.isFetched && !!instagramResult.data?.imgSrc && (
          <>
            <div className="relative mt-10 h-[30rem] w-full">
              <Image
                src={instagramResult.data?.imgSrc}
                alt="the image you want"
                fill
                style={{ objectFit: "contain" }}
              ></Image>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <a
                className="btn-accent btn-lg btn"
                href={instagramResult.data.imgSrc}
                download="image.png"
                target="_blank"
              >
                Open image in new window
              </a>
              <button
                className="btn-secondary btn-lg btn"
                onClick={() => void router.reload()}
              >
                Back
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Home;
