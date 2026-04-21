import AppLoader from "../MicroComponents/AppLoader.jsx";

export default function QueryState({
  query,
  loadingText = "Caricamento dati del catalogo...",
  empty = null,
  children,
}) {
  if (query.isLoading) {
    return <AppLoader text={loadingText} minHeight="32vh" />;
  }

  if (query.isError) {
    return (
      <div className="page-feedback page-feedback-error">
        <p className="page-feedback-eyebrow">Problema di rete</p>
        <h2>Non siamo riusciti a caricare questa sezione.</h2>
        <p>{query.error?.message || "Riprova tra qualche istante."}</p>
        <button className="checkout-btn" onClick={() => query.refetch()}>
          Riprova
        </button>
      </div>
    );
  }

  if (empty) {
    const data = query.data;
    const isEmpty = Array.isArray(data) ? data.length === 0 : !data;
    if (isEmpty) {
      return empty;
    }
  }

  return children;
}

