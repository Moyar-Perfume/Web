import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongoDB";

import cloudinary from "@/libs/cloudinary";
import Brand from "@/models/Brand";
import slugify from "slugify";
import { Descriptions } from "antd";

export async function GET() {
  await connectDB();
  try {
    const brands = await Brand.find();
    return NextResponse.json(brands, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách brand" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const { name, logo, description } = await req.json();

    const slug = slugify(name, { lower: true, strict: true });

    let existingBrand = await Brand.findOne({ slug });

    if (existingBrand) {
      return Response.json(
        { error: "Tên thương hiệu đã tồn tại!" },
        { status: 400 }
      );
    }

    const uploadResponse = await cloudinary.v2.uploader.upload(logo, {
      transformation: [{ width: 100, height: 100, crop: "limit" }],
      folder: "brands",
      public_id: slug,
      use_filename: true,
    });

    const newBrand = await Brand.create({
      name,
      logo: uploadResponse.secure_url,
      slug: slug,
      description: description,
    });

    return NextResponse.json(newBrand, { status: 201 });
  } catch (error) {
    console.error("Lỗi tạo brand:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();
  try {
    const { id } = await req.json();
    const brand = await Brand.findById(id);
    if (!brand) {
      return NextResponse.json(
        { error: "Brand không tồn tại" },
        { status: 404 }
      );
    }

    // Lấy public_id từ URL ảnh trên Cloudinary
    const publicId = brand.logo.split("/").pop().split(".")[0];

    // Xóa ảnh trên Cloudinary
    await cloudinary.v2.uploader.destroy(`brands/${publicId}`);

    // Xóa brand trong MongoDB
    await Brand.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Xóa brand thành công!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi xoá brand:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
