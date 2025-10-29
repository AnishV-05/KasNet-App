import "@/assets/styles/app.scss";
import { Card } from "./components/card/card.component";
import { useNavigate } from 'react-router-dom';
 
const benefitsFirst = [
  {
    imageSrc: '/images/hands-placeholder.png',
    title: 'Hola Mundo',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Velit viverra eros nascetur etiam enim venenatis nostra tristique.',
  },
];
 
export const HomeScreen = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        {benefitsFirst.map((b) => (
          <Card key={b.title} {...b} />
        ))}
      </div>
      <div className="home-actions">
        <button className="home-cta" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
      </div>

    </div>

  );
};
 
export default HomeScreen;