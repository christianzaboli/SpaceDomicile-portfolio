import { Component } from "react";

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("App render error", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-feedback page-feedback-error">
          <p className="page-feedback-eyebrow">Catalogo non disponibile</p>
          <h2>Si e verificato un problema imprevisto nel rendering.</h2>
          <p>
            La pagina non e stata caricata correttamente. Aggiorna questa vista e riprova.
          </p>
          <button className="checkout-btn" onClick={this.handleReset}>
            Riprova pagina
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
