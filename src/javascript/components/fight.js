import controls from '../../constants/controls';

export function getHitPower(fighter) {
    const criticalHitChance = Math.random() + 1;
    const power = fighter.attack * criticalHitChance;
    return power;
}

export function getBlockPower(fighter) {
    const dodgeChance = Math.random() + 1;
    const power = fighter.defense * dodgeChance;
    return power;
}

export function getDamage(attacker, defender) {
    const attackPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);
    const damage = attackPower - blockPower;
    return damage <= 0 ? 0 : damage;
}

function updateHealthIndicator(fighter) {
    const healthPoints = fighter.currentHealth > 0 ? (fighter.currentHealth * 100) / fighter.health : 0;

    document.getElementById(`${fighter.position}-fighter-indicator`).style.width = `${healthPoints}%`;
}

function fighterAttack(attacker, target, resolve, isCritical = false) {
    const defender = { ...target };
    if (attacker.action !== 'attack' || (defender.action === 'block' && !isCritical)) return defender;
    const damage = isCritical ? 2 * attacker.attack : getDamage(attacker, defender);

    if (damage > 0) {
        defender.currentHealth -= damage;
        updateHealthIndicator(defender);
    }

    if (defender.currentHealth <= 0) resolve(attacker);
    return defender;
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        let leftFighter = { ...firstFighter };
        let rightFighter = { ...secondFighter };
        const keyPressed = new Set();

        leftFighter.currentHealth = firstFighter.health;
        rightFighter.currentHealth = secondFighter.health;
        leftFighter.action = 'wait';
        rightFighter.action = 'wait';
        leftFighter.position = 'left';
        rightFighter.position = 'right';
        leftFighter.ultimateCooldown = false;
        rightFighter.ultimateCooldown = false;
        leftFighter.ultimateCharge = 0;
        rightFighter.ultimateCharge = 0;

        document.addEventListener('keyup', event => {
            if (keyPressed.has(event.code)) keyPressed.delete(event.code);
            switch (event.code) {
                case controls.PlayerOneAttack:
                    rightFighter = fighterAttack(leftFighter, rightFighter, resolve);
                    if (leftFighter.action !== 'block') leftFighter.action = 'wait';
                    break;
                case controls.PlayerTwoAttack:
                    leftFighter = fighterAttack(rightFighter, leftFighter, resolve);
                    if (rightFighter.action !== 'block') rightFighter.action = 'wait';
                    break;
                case controls.PlayerOneBlock:
                    leftFighter.action = 'wait';
                    break;
                case controls.PlayerTwoBlock:
                    rightFighter.action = 'wait';
                    break;
                case controls.PlayerOneCriticalHitCombination[0]:
                case controls.PlayerOneCriticalHitCombination[1]:
                case controls.PlayerOneCriticalHitCombination[2]:
                    leftFighter.ultimateCharge -= 1;
                    break;
                case controls.PlayerTwoCriticalHitCombination[0]:
                case controls.PlayerTwoCriticalHitCombination[1]:
                case controls.PlayerTwoCriticalHitCombination[2]:
                    rightFighter.ultimateCharge -= 1;
                    break;
                default:
                    break;
            }
        });

        document.addEventListener('keydown', event => {
            if (keyPressed.has(event.code)) return;
            keyPressed.add(event.code);
            switch (event.code) {
                case controls.PlayerOneAttack:
                    if (leftFighter.action !== 'block') leftFighter.action = 'attack';
                    break;
                case controls.PlayerTwoAttack:
                    if (rightFighter.action !== 'block') rightFighter.action = 'attack';
                    break;
                case controls.PlayerOneBlock:
                    leftFighter.action = 'block';
                    break;
                case controls.PlayerTwoBlock:
                    rightFighter.action = 'block';
                    break;
                case controls.PlayerOneCriticalHitCombination[0]:
                case controls.PlayerOneCriticalHitCombination[1]:
                case controls.PlayerOneCriticalHitCombination[2]:
                    leftFighter.ultimateCharge += 1;
                    if (leftFighter.ultimateCharge === 3 && !leftFighter.ultimateCooldown) {
                        leftFighter.action = 'attack';
                        leftFighter.ultimateCooldown = true;
                        rightFighter = fighterAttack(leftFighter, rightFighter, resolve, true);
                        setTimeout(() => {
                            leftFighter.ultimateCooldown = false;
                        }, 10000);
                    }
                    break;
                case controls.PlayerTwoCriticalHitCombination[0]:
                case controls.PlayerTwoCriticalHitCombination[1]:
                case controls.PlayerTwoCriticalHitCombination[2]:
                    rightFighter.ultimateCharge += 1;
                    if (rightFighter.ultimateCharge === 3 && !rightFighter.ultimateCooldown) {
                        rightFighter.action = 'attack';
                        rightFighter.ultimateCooldown = true;
                        leftFighter = fighterAttack(rightFighter, leftFighter, resolve, true);
                        setTimeout(() => {
                            rightFighter.ultimateCooldown = false;
                        }, 10000);
                    }
                    break;
                default:
                    break;
            }
        });
    });
}
