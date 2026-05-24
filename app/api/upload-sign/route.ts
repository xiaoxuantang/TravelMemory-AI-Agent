import { NextResponse } from "next/server";

import { createUploadSignature } from "../../lib/services/upload-sign-service";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await createUploadSignature(payload);

    if (!result.ok) {
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json(
      { message: "上传服务暂时不可用，请稍后再试。" },
      { status: 500 }
    );
  }
}
