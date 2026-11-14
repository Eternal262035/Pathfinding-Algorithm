/** returns an array of segments that the bot moves to */
export function calculatePath(
    stepLength = 25,
    startPosition = {
        x: 0,
        y: 0,
    },
    targetPosition = {
        x: 100,
        y: 100,
    },
    obstacles = [
        {
            x: 10,
            y: 10,
            radius: 10,
        }
    ],
    params = {
        mySpeed: 4,
        angularCandidateDiff: 0.1, // 0.1 radians is approx 5 degrees (good enough) 
        maxSteps: 100000,// to prevent implosion 
        myRadius: 4,
        turnPenaltyWeight: 0.1,
        backwardPenaltyWeight: 2,
    }
) {
    let x = startPosition.x;
    let y = startPosition.y;
    let angle = Math.atan2(targetPosition.y-y, targetPosition.x-x);

    let steps = [];
    const calcDistToTarget = (pointX, pointY) =>
        Math.hypot(targetPosition.x - pointX, targetPosition.y - pointY);
    const angleDifference = (from, to) =>
        Math.atan2(Math.sin(to - from), Math.cos(to - from));
    const isPathClear = (startX, startY, endX, endY) =>
        obstacles.every((ob) => {
            const dx = endX - startX;
            const dy = endY - startY;
            const lengthSquared = dx * dx + dy * dy;
            const t = lengthSquared === 0
                ? 0
                : Math.max(0, Math.min(1, ((ob.x - startX) * dx + (ob.y - startY) * dy) / lengthSquared));
            const closestX = startX + t * dx;
            const closestY = startY + t * dy;
            const clearance = ob.radius + params.myRadius;
            return Math.hypot(ob.x - closestX, ob.y - closestY) >= clearance;
        });

    let distance = calcDistToTarget(x, y);
    for (let step = 0; step < params.maxSteps && distance > 0; step++) {
        const moveLength = Math.min(stepLength, distance);
        const desiredAngle = Math.atan2(targetPosition.y - y, targetPosition.x - x);
        let bestCandidate = null;
        let bestScore = Infinity;

        for (let candidateAngle = -Math.PI;
            candidateAngle < Math.PI;
            candidateAngle += params.angularCandidateDiff) {
            const candidateHeading = desiredAngle + candidateAngle;
            const nextX = x + moveLength * Math.cos(candidateHeading);
            const nextY = y + moveLength * Math.sin(candidateHeading);

            if (!isPathClear(x, y, nextX, nextY)) {
                continue;
            }

            const distanceAfter = calcDistToTarget(nextX, nextY);
            const backwardDistance = Math.max(0, distanceAfter - distance);
            const turn = Math.abs(angleDifference(angle, candidateHeading));
            const score = distanceAfter
                + params.turnPenaltyWeight * moveLength * turn
                + params.backwardPenaltyWeight * backwardDistance;

            if (score < bestScore) {
                bestScore = score;
                bestCandidate = { x: nextX, y: nextY, angle: candidateHeading };
            }
        }

        if (bestCandidate === null) {
            break;
        }

        x = bestCandidate.x;
        y = bestCandidate.y;
        angle = bestCandidate.angle;
        steps.push({ x, y });
        distance = calcDistToTarget(x, y);
    }

    return steps;
}