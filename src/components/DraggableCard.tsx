import { useDrag } from 'react-dnd';
import { Card } from './Card';

export const ITEM_TYPE = 'CARD';

export const DraggableCard = ({ card }: { card: string }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { card },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`mb-2 md:mb-3 lg:mb-4 ${isDragging ? 'opacity-50' : ''}`}
    >
      <Card
        variant="default"
        size="medium"
        showHover={true}
        className={`bg-blue-50 border-blue-400 shadow-lg hover:shadow-xl ${isDragging ? 'border-red-400 border-4' : ''}`}
      >
        {card}
      </Card>
    </div>
  );
};
