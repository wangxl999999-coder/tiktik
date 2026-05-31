import type { User, Video, Comment, Topic, Message, Notification, Category, LiveRoom, HotSearchItem } from '@/types'

const SAMPLE_VIDEOS = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://www.w3schools.com/html/movie.mp4',
  'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
  'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_2mb.mp4',
  'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4',
]

const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
]

const COVERS = Array.from({ length: 20 }, (_, i) => `https://picsum.photos/400/700?random=${i + 1}`)

export const mockUsers: User[] = [
  {
    id: '1',
    phone: '13800138000',
    nickname: '旅行者小明',
    avatar: AVATARS[0],
    bio: '热爱生活，记录美好瞬间 🌟',
    followersCount: 12580,
    followingCount: 328,
    likesCount: 89562,
    worksCount: 156,
    isVerified: true,
    createdAt: '2023-01-15',
    location: '北京'
  },
  {
    id: '2',
    phone: '13800138001',
    nickname: '美食探店达人',
    avatar: AVATARS[1],
    bio: '吃遍天下美食 🍜',
    followersCount: 56890,
    followingCount: 156,
    likesCount: 125680,
    worksCount: 328,
    isVerified: true,
    createdAt: '2022-06-20',
    location: '上海'
  },
  {
    id: '3',
    phone: '13800138002',
    nickname: '舞蹈小仙女',
    avatar: AVATARS[2],
    bio: '用舞蹈表达心情 💃',
    followersCount: 89234,
    followingCount: 89,
    likesCount: 456789,
    worksCount: 89,
    isVerified: true,
    createdAt: '2022-03-10',
    location: '广州'
  },
  {
    id: '4',
    phone: '13800138003',
    nickname: '科技极客',
    avatar: AVATARS[3],
    bio: '分享科技前沿资讯 🚀',
    followersCount: 34567,
    followingCount: 567,
    likesCount: 234567,
    worksCount: 456,
    isVerified: false,
    createdAt: '2023-05-01',
    location: '深圳'
  },
  {
    id: '5',
    phone: '13800138004',
    nickname: '萌宠乐园',
    avatar: AVATARS[4],
    bio: '记录宠物的日常 🐱🐶',
    followersCount: 123456,
    followingCount: 234,
    likesCount: 789456,
    worksCount: 567,
    isVerified: true,
    createdAt: '2021-11-25',
    location: '成都'
  },
  {
    id: '6',
    phone: '13800138005',
    nickname: '健身教练阿杰',
    avatar: AVATARS[5],
    bio: '健身改变人生 💪',
    followersCount: 67890,
    followingCount: 123,
    likesCount: 345678,
    worksCount: 234,
    isVerified: false,
    createdAt: '2022-09-18',
    location: '杭州'
  },
  {
    id: '7',
    phone: '13800138006',
    nickname: '旅行日记',
    avatar: AVATARS[6],
    bio: '用脚步丈量世界 🌍',
    followersCount: 234567,
    followingCount: 456,
    likesCount: 1234567,
    worksCount: 789,
    isVerified: true,
    createdAt: '2021-02-14',
    location: '厦门'
  },
  {
    id: '8',
    phone: '13800138007',
    nickname: '音乐制作人',
    avatar: AVATARS[7],
    bio: '用音乐治愈心灵 🎵',
    followersCount: 45678,
    followingCount: 789,
    likesCount: 567890,
    worksCount: 123,
    isVerified: false,
    createdAt: '2023-03-08',
    location: '南京'
  }
]

export const mockTopics: Topic[] = [
  { id: '1', name: '夏日穿搭', description: '分享夏天的时尚穿搭灵感', videosCount: 12580, viewsCount: 5689000, coverUrl: 'https://picsum.photos/300/300?random=101', isHot: true, heat: 985600, trend: 'up' },
  { id: '2', name: '美食探店', description: '发现城市里的美食宝藏', videosCount: 23456, viewsCount: 12345000, coverUrl: 'https://picsum.photos/300/300?random=102', isHot: true, heat: 1256000, trend: 'up' },
  { id: '3', name: '健身打卡', description: '每天健身，健康生活', videosCount: 18923, viewsCount: 8956000, coverUrl: 'https://picsum.photos/300/300?random=103', isHot: true, heat: 756800, trend: 'stable' },
  { id: '4', name: '旅行日记', description: '记录旅途中的美好', videosCount: 34567, viewsCount: 18923000, coverUrl: 'https://picsum.photos/300/300?random=104', isHot: true, heat: 1568000, trend: 'up' },
  { id: '5', name: '萌宠日常', description: '宠物的可爱瞬间', videosCount: 45678, viewsCount: 23456000, coverUrl: 'https://picsum.photos/300/300?random=105', isHot: false, heat: 2156000, trend: 'up' },
  { id: '6', name: '舞蹈挑战', description: '最火舞蹈挑战合集', videosCount: 15678, viewsCount: 9876000, coverUrl: 'https://picsum.photos/300/300?random=106', isHot: true, heat: 895600, trend: 'down' },
  { id: '7', name: '科技数码', description: '最新科技产品评测', videosCount: 8923, viewsCount: 4567000, coverUrl: 'https://picsum.photos/300/300?random=107', isHot: false, heat: 456800, trend: 'stable' },
  { id: '8', name: '音乐分享', description: '好音乐一起听', videosCount: 28901, viewsCount: 11234000, coverUrl: 'https://picsum.photos/300/300?random=108', isHot: false, heat: 678900, trend: 'up' }
]

const VIDEO_TITLES = [
  '今天的日落真的太美了 🌅',
  '这家店的美食绝了！',
  '新学的舞蹈，大家觉得怎么样？',
  '开箱最新款手机，太香了！',
  '我家猫咪今天太可爱了 🐱',
  '健身打卡第100天！',
  '旅行vlog | 三亚的海真蓝',
  '原创音乐分享给大家',
  '夏日穿搭分享 👗',
  '周末去哪玩？',
  '教你做一道家常菜',
  '街舞freestyle',
  '雪山之旅 🏔️',
  '效率工具分享',
  '狗狗的快乐时光',
  '腹肌训练教程',
  '云南自驾游',
  '深夜食堂',
  '穿搭灵感分享',
  '生活日常vlog'
]

const VIDEO_DESCRIPTIONS = [
  '记录生活中的美好瞬间，喜欢的话记得点赞关注哦~ #生活 #日常',
  '探店美食分享，地址在评论区 #美食 #探店',
  '练习了很久的舞蹈，希望大家喜欢 💃 #舞蹈 #日常',
  '最新科技产品开箱评测 #科技 #数码',
  '我家毛孩子的日常 #萌宠 #猫咪',
  '坚持健身，坚持自律 #健身 #打卡',
  '带你看遍世界的美好 #旅行 #vlog',
  '原创音乐，希望能治愈你 #音乐 #原创',
  '夏天就要穿得美美的 #穿搭 #时尚',
  '周末好去处推荐 #生活 #周末',
  '家常菜教程来啦 #美食 #教程',
  '街舞日常练习 #舞蹈 #街舞',
  '最美的风景在路上 #旅行 #风景',
  '提升效率的小工具 #科技 #效率',
  '狗狗的快乐你不懂 #萌宠 #狗狗',
  '跟我一起练出好身材 #健身 #教程',
  '自驾游的快乐谁懂啊 #旅行 #自驾',
  '深夜放毒系列 #美食 #深夜食堂',
  '今天穿什么 #穿搭 #日常',
  '普通但快乐的一天 #生活 #vlog'
]

const LOCATIONS = ['北京·三里屯', '上海·外滩', '广州·珠江新城', '深圳·科技园', '成都·春熙路', '杭州·西湖', '厦门·鼓浪屿', '南京·夫子庙']
const CATEGORIES = ['美食', '舞蹈', '旅行', '科技', '萌宠', '健身', '音乐', '时尚']

export const mockVideos: Video[] = Array.from({ length: 20 }, (_, i) => ({
  id: `video-${i + 1}`,
  userId: mockUsers[i % mockUsers.length].id,
  author: mockUsers[i % mockUsers.length],
  title: VIDEO_TITLES[i],
  description: VIDEO_DESCRIPTIONS[i],
  videoUrl: SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length],
  coverUrl: COVERS[i % COVERS.length],
  likesCount: Math.floor(Math.random() * 100000) + 1000,
  commentsCount: Math.floor(Math.random() * 5000) + 100,
  sharesCount: Math.floor(Math.random() * 1000) + 50,
  viewsCount: Math.floor(Math.random() * 1000000) + 10000,
  isLiked: false,
  isFavorited: false,
  isFollowing: false,
  topics: [mockTopics[i % mockTopics.length]],
  location: LOCATIONS[i % LOCATIONS.length],
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  duration: Math.floor(Math.random() * 60) + 15,
  category: CATEGORIES[i % CATEGORIES.length]
}))

const COMMENT_CONTENTS = [
  '太棒了！👍',
  '学到了，感谢分享！',
  '这个视频太治愈了',
  '已关注，期待更多作品',
  '哈哈哈哈笑死我了',
  '求背景音乐！',
  '这个教程太详细了',
  '已收藏，慢慢看',
  '小姐姐跳得真好！',
  '这也太可爱了吧',
  '羡慕了，我也想去',
  '美食看起来好好吃',
  '干货满满，收藏了',
  '每天必看的博主',
  'BGM是什么呀？'
]

export const generateComments = (videoId: string, count: number = 20): Comment[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `comment-${videoId}-${i + 1}`,
    videoId,
    userId: mockUsers[i % mockUsers.length].id,
    user: mockUsers[i % mockUsers.length],
    content: COMMENT_CONTENTS[i % COMMENT_CONTENTS.length],
    likesCount: Math.floor(Math.random() * 1000) + 10,
    isLiked: false,
    replies: i < 5 ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
      id: `reply-${videoId}-${i + 1}-${j + 1}`,
      videoId,
      userId: mockUsers[(i + j + 1) % mockUsers.length].id,
      user: mockUsers[(i + j + 1) % mockUsers.length],
      content: COMMENT_CONTENTS[(i + j + 5) % COMMENT_CONTENTS.length],
      likesCount: Math.floor(Math.random() * 100),
      isLiked: false,
      replies: [],
      parentId: `comment-${videoId}-${i + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    })) : [],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
  }))
}

export const mockMessages: Message[] = [
  { id: 'msg-1', type: 'like', fromUserId: '2', fromUser: mockUsers[1], toUserId: '1', content: '赞了你的视频', videoId: 'video-1', video: mockVideos[0], isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'msg-2', type: 'comment', fromUserId: '3', fromUser: mockUsers[2], toUserId: '1', content: '评论了你的视频：太棒了！', videoId: 'video-1', video: mockVideos[0], isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 'msg-3', type: 'follow', fromUserId: '4', fromUser: mockUsers[3], toUserId: '1', content: '关注了你', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: 'msg-4', type: 'mention', fromUserId: '5', fromUser: mockUsers[4], toUserId: '1', content: '@了你', videoId: 'video-5', video: mockVideos[4], isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: 'msg-5', type: 'like', fromUserId: '6', fromUser: mockUsers[5], toUserId: '1', content: '赞了你的评论', videoId: 'video-2', video: mockVideos[1], isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() }
]

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'announcement',
    title: '🎉 新版本上线',
    content: 'TikTik v1.2.0 版本已发布，新增多项功能，赶快来体验吧！',
    imageUrl: 'https://picsum.photos/600/300?random=201',
    isRead: false,
    createdAt: new Date().toISOString(),
    priority: 'high'
  },
  {
    id: 'notif-2',
    type: 'activity',
    title: '🌟 夏日活动来袭',
    content: '参与#夏日穿搭 话题挑战，赢取丰厚奖品！',
    imageUrl: 'https://picsum.photos/600/300?random=202',
    linkUrl: '/topic/1',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    priority: 'medium'
  },
  {
    id: 'notif-3',
    type: 'version',
    title: '🔔 版本更新提示',
    content: '检测到新版本 v1.2.1，包含性能优化和 Bug 修复，建议更新。',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    priority: 'low'
  }
]

export const mockCategories: Category[] = [
  { id: 'cat-1', name: '美食', icon: 'utensils', description: '美食探店、家常菜教程、美食测评', videosCount: 125680 },
  { id: 'cat-2', name: '舞蹈', icon: 'music', description: '热门舞蹈、舞蹈教程、舞蹈挑战', videosCount: 89560 },
  { id: 'cat-3', name: '旅行', icon: 'plane', description: '旅行vlog、风景分享、攻略推荐', videosCount: 156780 },
  { id: 'cat-4', name: '科技', icon: 'cpu', description: '数码评测、科技资讯、效率工具', videosCount: 67890 },
  { id: 'cat-5', name: '萌宠', icon: 'heart', description: '猫咪、狗狗、萌宠日常', videosCount: 234560 },
  { id: 'cat-6', name: '健身', icon: 'dumbbell', description: '健身教程、健身打卡、营养知识', videosCount: 98760 },
  { id: 'cat-7', name: '音乐', icon: 'headphones', description: '音乐分享、翻唱、原创音乐', videosCount: 112340 },
  { id: 'cat-8', name: '时尚', icon: 'shirt', description: '穿搭分享、美妆教程、时尚资讯', videosCount: 145670 }
]

export const mockLiveRooms: LiveRoom[] = [
  { id: 'live-1', title: '新人主播求关注~', userId: '3', user: mockUsers[2], coverUrl: 'https://picsum.photos/400/600?random=301', viewersCount: 1256, isLive: true, category: '舞蹈', startedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'live-2', title: '深夜食堂，一起吃夜宵', userId: '2', user: mockUsers[1], coverUrl: 'https://picsum.photos/400/600?random=302', viewersCount: 8956, isLive: true, category: '美食', startedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 'live-3', title: '健身干货分享', userId: '6', user: mockUsers[5], coverUrl: 'https://picsum.photos/400/600?random=303', viewersCount: 3456, isLive: true, category: '健身', startedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: 'live-4', title: '聊聊天，唱唱歌', userId: '8', user: mockUsers[7], coverUrl: 'https://picsum.photos/400/600?random=304', viewersCount: 5678, isLive: true, category: '音乐', startedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: 'live-5', title: '带大家逛三亚', userId: '7', user: mockUsers[6], coverUrl: 'https://picsum.photos/400/600?random=305', viewersCount: 12345, isLive: true, category: '旅行', startedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() }
]

export const mockHotSearches: HotSearchItem[] = [
  { id: 'hot-1', keyword: '夏日穿搭', heat: 2156000, trend: 'up', isHot: true, isNew: false },
  { id: 'hot-2', keyword: '这家店真的绝了', heat: 1895000, trend: 'up', isHot: true, isNew: false },
  { id: 'hot-3', keyword: '健身打卡挑战', heat: 1568000, trend: 'stable', isHot: true, isNew: false },
  { id: 'hot-4', keyword: '旅行推荐', heat: 1256000, trend: 'up', isHot: false, isNew: true },
  { id: 'hot-5', keyword: '萌宠日常', heat: 1123000, trend: 'down', isHot: false, isNew: false },
  { id: 'hot-6', keyword: '舞蹈教程', heat: 987000, trend: 'up', isHot: false, isNew: false },
  { id: 'hot-7', keyword: '数码评测', heat: 856000, trend: 'stable', isHot: false, isNew: true },
  { id: 'hot-8', keyword: '音乐分享', heat: 745000, trend: 'up', isHot: false, isNew: false },
  { id: 'hot-9', keyword: '家常菜教程', heat: 634000, trend: 'down', isHot: false, isNew: false },
  { id: 'hot-10', keyword: '效率工具', heat: 523000, trend: 'up', isHot: false, isNew: false }
]

export const recommendedAccounts = mockUsers.filter(u => u.id !== '1').slice(0, 6)
export const followingList = mockUsers.filter(u => ['2', '3', '5', '7'].includes(u.id))

