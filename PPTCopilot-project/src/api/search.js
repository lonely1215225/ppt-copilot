import request from '@/utils/request'
export function searchProjects(filterWords, sortMethod) {
  return request({
    url: '/project/search',
    method: 'get',
    params: {
      filter_words: filterWords,
      sort_method: sortMethod
    }
  })
}

// export function searchProjects(filterWords) {
//   return request({
//     url: '/project',
//     method: 'get',
//     // params: {
//     //   filter_words: filterWords
//     // }
//   })
// }
