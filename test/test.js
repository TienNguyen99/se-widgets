        if (currentFrame >= 10 && currentFrame <= 30 && !animationHasRun) {
            if (currentFrame === 30) {
                stopAnimation();
                setTimeout(function() {
                    animationHasRun = true; // Set the flag to true after the animation runs
                    animate();
                }, 5000);
            }
        }