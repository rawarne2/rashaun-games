import { useDrop } from 'react-dnd';
import { DraggableCard, ITEM_TYPE } from './DraggableCard';

export type BoxProps = {
  onDrop: (item: string, index: number) => void;
  number: number;
  card: string | null;
};

export const DropBox = ({ onDrop, number, card }: BoxProps) => {
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: { card: string }) => onDrop(item.card, number - 1),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div className='flex min-[420px]:flex-row lg:flex-col items-center justify-center'>
      <div
        ref={(node) => { drop(node); }}
        className={`relative flex items-center justify-center w-[42vw] md:w-[31.5vw] lg:w-[16vw] max-w-[16.5rem] h-[14vh] md:h-[14vh] lg:h-[15.5vh] mb-2 lg:mb-4 border-dashed border-[3px] rounded-xl transition-colors ${isOver ? 'border-brand-soft bg-brand/15' : 'bg-background/50 border-line-strong'
          }`}
      >
        {card ? (
          <div className='absolute inset-0 flex items-center justify-center [&>div]:!mb-0'>
            <DraggableCard card={card} />
          </div>
        ) : (
          <p className='text-xl font-bold text-muted-foreground lg:hidden'>{number}</p>
        )}
      </div>
    </div>
  );
};
