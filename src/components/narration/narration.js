import styles from './styles.css';

const Narration = (function() {

  const element = document.createElement('div');
  element.classList.add(styles["narration"]);
  element.textContent = '';

  function setTextContent(text) {
    element.textContent = text;
  }

  function getElement() { return element; }

  return {
    setTextContent,
    getElement,
  }

})();

export default Narration;
