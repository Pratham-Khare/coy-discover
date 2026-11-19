import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeed, getMe, sendSwipe } from '../api.js';
import SwipeCard from '../components/SwipeCard.jsx';
import MatchModal from '../components/MatchModal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { CloseIcon, HeartIcon } from '../components/Icons.jsx';

export default function Swipe() {
  const [profiles, setProfiles] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [me, setMe] = useState(null);
  const [match, setMatch] = useState(null);
  const [toast, setToast] = useState('');
  const topCardRef = useRef(null);
  const navigate = useNavigate();

  const loadFeed = useCallback(async () => {
    try {
      setProfiles(await getFeed());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadFeed();
    getMe().then(setMe).catch(() => {}); // only used for the match screen photo
  }, [loadFeed]);

  // Hide the error toast after a few seconds.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Called by a card once its fly-out animation has finished.
  async function handleSwipe(profile, action) {
    setProfiles((current) => current.filter((p) => p.id !== profile.id));
    try {
      const result = await sendSwipe(profile.id, action);
      if (result.matched) setMatch(result.match);
    } catch {
      setToast("Couldn't save that swipe. Please try again.");
      loadFeed(); // resync with the server
    }
  }

  if (status === 'loading') {
    return <p className="center muted">Loading profiles…</p>;
  }

  if (status === 'error') {
    return (
      <div className="center">
        <p className="muted">Couldn&rsquo;t load profiles.</p>
        <button className="btn btn--primary" onClick={loadFeed}>
          Try again
        </button>
      </div>
    );
  }

  const visible = profiles.slice(0, 2); // the top card plus the one peeking behind it

  return (
    <div className="swipe">
      <div className="deck">
        {visible.length === 0 ? (
          <EmptyState
            title="You've seen everyone"
            text="No new profiles right now. Check back later."
            linkTo="/discover/matches"
            linkText="See your matches"
          />
        ) : (
          visible.map((profile, i) => (
            <SwipeCard
              key={profile.id}
              ref={i === 0 ? topCardRef : null}
              profile={profile}
              isTop={i === 0}
              onSwipe={handleSwipe}
            />
          ))
        )}
      </div>

      {visible.length > 0 && (
        <div className="actions">
          <button className="action action--pass" aria-label="Pass" onClick={() => topCardRef.current?.swipe('pass')}>
            <CloseIcon />
          </button>
          <button className="action action--like" aria-label="Like" onClick={() => topCardRef.current?.swipe('like')}>
            <HeartIcon />
          </button>
        </div>
      )}

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}

      {match && (
        <MatchModal
          me={me}
          match={match}
          onClose={() => setMatch(null)}
          onViewMatches={() => navigate('/discover/matches')}
        />
      )}
    </div>
  );
}
