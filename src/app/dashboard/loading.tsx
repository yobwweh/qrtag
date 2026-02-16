import React from "react";

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-[#F7F8FA]">
            {/* HEADER SKELETON */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT SKELETON */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8 space-y-3">
                    <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* FILTERS SKELETON */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="ml-auto h-10 w-36 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>

                {/* CARDS GRID SKELETON */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-200 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="h-6 w-24 bg-gray-100 rounded animate-pulse"></div>
                                <div className="h-6 w-6 bg-gray-100 rounded animate-pulse"></div>
                            </div>
                            <div className="h-7 w-48 bg-gray-100 rounded animate-pulse"></div>
                            <div className="space-y-2 mt-4 pt-4 border-t border-gray-50">
                                <div className="h-4 w-full bg-gray-50 rounded animate-pulse"></div>
                                <div className="h-4 w-full bg-gray-50 rounded animate-pulse"></div>
                            </div>
                            <div className="flex gap-2 pt-3 border-t border-gray-50">
                                <div className="h-10 flex-1 bg-gray-100 rounded-lg animate-pulse"></div>
                                <div className="h-10 w-16 bg-gray-100 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
