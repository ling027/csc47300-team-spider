import "./watchlist.css"
import NavBar from "../Component/Navbar.jsx"
import { useLang } from "../../i18n/LanguageContext.jsx"; 

function WatchList(){
  const { t } = useLang();

  return(
    <div className="body">
  <header class="site-header">
    <NavBar/>
  </header>

  <main class="container">
    <section class="watchlist-header">
      <h2>{t("yourWatchlist")}</h2>
    </section>

    <section class="watchlist-table card">
      <table class="wl-table">
        <thead>
          <tr>
            <th>{t("title")}</th>
            <th>{t("year")}</th>
            <th>{t("rating")}</th>
            <th class="right">{t("action")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Inception</td>
            <td>2010</td>
            <td>★ ★ ★ ★ ☆</td>
            <td class="right"><button class="btn danger" type="button" aria-disabled="true">{t("remove")}</button></td>
          </tr>
          <tr>
            <td>Interstellar</td>
            <td>2014</td>
            <td>★ ★ ★ ★ ★</td>
            <td class="right"><button class="btn danger" type="button" aria-disabled="true">{t("remove")}</button></td>
          </tr>
          <tr>
            <td>Dune</td>
            <td>2021</td>
            <td>★ ★ ★ ★ ☆</td>
            <td class="right"><button class="btn danger" type="button" aria-disabled="true">{t("remove")}</button></td>
          </tr>
          <tr>
            <td>Spider-Verse</td>
            <td>2018</td>
            <td>★ ★ ★ ★ ★</td>
            <td class="right"><button class="btn danger" type="button" aria-disabled="true">{t("remove")}</button></td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</div>

  );
}

export default WatchList;


