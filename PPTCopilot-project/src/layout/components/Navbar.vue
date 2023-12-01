<template>
  <div class="navbar">
    <img src="https://github.com/rumengkai/awesome-vue/assets/91320586/83f64d27-20a7-42e7-b6a4-30d828ff4365"
      class="user-avatar1" @click="handlegotoDashboard" />

    <div class="right-menu">
      <div class="avatar-wrapper">
        <t-space align="center" :separator="separator">
          <t-button variant="outline" theme="primary" @click="handlegotoSearch" round>
            <SearchIcon slot="icon" />
            搜索
          </t-button>
          <t-button variant="outline" theme="primary" @click="handlegotoProjects" round>
            <HomeIcon slot="icon" />
            我的
          </t-button>
          <t-button variant="outline" theme="primary" @click.native="logout" round>
            <RemoveIcon slot="icon" />
            登出
          </t-button>

          <img :src=img_url class="user-avatar2" @click="handlegotoProfile" />
        </t-space>

        <span style="margin-left: 10px">
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  SearchIcon,
  HomeIcon,
  RemoveIcon,
} from 'tdesign-icons-vue';
export default {
  data() {
    return {
      img_url: "",
    };
  },
  created() {
    this.img_url = "http://{{server_ip}}:8080/_static/user/" + this.id + "/avatar.png?time=" + new Date().getTime();
  },
  components: {
    SearchIcon,
    HomeIcon,
    RemoveIcon,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "id"]),
  },
  methods: {
    handlegotoDashboard() {
      this.$router.push("/around/index");
    },
    handlegotoSearch() {
      this.$router.push("/index");
    },

    handlegotoProjects() {
      this.$router.push("/project/index");
    },
    handlegotoProfile() {
      this.$router.push("/profile");
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    getPic() {
      getAvatar(this.id).then(response => {
        this.picture = response.data
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 80px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .search-button-container {
    margin-top: -5px;
  }

  .avatar-wrapper {
    display: flex;
    align-items: center;
  }

  .right-menu {
    float: right;
    margin-top: 20px;
  }

  .nav-button {
    margin-left: 10px;
    margin-right: 10px;
    border: none;
    outline: none;
    cursor: pointer;
    font-size: 14px;
  }

  .user-avatar1 {
    cursor: pointer;
    width: 60px;
    height: 60px;
    margin-top: 5px;
  }

  .user-avatar2 {
    cursor: pointer;
    width: 40px;
    height: 40px;
  }
}
</style>
