"use client";

import TextEditor from "@/components/shared/TextEditor";
import api from "@/constants/apiURL";
import { useState } from "react";
import { Image, Upload } from "antd";
import slugify from "slugify";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function ManageBrand() {
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const handleCreateBrand = async () => {
    if (!brandName || !fileList) {
      alert("Vui lòng nhập tên và chọn ảnh!");
      return;
    }
    const file = await getBase64(fileList[0].originFileObj);

    try {
      const response = await api.post("/brands", {
        name: brandName,
        logo: file,
        description: description,
      });

      console.log("Brand created:", response.data);
    } catch (error) {
      console.error("Lỗi khi gửi request:", error);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  return (
    <main className="p-6 grid grid-cols-8 gap-8">
      <h1 className="text-lg whitespace-nowrap col-span-1 flex justify-end">
        Tên Brand
      </h1>

      <input
        type="text"
        placeholder="Nhập tên brand"
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
        className="border p-3 w-full col-span-7"
      />

      <h1 className="text-lg col-span-1 flex justify-end">Logo Brand</h1>

      <div className="col-span-7 flex">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          maxCount={1}
        >
          {fileList.length >= 1 ? null : (
            <button
              style={{
                border: 0,
                background: "none",
              }}
              type="button"
            >
              <div className="w-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>

              <div
                style={{
                  marginTop: 8,
                }}
              >
                Upload
              </div>
            </button>
          )}
        </Upload>

        {previewImage && (
          <Image
            wrapperStyle={{
              display: "none",
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </div>

      <h1 className=" col-span-1 text-lg justify-end flex">Mô tả Brand</h1>
      <div className="col-span-7 min-h-[400px]">
        <TextEditor
          value={description}
          onChange={setDescription}
          className="h-full"
        />
      </div>

      <div className=" col-span-1"></div>
      <button
        className="mt-10 bg-blue-500 col-span-7 p-3 font-semibold text-white"
        onClick={handleCreateBrand}
      >
        Thêm Brand
      </button>
    </main>
  );
}
