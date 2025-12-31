import PropTypes from 'prop-types';

function CasinoTriviaPopup({ trivia, onDismiss }) {
  if (!trivia) {
    return null;
  }

  return (
    <div className="trivia" role="dialog" aria-live="assertive" aria-label="Casino trivia">
      <div className="trivia__content">
        <p>{trivia}</p>
        <button className="button button--ghost" type="button" onClick={onDismiss}>
          Back to the tables
        </button>
      </div>
    </div>
  );
}

CasinoTriviaPopup.propTypes = {
  trivia: PropTypes.string,
  onDismiss: PropTypes.func.isRequired,
};

CasinoTriviaPopup.defaultProps = {
  trivia: null,
};

export default CasinoTriviaPopup;
