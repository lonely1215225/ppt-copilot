<template>
  <div class="user-activity">
    <div class="post">
      <div class="user-block">
        <img class="img-circle" :src="'https://wpimg.wallstcn.com/57ed425a-c71e-4201-9428-68760c0537c4.jpg'+avatarPrefix">
        <span class="username text-muted">Iron Man</span>
        <span class="description">Shared publicly - 7:30 PM today</span>
      </div>
      <p>
        大家好，今天我要跟大家分享我对这个ppt的一些心得体会。首先，我认为这个ppt非常清晰明了，它通过简洁的文字和图片生动地呈现了主题内容，让人一目了然。其次，我觉得作者在整理内容时非常用心，将主题分成了几个部分，每个部分都讲解得非常详尽，让听众能够深入了解主题。此外，我还注意到这个ppt采用了非常漂亮的配色方案，使得整个ppt看起来非常美观，让人感到非常舒适。总的来说，我认为这个ppt是一个非常成功的例子，作者的辛勤努力和用心付出使得它非常优秀，让人们受益匪浅。
      </p>
      <ul class="list-inline">
        <li>
          <span class="link-black text-sm">
            <i class="el-icon-share" />
            Share
          </span>
        </li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" />
            Like
          </span>
        </li>
      </ul>
    </div>
    <div class="post">
      <div class="user-block">
        <img class="img-circle" :src="'https://wpimg.wallstcn.com/9e2a5d0a-bd5b-457f-ac8e-86554616c87b.jpg'+avatarPrefix">
        <span class="username text-muted">Captain American</span>
        <span class="description">Sent you a message - yesterday</span>
      </div>
      <p>
        我很欣赏这份PPT所采用的设计风格和排版方式。每一页都被巧妙地设计成了一个整体，让人感觉非常美观大方，同时也非常容易阅读和理解。此外，PPT中还采用了一些简单易懂的动画和图形效果，让整个呈现过程更加生动有趣。
      </p>
      <ul class="list-inline">
        <li>
          <span class="link-black text-sm">
            <i class="el-icon-share" />
            Share
          </span>
        </li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" />
            Like
          </span>
        </li>
      </ul>
    </div>
    <div class="post">
      <div class="user-block">
        <img class="img-circle" :src="'https://wpimg.wallstcn.com/fb57f689-e1ab-443c-af12-8d4066e202e2.jpg'+avatarPrefix">
        <span class="username">Spider Man</span>
        <span class="description">Posted 4 photos - 2 days ago</span>
      </div>
      <div class="user-images">
        <el-carousel :interval="6000" type="card" height="220px">
          <el-carousel-item v-for="item in carouselImages" :key="item">
            <img :src="item+carouselPrefix" class="image">
          </el-carousel-item>
        </el-carousel>
      </div>
      <ul class="list-inline">
        <li><span class="link-black text-sm"><i class="el-icon-share" /> Share</span></li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" /> Like</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const avatarPrefix = '?imageView2/1/w/80/h/80'
const carouselPrefix = '?imageView2/2/h/440'

export default {
  data() {
    return {
      carouselImages: [
        'https://fc1tn.baidu.com/it/u=2554800398,4089275240&fm=202&mola=new&crop=v1',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F9505809d-7daa-4913-bd5f-58d6e8fa746d%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1686049367&t=d5c1f96a95471f68115accf3e4ee030f',
        'https://img2.baidu.com/it/u=1237386574,2964608939&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500',
        'https://img1.baidu.com/it/u=12865346,113216081&fm=253&fmt=auto&app=138&f=GIF?w=976&h=500'
      ],
      avatarPrefix,
      carouselPrefix
    }
  }
}
</script>

<style lang="scss" scoped>
.user-activity {
  .user-block {

    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username{
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;

    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {

      &:hover,
      &:focus {
        color: #999;
      }
    }
  }

}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
</style>
