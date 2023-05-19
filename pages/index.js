import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPosts } from '../utils/mdx-utils';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout, { GradientBackground } from '../components/Layout';
import ArrowIcon from '../components/ArrowIcon';
import { getGlobalData } from '../utils/global-data';
import SEO from '../components/SEO';

function Index({ posts, globalData, socket }) {
  useEffect(() => {
    if (socket) {
      socket.on('imageCaptured', (imageFileName) => {
        // 이미지를 HTML에 추가하는 로직 작성
      });
    }
  }, [socket]);

  // 나머지 코드 작성

  return (
    // 나머지 JSX 코드 작성
  );
}

export function getStaticProps() {
  const posts = getPosts();
  const globalData = getGlobalData();

  return { props: { posts, globalData } };
}

export default Index;
