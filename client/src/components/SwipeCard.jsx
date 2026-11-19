import { useImperativeHandle, useRef } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

// How far (in px, with a boost from flick speed) a card must travel to count as a swipe.
const SWIPE_THRESHOLD = 120;

/**
 * One profile card. The top card can be dragged left/right. The parent can
 * also trigger a swipe through `ref.current.swipe('like' | 'pass')`, which the
 * desktop buttons use.
 */
export default function SwipeCard({ profile, isTop, onSwipe, ref }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 0, 250], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [30, SWIPE_THRESHOLD], [0, 1]);
  const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, -30], [1, 0]);
  const isLeaving = useRef(false);

  async function flyOut(action) {
    if (isLeaving.current) return; // ignore double clicks while the card is leaving
    isLeaving.current = true;
    const direction = action === 'like' ? 1 : -1;
    await animate(x, direction * (window.innerWidth + 200), { duration: 0.35, ease: 'easeIn' });
    onSwipe(profile, action);
  }

  useImperativeHandle(ref, () => ({ swipe: flyOut }));

  function handleDragEnd(_event, info) {
    const power = info.offset.x + info.velocity.x * 0.2;
    if (power > SWIPE_THRESHOLD) flyOut('like');
    else if (power < -SWIPE_THRESHOLD) flyOut('pass');
    else animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 }); // snap back
  }

  const place = [profile.college, profile.city].filter(Boolean).join(' · ');

  return (
    <motion.article
      className={`card ${isTop ? 'card--top' : ''}`}
      style={{ x, rotate, zIndex: isTop ? 2 : 1 }}
      drag={isTop ? 'x' : false}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      initial={false}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 26 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      aria-hidden={!isTop}
      aria-label={`${profile.name}, ${profile.age}`}
    >
      <img className="card__photo" src={profile.photo} alt="" draggable={false} />

      <motion.span className="stamp stamp--like" style={{ opacity: likeOpacity }}>
        LIKE
      </motion.span>
      <motion.span className="stamp stamp--nope" style={{ opacity: nopeOpacity }}>
        NOPE
      </motion.span>

      <div className="card__info">
        <h2 className="card__name">
          {profile.name}, <span>{profile.age}</span>
        </h2>
        {place && <p className="card__place">{place}</p>}
        {profile.bio && <p className="card__bio">{profile.bio}</p>}
        {profile.interests?.length > 0 && (
          <ul className="chips">
            {profile.interests.map((interest) => (
              <li key={interest} className="chip">
                {interest}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.article>
  );
}
