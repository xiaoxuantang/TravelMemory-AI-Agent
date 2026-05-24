"use client";

import SparkMD5 from "spark-md5";

const chunkSize = 2 * 1024 * 1024;

export async function calculateImageHash(file: File): Promise<string> {
  const spark = new SparkMD5.ArrayBuffer();
  let offset = 0;

  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    const buffer = await chunk.arrayBuffer();
    spark.append(buffer);
    offset += chunkSize;
  }

  return spark.end();
}
