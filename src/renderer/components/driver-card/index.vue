<template>
  <div class="card"
       :class="{'card-selected':selected,animated: isSpeaking, 'flash':isSpeaking, 'infinite':isSpeaking}"
       :style="{transform: 'rotate(' + r + 'deg) translate(' + x + 'px,' + y + 'px) scale(' + s + ',' + s + ')', opacity: isWinner === false ? 0.3 : 1}">
    <div class="card-warp">
      <!--content-->
      <div class="content" :style="{'background-image': 'url('+encodeURI(driver.img)+')'}">
      </div>
      <span class="title">{{driver.serial_no}}</span>
      <el-badge :value="driver.luckdraw_count" class="badge">
      </el-badge>

      <el-rate
        v-if="driver.need_show"
        v-model="showValue"
        disabled
        :max="showMaxValue"
        show-score
        text-color="#ff9900"
        score-template="表演节目Buff">
      </el-rate>

      <!--contolbar-->
      <div class="footer">
        <span>{{driver.name}}</span>
      </div>

      <div class="mask" v-show="selected && !isWinnerShow"></div>
    </div>
    </div>
</template>

<script>
  /* eslint-disable */

  export default {
    name: 'driver-card',
    props: {
      driver: {
        serial_no: '',
        name: '',
        img: null,
        need_show: false, // 表演节目
        luckdraw_count: 0,
      },
      index: 0,
      count: 0,
      round: 0,
      randomSeed: 0,
    },

    computed: {
//      isWinner: function() {
//        return this.winnerIndex !== -1 && this.index === this.winnerIndex;
//      }
    },

    data() {
      return {
        showValue: 1,
        showMaxValue: 1,
        selected: false,
        x: 0,
        y: 0,
        r: 0,
        s: 1,
        isWinner: null, //true false unknown
        isSpeaking: false,
        isWinnerShow: false,
      }
    },

    created() {
      if (this.count > 0) {
        const perAngle = 360/this.count;
        const startAngle = ~~(this.randomSeed * this.count) * perAngle;

        const targetAngle = startAngle + perAngle * this.index;
        const targetRadius = window.innerHeight * 0.5 - 90;

//        const fromAngle = startAngle + perAngle * this.index + 4;
//        const fromRadius = Math.random() * targetRadius * 0.3;
//
//        this.x = fromRadius * Math.cos(fromAngle*3.14/180);
//        this.y = fromRadius * Math.sin(fromAngle*3.14/180);
//        this.r = Math.random(360);
//
        const x = targetRadius * Math.cos(targetAngle*3.14/180);
        const y = targetRadius * Math.sin(targetAngle*3.14/180);
        this.r = Math.random() * 360;

        const duration = 600 + 1200 * this.randomSeed;
        const delay = 600 + 1200 * this.randomSeed;

        const easings = [];
        Object.keys(TWEEN.Easing).forEach(groupName => {
          const item = TWEEN.Easing[groupName];
          Object.keys(item).forEach(itemName => {
            easings.push(item[itemName]);
          })
        });

        let idx = this.round % easings.length;
        if (process.env.NODE_ENV === 'development') {
          idx = ~~(Math.random() * easings.length);
        }
//        const easing = easings[idx] || TWEEN.Easing.Linear.None;
        const easing = TWEEN.Easing.Linear.None;
        // 0 - 2000
        this.moveTween = new TWEEN.Tween(this)
          .to({x,y, r:0}, duration)
          .easing(easing)
          .delay(this.index * (delay / this.count) * 1.8)
          .start();
      }
    },

    beforeDestroy() {
      if (this.moveTween) {
        this.moveTween.stop();
      }
      this.moveTween = null;
    },

    methods: {
      setSelect(val) {
        this.selected = val;
      },

      setWinner(val) {
        this.isWinner = val;
      },

      setSpeaking(val){
        this.isSpeaking = val;
      },

      moveToCenter(cb) {
        this.isWinnerShow = true;
        this.moveTween.stop();

        const w = 150;
        const W = 500;

        const s = W / w;
        const x = W * 0.5 + 20;

        this.moveTween.to({s, x, y: 0})
          .onComplete(()=>{
            cb();
          })
          .start();
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
    width: 150px;
    height: 180px;
    border-radius: 6px;
    margin: 4px 8px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    position: relative;
    transform:translate(-50%, -50%)
  }

  .card-selected {
    z-index: 999;
  }

  .card-winner {

  }

  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #ff3647;
    opacity: 0.6;
  }

  /*.card-warp-selected {*/
    /*outline-color: #eb0419;*/
    /*outline-style: solid;*/
    /*outline-width: 12px;*/
  /*}*/

  /*.unselected {*/

  /*}*/

  .content {
    width: 100%;
    flex-grow: 1;
    background-repeat: no-repeat;
    background-size: cover;
    box-shadow: 0px 0px 8px #000000;
  }

  .title {
    position: absolute;
    left: 10px;
    top: 10px;
    color: #ffffff;
    text-shadow: 0 0 2px #000;
  }

  .badge {
    position: absolute;
    top: 2px;
    right: 2px;
  }

  .footer {
    padding: 6px 10px;
    width: 100%;
    height: 42px;
    line-height: 20px;
  }
</style>
