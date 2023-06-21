import createElement from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (fighter) {
        const { name, health, attack, defense, source } = fighter;

        const fighterNameElement = createElement({
            tagName: 'span'
        });
        const fighterHealthElement = createElement({
            tagName: 'span'
        });
        const fighterAttackElement = createElement({
            tagName: 'span'
        });
        const fighterDefenseElement = createElement({
            tagName: 'span'
        });
        const fighterImageElement = createElement({
            tagName: 'img',
            attributes: {
                src: source,
                alt: `Image of ${name}`,
                title: name
            }
        });

        fighterNameElement.innerText = `Name: ${name}`;
        fighterHealthElement.innerText = `Health: ${health}`;
        fighterAttackElement.innerText = `Attack: ${attack}`;
        fighterDefenseElement.innerText = `Defense: ${defense}`;
        fighterElement.append(fighterNameElement);
        fighterElement.append(fighterHealthElement);
        fighterElement.append(fighterAttackElement);
        fighterElement.append(fighterDefenseElement);
        fighterElement.append(fighterImageElement);
    }

    return fighterElement;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}
