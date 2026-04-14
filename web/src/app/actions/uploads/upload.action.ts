"use server";

import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

export async function upload(files: File[]) {
  try {
    if (files.length === 0) {
      return { success: false, message: "No files uploaded" };
    }
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });
    const uploadedFiles: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split(".").pop();
      const fileName = `${uuid()}.${ext}`;

      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      uploadedFiles.push(`/uploads/${fileName}`);
    }

    return {
      success: true,
      message: "All files uploaded",
      urls: uploadedFiles,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal server error" };
  }
}
