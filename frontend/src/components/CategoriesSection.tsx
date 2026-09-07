import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { getRequest } from "../api/APIManager";
import { urlCategories } from "../api/APIs";
import { type Categories } from "../models/modelCategories";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
    selectedCategories: string[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    onError?: (msg: string) => void;
    singleSelect?: boolean;
};

const CategoryUI = React.memo(
    ({
        section,
        items,
        selectedCategories,
        ToggleSection,
        ToggleCategory,
    }: {
        section: string;
        items: string[];
        selectedCategories: string[];
        ToggleSection: (section: string) => void;
        ToggleCategory: (item: string) => void;
    }) => {
        const allSelected = useMemo(
            () => items.every((item) => selectedCategories.includes(item)),
            [items, selectedCategories]
        );

        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 p-4 sm:p-5 rounded-xl shadow-md border border-white/20 w-full">
                <h2
                    onClick={() => ToggleSection(section)}
                    className={`text-base sm:text-lg font-bold mb-4 select-none cursor-pointer transition duration-200 ${allSelected ? "text-cyan-400" : "text-white hover:text-purple-400"}`}>
                    {section}
                </h2>
                <div className="flex flex-wrap gap-2">
                    <AnimatePresence initial={false}>
                        {items.map((item, idx) => {
                            const isSelected = selectedCategories.includes(item);
                            return (
                                <motion.span
                                    layout
                                    key={idx}
                                    onClick={() => ToggleCategory(item)}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    whileTap={{ scale: 1.2 }}
                                    whileHover={{ scale: 0.95 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition select-none cursor-pointer break-words max-w-full truncate ${isSelected
                                        ? "bg-purple-600 text-white"
                                        : "bg-pink-600 text-white hover:bg-pink-700"
                                        }`}>
                                    {item}
                                </motion.span>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </motion.div>
        );
    }
);

function CategoriesSection({ selectedCategories, setSelectedCategories, onError, singleSelect }: Props) {
    const [currPage, setCurrPage] = useState(1);
    const [isShowMore, setIsShowMore] = useState(true);
    const [categoriesData, setCategoriesData] = useState<Record<string, string[]>>({});
    const [isLoading, setIsLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const loadingRef = useRef(false);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    const LoadCategories = useCallback(async (page: number) => {
        if (!isShowMore || loadingRef.current) return;
        loadingRef.current = true;
        setIsLoading(true);

        const { data, error } = await getRequest<Categories>(`${urlCategories}?page=${page}`);
        if (data) {
            setCurrPage(page);
            setIsShowMore(page < data.totalPages);
            setCategoriesData((prev) => {
                const updated = { ...prev };
                for (const key in data.categories) {
                    const existing = new Set(updated[key] ?? []);
                    data.categories[key].forEach((item: string) => existing.add(item));
                    updated[key] = Array.from(existing);
                }
                return updated;
            });
        } else {
            onError?.(error || "Failed to load categories.");
        }

        setIsLoading(false);
        loadingRef.current = false;
    }, [isShowMore, onError]);

    const ToggleSection = useCallback((section: string) => {
        const items = categoriesData[section] || [];
        const allSelected = items.every((item) => selectedCategories.includes(item));

        setSelectedCategories((prev) => {
            if (singleSelect) {
                return allSelected ? [] : [items[0]];
            }
            if (allSelected) {
                return prev.filter((cat) => !items.includes(cat));
            } else {
                const newSet = new Set(prev);
                items.forEach((item) => newSet.add(item));
                return Array.from(newSet);
            }
        });

    }, [categoriesData, selectedCategories, setSelectedCategories, singleSelect]);

    const ToggleCategory = useCallback((category: string) => {
        setSelectedCategories((prev) => {
            if (singleSelect) return [category];
            return prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category];
        });

    }, [setSelectedCategories, singleSelect]);

    useEffect(() => {
        LoadCategories(1);
    }, [LoadCategories]);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current || isLoading || !isShowMore) return;

            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
                const { scrollTop, scrollHeight, clientHeight } = containerRef.current!;
                if (scrollHeight - scrollTop <= clientHeight + 100) {
                    LoadCategories(currPage + 1);
                }
            }, 100);
        };

        const current = containerRef.current;
        current?.addEventListener("scroll", handleScroll);
        return () => current?.removeEventListener("scroll", handleScroll);
    }, [currPage, isShowMore, isLoading, LoadCategories]);

    const CategorySkeleton = () => (
        <motion.div
            layout
            className="bg-white/10 p-4 rounded-xl shadow-md border border-white/20 w-full animate-pulse space-y-3">
            <div className="h-5 bg-white/30 rounded w-1/3" />
            <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-6 w-20 bg-white/20 rounded-full" />
                ))}
            </div>
        </motion.div>
    );

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden custom-scroll space-y-6"
        >
            <AnimatePresence initial={false}>
                {Object.entries(categoriesData).map(([section, items]) => (
                    <CategoryUI
                        key={section}
                        section={section}
                        items={items}
                        selectedCategories={selectedCategories}
                        ToggleSection={ToggleSection}
                        ToggleCategory={ToggleCategory}
                    />
                ))}
                {isLoading && <CategorySkeleton />}
            </AnimatePresence>
        </div>
    );
}

export default React.memo(CategoriesSection);