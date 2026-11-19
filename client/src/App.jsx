import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import TabBar from './components/TabBar.jsx';
import Home from './pages/Home.jsx';
import DiscoverLayout from './pages/DiscoverLayout.jsx';
import Swipe from './pages/Swipe.jsx';
import Matches from './pages/Matches.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <main className="app__content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<DiscoverLayout />}>
              <Route index element={<Swipe />} />
              <Route path="matches" element={<Matches />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <TabBar />
      </div>
    </BrowserRouter>
  );
}
