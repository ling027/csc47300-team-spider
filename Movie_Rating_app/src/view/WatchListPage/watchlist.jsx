import "../main.css"
import NavBar from "../Component/Navbar.jsx"

function WatchList(){
  return(
    <div className="body">
  <header class="site-header">
    <NavBar/>
  </header>

  <main class="container">
    <section class="watchlist-header">
      <h2>Your Watchlist</h2>
    </section>

    <section class="watchlist-table card">
      <table class="wl-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Year</th>
            <th>Rating</th>
            <th class="right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Inception</td>
            <td>2010</td>
            <td>★ ★ ★ ★ ☆</td>
            <td class="right"><button class="btn danger" type="button" aria-disabled="true">Remove</button></td>
          </tr>
          <tr>
            <td>Interstellar</td>
            <td>2014</td>
            <td>★ ★ ★ ★ ★</td>
            <td class="right"><button class="btn danger" type="button" aria-disabled="true">Remove</button></td>
          </tr>
          <tr>
            <td>Dune</td>
            <td>2021</td>
            <td>★ ★ ★ ★ ☆</td>
            <td class="right"><button class="btn danger" type="button" aria-disabled="true">Remove</button></td>
          </tr>
          <tr>
            <td>Spider-Verse</td>
            <td>2018</td>
            <td>★ ★ ★ ★ ★</td>
            <td class="right"><button class="btn danger" type="button" aria-disabled="true">Remove</button></td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</div>

  );
}

export default WatchList;


