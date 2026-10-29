import React from 'react';
import { Card, CardProps } from './Card';

export interface ResultCardProps extends Omit<CardProps, 'children'> {
    text: string;
    rank?: number;
    score?: number;
    showRank?: boolean;
    showScore?: boolean;
    layout?: 'default' | 'compact';
}

export const ResultCard: React.FC<ResultCardProps> = ({
    text,
    rank,
    score,
    showRank = false,
    showScore = false,
    variant = 'default',
    size = 'medium',
    layout = 'default',
    className = '',
    ...cardProps
}) => {
    // Base responsive classes for the card container
    const baseCardClasses = layout === 'compact'
        ? "w-[35vw] md:w-[25vw] lg:w-[12vw] h-[9.5vh] text-sm md:text-base lg:text-lg p-1 lg:p-2"
        : "w-[40vw] md:w-[30vw] lg:w-[15vw] h-[10vh] lg:h-[11vh] min-w-32 max-w-60 text-sm md:text-base lg:text-xl p-1 lg:p-4";

    // Combine with any additional className passed in
    const finalClassName = `${baseCardClasses} ${className}`.trim();

    return (
        <div className="flex lg:flex-col justify-center items-center">
            {showRank && rank && (
                <span className="inline-flex items-center pr-2 py-1 lg:mr-0 lg:mb-1 font-medium text-lg lg:text-xl">
                    {rank}
                </span>
            )}
            {showScore && typeof score === 'number' && (
                <span
                    className={`inline-flex items-center rounded-lg mr-1 lg:mr-0 justify-center px-2 py-0.5 lg:mb-1 font-bold text-xs lg:text-sm ${score === 4
                        ? 'bg-success/20 text-success-soft'
                        : score >= 2
                            ? 'bg-warning/20 text-warning-soft'
                            : 'bg-danger/20 text-danger-soft'
                        }`}
                >
                    +{score}
                </span>
            )}
            <Card variant={variant} size={size} className={finalClassName} {...cardProps}>
                {text}
            </Card>
        </div>
    );
}; 