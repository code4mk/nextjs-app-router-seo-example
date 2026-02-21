export default function StarRating({
  rate,
  count,
}: {
  rate: number;
  count: number;
}) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rate));

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {stars.map((filled, i) => (
          <span
            key={i}
            className={
              filled
                ? "text-amber-500"
                : "text-zinc-300 dark:text-zinc-600"
            }
          >
            &#9733;
          </span>
        ))}
      </div>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        {rate} ({count} reviews)
      </span>
    </div>
  );
}
