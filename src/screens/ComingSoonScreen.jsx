import { AppHeader, AppScreen } from './AppScreen';

// Temporary page for nav tabs whose screens haven't been built yet.
export default function ComingSoonScreen({ title, description }) {
  return (
    <AppScreen>
      <AppHeader title={title} subtitle={description} compact />
      <main className="hd-main hd-main--flat">
        <section className="hd-risk hd-empty">
          <h2 className="hd-risk-title">This screen is on its way</h2>
          <p className="hd-risk-text">Use Home to start your assessment in the meantime.</p>
        </section>
      </main>
    </AppScreen>
  );
}
