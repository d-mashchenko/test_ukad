import React from 'react';
import { Link } from 'react-router-dom';

import './Card.scss';
import PropTypes from 'prop-types';
import cn from 'class-names';

export function Card({ image, name, temperament, className, mode, id }) {
  const cardMode = cn({
    'Slider-format': mode === 'primary',
  });

  return (
    <div className={cn('Card', cardMode, className)}>
      <div className="Card__image-container">
        <Link to={`/products/${id}`}>
          <img className="Card__image" src={image.url} alt="fine_dog" />
        </Link>
      </div>
      <div className="Card__info-container">
        <h4 className="Card__sub-title">{name}</h4>
        <h3 className="Card__title">
          <Link to={`/products/${id}`}>{temperament}</Link>
        </h3>
      </div>
    </div>
  );
}

Card.propTypes = {
  image: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  temperament: PropTypes.string.isRequired,
  className: PropTypes.string,
  mode: PropTypes.oneOf(['default', 'primary']),
  id: PropTypes.number.isRequired,
};
