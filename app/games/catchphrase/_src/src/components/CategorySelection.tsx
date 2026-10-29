import { Category } from '../types/game';
import { useGame } from '../context/GameContext';

export function CategorySelection() {
  const { selectCategory } = useGame();
  const categories: Category[] = [
    'Sports',
    'Movies & TV',
    'Places',
    'Fun and Games',
    'People',
  ];

  return (
    <div className='rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/20 sm:p-6'>
      <h2 className='mb-4 text-center text-xl font-bold sm:text-2xl'>Pick a Category</h2>
      <div className='grid gap-3 sm:grid-cols-2'>
        {categories.map((category, i) => (
          <button
            key={category}
            onClick={() => selectCategory(category)}
            className={`w-full rounded-xl border border-line-strong bg-raised px-5 py-4 text-lg font-semibold text-foreground transition-colors hover:border-orange hover:bg-raised-hover active:scale-[0.98] ${i === categories.length - 1 ? 'sm:col-span-2' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
