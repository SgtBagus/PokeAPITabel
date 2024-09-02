import { Routes, Route } from "react-router-dom";

import { LayoutDefault } from "../Layout"; 
import { LayoutPokemon } from "../Layout/pokemon"; 

import Home from "../Pages";
import PokemonTabel from "../Pages/Pokemon";
import { NotFound404 } from "../Layout/404";

const RenderDefaultLayout = (page, pageName) => (
  <LayoutDefault pageName={pageName}>
    {page}
  </LayoutDefault>
)

const RenderPokemonLayout = (page, pageName) => (
  <LayoutPokemon pageName={pageName}>
    {page}
  </LayoutPokemon>
)

const App = () => {
  return (
    <Routes>
      <Route path="" element={ RenderDefaultLayout(<Home />, "Shooping Website")}/>
      <Route path="pokemon" element={ RenderPokemonLayout(<PokemonTabel />, "Pokemon List")}/>

      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
}

export default App;
