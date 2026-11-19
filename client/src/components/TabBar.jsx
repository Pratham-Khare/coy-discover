import { NavLink } from 'react-router-dom';
import { CardsIcon, HomeIcon } from './Icons.jsx';

export default function TabBar() {
  return (
    <nav className="tabbar" aria-label="Main">
      <NavLink to="/" end className="tab">
        <HomeIcon />
        <span>Home</span>
      </NavLink>
      <NavLink to="/discover" className="tab">
        <CardsIcon />
        <span>Discover</span>
      </NavLink>
    </nav>
  );
}
