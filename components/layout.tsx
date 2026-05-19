import Footer from "./Footer";
import Header from "./Header";
import Meta from "./Meta/meta";
import MotionEffects from "./MotionEffects";

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Meta />
      <MotionEffects />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
