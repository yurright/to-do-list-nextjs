"use client";

import { NextPage } from "next";
import { useParams } from "next/navigation";

const Post: NextPage = () => {
  const { id } = useParams();

  return <div>{id}번 Post 페이지입니다</div>;
};

export default Post;
