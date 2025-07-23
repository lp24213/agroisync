import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Head from "next/head";

const Intro = dynamic(() => import("@/components/intro/IntroVideo"), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>AGROTM - Revolução Cripto</title>
      </Head>
      <motion.div
        className="min-h-screen bg-black text-white flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <Intro />
      </motion.div>
    </>
  );
}
