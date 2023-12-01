<template>
  <div class="dash-plate-container">
    <div class="dash-plate-header">
      <img src="https://user-images.githubusercontent.com/75596353/236753989-c95dd9d6-029e-4456-aec4-dd65363a9c5d.png" alt="PPTCopilot Logo" class="logo">
      <h1>Welcome to PPTCopilot</h1>
      <p>Experience the future of PPT creation with AI assistance</p>
    </div>
    <div class="container">
      <t-button type="primary" style="margin-top: 20px;margin-bottom: 20px" @click="jumpProject">立即使用</t-button>
    </div>
    <div class="dash-plate-content">

      <div
        v-for="(feature, index) in features"
        :key="index"
        class="dash-plate-feature"
        :class="{'fade-in': isVisible[index]}"
        ref="feature"
        :data-index="index"
      >
        <h2>{{ feature.title }}</h2>
        <p>{{ feature.description }}</p>
        <img :src="feature.image" alt="Feature image" class="feature-image">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashPlate',
  data() {
    return {
      observer: null,
      isVisible: [],
      features: [
        {
          title: '引导流程',
          image: 'https://user-images.githubusercontent.com/91320586/236810826-47598f00-1076-4450-a174-47888c5d787f.jpg',
          description: '清晰引导流程，帮助您轻松制作PPT。',
        },
        {
          title: '大纲生成',
          image: 'https://user-images.githubusercontent.com/91320586/236811011-f676f462-1827-43f6-b4a0-29ee8ab03166.jpg',
          description: '借助GPT AI轻松创建演示文稿大纲。',
        },
        {
          title: 'GPT集成',
          image: ' https://user-images.githubusercontent.com/91320586/236810233-b7bb7a4a-c150-4e5e-ae83-f455c0fb264f.png',
          description: '与GPT AI无缝交互，进行内容创建和优化。',
        },
        {
          title: '模板系统',
          image: 'https://user-images.githubusercontent.com/91320586/236810917-e54458e8-bd86-48c5-83b1-75976f450845.jpg',
          description: '从各种精美模板中选择，满足您的需求。',
        },
        {
          title: '单页生成',
          image: 'https://user-images.githubusercontent.com/91320586/236811073-8b263eab-79ac-4304-90f6-e47557a54599.jpg',
          description: '使用自定义提示修改任何幻灯片，实现精确的内容控制。',
        },
        {
          title: '项目管理',
          image: 'https://user-images.githubusercontent.com/91320586/236810666-9e375809-a579-4288-b08c-0b3e6af258f2.jpg',
          description: '轻松组织和管理您的演示文稿。',
        },
        {
          title: 'PPT共享与搜索',
          image: 'https://user-images.githubusercontent.com/91320586/236810750-0b8b3ec8-8ccd-410a-a3ad-d7c3dbdd45c3.jpg',
          description: '分享您的创作，从社区发现新的演示文稿。',
        },
        {
          title: 'PPT探索',
          image: 'https://user-images.githubusercontent.com/91320586/236810476-977f4291-d762-4304-bc8d-3628b61bc37f.jpg',
          description: '通过访问创新演示文稿的世界拓展视野。',
        },
      ],
    };
  },
  methods: {
    observeFeatureEntries(entries) {
      entries.forEach((entry) => {
        const index = Number(entry.target.getAttribute('data-index'));
        this.$set(this.isVisible, index, entry.isIntersecting);
      });
    },
    jumpProject(){
      this.$router.push('/around/index')
    }
  },
  mounted() {
    this.isVisible = this.features.map(() => false);
    this.observer = new IntersectionObserver(this.observeFeatureEntries, {
      rootMargin: '0px',
      threshold: 0.1,
    });

    this.$refs.feature.forEach((featureEl) => {
      this.observer.observe(featureEl);
    });
  },
  beforeDestroy() {
    this.$refs.feature.forEach((featureEl) => {
      this.observer.unobserve(featureEl);
    });
    this.observer.disconnect();
  },

};
</script>

<style lang="scss" scoped>
.dash-plate-container {
  max-width: 1200px;
  margin: 0 auto;
  //padding: 60px 30px;
}

.dash-plate-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  .logo {
    width: 300px; // 将宽度从 80px 修改为 60px
    height: auto;
    //margin-bottom: 20px;
  }

  h1 {
    font-size: 48px;
    margin-bottom: 10px;
  }

  p {
    font-size: 24px;
    color: #777;
  }

  img {
    margin: 50px;
  }
}

.dash-plate-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);;
  gap: 10px;
  margin-top: 30px;

  .dash-plate-feature {
    opacity: 0;
    transition: opacity 2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &.fade-in {
      opacity: 1;
    }

    .feature-image {
      width: 100%;
      max-width: 300px;
      height: 200px;
      margin-bottom: 20px;
    }

    h2 {
      font-size: 28px;
      margin-bottom: 10px;
    }

    p {
      font-size: 18px;
      color: #666;
    }
  }


}
.container {
   display: flex;
   justify-content: center;
 }
</style>
