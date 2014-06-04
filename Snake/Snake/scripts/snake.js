window.onload = function () {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        score = 0,
        level = 0,
        direction = 0,
        snake = new Array(3),
        alive = true,
        speed = 250,
        appleStr = 'apple',
        bodyStr = 'body';

    // Initialize the matrix.
    var map = new Array(40);
    for (var i = 0; i < map.length; i++) {
        map[i] = new Array(40);
    }

    // Add the snake
    map = generateSnake(map);

    // Add the food
    map = generateFood(map);

    drawGame();

    window.addEventListener('keydown', function (e) {
        if (e.keyCode === 38 && direction !== 3) {
            direction = 2; // Up
        } else if (e.keyCode === 40 && direction !== 2) {
            direction = 3; // Down
        } else if (e.keyCode === 37 && direction !== 0) {
            direction = 1; // Left
        } else if (e.keyCode === 39 && direction !== 1) {
            direction = 0; // Right
        }
    });

    function drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = snake.length - 1; i >= 0; i--) {

            if (i === 0) {
                switch (direction) {
                    case 0: // Right
                        snake[0] = { x: snake[0].x + 1, y: snake[0].y }
                        break;
                    case 1: // Left
                        snake[0] = { x: snake[0].x - 1, y: snake[0].y }
                        break;
                    case 2: // Up
                        snake[0] = { x: snake[0].x, y: snake[0].y - 1 }
                        break;
                    case 3: // Down
                        snake[0] = { x: snake[0].x, y: snake[0].y + 1 }
                        break;
                }

                if (snake[0].x < 0 ||
                    snake[0].x >= 40 ||
                    snake[0].y < 0 ||
                    snake[0].y >= 38) {
                    showGameOver();
                    return;
                }
                
                if (map[snake[0].x][snake[0].y] === 1) {
                    score += 10;
                    map = generateFood(map);

                    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
                    map[snake[snake.length - 1].x][snake[snake.length - 1].y] = 2;

                    if ((score % 50) == 0) {
                        level += 1;
                    }

                } else if (map[snake[0].x][snake[0].y] === 2) {
                    showGameOver();
                    return;
                }

                map[snake[0].x][snake[0].y] = 2;
            } else {
                
                if (i === (snake.length - 1)) {
                    map[snake[i].x][snake[i].y] = null;
                }

                snake[i] = { x: snake[i - 1].x, y: snake[i - 1].y };
                map[snake[i].x][snake[i].y] = 2;
            }
        }

        // Draw the border as well as the score
        drawMain();

        // Start cycling the matrix
        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[0].length; y++) {
                if (map[x][y] === 1) {
                    drawImg(appleStr, x * 10, y * 10 + 40);
                }
                else if (map[x][y] === 2) {
                    drawImg(bodyStr, x * 10, y * 10 + 40);
                }
            }
        }

        if (alive) {
            setTimeout(drawGame, speed - (level * 50));
        }
    }

    function drawImg(element, x, y) {
        var image = new Image();
        switch (element) {
            case 'apple':
                image.src = 'http://static.tumblr.com/d108c9a9fabf1c857bac55ca36958bc6/vhn5irg/cA2n5h74u/tumblr_static_c07k6mhvvrk80wgccskk8w4kk.png';
                break;
            case 'body':
                image.src = 'http://www.clker.com/cliparts/F/x/C/T/d/f/green-square-md.png';
                break;
        }

        ctx.drawImage(image, x, y, 10, 10);
    }



    function drawMain() {
        ctx.lineWidth = 1; // Our border will have a thickness of 2 pixels
        ctx.fillStyle = '#C5F2AE';
        ctx.strokeStyle = 'darkgreen'; // The border will also be black

        ctx.fillRect(0, 20, canvas.width - 4, canvas.height - 23);
        ctx.strokeRect(0, 20, canvas.width - 4, canvas.height - 23);

        ctx.fillStyle = 'blue';
        ctx.font = "13px Arial";
        ctx.fillText('Score: ' + score + '  Level: ' + level, 150, 10);
    }

    function generateFood(map) {
        var numberOfFood;
        if (score === 0 ) {
            numberOfFood = 3;
        } else {
            numberOfFood = 1;
        }
        for (var j = 0; j < numberOfFood; j++) {

            var rndX = Math.round(Math.random() * 39),
            rndY = Math.round(Math.random() * 39);

            while (map[rndX][rndY] === 2 && map[rndX][rndY === 1] && rndY > 38) {
                rndX = Math.round(Math.random() * 39);
                rndY = Math.round(Math.random() * 39);
            }

            map[rndX][rndY] = 1;
        }
        
        return map;
    }

    function generateSnake(map) {
        // Generate a random position for the row and the column of the head.
        var rndX = Math.round(Math.random() * 39),
            rndY = Math.round(Math.random() * 39);

        // Let's make sure that we're not out of bounds as we also need to make space to accomodate the
        // other two body pieces
        while ((rndX - snake.length) < 0) {
            rndX = Math.round(Math.random() * 39);
        }

        for (var i = 0; i < snake.length; i++) {
            snake[i] = { x: rndX - i, y: rndY };
            map[rndX - i][rndY] = 2;
        }

        return map;
    }

    function showGameOver() {
        // Disable the game.
        alive = false;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'black';
        ctx.font = '16px sans-serif';

        ctx.fillText('Game Over!', ((canvas.width / 2) - (ctx.measureText('Game Over!').width / 2)), 50);

        ctx.font = '12px sans-serif';

        ctx.fillText('Your Score Was: ' + score, ((canvas.width / 2) - (ctx.measureText('Your Score Was: ' + score).width / 2)), 70);

        var a = document.createElement('a');
        var linkText = document.createTextNode("Restart");
        a.appendChild(linkText);
        a.title = "Restart";
        a.href = "snake.html";
        document.body.appendChild(a);
    }
};
