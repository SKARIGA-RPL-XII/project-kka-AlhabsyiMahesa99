type Props = {
  categories: string[];
  activeCategory: string;
  onChangeCategory: (category: string) => void;
};

export function RewardCategoryFilter({ categories, activeCategory, onChangeCategory }: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onChangeCategory(category)}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeCategory === category
                ? "bg-[#299E63] text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
