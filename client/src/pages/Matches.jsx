import { useEffect, useState } from 'react';
import { getMatches } from '../api.js';
import EmptyState from '../components/EmptyState.jsx';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function Matches() {
  const [matches, setMatches] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getMatches()
      .then(setMatches)
      .catch(() => setFailed(true));
  }, []);

  if (failed) return <p className="center muted">Couldn&rsquo;t load your matches.</p>;
  if (!matches) return <p className="center muted">Loading matches…</p>;

  if (matches.length === 0) {
    return (
      <EmptyState
        title="No matches yet"
        text="When someone you like likes you back, they'll show up here."
        linkTo="/discover"
        linkText="Start swiping"
      />
    );
  }

  return (
    <ul className="matches">
      {matches.map(({ id, matchedAt, profile }) => (
        <li key={id} className="match">
          <img className="match__photo" src={profile.photo} alt="" />
          <div className="match__info">
            <h3>
              {profile.name}, {profile.age}
            </h3>
            <p className="muted">{[profile.college, profile.city].filter(Boolean).join(' · ')}</p>
            <p className="match__date">Matched {formatDate(matchedAt)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
