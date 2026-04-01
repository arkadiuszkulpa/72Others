import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Programs from './pages/Programs';
import HowItWorks from './pages/HowItWorks';
import Subscribe from './pages/Subscribe';
import WhatsAppRedirect from './pages/WhatsAppRedirect';
import AdminDashboard from './pages/AdminDashboard';
import DoWithout from './pages/DoWithout';

function App() {
  useEffect(() => {
    // Configure Amplify - will be populated after sandbox deployment
    import('../amplify_outputs.json')
      .then((outputs) => {
        Amplify.configure(outputs.default);
      })
      .catch((error) => {
        console.log('Amplify configuration pending - will configure after sandbox deployment');
      });
  }, []);
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/join-whatsapp" element={<WhatsAppRedirect />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dowithout" element={<DoWithout />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
