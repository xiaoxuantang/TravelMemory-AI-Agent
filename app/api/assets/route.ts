import { NextResponse } from "next/server";

import { persistUploadAsset } from "../../lib/services/asset-service";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await persistUploadAsset(payload);

    if (!result.ok) {
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }

    return NextResponse.json({
      assetId: result.asset.id,
      asset: result.asset
    });
  } catch {
    return NextResponse.json(
      { message: "图片信息保存失败，请重试。" },
      { status: 500 }
    );
  }
}
