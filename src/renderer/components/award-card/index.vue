<template>
  <div class="card"
    :class="{animated: isSpeaking, 'flash':isSpeaking, 'infinite':isSpeaking}"
    :style="{transform: 'rotate(' + r + 'deg) translate(' + x + 'px,' + y + 'px) scale(' + s + ',' + s + ')'}"
  >
    <!--<audio v-if="power > 0 && award.luckdraw_sound"-->
           <!--autoplay-->
           <!--loop-->
           <!--:src="award.luckdraw_sound">-->
    <!--</audio>-->
    <!--content-->
    <div class="card-warp">
      <div class="content" :style="{'background-image': 'url('+encodeURI(award.img)+')', filter: 'blur(' + (secret ? 8 : 0) + 'px)'}">
      </div>
      <div class="powerbar" :style="{width: power * 100 + '%', 'background-color':loadingColor }">
        <p v-if="power > 0" style="color: #cf9236;font-size: 20px;text-align: center;line-height: 60px">～恭喜发财 保持～</p>
      </div>
      <span class="title">{{award.serial_no}}</span>

      <i v-if="power > 0"
         class="el-icon-loading loading"
         :style="{'animation-duration': (-2.5 * power + 2.8) + 's', color: loadingColor}"></i>
      <!--contolbar-->
      <div class="footer">
        <span v-if="secret">***********</span>
        <span v-else>{{award.name}}</span>
        <div style="flex-grow: 1"></div>
        <!--el-icon-loadin-->

        <el-button type="text"
                   class="button awardBtn"
                   icon="el-icon-location"
                   @mousedown.native="awardBtnMouseDownHandler()"
                   @mouseup.native="awardBtnMouseUpHandler()">抽奖</el-button>
      </div>

      <p class="max-holdtime"  v-if="power > 0.95 && maxHoldTime > 0">{{maxHoldTime }}S
        <span v-if="maxHoldTime >= 6 && maxHoldTime < 10">(不错哟！)</span>
        <span v-else-if="maxHoldTime >= 10 && maxHoldTime < 15">(加油！)</span>
        <span v-else-if="maxHoldTime >= 15 && maxHoldTime < 30">(还在玩?)</span>
        <span v-else-if="maxHoldTime >= 30 && maxHoldTime < 50">(可以放了!)</span>
        <span v-else-if="maxHoldTime >= 50 && maxHoldTime < 60">(你疯了~)</span>
        <span v-else-if="maxHoldTime >= 60 && maxHoldTime < 100">(好吧你赢了~ 后面100s还有你信么?)</span>
        <span v-else-if="maxHoldTime >= 100">(加我微信15000273960)</span>
      </p>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */

  export default {
    name: 'award-card',
    props: {
      award: {
        serial_no: '',
        name: '',
        img: null,
        award_sound: null, // 获奖
      },
      secret: true,
      power: 0, //0-1
      maxHoldTime: 0,
      randomSeed: 0,
    },

    data() {
      return {
        isSpeaking: false,
        x: 0,
        y: 0,
        r: 0,
        s: 1,
      };
    },

    computed: {
      loadingColor() {
        if (this.power >= 1) return '#FF0014';
        else if (this.power >= 0.9 && this.power < 1) return '#FF4F5A';
        else if (this.power >= 0.6 && this.power < 0.9) return '#FF7B80';
        else if (this.power >= 0.4 && this.power < 0.6) return '#FFB2B0';
        else if (this.power >= 0.2 && this.power < 0.4) return '#FFD9D0';
        else if (this.power == 0) return '#fff';
      },
    },

    created() {
//      const duration = 600 + 1200 * this.randomSeed;
//
//      const easings = [];
//      Object.keys(TWEEN.Easing).forEach(groupName => {
//        const item = TWEEN.Easing[groupName];
//        Object.keys(item).forEach(itemName => {
//          easings.push(item[itemName]);
//        })
//      });
//
//      let idx = this.round % easings.length;
//      if (process.env.NODE_ENV === 'development') {
//        idx = ~~(Math.random() * easings.length);
//      }
////        const easing = easings[idx] || TWEEN.Easing.Linear.None;
//      const easing = TWEEN.Easing.Linear.None;
//      // 0 - 2000
//      this.moveTween = new TWEEN.Tween(this)
//        .to({r:360}, duration)
//        .easing(easing)
//        .start();

      this.moveTween = new TWEEN.Tween(this);
    },

    beforeDestroy() {
      if (this.moveTween) {
        this.moveTween.stop();
      }
      this.moveTween = null;
    },

    methods: {
      setSpeaking(val){
        this.isSpeaking = val;
      },

      moveToCenter(cb) {
        this.moveTween.stop();

        const w = 250;
        const W = 500;

//        const h = 300;

        const s = W / w;
        const x = - W * 0.5 - 20;

        this.moveTween.to({s, x, y: 0})
          .onComplete(()=>{
            cb();
          })
          .start();
      },

      awardBtnMouseDownHandler() {
        this.$emit('holdluckdraw');
      },

      awardBtnMouseUpHandler() {
        this.$emit('releaseluckdraw')
      },
    }
  };
</script>

<style scoped>
  .card {
    width: 0px;
    height: 0px;
    position: absolute;
  }

  .card-warp {
    width: 250px;
    height: 300px;
    border-radius: 8px;
    background-color: #ffffff;
    display: flex;
    position: absolute;
    flex-direction: column;
    margin: 4px;
    transform:translate(-50%, -50%)
  }

  .title {
    position: absolute;
    left: 10px;
    top: 10px;
    color: #ffffff;
    text-shadow: 0 0 2px #000;
  }

  .powerbar {
    position: absolute;
    overflow: hidden;
    width: 0%;
    /*filter: blur(1px);*/
    background-color: #ffffff;
    opacity: 0.9;
    height: 60px;
    left: 0px;
    bottom: 0px;
    pointer-events: none;
  }

  .loading {
    position: absolute;
    font-size: 80px;
    filter: blur(2px);
    color: #FFF;
    left: 85px;
    top: 110px;
  }

  .content {
    width: 100%;
    flex-grow: 1;
    background-repeat: no-repeat;
    background-size: cover;
    box-shadow: 0px 0px 8px #000000;
  }

  .footer {
    padding: 6px 10px;
    width: 100%;
    height: 60px;
    line-height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .max-holdtime {
    position: absolute;
    color: #FFF;
    font-weight: bold;
    bottom: 65px;
    right: 10px;
    text-shadow: 0 0 2px #000;
  }
</style>
