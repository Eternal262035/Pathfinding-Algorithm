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
    }
) {
    const PI = Math.PI;
    const PI2 = 2*Math.PI;
    
    let x = startPosition.x;
    let y = startPosition.y;
    let angle = Math.atan2(targetPosition.y-y, targetPosition.x-x);

    let steps = [];
    /* 
        specifies the target that the next step should arrive at.
        {
            x: number,
            y: number,
        }
    */
    
    const calcDistToTarget = ()=>{
        return Math.hypot(targetPosition.y-y, targetPosition.x-x);
    }

    let distance = calcDistToTarget();
    while (distance > stepLength) {
        const stepTargetX = stepLength*Math.cos(angle);
        const stepTargetY = stepLength*Math.sin(angle);
        for (const ob of obstacles) {
            if (
                stepTargetX+radius > ob.x-ob.radius ||
                stepTargetX-radius < ob.x+ob.radius || 
                stepTargetY+radius > ob.y-ob.radius || 
                stepTargetY-radius < ob.y+ob.radius 
            ) {
                let dTheta = 0;
                for () {
                    // penalize sharper turns to avoid simply oscillating back and forth against a wall
                    // however, the penalty should still reward getting closer to the target.
                    // have it turn toward the target first, then deviate from that. 
                    let penalty = 
                }
            }
        }
        
        distance = calcDistToTarget();
    }
}