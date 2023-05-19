import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPosts } from '../utils/mdx-utils';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout, { GradientBackground } from '../components/Layout';
import ArrowIcon from '../components/ArrowIcon';
import { getGlobalData } from '../utils/global-data';
import SEO from '../components/SEO';
import io from 'socket.io-client';
import GIFEncoder from 'gif-encoder';
import { createCanvas, Image } from 'canvas';

function Index({ posts, globalData }) {
  const [socket, setSocket] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);

  useEffect(() => {
    const socket = io();
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('imageCaptured', (imageFileName) => {
        setCapturedImages((prevImages) => [...prevImages, imageFileName]);
      });
    }
  }, [socket]);

  function captureImage() {
    if (socket) {
      socket.emit('capture');
    }
  }

  function createGif() {
    const gif = new GIFEncoder(400, 300);
    gif.setRepeat(0);
    gif.setDelay(100);
    gif.start();

    capturedImages.forEach((imageFileName) => {
      const image = new Image();
      image.src = imageFileName;
      image.onload = () => {
        const canvas = createCanvas(400, 300);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, 400, 300);
        gif.addFrame(ctx);
      };
    });

    gif.finish();

    const gifBlob = new Blob([gif.out.getData()], { type: 'image/gif' });
    const gifURL = URL.createObjectURL(gifBlob);

    const gifPreview = document.getElementById('gifPreview');
    gifPreview.src = gifURL;
    gifPreview.style.display = 'block';
  }

  return (
    <Layout>
      <SEO title={globalData.name} description={globalData.blogTitle} />
      <Header name={globalData.name} />
      <main className="w-full">
        <h1 className="text-3xl lg:text-5xl text-center mb-12">
          {globalData.blogTitle}
        </h1>
        <ul className="w-full">
          {posts.map((post) => (
            <li
              key={post.filePath}
              className="md:first:rounded-t-lg md:last:rounded-b-lg backdrop-blur-lg bg-white dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 transition border border-gray-800 dark:border-white border-opacity-10 dark:border-opacity-10 border-b-0 last:border-b hover:border-b hovered-sibling:border-t-0"
            >
              <Link
                as={`/posts/${post.filePath.replace(/\.mdx?$/, '')}`}
                href={`/posts/[slug]`}
              >
                <a className="py-6 lg:py-10 px-6 lg:px-16 block focus:outline-none focus:ring-4">
                  {post.data.date && (
                    <p className="uppercase mb-3 font-bold opacity-60">
                      {post.data.date}
                    </p>
                  )}
                  <h2 className="text-2xl md:text-3xl">{post.data.title}</h2>
                  {post.data.description && (
                    <p className="mt-3 text-lg opacity-60">
                      {post.data.description}
                    </p>
                  )}
                  <ArrowIcon className="mt-4" />
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer copyrightText={globalData.footerText} />
      <GradientBackground
        variant="large"
        className="fixed top-20 opacity-40 dark:opacity-60"
      />
      <GradientBackground
        variant="small"
        className="absolute bottom-0 opacity-20 dark:opacity-10"
      />
      <div className="flex justify-center mt-8">
        <button
          onClick={captureImage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          시작
        </button>
      </div>
      <div className="flex flex-wrap justify-center mt-8">
        {capturedImages.map((imageFileName, index) => (
          <div key={index} className="mr-4 mb-4">
            <img src={imageFileName} alt={`Image ${index}`} className="w-32 h-32" />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        {capturedImages.length >= 10 && (
          <button
            onClick={createGif}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            GIF 생성
          </button>
        )}
      </div>
      <div className="flex justify-center mt-8">
        {capturedImages.length >= 10 && (
          <img
            id="gifPreview"
            src=""
            alt="Generated GIF"
            style={{ display: 'none' }}
          />
        )}
      </div>
    </Layout>
  );
}

export function getStaticProps() {
  const posts = getPosts();
  const globalData = getGlobalData();

  return { props: { posts, globalData } };
}

export default Index;
