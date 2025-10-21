import "@/assets/styles/app.scss";
import { Card } from "./components/card/card.component";

const benefitsFirst = [
  {
    imageSrc: '/images/hands-placeholder.png',
    title: 'Hola Mundo',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit ultrices sollicitudin integer donec, taciti viverra eros nascetur etiam enim venenatis nostra tristique.',
  },
]

export const HomeScreen = () => {
  return (
    <>
      {benefitsFirst.map((b) => (
        <Card key={b.title} {...b} />
      ))}
    </>
  );
};
