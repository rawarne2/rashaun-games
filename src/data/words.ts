import { Word, Category } from '../types/game';

const createWords = (category: Category, words: string[]): Word[] =>
    words.map((word, index) => ({
        id: index,
        word,
        category,
    }));

const wordListsByCategory: Record<Category, string[]> = {
    'Sports': [
        'Basketball', 'Soccer', 'Tennis', 'Football', 'Baseball',
        'Golf', 'Hockey', 'Swimming', 'Boxing', 'Volleyball',
        'Marathon', 'Skateboard', 'Wrestling', 'Archery'
    ],
    'Movies & TV': [
        'Stranger Things', 'Star Wars', 'Friends', 'Breaking Bad',
        'The Office', 'Marvel', 'Game of Thrones', 'Batman', 'Titanic',
        'Harry Potter', 'The Simpsons', 'Jaws', 'Frozen'
    ],
    'Places': [
        'Paris', 'New York', 'Beach', 'Mountain', 'Airport',
        'Hospital', 'School', 'Park', 'Restaurant', 'Mall',
        'Library', 'Zoo', 'Stadium', 'Hotel'
    ],
    'Fun and Games': [
        'Monopoly', 'Chess', 'Video Games', 'Puzzle', 'Hide and Seek',
        'Tag', 'Jenga', 'Cards', 'Bowling', 'Karaoke', 'Poker', 'Pictionary',
        'Twister', 'Scrabble', 'Trivia Night', 'Charades'
    ],
    'People': [
        'Teacher', 'Doctor', 'Artist', 'Chef', 'Athlete',
        'Musician', 'Scientist', 'Actor', 'Firefighter', 'Pilot',
        'Lawyer', 'Astronaut', 'Magician', 'Babysitter'
    ],
};

const seenWords = new Set<string>();
for (const words of Object.values(wordListsByCategory)) {
    for (const word of words) {
        const key = word.toLowerCase();
        if (seenWords.has(key)) {
            throw new Error(`Duplicate word or phrase in words.ts: "${word}"`);
        }
        seenWords.add(key);
    }
}

export const wordsByCategory: Record<Category, Word[]> = {
    'Sports': createWords('Sports', wordListsByCategory['Sports']),
    'Movies & TV': createWords('Movies & TV', wordListsByCategory['Movies & TV']),
    'Places': createWords('Places', wordListsByCategory.Places),
    'Fun and Games': createWords('Fun and Games', wordListsByCategory['Fun and Games']),
    'People': createWords('People', wordListsByCategory.People),
};