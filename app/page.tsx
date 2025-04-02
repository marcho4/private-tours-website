import Booking from "./elements/Booking";
import Footer from "./elements/Footer";
import NavigationBar from "./elements/NavigationBar";
import PhotoSection from "./elements/PhotoSection";
import Reviews from "./elements/Reviews";
import Skills from "./elements/Skills";
import Tours from "./elements/Tours";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full lab-grotesque">
        <NavigationBar />
        <PhotoSection /> 
        <Skills />
        <Tours />
        <Reviews />
        <Booking />
        <Footer />  
    </div>
  );
}
