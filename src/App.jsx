import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import ThemeProvider from './screens/ThemeProvider';
import HomeScreen from './screens/HomeScreen';
import ComingSoonScreen from './screens/ComingSoonScreen';
import AssessmentScreen from './screens/AssessmentScreen';
import ResultsScreen from './screens/ResultsScreen';
import ShapScreen from './screens/ShapScreen';
import SimulatorScreen from './screens/SimulatorScreen';
import NutritionScreen from './screens/NutritionScreen';
import ProfileScreen from './screens/ProfileScreen';
import CycleScreen from './screens/CycleScreen';
import ProgressScreen from './screens/ProgressScreen';

function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/assessment" element={<AssessmentScreen />} />
        <Route path="/results" element={<ResultsScreen />} />
        <Route path="/shap" element={<ShapScreen />} />
        <Route path="/simulator" element={<SimulatorScreen />} />
        <Route path="/exercise" element={<ComingSoonScreen title="Exercise" description="Movement plans that fit your energy and cycle." />} />
        <Route path="/nutrition" element={<NutritionScreen />} />
        <Route path="/track" element={<CycleScreen />} />
        <Route path="/progress" element={<ProgressScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
