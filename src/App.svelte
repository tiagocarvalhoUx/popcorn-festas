<script>
  import { Router, Route } from "svelte-routing";
  import Header from "./components/Header.svelte";
  import Footer from "./components/Footer.svelte";
  import Home from "./pages/Home.svelte";
  import Catalogo from "./pages/Catalogo.svelte";
  import ConstrutorFestas from "./pages/ConstrutorFestas.svelte";
  import Orcamento from "./pages/Orcamento.svelte";
  import Galeria from "./pages/Galeria.svelte";
  import Divertido from "./pages/Divertido.svelte";
  import Favoritos from "./pages/Favoritos.svelte";
  import About from "./pages/About.svelte";
</script>

<Router>
  <div class="min-h-screen bg-popcorn-light flex flex-col">
    <Header />
    <main class="flex-1">
      <Route path="/" component={Home} />
      <Route path="/catalogo" component={Catalogo} />
      <Route path="/catalogo/:categoria" component={Catalogo} />
      <Route path="/construir-festa" component={ConstrutorFestas} />
      <Route path="/orcamento" component={Orcamento} />
      <Route path="/galeria" component={Galeria} />
      <Route path="/divertido" component={Divertido} />
      <Route path="/favoritos" component={Favoritos} />
      <Route path="/about" component={About} />
    </main>
    <Footer />
  </div>
</Router>
