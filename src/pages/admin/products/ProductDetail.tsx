"use client";

import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../../api/productService";
import { ImageManager } from "./ImageManager";
import { VersionManager } from "./VersionManager";
import { ArrowLeft, Pencil } from "lucide-react";

export default function ProductDetail() {
    const { id } = useParams();

    const {
        data: product,
        isLoading,
        isError
    } = useQuery({
        queryKey: ["product", id],
        queryFn: () => productService.getById(Number(id)).then(res => res.data),
        enabled: !!id
    });

    // =========================
    // LOADING
    // =========================
    if (isLoading) {
        return (
            <div className="text-center py-20 text-slate-500">
                ⏳ Đang tải sản phẩm...
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================
    if (isError || !product) {
        return (
            <div className="text-center py-20 text-red-500">
                ❌ Không tìm thấy sản phẩm
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        to="/admin/products"
                        className="text-sm text-slate-500 flex items-center gap-1 hover:text-blue-600"
                    >
                        <ArrowLeft size={16} /> Quay lại
                    </Link>

                    <h1 className="text-3xl font-bold mt-2">
                        {product.name}
                    </h1>

                    <p className="text-sm text-slate-400">
                        {product.slug}
                    </p>
                </div>

                <Link
                    to={`/admin/edit/${product.id}`}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 shadow"
                >
                    <Pencil size={16} /> Chỉnh sửa
                </Link>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-3 gap-6">

                {/* LEFT */}
                <div className="col-span-2 space-y-6">

                    {/* DESCRIPTION */}
                    <div className="bg-white p-6 rounded-2xl shadow border">
                        <h2 className="font-semibold mb-3 text-lg">
                            📄 Mô tả
                        </h2>

                        <p className="text-slate-600 whitespace-pre-line">
                            {product.description || "Chưa có mô tả"}
                        </p>
                    </div>

                    {/* IMAGES */}
                    <div className="bg-white p-6 rounded-2xl shadow border">
                        <h2 className="font-semibold mb-3 text-lg">
                            🖼 Hình ảnh
                        </h2>

                        {product.images?.length ? (
                            <div className="grid grid-cols-4 gap-3 mb-4">
                                {product.images.map((img: any) => (
                                    <img
                                        key={img.id}
                                        src={`https://le-minh-thanh.onrender.com${img.imageUrl}`}
                                        className="w-full h-24 object-cover rounded-lg border"
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm">
                                Chưa có ảnh
                            </p>
                        )}

                        <ImageManager productId={product.id} />
                    </div>

                    {/* VERSIONS */}
                    <div className="bg-white p-6 rounded-2xl shadow border">
                        <h2 className="font-semibold mb-3 text-lg">
                            📦 Phiên bản
                        </h2>

                        {product.versions?.length ? (
                            <div className="space-y-2 mb-4">
                                {product.versions.map((v: any) => (
                                    <div
                                        key={v.id}
                                        className="flex justify-between items-center border p-3 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {v.version}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {v.changelog || "No changelog"}
                                            </p>
                                        </div>

                                        <a
                                            href={`https://le-minh-thanh.onrender.com${v.fileUrl}`}
                                            target="_blank"
                                            className="text-blue-600 text-sm"
                                        >
                                            Tải file
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm">
                                Chưa có version
                            </p>
                        )}

                        <VersionManager productId={product.id} />
                    </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-6">

                    {/* PRICE */}
                    <div className="bg-white p-5 rounded-2xl shadow border">
                        <p className="text-sm text-slate-500">Giá</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {product.price === 0
                                ? "Miễn phí"
                                : `${product.price.toLocaleString()}đ`}
                        </p>
                    </div>

                    {/* STATUS */}
                    <div className="bg-white p-5 rounded-2xl shadow border">
                        <p className="text-sm text-slate-500 mb-2">Trạng thái</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium
                            ${product.status === 1
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                            {product.status === 1 ? "Công khai" : "Bản nháp"}
                        </span>
                    </div>

                    {/* INFO */}
                    <div className="bg-white p-5 rounded-2xl shadow border space-y-2 text-sm">
                        <p><strong>Developer:</strong> {product.developer?.name || "N/A"}</p>
                        <p><strong>Publisher:</strong> {product.publisher?.name || "N/A"}</p>
                        <p><strong>Release:</strong> {
                            product.releaseDate
                                ? new Date(product.releaseDate).toLocaleDateString()
                                : "Chưa có"
                        }</p>
                    </div>

                    {/* CATEGORY */}
                    <div className="bg-white p-5 rounded-2xl shadow border">
                        <p className="text-sm text-slate-500 mb-2">Danh mục</p>

                        <div className="flex flex-wrap gap-2">
                            {product.productCategories?.length ? (
                                product.productCategories.map((pc: any) => (
                                    <span
                                        key={pc.categoryId}
                                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                                    >
                                        {pc.category?.name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-slate-400 text-xs">
                                    Không có
                                </span>
                            )}
                        </div>
                    </div>

                    {/* META */}
                    <div className="bg-white p-5 rounded-2xl shadow border text-xs text-slate-500 space-y-1">
                        <p>
                            Created: {product.createdAt
                                ? new Date(product.createdAt).toLocaleString()
                                : "N/A"}
                        </p>


                    </div>
                </div>
            </div>
        </div>
    );
}