import showModal from './modal';
import createElement from '../../helpers/domHelper';

export default function showWinnerModal(fighter) {
    let title = '';

    if (fighter) {
        title = `${fighter.name} wins`;
    }

    const bodyElement = createElement({
        tagName: 'img',
        attributes: {
            src: fighter.source
        }
    });

    const finishFight = () => {
        window.location.reload();
    };

    showModal({ title, bodyElement, onClose: finishFight });
}
