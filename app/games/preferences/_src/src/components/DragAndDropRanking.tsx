import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableCard } from './DraggableCard';
import { DropBox } from './DropBox';
import { TouchBackend } from 'react-dnd-touch-backend';
import { usePreview } from 'react-dnd-preview';
import { isMobile } from 'react-device-detect';

const backend = isMobile ? TouchBackend : HTML5Backend;

// Handles both the target's ranking and group's prediction
export const DragAndDropRanking = ({ availableCards, rankedCards, setRankedCards, setAvailableCards }: { availableCards: string[], rankedCards: (string | null)[], setRankedCards: (cards: (string | null)[]) => void, setAvailableCards: (cards: string[]) => void }) => {

  const PreviewPicture = () => {
    const preview = usePreview();
    if (!preview.display || !isMobile) {
      return null;
    }
    const { itemType, item, style, ref } = preview;
    const currentCard = item as { card: string };
    return (
      <div
        className='z-50'
        style={style}
        ref={(node) => (ref.current = node as HTMLDivElement | null)}
        itemRef={String(item)}
        typeof={itemType?.toString()}
      >
        <DraggableCard card={currentCard.card} />
      </div>
    );
  };

  const handleDrop = (item: string, index: number) => {
    const newRankings = [...rankedCards];
    const updatedAvailableCards = [...availableCards];

    // Find where the card is coming from
    const previousIndex = rankedCards.indexOf(item);

    if (previousIndex !== -1) {
      // Card is being moved from another drop box
      newRankings[previousIndex] = null;
    } else {
      // Card is being moved from the available cards
      const availableIndex = availableCards.indexOf(item);
      updatedAvailableCards.splice(availableIndex, 1);
    }

    // If there is an existing card in the drop box, move it to the previous location
    const displacedCard = newRankings[index];
    if (displacedCard) {
      if (previousIndex !== -1) {
        // Move displaced card to the previous drop box
        newRankings[previousIndex] = displacedCard;
      } else {
        // Move displaced card back to available cards
        updatedAvailableCards.push(displacedCard);
      }
    }

    // Place the new card in the drop box
    newRankings[index] = item;

    setRankedCards(newRankings);
    setAvailableCards(updatedAvailableCards);
  };

  return (
    <DndProvider backend={backend}>
      <div className='lg:p-4 w-full flex lg:flex-col items-center justify-center'>
        <div className='flex flex-col justify-evenly lg:grid lg:grid-cols-5 lg:gap-4 lg:mb-4 pr-2 lg:pr-0'>
          {availableCards.map((card, index) => (
            <DraggableCard key={index} card={card} />
          ))}
        </div>

        <div className='flex flex-col justify-evenly lg:grid grid-cols-5 lg:gap-4 pl-2 lg:pl-0'>
          {[1, 2, 3, 4, 5].map((number, index) => (
            <div key={index} className='flex lg:flex-col items-center'>
              <DropBox
                key={index}
                onDrop={handleDrop}
                number={number}
                card={rankedCards[index]}
              />
              {rankedCards[index] && <p className='lg:hidden md:mt-1 ml-2 text-xl font-bold '>{number}</p>}
              <p className='hidden lg:block md:mt-1 ml-2 text-xl font-bold '>{number}</p>
            </div>
          ))}
        </div>
      </div>
      <PreviewPicture />
    </DndProvider>
  );
};
