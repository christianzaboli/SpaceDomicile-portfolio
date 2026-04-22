import { Outlet } from "react-router-dom";
import MyHeader from "../Components/MacroComponents/MyHeader.jsx";
import MyFooter from "../Components/MacroComponents/MyFooter.jsx";
export default function DefaultLayout() {
  return (
    <>
      <MyHeader />
      <main>
        <Outlet />
      </main>
      <MyFooter />
    </>
  );
}
