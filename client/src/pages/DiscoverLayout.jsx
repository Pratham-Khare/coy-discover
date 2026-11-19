import { NavLink, Outlet } from 'react-router-dom';

// The Discover tab: a Swipe / Matches toggle on top, the selected view below.
export default function DiscoverLayout() {
  return (
    <div className="discover">
      <header className="discover__header">
        <h1 className="discover__title">Discover</h1>
        <nav className="segmented" aria-label="Discover sections">
          <NavLink to="/discover" end>
            Swipe
          </NavLink>
          <NavLink to="/discover/matches">Matches</NavLink>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
