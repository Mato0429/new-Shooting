function main(){

  const screen_w = 400;
  const screen_h = 600;
  const fps = 60;
  const game_cloud_int = 75;
  const game_cloud_color = "#00000";
  const debug = true;

  //キャンバス取得
  const canvas = document.querySelector("#canvas");
  const context = canvas.getContext("2d");
  const vcanvas = document.createElement("canvas");
  const vcontext = vcanvas.getContext("2d");

  //キャンバスサイズ
  canvas.width = screen_w;
  canvas.height = screen_h;
  vcanvas.width = screen_w;
  vcanvas.height = screen_h;

  //画像読み込み
  const sprite_img = new Array(10).fill(new Image());
  sprite_img[0].src = "img/pepepe.png";

  //フルスクリーン
  canvas.addEventListener("click",x =>{
      // Chrome,Firefox
				if(canvas.requestFullscreen ) {
          canvas.requestFullscreen();
        //Firefox ~63
				}else if( canvas.mozRequestFullScreen ) {
          canvas.mozRequestFullScreen();
        //Safari,Edge,Chrome ~68
				}else if( canvas.webkitRequestFullscreen ) {
          canvas.webkitRequestFullscreen();
        //IE11
				}else if( canvas.msRequestFullscreen ) {
					canvas.msRequestFullscreen();
				}
  });

  //カーソルの位置取得
  let carsol_x = 0;
  let carsol_y = 0;
  window.onmousemove = function (e) {
    carsol_x = e.offsetX;
    carsol_y = e.offsetY;
  };

  //乱数生成
  function rand(min,max){
    return Math.random() * ( max + 1 - min ) + min;
  }

  function sprite_draw(x,y,img){
    let sx = 0;
    let sy = 0;
    let sw = img.width;
    let sh = img.height;

    vcontext.drawImage(img,sx,sy,sw,sh,x,y,sw,sh);
}

  //雲
  class Cloud{
    constructor(x,y,sz,msz,d,color){
      this.mx = x;
      this.my = y;
      this.x = [
        rand(d,d*2),
        rand(-d,-d*2)
      ];
      this.y = [
        rand(d,d*2),
        rand(-d,d*2)
      ];
      this.xsz = [
        rand(sz*2,msz*2),
        rand(sz*2,msz*2),
        rand(sz*2,msz*2)
      ];
      this.ysz = [
        rand(sz,msz),
        rand(sz,msz),
        rand(sz,msz)
      ]

      this.vx = 0;
      this.vy = rand(5,10);
      this.color = color;
    }
    update(){
      this.mx += this.vx;
      this.my += this.vy;
      if(this.my >= screen_h){
        this.mx = rand(0,screen_h);
        this.my = -30;
        this.vx = 0;
        this.vy = rand(5,10);
      }
    }
    draw(){
      this.cxa = this.mx + this.x[0];
      this.cya = this.my + this.y[0];
      this.cxb = this.mx + this.x[1];
      this.cyb = this.my + this.y[1];

      vcontext.fillStyle = this.color;
      vcontext.fillRect(this.mx,this.my,this.xsz[0],this.ysz[0]);
      vcontext.fillRect(this.cxa,this.cya,this.xsz[1],this.ysz[1]);
      vcontext.fillRect(this.cxb,this.cyb,this.xsz[2],this.ysz[2]);
    }
  }

  class Player{
    constructor(){
      this.x = 0;
      this.y = 0;
    }
    update(){
      //移動
      this.x = carsol_x;
      this.y = carsol_y;

      //壁判定
      if (this.x > 1450) this.x = 1450;
      if (this.y > 930) this.y = 930;
    }
    draw(){
      sprite_draw(screen_w / screen.width * this.x,screen_h / screen.height * this.y,sprite_img[0]);
    }
  }

  
  //雲作成
  let cloud = [];
  for (let i=0;i<=game_cloud_int;i++){
    cloud.push(new Cloud(rand(0,screen_w),rand(30,screen_h),10,30,20/3,"white"));
  }

  //Player作成
  const player = new Player();

  //ゲームループ
  function game_loop(){
    //背景描画
    vcontext.fillStyle = "#87cefa";
    vcontext.fillRect(0,0,screen_w,screen_h);

    //雲描画
    for (let i=0;i<=game_cloud_int;i++) cloud[i].update();
    for (let i=0;i<=game_cloud_int;i++) cloud[i].draw();

    //player描画
    player.update();
    player.draw();

    //debug
    if(debug){
      vcontext.strokeStyle = "black";
      vcontext.font = "italic bold 15px Meryo";
      vcontext.textAlign = 'left';
      vcontext.strokeText("playerX:" + player.x + " playerY:" + player.y, 0, 15);
    }
    //canvasに描画
    context.drawImage(vcanvas,0,0);
  }

  setInterval(game_loop,1000/fps)
};

window.addEventListener("DOMContentLoaded",main());

