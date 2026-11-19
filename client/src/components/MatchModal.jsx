import { motion } from 'framer-motion';
import { HeartIcon } from './Icons.jsx';

export default function MatchModal({ me, match, onClose, onViewMatches }) {
  const { profile } = match;

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-title"
    >
      <motion.div
        className="modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="modal__photos">
          {me && <img src={me.photo} alt="You" />}
          <span className="modal__heart">
            <HeartIcon />
          </span>
          <img src={profile.photo} alt={profile.name} />
        </div>
        <h2 id="match-title" className="modal__title">
          It&rsquo;s a match!
        </h2>
        <p className="modal__text">You and {profile.name} liked each other.</p>
        <div className="modal__actions">
          <button className="btn btn--primary" onClick={onViewMatches}>
            View matches
          </button>
          <button className="btn btn--ghost" onClick={onClose} autoFocus>
            Keep swiping
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
