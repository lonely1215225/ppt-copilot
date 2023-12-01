<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>About me</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <img :src=avatar_url width="100px" height="100px" class="user-avatar" />
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ name }}</div>
        <!--        <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>-->
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="个人签名" /><span>个人签名</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ this.description || "这个人很懒，什么也没留下"  }}
          </div>
        </div>
      </div>

<!--      <div class="user-skills user-bio-section">-->
<!--        <div class="user-bio-section-header"><svg-icon icon-class="自我评价" /><span>自我评价</span></div>-->
<!--        <div class="user-bio-section-body">-->
<!--          <div class="progress-item">-->
<!--            <span>项目经验</span>-->
<!--            <el-progress :percentage="70" />-->
<!--          </div>-->
<!--          <div class="progress-item">-->
<!--            <span>项目美观度</span>-->
<!--            <el-progress :percentage="78" />-->
<!--          </div>-->
<!--          <div class="progress-item">-->
<!--            <span>项目整体性</span>-->
<!--            <el-progress :percentage="62" />-->
<!--          </div>-->
<!--          <div class="progress-item">-->
<!--            <span>项目动画流畅度</span>-->
<!--            <el-progress :percentage="100" status="success" />-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import { mapGetters } from "vuex";
export default {
  components: { PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
        }
      }
    }
  },
  computed: {
    ...mapGetters(["id","name","description"]),
  },
  created() {
    this.avatar_url = "http://{{server_ip}}:8080/_static/user/" + this.id + "/avatar.png?time=" + new Date().getTime();
  },
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
