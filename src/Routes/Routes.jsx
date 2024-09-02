import { Routes, Route } from "react-router-dom";

import { LayoutDefault } from "../Layout"; 

import PokemonTabel from "../Pages";
import { NotFound404 } from "../Layout/404";

const RenderDefaultLayout = (page, pageName, currentUser, path) => (
  <LayoutDefault dataLogin={currentUser} pageName={pageName} path={path}>
    {page}
  </LayoutDefault>
)

const App = () => {
  return (
    <Routes>
      <Route
        path=""
        element={
          RenderDefaultLayout(<PokemonTabel dataLogin={null}/>, "Pokemon List", [], "/" ,)
        }
      />

      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
}

export default App;
