import { defineStore } from 'pinia';
import tinycolor from 'tinycolor2';
import { omit } from 'lodash';
import { slides } from '@/mocks/slides';
import { theme } from '@/mocks/theme';
import { layouts } from '@/mocks/layout';
import { update_slides } from '@/api/ppt_Request_gpt';
import useSlide2Dom from '@/hooks/useSlide2Dom';
import useXml2Slide from '@/hooks/useXml2Slide';
const { convert_slide_to_dom, convert_slides_to_dom } = useSlide2Dom();
const { update_xml_to_dom_to_slide } = useXml2Slide();
export const useSlidesStore = defineStore('slides', {
    state: () => ({
        theme: theme,
        slides: slides,
        slideIndex: 0,
        viewportRatio: 0.5625, // 可视区域比例，默认16:9
    }),
    getters: {
        currentSlide(state) {
            return state.slides[state.slideIndex];
        },
        currentSlideAnimations(state) {
            const currentSlide = state.slides[state.slideIndex];
            if (!currentSlide?.animations)
                return [];
            const els = currentSlide.elements;
            const elIds = els.map(el => el.id);
            return currentSlide.animations.filter(animation => elIds.includes(animation.elId));
        },
        // 格式化的当前页动画
        // 将触发条件为“与上一动画同时”的项目向上合并到序列中的同一位置
        // 为触发条件为“上一动画之后”项目的上一项添加自动向下执行标记
        formatedAnimations(state) {
            const currentSlide = state.slides[state.slideIndex];
            if (!currentSlide?.animations)
                return [];
            const els = currentSlide.elements;
            const elIds = els.map(el => el.id);
            const animations = currentSlide.animations.filter(animation => elIds.includes(animation.elId));
            const formatedAnimations = [];
            for (const animation of animations) {
                if (animation.trigger === 'click' || !formatedAnimations.length) {
                    formatedAnimations.push({ animations: [animation], autoNext: false });
                }
                else if (animation.trigger === 'meantime') {
                    const last = formatedAnimations[formatedAnimations.length - 1];
                    last.animations = last.animations.filter(item => item.elId !== animation.elId);
                    last.animations.push(animation);
                    formatedAnimations[formatedAnimations.length - 1] = last;
                }
                else if (animation.trigger === 'auto') {
                    const last = formatedAnimations[formatedAnimations.length - 1];
                    last.autoNext = true;
                    formatedAnimations[formatedAnimations.length - 1] = last;
                    formatedAnimations.push({ animations: [animation], autoNext: false });
                }
            }
            return formatedAnimations;
        },
        layouts(state) {
            const { themeColor, fontColor, fontName, backgroundColor, } = state.theme;
            const subColor = tinycolor(fontColor).isDark() ? 'rgba(230, 230, 230, 0.5)' : 'rgba(180, 180, 180, 0.5)';
            const layoutsString = JSON.stringify(layouts)
                .replaceAll('{{themeColor}}', themeColor)
                .replaceAll('{{fontColor}}', fontColor)
                .replaceAll('{{fontName}}', fontName)
                .replaceAll('{{backgroundColor}}', backgroundColor)
                .replaceAll('{{subColor}}', subColor);
            return JSON.parse(layoutsString);
        },
    },
    actions: {
        setTheme(themeProps) {
            this.theme = { ...this.theme, ...themeProps };
        },
        setViewportRatio(viewportRatio) {
            this.viewportRatio = viewportRatio;
        },
        setSlides(slides) {
            this.slides = slides;
        },
        addSlide(slide) {
            const slides = Array.isArray(slide) ? slide : [slide];
            const addIndex = this.slideIndex + 1;
            this.slides.splice(addIndex, 0, ...slides);
            this.slideIndex = addIndex;
        },
        updateSlide(props) {
            const slideIndex = this.slideIndex;
            this.slides[slideIndex] = { ...this.slides[slideIndex], ...props };
        },
        deleteSlide(slideId) {
            const slidesId = Array.isArray(slideId) ? slideId : [slideId];
            const deleteSlidesIndex = [];
            for (let i = 0; i < slidesId.length; i++) {
                const index = this.slides.findIndex(item => item.id === slidesId[i]);
                deleteSlidesIndex.push(index);
            }
            let newIndex = Math.min(...deleteSlidesIndex);
            const maxIndex = this.slides.length - slidesId.length - 1;
            if (newIndex > maxIndex)
                newIndex = maxIndex;
            this.slideIndex = newIndex;
            this.slides = this.slides.filter(item => !slidesId.includes(item.id));
        },
        updateSlideIndex(index) {
            this.slideIndex = index;
        },
        addElement(element) {
            const elements = Array.isArray(element) ? element : [element];
            const currentSlideEls = this.slides[this.slideIndex].elements;
            const newEls = [...currentSlideEls, ...elements];
            this.slides[this.slideIndex].elements = newEls;
        },
        deleteElement(elementId) {
            const elementIdList = Array.isArray(elementId) ? elementId : [elementId];
            const currentSlideEls = this.slides[this.slideIndex].elements;
            const newEls = currentSlideEls.filter(item => !elementIdList.includes(item.id));
            this.slides[this.slideIndex].elements = newEls;
        },
        updateElement(data) {
            const { id, props } = data;
            const elIdList = typeof id === 'string' ? [id] : id;
            const slideIndex = this.slideIndex;
            const slide = this.slides[slideIndex];
            const elements = slide.elements.map(el => {
                return elIdList.includes(el.id) ? { ...el, ...props } : el;
            });
            this.slides[slideIndex].elements = elements;
        },
        removeElementProps(data) {
            const { id, propName } = data;
            const propsNames = typeof propName === 'string' ? [propName] : propName;
            const slideIndex = this.slideIndex;
            const slide = this.slides[slideIndex];
            const elements = slide.elements.map(el => {
                return el.id === id ? omit(el, propsNames) : el;
            });
            this.slides[slideIndex].elements = elements;
        },
        request_update_slides(prompt) {
            const update_slides_requset = {
                'prompt': '',
                'slide': '',
            };
            update_slides_requset['prompt'] = prompt;
            const target_slides = this.slides[this.slideIndex];
            // const dom_top = convert_slides_to_dom(target_slides)
            const dom_top = convert_slide_to_dom(target_slides);
            update_slides_requset['slide'] = dom_top.outerHTML;
            let receive_xml = `
      <slides>
  <slide id="test-slide-1">
    <p id="idn7Mx">论语</p>
    <p id="7stmVP">有朋自远方来，不亦乐乎。</p>
  </slide>
</slides>
`;
            console.log('要修改的页面和命令：');
            console.log(JSON.stringify(update_slides_requset, null, 2));
            // const res_slides = update_xml_to_dom_to_slide(receive_xml, target_slides)
            // for (let i = 0; i < res_slides.length; i++) {
            //   target_slides[i] = res_slides[i]
            // }
            // this.slides[this.slideIndex] = res_slides[0]
            update_slides(update_slides_requset).then((response) => {
                console.log('response:', JSON.stringify(response, null, 2));
                const data = response.data;
                if (data) {
                    receive_xml = data['xml_ppt'];
                    const res_slides = update_xml_to_dom_to_slide(receive_xml, [target_slides]);
                    // for (let i = 0; i < res_slides.length; i++) {
                    //   target_slides[i] = res_slides[i]
                    // }
                    this.slides[this.slideIndex] = res_slides[0];
                }
            }).catch(error => {
                console.error('An error occurred:', error);
            });
        },
    },
});
//# sourceMappingURL=slides.js.map