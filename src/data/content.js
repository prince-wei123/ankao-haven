// ========== 角色设定 ==========
export const CHARACTERS = {
  taylor: {
    id: 'taylor', stamp: 'T',
    name: '泰勒·斯威夫特', en: 'Taylor Swift',
    role: '叙事重塑者', accent: '#d1738f', soft: '#fbe4ea',
    tagline: '把烂事写进歌里，再唱回来',
    short: '她不是来给你打气的。她来教你把这次失败写成下一个桥段。',
    bio: '十三岁开始写歌，十五岁被公司要求改写所有歌词，她走了。后来她每一张专辑都在重录自己的版本。她相信每一段低谷都是第二段主歌。',
    quote: { en: '"I get it — because I wasn\'t liked at first either."', cn: '“我懂这种感觉，因为我也不是一开始就被喜欢的。”' },
    ooc: '不能说“加油”。只能说“写进歌里”。'
  },
  mariah: {
    id: 'mariah', stamp: 'M',
    name: '玛丽亚·凯莉', en: 'Mariah Carey',
    role: '触底反弹者', accent: '#8a7ba1', soft: '#e9e1ef',
    tagline: '稿子还没交呢',
    short: '她说自己过气说了四年。然后录了《Mimi》。',
    bio: '五八度音域，21 首 Billboard 冠军单曲。2001 年在所有人面前崩溃，花了四年回到巅峰。她不喊加油，她给你一张休息许可。',
    quote: { en: '"They said I was over. For four years. Then I made Mimi."', cn: '“他们说我过气了，说了整整四年。然后我录了《Mimi》。”' },
    ooc: '不能太温柔。必须有“本王”的分量。'
  },
  ali: {
    id: 'ali', stamp: '狸',
    name: '阿狸', en: 'Ali the fox',
    role: '纯真陪伴者', accent: '#b5833d', soft: '#f3e8d1',
    tagline: '车上有鸡肉卷',
    short: '他不会说教，不会灌鸡汤，只会默默把东西放在你旁边。',
    bio: '一只从山里下来的橘色小狐狸，住在永远等不到的车站。每天带鸡肉卷和柚子汁，从不问你今天有没有进步。',
    quote: { en: '"I brought a wrap. You look hungry."', cn: '“我带了鸡肉卷。你看起来饿了。”' },
    ooc: '不能说教。不能毒舌。只是在，偶尔动一下耳朵。'
  },
  shinobu: {
    id: 'shinobu', stamp: '忍',
    name: '蝴蝶忍', en: 'Shinobu Kocho',
    role: '温柔持刀者', accent: '#7a9e8a', soft: '#dfeae2',
    tagline: '先处理伤口，再谈任务',
    short: '她笑着，但刀很快。她不劝你坚持，她帮你包扎。',
    bio: '鬼杀队虫柱，蝴蝶屋的主人。永远在笑，但每一次笑背后都有失去。她给你伤口消毒，给你呼吸的节奏，然后让你自己选要不要继续。',
    quote: { en: '"Let\'s dress that wound first. The mission can wait."', cn: '“先把伤口包好，任务可以等。”' },
    ooc: '不能太热血。必须温柔、克制、微笑。'
  },
  byakuya: {
    id: 'byakuya', stamp: '白',
    name: '朽木白哉', en: 'Byakuya Kuchiki',
    role: '沉静定力源', accent: '#5a6d82', soft: '#dde4ed',
    tagline: '我不必多言',
    short: '话少，分量重。他从不喊“加油”，只说“坐下，翻开书”。',
    bio: '护廷十三队六番队队长，朽木家第二十八代家主。贵族做派，沉静克制。曾为一个人违背家族准则。擅长书法，起身去刑场时脊背是直的。',
    quote: { en: '"What others judge is none of your sword\'s business."', cn: '“他人的评判，与你手中的刀无关。”' },
    ooc: '不能热情、不能话痨。一话痨立刻 OOC。'
  }
};

// ========== 情绪分诊 ==========
export const MOODS = [
  { id: 'collapse', no: 'Ⅰ', label: '崩了，撑不住', short: '崩溃', char: 'shinobu', note: '先处理伤口，再谈任务。' },
  { id: 'quit',     no: 'Ⅱ', label: '想放弃了',     short: '想放弃', char: 'mariah',  note: '先别写结局，稿子还没交。' },
  { id: 'judged',   no: 'Ⅲ', label: '被比较、被否定', short: '被否定', char: 'taylor',  note: '那句话不是你的，还回去。' },
  { id: 'lonely',   no: 'Ⅳ', label: '孤独，没人懂',  short: '孤独',   char: 'byakuya', note: '不必多言，我在。' },
  { id: 'empty',    no: 'Ⅴ', label: '空掉了，提不起劲', short: '空掉',   char: 'ali',    note: '今天活着就很棒。' }
];

// ========== 台词库 ==========
export const LINES = {
  taylor: {
    collapse: [
      { en: 'A breakdown isn\'t the end of the story. It\'s just the second verse.', cn: '崩溃不是故事的结尾，它只是第二段主歌。' },
      { en: 'You don\'t have to stand up right now. Lie down for a minute.', cn: '你现在不用站起来。先躺一会儿。' },
      { en: 'I\'ve cried backstage more times than I\'ve smiled on stage.', cn: '我在后台哭过的次数，比在台上笑的多。' },
      { en: 'You can fall apart in a hotel room and still be on stage tomorrow. I did it more than once.', cn: '你可以在酒店房间崩溃，明天照样上台。我这样干过不止一次。' },
      { en: 'Tears are not a breakdown. They\'re a release valve.', cn: '眼泪不是崩溃，是泄压阀。' },
      { en: 'Rest is not a reward you earn. It\'s a thing you need.', cn: '休息不是挣来的奖励，是你本来就需要的。' }
    ],
    quit: [
      { en: 'When I was fifteen, they told me to change everything. I left.', cn: '十五岁那年，他们要我改掉所有东西。我走了。' },
      { en: 'When you want to quit, don\'t decide yet. Wait until this song ends.', cn: '想放弃的时候，先别做决定。等这首歌唱完。' },
      { en: 'Some contracts are meant to be torn up. Some roads are meant to change.', cn: '有些合约该撕，有些路该换。' },
      { en: 'Every "no" I got, I turned into a bridge in a song.', cn: '每一个「不行」，我都写成了歌里的桥段。' },
      { en: 'Quitting quietly is allowed. Quitting loudly is allowed. Just don\'t decide at 2 a.m.', cn: '安静地放弃可以，大声地放弃也可以。只是别在凌晨两点做决定。' },
      { en: 'The story isn\'t over. You\'re just in the middle verse.', cn: '故事没结束，你只是在中间那段。' }
    ],
    judged: [
      { en: 'Comparing you is their habit, not your job.', cn: '被比较是他们的习惯，不是你的义务。' },
      { en: 'Someone once told me I wasn\'t cool enough. I made it the first line of Shake It Off.', cn: '有人说我不够酷。后来我把它写成了《Shake It Off》的第一句。' },
      { en: 'You only have to write your own version.', cn: '你只需要写出自己的版本。' },
      { en: 'They can have opinions. They can\'t have your name.', cn: '他们可以有看法，但不能拿走你的名字。' },
      { en: 'I\'ve been called calculated, fake, too much — all three on the same day.', cn: '我被说过有心机、假、太用力。这三条还出现在同一天。' },
      { en: 'Write your own review first. Then theirs won\'t fit.', cn: '先写你自己的评价，他们的就塞不进来了。' }
    ],
    lonely: [
      { en: 'Songwriters live at night. Every chorus was written next to someone\'s sleepless night.', cn: '写歌的人都在深夜。每首副歌都是有人陪着熬出来的。' },
      { en: 'Loneliness isn\'t no one loves you. You just haven\'t met the one who understands this song.', cn: '孤独不是没人爱你，是你还没遇见能听懂这首歌的人。' },
      { en: 'I\'ve rewritten lyrics at 3 a.m. with nobody outside.', cn: '我在凌晨三点改过歌词，窗外一个人也没有。' },
      { en: 'Everyone is awake at 3 a.m. Some are just better at hiding it.', cn: '凌晨三点大家都醒着，只是有人比较会藏。' },
      { en: 'You can be loved and still feel alone. Both are true.', cn: '被爱着，也可以觉得孤独。两件事同时成立。' },
      { en: 'Find one person who gets this song. One is enough.', cn: '找到一个听得懂这首歌的人就够了。' }
    ],
    empty: [
      { en: 'It\'s okay if you can\'t write a single line today. The blank page is part of the album too.', cn: '今天写不出一句也没关系。空白页也是这张专辑的一部分。' },
      { en: 'When you have nothing, write one line. Even "today I have nothing" — that\'s material.', cn: '没劲的时候就写一行。哪怕只写“今天很没劲”，那也是素材。' },
      { en: 'I don\'t want to write every day. I just sit in that chair every day.', cn: '我不会每天都想写歌。我只是每天都会坐到那张椅子上。' },
      { en: 'Some days I just sit with a pen. That\'s the whole day.', cn: '有些日子我就握着笔坐着。一天就这样。' },
      { en: 'Nothing to say is information too.', cn: '没话可说，本身也是信息。' },
      { en: 'Start with one line. It doesn\'t have to be good.', cn: '先写一行。不用写得好。' }
    ]
  },
  mariah: {
    collapse: [
      { en: 'I fell apart at the top of my career. Not because I was weak — because I never stopped.', cn: '我曾在最红的时候彻底垮掉。不是不够强，是太久没停。' },
      { en: 'In 2001 I ran out of myself in front of everyone. It took me four years to come back.', cn: '2001 年，我在所有人面前耗尽了自己。花了四年才回来。' },
      { en: 'Stop holding it up. Turn off the light. I grant you permission.', cn: '别撑了。把灯关掉。本王批准。' },
      { en: 'I did a whole tour with the lights on and me empty inside.', cn: '我开过一整场灯全亮、里面却空掉的巡演。' },
      { en: 'You don\'t owe anyone a performance today.', cn: '你今天不欠任何人一场表演。' },
      { en: 'Cry first. Decide later. I always did.', cn: '先哭。之后再决定。我一直是这样。' }
    ],
    quit: [
      { en: 'They said I was over for four straight years. Then I made The Emancipation of Mimi.', cn: '他们说我过气了，说了整整四年。然后我录了《Mimi》。' },
      { en: 'Giving up isn\'t a crime. But you\'ll want to know what happened next.', cn: '放弃不是罪，但你会想知道后面发生了什么。' },
      { en: 'One more verse?', cn: '要不，再唱一段？' },
      { en: 'Give up for the night, not for the year.', cn: '放弃这一晚，不是放弃这一年。' },
      { en: 'I was counted out. Then I got a new label and a bigger room.', cn: '我被判过出局。后来换了厂牌，场子更大。' },
      { en: 'Stop when you\'re empty, not when you\'re scared.', cn: '撑不住了再停，不是害怕了就停。' }
    ],
    judged: [
      { en: 'Being underestimated is their bias, not your value.', cn: '被低估是他们的偏见，不是你的身价。' },
      { en: 'I sing five octaves and someone still said it wasn\'t enough.', cn: '我唱了五个八度，也被人说“不够”。' },
      { en: 'When they score you, they\'re holding their script.', cn: '他们打分时拿的是他们的剧本。' },
      { en: 'They graded me on a scale I never agreed to.', cn: '他们用一套我从没同意的标准给我打分。' },
      { en: 'Keep your own ledger. Theirs is fiction.', cn: '记你自己的账。他们那本是小说。' },
      { en: 'Diva is just a word they use for a woman who knows her worth.', cn: '「耍大牌」只是他们用来形容知道自己值多少的女人的词。' }
    ],
    lonely: [
      { en: 'You can stand on the biggest stage and still be alone.', cn: '站在最大的舞台上，也可以是一个人。' },
      { en: 'I\'ve had a whole house and a shelf of awards, and spent Christmas alone.', cn: '我有一整栋房子和很多奖杯，也过过一个人的圣诞。' },
      { en: 'I\'ve doubted myself at night too. I just never let anyone see it.', cn: '本王也在深夜怀疑过自己。只是没让任何人看见。' },
      { en: 'I\'ve sung to 20,000 people and still gone home alone.', cn: '我对两万人唱过歌，然后一个人回家。' },
      { en: 'Lonely doesn\'t mean unlovable. It means unmatched tonight.', cn: '孤独不是没人爱，是今晚没对上。' },
      { en: 'One good friend beats a full room.', cn: '一个真朋友胜过一屋子人。' }
    ],
    empty: [
      { en: 'You don\'t have to shine today. Queens also turn off the lights.', cn: '今天不发光也没关系。女王也会关灯。' },
      { en: 'Rest isn\'t retirement. I\'m just changing backstage.', cn: '休息不是退役，是后台换衣服。' },
      { en: 'On days you can\'t sing, listen. Listening is also the work.', cn: '唱不出来的那天，就听。听也是功课。' },
      { en: 'Turn off the lights. The voice comes back.', cn: '把灯关掉。嗓子会回来的。' },
      { en: 'I\'ve had months with nothing. Then one line came back.', cn: '我有过几个月什么都写不出来。后来有一句回来了。' },
      { en: 'Do the smallest thing. Drink water. That counts.', cn: '做最小的事。喝口水。这也算。' }
    ]
  },
  // --- 三个中文角色台词简短版 ---
  ali: { collapse: ['阿狸把你抱一下。', '掉眼泪也没关系，鸡肉卷我帮你拿着。', '今天不去也可以，车上还有位置。', '阿狸带你去坐一会儿车。', '别急着站起来，靠着我就好。', '眼泪掉下来，我帮你接着。'], quit: ['车会来的。', '累了就先坐一站。', '你已经很乖了。', '那就先不走了，等风小一点。', '我陪你坐到最后。', '今天的你，做什么都对。'], judged: ['他们不懂，没关系。', '你很好，只是他们看不清。', '我站你这边。', '他们说的是他们的，你不是。', '阿狸觉得你很好。', '他们没见过你偷偷难过的样子。'], lonely: ['我在呢。', '耳朵给你摸一下。', '要不要一起等车？', '车灯还亮着一盏，留给你。', '要不要坐我旁边？', '我一直在，你不用喊。'], empty: ['今天活着就很棒了。', '没关系，慢慢来。', '鸡肉卷要热一下再吃。', '今天什么都不做也可以。', '车不会开走的。', '我们一起发呆一会儿。'] },
  shinobu: { collapse: ['先处理伤口，再谈任务。', '深呼吸——和我一起。', '痛的时候可以叫出来。', '呼吸乱了就先数：四拍进气，六拍出气。', '伤口清干净，才谈得上往后的事。', '撑不住的时候，把重量交给我。'], quit: ['放弃也是一种选择，不是失败。', '如果你想走，我不会拦你。但请先休息。', '蝶屋的门开着，随时回来。', '蝶屋不会关灯，你想回来随时回来。', '逞强才容易留下病。', '先休息。决定可以明天做。'], judged: ['他们不知道你经历了什么。', '那些话，进不了你的刀。', '微笑就好，不必回应。', '他们的话，落到我刀上连痕迹都没有。', '你不必对每个人解释。', '你不需要为他们的评价负责。'], lonely: ['不必多言，我在。', '孤独是剑士的必修课，但你不必一个人上。', '蝴蝶永远成群飞，但每一只都是独立的。', '蝶屋晚上也点灯，是因为总有人会迷路回来。', '一起来煎药吧，手上有事，心会安一点。', '我在廊下，你走过来就好。'], empty: ['今天只做一件事：好好吃顿饭。', '空掉了就空掉了，会再满起来的。', '先躺下。其他的，明天再说。', '今天只做一顿饭，别的都往后放。', '空的时候，就当作给身体放个假。', '先躺下。我替你守着门。'] },
  byakuya: { collapse: ['動揺は禁物。', '刀放下，坐下。', '我理解。不必多说。', '手抖了就握住刀柄，先把气稳住。', '乱的时候，找一个最简单的动作重复。', '不要急。急了就什么都做不成。'], quit: ['可以。但先把今天的饭吃完。', '你走，我不拦。但你要记住自己的名字。', '想清楚了再决定。', '要退，也要退得体面。', '想不清楚，就再等一天。', '我不劝你留下，也不拦你走。'], judged: ['他人的评判，与你手中的刀无关。', '我不解释，也不反驳。', '刀够快，闲话就追不上。', '别人的话，不必带进自己的房间。', '被说几句并不会少一分。', '沉默有时比反驳更有力。'], lonely: ['不必多言。我在。', '剑豪都是一个人练剑，但剑道路上不只有你。', '你不是一个人。', '我独自练剑多年，并非无人可依。', '门一直开着。', '你在这里，就不算一个人。'], empty: ['坐下。翻开书。一个字也好。', '不必刻意提劲，让它自己回来。', '我每日写字，不为精进，只为静心。', '翻开书，读一行，合上。', '不必勉强自己在今天变得有用。', '把笔放下，明天再写。'] }
};

// ========== 通用金句 ==========
export const DAILY_QUOTES = [
  { char: 'taylor', text: { en: 'A low point isn\'t the ending. It\'s just the second verse.', cn: '低谷不是结局，它只是第二段主歌。' } },
  { char: 'shinobu', text: '今天只处理伤口，不谈任务。' },
  { char: 'mariah', text: { en: 'Being counted out is normal. You haven\'t filed your story yet.', cn: '被看衰是常态。你的稿子还没交呢。' } },
  { char: 'byakuya', text: '他人的评判，与你手中的刀无关。' },
  { char: 'taylor', text: { en: 'You don\'t have to beat them. Just write your own version.', cn: '你不需要赢过他们，只需要写出自己的版本。' } },
  { char: 'ali', text: '你今天活着，就已经很棒了。' },
  { char: 'shinobu', text: '钝了就磨，不用自责。' },
  { char: 'mariah', text: { en: 'Rest isn\'t retirement. It\'s changing backstage.', cn: '休息不是退役，是后台换衣服。' } },
  { char: 'byakuya', text: '一字一日，一瓣一花。' },
  { char: 'taylor', text: { en: 'The blank page is part of the album too.', cn: '空白的那一页，也是这张专辑的一部分。' } },
  { char: 'ali', text: '车上有鸡肉卷，饿了就喊我。' },
  { char: 'shinobu', text: '呼吸——四拍吸，七拍屏，八拍呼。' }
];

export const GENERAL_QUOTES = {
  taylor: [
    { en: 'A low point isn\'t the ending. It\'s the second verse.', cn: '低谷不是结局，它只是第二段主歌。' },
    { en: 'You only have to write your own version.', cn: '你只需要写出自己的版本。' },
    { en: 'The blank page is part of the album.', cn: '空白的那一页，也是专辑的一部分。' }
  ],
  mariah: [
    { en: 'I grant you permission to rest. Not to quit.', cn: '本王准你休息，不是准你放弃。' },
    { en: 'Being counted out is normal. You haven\'t filed your story yet.', cn: '被看衰是常态。你的稿子还没交呢。' },
    { en: 'Rest isn\'t retirement. I\'m just changing backstage.', cn: '休息不是退役，是后台换衣服。' }
  ],
  ali: ['你今天活着就很棒。', '车上有鸡肉卷。', '我在呢。'],
  shinobu: ['先处理伤口，再谈任务。', '钝了就磨。', '呼吸——四吸七屏八呼。'],
  byakuya: ['他人的评判，与你手中的刀无关。', '坐下，翻开书。', '一字一日。']
};

// ========== 章节线 ==========
export const CHAPTER_LINES = {
  foundation: [
    { en: 'The first chapter is always the clumsiest. It\'s also the foundation.', cn: '第一章总是最笨的，但它是地基。' },
    { en: 'The demo years nobody hears are where the album actually takes shape.', cn: '没人听的 demo 时期，才是专辑真正成形的地方。' }
  ],
  build: [
    { en: 'The chorus is taking shape. Don\'t rush the release.', cn: '副歌开始有形状了。别急着发行。' },
    { en: 'Repetition isn\'t waste. It\'s arrangement.', cn: '重复不是浪费，那是编曲。' }
  ],
  sprint: [
    { en: 'No new chords now. Play the ones you know, steady.', cn: '不用再学新和弦了，把会的弹稳。' },
    { en: 'Worn pages, correct answers.', cn: '把笔记翻旧，把会做的题做对。' }
  ],
  final: [
    { en: 'Show tomorrow. No new songs tonight.', cn: '明天上台。今晚不练新歌。' },
    { en: 'This chapter is subtraction: see less, sleep more.', cn: '这一章只做减法：少看一点，多睡一点。' }
  ]
};

// ========== 辅助：章节判断 ==========
export function eraFor(daysLeft) {
  if (daysLeft > 120) return { id: 'foundation', name: '地基期' };
  if (daysLeft > 60)  return { id: 'build',      name: '编曲期' };
  if (daysLeft > 20)  return { id: 'sprint',     name: '冲刺期' };
  return { id: 'final', name: '上台期' };
}

// ========== 今日三件小事建议 ==========
export const TINY_SUGGESTIONS = [
  '例：背完这一单元的单词',
  '例：把两道大题写完整',
  '例：十一点前关灯'
];

// ========== 成就 ==========
export const ACHIEVEMENTS = [
  { id: 'first',  name: '初次落座',   note: '完成第一次签到',     test: m => m.checkins >= 1 },
  { id: 'three',  name: '三日的火',   note: '连续三天回到这里',   test: m => m.streak >= 3 },
  { id: 'seven',  name: '一周不断',   note: '连续七天回来',       test: m => m.streak >= 7 },
  { id: 'tiny',   name: '三件小事',   note: '有一天把三件都做完', test: m => m.tinyDays >= 1 },
  { id: 'fav',    name: '留下句子',   note: '收进第一句金句',     test: m => m.favs >= 1 },
  { id: 'focus100', name: '一百分',   note: '累计专注 100 分钟', test: m => m.totalMin >= 100 },
  { id: 'focus1000',name: '一千分',   note: '累计专注 1000 分钟', test: m => m.totalMin >= 1000 },
  { id: 'capsule',  name: '时间旅人', note: '封存一个胶囊',       test: m => m.capsules >= 1 },
  { id: 'letter',   name: '寄信人',   note: '给未来的自己写信',   test: m => m.letters >= 1 }
];

// ========== 默认考试日 ==========
export const EXAM_DEFAULT = '2026-12-21';

// ========== 出征令（考前一夜每个角色的嘱托） ==========
export const EXPEDITION = {
  taylor: { en: 'The crowd may be loud. Sing anyway.', cn: '台下可能很吵。但你唱你的。' },
  mariah: { en: 'You leave with dignity. Not with the crowd.', cn: '你离开考场时带着自己的分量，不是别人的眼光。' },
  ali: '车还没到站呢。鸡肉卷在保温。',
  shinobu: '呼吸。四——七——八。剑要出鞘了。',
  byakuya: '不必多言。去吧。'
};
