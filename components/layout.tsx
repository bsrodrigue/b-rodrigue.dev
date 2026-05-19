import Footer from "./Footer";
import Header from "./Header";
import Meta from "./Meta/meta";
import MotionEffects from "./MotionEffects";
import MotionPage from "./MotionPage";

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Meta />
      <MotionEffects />
      <Header />
      <MotionPage>{children}</MotionPage>
      <Footer />
    </>
  );
};

export default Layout;
