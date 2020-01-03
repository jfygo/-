$(function (){
    let uls = new Array(6)
    let div = $("div").eq(0)
    let divs = [[],[],[],[],[],[]]
    let colors = [[],[],[],[],[],[]]
    let lis = [[],[],[],[],[],[]]
    let is_rotate = true
    let roY = 10, roX = -10;
    init(uls, div, colors, lis)
    bindBodyMove()
    run()
    renew(uls,lis,colors, divs)
    function run() {
        for(let i=0; i<6; i++){
            for(let j=0; j<9; j++){
                lis[i][j].son.on("mousedown",  function (e) {
                    e.preventDefault()
                    let parentIndex = parseInt($(this).parents().eq(0).index())
                    let index = parseInt($(this).index())
                    let Direction, dis
                    const body = $('body')
                    body.off()
                    let lastX, lastY, nowX, nowY, disx = 0, disy = 0, angel = 0;
                    lastX = e.clientX;
                    lastY = e.clientY;
                    body.on('mousemove', (e) => {
                        e.preventDefault()
                        nowX = e.clientX;
                        nowY = e.clientY;
                        disx = (nowX - lastX) * 0.3;
                        disy = (nowY - lastY) * 0.3;
                        if(is_rotate){
                            is_rotate = false
                            dis = Math.abs(disx) > Math.abs(disy) ? 0 : 1
                            Direction = getDirection(Math.abs(disx), Math.abs(disy), parentIndex, index)
                        }
                        rotate(Direction.direction, Direction.level, dis == 0 ? -disx: -disy, divs)
                        angel += dis * disy + (1-dis) * disx
                        lastX = nowX;
                        lastY = nowY;
                    });
                    body.on('mouseup', (e) => {
                        body.off()
                        colorChange(Direction.direction, Direction.level, angel)
                        bindBodyMove()
                    });
                })
            }
        }
    }
    function rotate(direction, level, dis, divs){
        if(direction == 0){
            rotateLR(level, -dis, divs)
        }else if(direction == 1){
            rotateUD(level, dis, divs)
        }else{
            rotateFB(level, dis, divs)
        }
    }
    function colorChange(direction, level, angel){
        let turn = getTurns(angel)  
        if(turn != 0){
            if(direction == 0){
            colorChangeLR(level, angel, turn)
        }else if(direction == 1){
            colorChangeUD(level, angel, turn)
        }else{
            colorChangeFB(level, angel, turn)
            }
        }
        is_rotate = true
        renew(uls, lis, colors, divs)
    }
    // 得到旋转的方向
    function getDirection(disx, disy, page, index){
        if(page == 0){
            return disx > disy ? {direction: 0, level: parseInt(index / 3)} : 
            {direction: 1, level: index % 3}
        }else if(page == 2){
            return disx > disy ? {direction: 0, level: parseInt(index / 3)} : 
            {direction: 1, level: Math.abs(index % 3 - 2)}
        }else if(page == 1){
            return disx > disy ? {direction: 0, level: parseInt(index / 3)} : 
            {direction: 2, level: index % 3}
        }else if(page == 3){
            return disx > disy ? {direction: 0, level: parseInt(index / 3)} : 
            {direction: 2, level: Math.abs(index % 3 - 2)}
        }else if(page == 4){
            return disx > disy ? {direction: 2, level: Math.abs(index % 3 - 2)} : {direction: 1, level: index % 3}
        }else{
            return disx > disy ? {direction: 2, level: parseInt(index / 3)} : {direction: 1, level: index % 3}
        }
    }
    function colorChangePage(page, turn){
        let pageindex = [[0,2,8,6], [1,5,7,3]]
        let pageColorTemp = new Array(9)
        for(let i=0; i<9; i++){
            pageColorTemp[i] = colors[page][i]
        }
        for(let j=0; j<2; j++){
            for(let i=0; i<4; i++){
                colors[page][pageindex[j][i]] = pageColorTemp[pageindex[j][(i+turn+4)%4]]
            }
        }
    }
    // 左右旋转改变颜色
    function colorChangeLR(level, angel, turn){
        let pageindex = [[0,2,8,6], [1,5,7,3]]
        let pageColorTemp = new Array(9)
        if(level == 0){
            colorChangePage(4, turn)
        }else if(level == 2){
            colorChangePage(5, -turn)
        }
        let colorTemp = [[],[],[],[]]
        for(let i=0; i<4; i++){
            for(let j=0; j<3; j++){
                colorTemp[i].push(colors[i][level*3+j])
            }
        }
        for(let i=0; i<4; i++){
            for(let j=0; j<3; j++){
                colors[i][j+level*3] = colorTemp[(i + 4 - turn)%4][j]
            }
        }
    }
    // 左右旋转
    function rotateLR(level, angel, divs){
        let RoteteDistance = getRoteteDistance(level, angel)
        decreateBlack(angel, level, 4, 5)
        for(let i=0; i<4; i++){
            lis[i][level*3].ry(angel).tz(RoteteDistance.z_0).tx(RoteteDistance.y_0)
            lis[i][level*3 + 1].ry(angel).tz(RoteteDistance.z_1).tx(RoteteDistance.y_1)
            lis[i][level*3 + 2].ry(angel).tz(RoteteDistance.z_2).tx(RoteteDistance.y_2)
        }
    }
    function getRoteteDistance(level, angel){
        let angelR = angel * Math.PI / 180
        let cos = Math.cos(angelR)
        let sin = Math.sin(angelR)
        let z_1 = 150-150 * cos
        let z_0 = z_1 + 100 * sin
        let z_2 = z_1 - 100 * sin
        let y_1 = 150 * sin
        let y_0 = y_1 - 100 + 100 * cos
        let y_2 = y_1 + 100 - 100 * cos
        return{
            z_1, z_0, z_2, y_1, y_0, y_2 
        }
    }
    // 上下旋转
    function rotateUD(level, angel, divs){
        let RoteteDistance = getRoteteDistance(level, angel)
        let indextemp = [0, 2, 4, 5]
        decreateBlack(angel, level, 3, 1)
        for(let i=0; i<4; i++){
            if(i == 1){
                lis[indextemp[i]][2-level].rx(-angel).tz(RoteteDistance.z_0).ty(RoteteDistance.y_0)
                lis[indextemp[i]][5-level].rx(-angel).tz(RoteteDistance.z_1).ty(RoteteDistance.y_1)
                lis[indextemp[i]][8-level].rx(-angel).tz(RoteteDistance.z_2).ty(RoteteDistance.y_2)
            }else{
                lis[indextemp[i]][level].rx(angel).tz(RoteteDistance.z_2).ty(-RoteteDistance.y_2)
                lis[indextemp[i]][level+3].rx(angel).tz(RoteteDistance.z_1).ty(-RoteteDistance.y_1)
                lis[indextemp[i]][level+6].rx(angel).tz(RoteteDistance.z_0).ty(-RoteteDistance.y_0)
            }
        }
    }
    // 上下旋转改变颜色
    function colorChangeUD(level, angel, turn){
        if(level == 0){
            colorChangePage(3, -turn)
        }else if(level == 2){
            colorChangePage(1, turn)
        }
        let indextemp = [0, 5, 2, 4]
        let colorTemp = [[],[],[],[]]
        for(let i=0; i<4; i++){
            for(let j=0; j<3; j++){
                if(i == 2){
                    colorTemp[i].push(colors[indextemp[i]][8-j*3-level])
                }else{
                    colorTemp[i].push(colors[indextemp[i]][j*3+level])
                }
            }
        }
        for(let i=0; i<4; i++){
            for(let j=0; j<3; j++){
                if(i == 2){
                    colors[indextemp[i]][8-j*3-level] = colorTemp[(i+4-turn)%4][j]
                }else{
                    colors[indextemp[i]][level+j*3] = colorTemp[(i+4-turn)%4][j]
                }
            }
        }
    }
    function decreateBlack(angel, level, page1, page2){
        if(level == 0){
            divs[page1][0].rz(-angel).show()
            divs[page1][1].show()
            uls[page1].rz(-angel)
        }else if(level == 1){
            divs[page1][0].show()
            divs[page1][1].rz(-angel).show()
            divs[page2][0].rz(angel).show()
            divs[page2][1].show()
        }else{
            divs[page2][0].show()
            divs[page2][1].rz(angel).show()
            uls[page2].rz(angel)
        }
    }
    // 前后旋转
    function rotateFB(level, angel, divs){
        let RoteteDistance = getRoteteDistance(level, angel)
        let indextemp = [1, 3, 4, 5]
        let indexstemp = [[0,3,6,], [2,5,8], [6,7,8], [0,1,2]]
        if(level == 0){
            uls[0].rz(-angel)
            divs[0][0].rz(-angel)
            divs[0][1].show()
        }else if(level == 1){
            divs[0][0].rz(-angel).show()
            divs[0][1].show()
            divs[2][0].show()
            divs[2][1].rz(-angel).show()
        }else if(level == 2){
            divs[2][0].show()
            divs[2][1].rz(-angel).show()
            uls[2].rz(angel)
        }
        lis[indextemp[0]][indexstemp[0][0]+level].rx(angel).tz(RoteteDistance.z_2).ty(-RoteteDistance.y_2)
        lis[indextemp[0]][indexstemp[0][1]+level].rx(angel).tz(RoteteDistance.z_1).ty(-RoteteDistance.y_1)
        lis[indextemp[0]][indexstemp[0][2]+level].rx(angel).tz(RoteteDistance.z_0).ty(-RoteteDistance.y_0)
        lis[indextemp[1]][indexstemp[1][0]-level].rx(-angel).tz(RoteteDistance.z_0).ty(RoteteDistance.y_0)
        lis[indextemp[1]][indexstemp[1][1]-level].rx(-angel).tz(RoteteDistance.z_1).ty(RoteteDistance.y_1)
        lis[indextemp[1]][indexstemp[1][2]-level].rx(-angel).tz(RoteteDistance.z_2).ty(RoteteDistance.y_2)
        lis[indextemp[2]][indexstemp[2][0]-level*3].ry(-angel).tz(RoteteDistance.z_2).tx(-RoteteDistance.y_2)
        lis[indextemp[2]][indexstemp[2][1]-level*3].ry(-angel).tz(RoteteDistance.z_1).tx(-RoteteDistance.y_1)
        lis[indextemp[2]][indexstemp[2][2]-level*3].ry(-angel).tz(RoteteDistance.z_0).tx(-RoteteDistance.y_0)
        lis[indextemp[3]][indexstemp[3][0]+level*3].ry(angel).tz(RoteteDistance.z_0).tx(RoteteDistance.y_0)
        lis[indextemp[3]][indexstemp[3][1]+level*3].ry(angel).tz(RoteteDistance.z_1).tx(RoteteDistance.y_1)
        lis[indextemp[3]][indexstemp[3][2]+level*3].ry(angel).tz(RoteteDistance.z_2).tx(RoteteDistance.y_2)
    }
    // 前后旋转改变颜色
    function colorChangeFB(level, angel, turn){
        let pageindex = [[0,2,8,6], [1,5,7,3]]
        let pageColorTemp = new Array(9)
        if(level == 0){
            colorChangePage(0, -turn)
        }else if(level == 2){
            colorChangePage(2, turn)
        }
        let indextemp = [4, 1, 5, 3]
        let indexstemp = [[6,7,8], [0,3,6], [2,1,0], [8,5,2]]
        let colorTemp = [[],[],[],[]]
        for(let j=0; j<3; j++){
            colorTemp[0].push(colors[indextemp[0]][6+j-level*3])
            colorTemp[1].push(colors[indextemp[1]][j*3+level])
            colorTemp[2].push(colors[indextemp[2]][2-j+level*3])
            colorTemp[3].push(colors[indextemp[3]][8-j*3-level])
        }
        for(let i=0; i<4; i++){
            for(let j=0; j<3; j++){
                if(i == 0){
                    colors[indextemp[i]][indexstemp[0][j]-level*3] = colorTemp[(i+4-turn)%4][j]
                }else if(i == 1){
                    colors[indextemp[i]][indexstemp[1][j]+level] = colorTemp[(i+4-turn)%4][j]
                }else if(i == 2){
                    colors[indextemp[i]][indexstemp[2][j]+level*3] = colorTemp[(i+4-turn)%4][j]
                }else if(i == 3){
                    colors[indextemp[i]][indexstemp[3][j]-level] = colorTemp[(i+4-turn)%4][j]
                }
            }
        }
    }
    // 得到旋转的圈数
    function getTurns(angel){
        let turn = 0
        if(angel > 0){
            turn = parseInt(angel / 90)
            if(angel > parseInt(angel / 90) * 90 + 45){
                turn += 1
            }
        }else if(angel < 0){
            turn = parseInt(angel / 90)
            if(angel < parseInt(angel / 90) * 90 - 45){
                turn -= 1
            }
        }
        return turn
    }
    // 初始化
    function init(uls, div, colors, lis){
        const colorTemp = ["red", "blue", "green", "yellow", "white", "brown"]
        for(let i=0; i<6; i++){
            for(let j=0; j<9; j++){
                colors[i].push(colorTemp[i])
            }
        }
        for(let i=0; i<6; i++){
            uls[i] = new Page("", div, "ul")
        }
        for(let i=0; i<6; i++){
            for(let j=0; j<9; j++){
                lis[i].push(new Page(colors[i][j], uls[i].son, "li"))
            } 
        }
        for(let i=0; i<6; i++){
            for(let j=0; j<2; j++){
                divs[i].push(new Page("black", div, "div"))
            }
        }
    }
    // 更新
    function renew(uls, lis, colors, divs){
        for(let i=0; i<6; i++){
            uls[i].renew("")
            for(let j=0; j<9; j++){
                lis[i][j].renew(colors[i][j])
            }
            divs[i][0].renew("")
            divs[i][1].renew("")
        }
        uls[0].tz(150)
        uls[1].ry(90).tz(150)
        uls[2].tz(-150).ry(180)
        uls[3].ry(-90).tz(150)
        uls[4].rx(90).tz(150)
        uls[5].rx(-90).tz(150)
        for(let i=0; i<6; i++){
            lis[i][0].tx(0)
            lis[i][1].tx(100)
            lis[i][2].tx(200)
            lis[i][3].ty(100)
            lis[i][4].ty(100).tx(100)
            lis[i][5].ty(100).tx(200)
            lis[i][6].ty(200)
            lis[i][7].ty(200).tx(100)
            lis[i][8].ty(200).tx(200)	
        }
        for(let i=0; i<2; i++){
            divs[0][i].tz(50)
            divs[1][i].ry(90).tz(50)
            divs[2][i].tz(-50)
            divs[3][i].ry(-90).tz(50)
            divs[4][i].rx(90).tz(50)
            divs[5][i].rx(-90).tz(50)

        }
    }
    // 整体旋转
    function bindBodyMove() {
        const cube = $('.cube');
        const body = $('body');
        let lastX, lastY, nowX, nowY, disx = 0, disy = 0;
        body.on('mousedown', function (e) {
            lastX = e.clientX;
            lastY = e.clientY;
            body.on('mousemove', function (e) {
                e.preventDefault()
                nowX = e.clientX;
                nowY = e.clientY;
                disx = nowX - lastX;
                disy = nowY - lastY;
                roY += disx * 0.2;
                roX -= disy * 0.2;
                cube.css({
                    'transform': 'rotateX(' + roX + 'deg) rotateY(' + roY + 'deg)',
                    'cursor': 'move'
                });
                lastX = nowX;
                lastY = nowY;
            });
            body.on('mouseup', function () {
                body.off('mousemove')
            });
        });
    }
});