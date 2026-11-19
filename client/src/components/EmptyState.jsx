import { Link } from 'react-router-dom';
import { HeartIcon } from './Icons.jsx';

export default function EmptyState({ title, text, linkTo, linkText }) {
  return (
    <div className="empty">
      <div className="empty__icon">
        <HeartIcon filled={false} />
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
      {linkTo && (
        <Link className="btn btn--primary" to={linkTo}>
          {linkText}
        </Link>
      )}
    </div>
  );
}
