import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  readOnly?: boolean;
}

const StarRating = ({ value = 0, onChange, readOnly = false }: StarRatingProps) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleMouseEnter = (rating: number) => {
    if (readOnly) return;
    setHoveredRating(rating);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoveredRating(null);
  };

  const handleClick = (rating: number) => {
    if (readOnly) return;
    onChange(rating);
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => handleClick(rating)}
          onMouseEnter={() => handleMouseEnter(rating)}
          onMouseLeave={handleMouseLeave}
          className={`text-4xl focus:outline-none ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
          disabled={readOnly}
          aria-label={`Rate ${rating} stars`}
        >
          <Star
            className={`h-8 w-8 fill-current ${
              (hoveredRating !== null ? rating <= hoveredRating : rating <= value)
                ? 'text-amber-500'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
