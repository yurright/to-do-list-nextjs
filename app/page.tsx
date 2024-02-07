import { NextPage } from "next";

import Image from "next/image";
import MallorcaImg from "@/public/images/mallorca.jpeg";

const Home: NextPage = () => {
  return (
    <div className="bg-gray-100">
      <div className=" relative w-48 h-48 md:w-96 md:h-96">
        <Image src="/images/nextjs.png" alt="NextJS" fill />
      </div>
      <div className=" relative w-48 h-36 md:w-96 md:h-72">
        <Image src={MallorcaImg} alt="Mallorca" fill placeholder="blur" />
      </div>
    </div>
  );
};

export default Home;
