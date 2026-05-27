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
    <div className='p-6 max-w-md mx-auto'>
      <h2 className='text-2xl font-bold text-center mb-6'>Select a Category</h2>
      <div className='grid gap-4'>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => selectCategory(category)}
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg 
                     transition-colors text-lg w-full'
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
