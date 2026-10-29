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
      ref={(node) => { drag(node); }}
      className={`mb-2 md:mb-3 lg:mb-4 ${isDragging ? 'opacity-50' : ''}`}
    >
      <Card
        variant="default"
        size="medium"
        showHover={true}
        className={`bg-raised border-brand shadow-lg hover:shadow-xl hover:border-brand-soft ${isDragging ? '!border-orange border-4' : ''}`}
      >
        {card}
      </Card>
    </div>
  );
};
