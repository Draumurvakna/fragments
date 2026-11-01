/* 恋人絮语 · 展馆目录
 * halls：九个展厅（顺序、名称、布展方式 kind、主色 stucco、墙签 intro、参照作品 art、展品 figures）
 * figures：80 个 figure（原书字母序编号 no、法文 fr、中文 zh、一句话释义 def、代码画母题 motif、参照作品 art）
 * 画像、导读、边注在 js/guides.js
 */
window.MUSEUM = {
  "title": "恋人絮语",
  "subtitle": "一座关于语言的展馆",
  "blog": "https://draumurvakna.github.io/",
  "preface": [
    "1977 年，罗兰·巴特出版了《恋人絮语》。书里没有故事，只有 80 个片段，按法文字母顺序排列，从 S’abîmer 排到 Vouloir-saisir。",
    "巴特管这些片段叫 figure。它不是修辞格，更像运动员的身姿、舞者的造型：恋人在说话时，会不自觉地摆出某个姿势。等待是一个姿势，嫉妒是一个姿势，说“我爱你”也是。",
    "本馆把 80 个 figure 重新挂进九个展厅。每幅画像是一个当代场景；走近看，导读会按巴特的片段顺序，一段一段讲这一章说了什么。你可以按动线走，也可以直接去藏品总目找。"
  ],
  "halls": [
    {
      "id": 1,
      "art": {
        "src": "https://commons.wikimedia.org/wiki/Special:FilePath/L'Embarquement_pour_Cythère,_by_Antoine_Watteau,_from_C2RMF_retouched.jpg?width=1400",
        "artist": "华托",
        "title": "《舟发西苔岛》",
        "year": "1717",
        "cap": "爱神之岛的朝圣。人们正要上船，或刚要离开，看不出是开始还是结束。"
      },
      "roman": "I",
      "name": "相遇与心动",
      "en": "RAVISSEMENT",
      "kind": "standard",
      "stucco": "#8f3a28",
      "intro": "第一厅讲开始。巴特提醒我们，开始常常是后来补认的：故事需要一个起点，人就回头去挑一个画面。本厅八幅画像，从被“劫持”的那一瞬，到为一次约会挑一件衣服。",
      "figures": [
        "ravissement",
        "rencontre",
        "induction",
        "adorable",
        "atopos",
        "fete",
        "dedicace",
        "habit"
      ]
    },
    {
      "id": 2,
      "art": {
        "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Caspar_David_Friedrich_018.jpg?width=1400",
        "artist": "弗里德里希",
        "title": "《窗前的女人》",
        "year": "1822",
        "cap": "她背对着我们看向窗外。我们看不见她等的人，只看见她在等。"
      },
      "roman": "II",
      "name": "缺席与夜",
      "en": "CHAMBRE NOIRE",
      "kind": "darkroom",
      "stucco": "#5a1a14",
      "intro": "第二厅是一间暗房。那个人不在眼前，他的样子反倒在等待里一点点显影。本厅九幅画像挂在红灯下，要走近了才看得清。",
      "figures": [
        "absence",
        "attente",
        "mutisme",
        "lettre",
        "fading",
        "pourquoi",
        "langueur",
        "nuit",
        "reveil"
      ]
    },
    {
      "id": 3,
      "art": {
        "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Francesco_Hayez_008.jpg?width=1400",
        "artist": "海耶兹",
        "title": "《吻》",
        "year": "1859",
        "cap": "拥抱的一瞬，脚已经踏在台阶上，好像下一秒就要走。"
      },
      "roman": "III",
      "name": "身体与接触",
      "en": "CORPS",
      "kind": "standard",
      "stucco": "#a0603c",
      "intro": "这一厅讲身体。一次碰触，一个拥抱，对方碰过的一样东西，到了恋人这里都成了符号，要求一个回应。他在拥抱里尝过圆满，便梦想和对方合成一个人；可对方的温柔也会给别人，对方受苦的时候，那份苦里也没有他的位置。",
      "figures": [
        "contacts",
        "corps",
        "etreinte",
        "objets",
        "tendresse",
        "union",
        "comblement",
        "compassion"
      ]
    },
    {
      "id": 4,
      "art": {
        "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Fragonard,_The_Reader.jpg?width=1400",
        "artist": "弗拉戈纳尔",
        "title": "《读书的少女》",
        "year": "约 1770",
        "cap": "她在读别人写下的话。语言总是先于我们存在。"
      },
      "roman": "IV",
      "name": "语言的困境",
      "en": "LANGAGE",
      "kind": "scribble",
      "stucco": "#b4475e",
      "intro": "这一厅讲恋人和语言的纠缠。他一遍遍说我爱你，跟对方没完没了地谈这段关系，在脑子里跟自己吵架，想把爱写下来，想读懂对方的每个信号，又拿不准心事该藏多少。话说了这么多，语言还是给不出一句准话。",
      "figures": [
        "jetaime",
        "declaration",
        "loquele",
        "ecrire",
        "signes",
        "drame",
        "cacher",
        "comprendre",
        "inconnaissable",
        "verite"
      ]
    },
    {
      "id": 5,
      "art": {
        "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Edvard_Munch_-_Jealousy_-_MM.M.00864_-_Munch_Museum.jpg?width=1400",
        "artist": "蒙克",
        "title": "《嫉妒》",
        "year": "1913–1915",
        "cap": "前景那张脸看着背后的一对人。第三个人永远站在画框边上。"
      },
      "roman": "V",
      "name": "嫉妒与第三人",
      "en": "LE TIERS",
      "kind": "standard",
      "stucco": "#4e6b4a",
      "intro": "恋人想要一个只有两个人的世界，可第三个人总会进来。这一厅讲的就是这些第三人：情敌，凑过来的熟人，捎来消息的朋友，别人嘴里的闲话，一屋子心照不宣的人，还有身边那些早已各就各位的人。多出来的这个人让恋人嫉妒，也让他在别人的位置上认出了自己。",
      "figures": [
        "jalousie",
        "connivence",
        "facheux",
        "identification",
        "informateur",
        "potin",
        "gene",
        "cases"
      ]
    },
    {
      "id": 6,
      "art": {
        "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Edvard_Munch_-_Melancholy_(1894-96).jpg?width=1400",
        "artist": "蒙克",
        "title": "《忧郁》",
        "year": "1894–1896",
        "cap": "海岸线把画面切开，人坐在伤口的一侧。"
      },
      "roman": "VI",
      "name": "伤口与阴影",
      "en": "BLESSURES",
      "kind": "standard",
      "stucco": "#3e4d5c",
      "intro": "这一厅讲恋人的伤口和阴影。伤人的多半是很小的东西：撞见的画面，对方说漏嘴的一个词，一句玩笑，或者一件碰巧的事。恋人在身体里把它放大，闹情绪，自己折磨自己，吵架，内疚，有时还会突然发现，压在对方身上的那个怪物就是自己。",
      "figures": [
        "image",
        "alteration",
        "ecorche",
        "retentissement",
        "nuages",
        "demons",
        "scene",
        "fautes",
        "monstrueux",
        "contingences"
      ]
    },
    {
      "id": 7,
      "art": {
        "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Caspar_David_Friedrich_-_Der_Mönch_am_Meer_-_Google_Art_Project.jpg?width=1400",
        "artist": "弗里德里希",
        "title": "《海边的僧侣》",
        "year": "1808–1810",
        "cap": "一个很小的人，面对一整片暗下去的海。"
      },
      "roman": "VII",
      "name": "深渊",
      "en": "ABÎME",
      "kind": "abyss",
      "stucco": "#22303a",
      "intro": "这一厅是恋人往下沉的时候：焦虑，崩溃，受不了，怀疑自己疯了，想消失，流泪，觉得整个世界隔着一层玻璃。巴特把这些时刻一个个拆开来看，看焦虑到底在怕什么，眼泪是哭给谁看的。好几章落在同一件事上：只要还能把这种状态说出来，人就还没有完全掉下去。",
      "figures": [
        "sabimer",
        "angoisse",
        "catastrophe",
        "insupportable",
        "fou",
        "suicide",
        "regrette",
        "pleurer",
        "dereallite"
      ]
    },
    {
      "id": 8,
      "art": {
        "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Gradiva-p1030638.jpg?width=1400",
        "artist": "罗马浮雕",
        "title": "《格拉迪娃》",
        "year": "古罗马",
        "cap": "詹森小说里的考古学家爱上浮雕里这个“正在走的女人”，弗洛伊德为此写过一篇长文。"
      },
      "roman": "VIII",
      "name": "信与痴",
      "en": "CROYANCES",
      "kind": "standard",
      "stucco": "#b08a3e",
      "intro": "恋人有自己的一套信仰：向一片树叶问卜，偷偷许愿，把心和力气白白花掉，明知旁人嫌这些又傻又过时，还是认定爱有价值。他甘心被对方拴住，有时又只爱着爱本身，把那个人忘在一边。如今没有哪一套学说肯接住这份痴，他只好一个人信下去。",
      "figures": [
        "magie",
        "gradiva",
        "coeur",
        "depense",
        "obscene",
        "affirmation",
        "seul",
        "dependance",
        "annulation",
        "ascese"
      ]
    },
    {
      "id": 9,
      "art": {
        "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg?width=1400",
        "artist": "弗里德里希",
        "title": "《雾海上的旅人》",
        "year": "约 1818",
        "cap": "走出来了，站在高处，前面仍是雾。"
      },
      "roman": "IX",
      "name": "出口",
      "en": "ISSUES",
      "kind": "exit",
      "stucco": "#c9b98f",
      "intro": "最后一厅讲出口，恋人给自己想过的种种出路：一走了之，只留下快乐的部分，不再去抓住对方，接受他就是这个样子。这些路大多又绕回爱里面，或者通向下一段爱。走到门口回头看，恋人说话已经用上了过去时。",
      "figures": [
        "issues",
        "exil",
        "errance",
        "circonscrire",
        "conduite",
        "tel",
        "vouloirsaisir",
        "souvenir"
      ]
    }
  ],
  "figures": {
    "sabimer": {
      "no": 1,
      "fr": "S’abîmer",
      "zh": "沉没",
      "motif": "wave",
      "def": "因为绝望，也因为太满，恋人忽然想整个人沉下去，消失掉。"
    },
    "absence": {
      "no": 2,
      "fr": "Absence",
      "zh": "缺席",
      "motif": "chair",
      "def": "那个人不在。不论多久、为什么，恋人都会把这段缺席讲成一次被抛弃。"
    },
    "adorable": {
      "no": 3,
      "fr": "Adorable",
      "zh": "可爱",
      "motif": "sun",
      "def": "说不出到底爱对方哪一点，最后只剩下一个有点傻的词：可爱。"
    },
    "affirmation": {
      "no": 4,
      "fr": "Affirmation",
      "zh": "肯定",
      "motif": "star",
      "def": "不管发生什么，恋人坚持把爱当成一种价值。"
    },
    "alteration": {
      "no": 5,
      "fr": "Altération",
      "zh": "变质",
      "motif": "mirror",
      "def": "一个很小的举动，让心目中美好的形象忽然翻转，露出另一副样子。"
    },
    "angoisse": {
      "no": 6,
      "fr": "Angoisse",
      "zh": "焦虑",
      "motif": "spiral",
      "def": "害怕危险、受伤、被抛下、被翻脸，恋人把这些统称为焦虑。"
    },
    "annulation": {
      "no": 7,
      "fr": "Annulation",
      "zh": "抹去",
      "motif": "frame",
      "def": "爱得太多，反而把对方淹没了：恋人爱的是爱本身，不是那个人。"
    },
    "ascese": {
      "no": 8,
      "fr": "Ascèse",
      "zh": "苦行",
      "motif": "candle",
      "def": "出于内疚，或想让对方看见自己的不幸，恋人开始惩罚自己。"
    },
    "atopos": {
      "no": 9,
      "fr": "Atopos",
      "zh": "无法归类",
      "motif": "eye",
      "def": "恋人眼里的对方无法归类，每一次都出人意料。"
    },
    "attente": {
      "art": {
        "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Vilhelm_Hammershoi_-_Interieur_mit_Rueckenansicht_einer_Frau_-_1903-1904_-_Randers_Kunstmuseum.jpg?width=1200",
        "artist": "哈默修伊",
        "title": "《背影》",
        "year": "1903–1904"
      },
      "no": 10,
      "fr": "Attente",
      "zh": "等待",
      "motif": "clock",
      "def": "对方迟到一点点，恋人心里就翻起一阵焦虑。"
    },
    "cacher": {
      "no": 11,
      "fr": "Cacher",
      "zh": "掩饰",
      "motif": "veil",
      "def": "问题不是要不要表白，而是要把心里的翻涌藏起多少。"
    },
    "cases": {
      "no": 12,
      "fr": "Casés",
      "zh": "各得其所",
      "motif": "grid",
      "def": "身边每个人都安顿好了自己的关系，只有恋人被排除在外，又羡慕又不屑。"
    },
    "catastrophe": {
      "no": 13,
      "fr": "Catastrophe",
      "zh": "灾难",
      "motif": "cliff",
      "def": "觉得这段感情是一条死路，自己会被彻底毁掉。"
    },
    "circonscrire": {
      "no": 14,
      "fr": "Circonscrire",
      "zh": "划界",
      "motif": "circle",
      "def": "只留下快乐的部分，把其余的低落圈起来不去想。"
    },
    "coeur": {
      "no": 15,
      "fr": "Cœur",
      "zh": "心",
      "motif": "heart",
      "def": "心是拿来送人的东西，可它不是被误解，就是被退回。"
    },
    "comblement": {
      "no": 16,
      "fr": "Comblement",
      "zh": "圆满",
      "motif": "sun",
      "def": "恋人固执地相信，爱可以被完全满足，并且永远如此。"
    },
    "compassion": {
      "no": 17,
      "fr": "Compassion",
      "zh": "怜惜",
      "motif": "hands",
      "def": "看到对方受苦，哪怕与自己无关，恋人也心疼得厉害。"
    },
    "comprendre": {
      "no": 18,
      "fr": "Comprendre",
      "zh": "想弄明白",
      "motif": "knot",
      "def": "突然觉得一切都是解不开的结，恋人喊：我想弄明白到底怎么了。"
    },
    "conduite": {
      "no": 19,
      "fr": "Conduite",
      "zh": "怎么办",
      "motif": "fork",
      "def": "为一些小事反复纠结：该怎么做，该怎么回。"
    },
    "connivence": {
      "no": 20,
      "fr": "Connivence",
      "zh": "默契",
      "motif": "two",
      "def": "想象和情敌一起谈论心爱的人，竟生出一种奇怪的同伙感。"
    },
    "contacts": {
      "no": 21,
      "fr": "Contacts",
      "zh": "接触",
      "motif": "hands",
      "def": "不经意碰到对方的皮肤，心里就开始一长串独白。"
    },
    "contingences": {
      "no": 22,
      "fr": "Contingences",
      "zh": "琐事",
      "motif": "dots",
      "def": "一点点小事、小意外，好像老天专门和恋人作对。"
    },
    "corps": {
      "no": 23,
      "fr": "Corps",
      "zh": "身体",
      "motif": "figure",
      "def": "对方的身体引起的一切念头、心动和好奇。"
    },
    "declaration": {
      "no": 24,
      "fr": "Déclaration",
      "zh": "倾诉",
      "motif": "mouth",
      "def": "恋人不停地跟对方谈“我们”，谈这段关系本身。"
    },
    "dedicace": {
      "no": 25,
      "fr": "Dédicace",
      "zh": "献辞",
      "motif": "gift",
      "def": "每一份送出的礼物，每一个献给对方的举动，都伴着一段话。"
    },
    "demons": {
      "no": 26,
      "fr": "Démons",
      "zh": "心魔",
      "motif": "flame",
      "def": "像被语言的魔鬼附了身，忍不住说出伤害自己的话。"
    },
    "dependance": {
      "no": 27,
      "fr": "Dépendance",
      "zh": "依附",
      "motif": "thread",
      "def": "旁人眼里，恋人就是被对方拴住的人。"
    },
    "depense": {
      "no": 28,
      "fr": "Dépense",
      "zh": "耗费",
      "motif": "coins",
      "def": "想把爱当成纯粹的耗费，白白付出，却又犹豫。"
    },
    "dereallite": {
      "no": 29,
      "fr": "Déréalité",
      "zh": "失真",
      "motif": "fog",
      "def": "世界忽然变得不真实，恋人从现实里退了出来。"
    },
    "drame": {
      "no": 30,
      "fr": "Drame",
      "zh": "剧",
      "motif": "curtain",
      "def": "恋人写不出自己的爱情小说，只能像古老的戏剧那样念白。"
    },
    "ecorche": {
      "no": 31,
      "fr": "Écorché",
      "zh": "剥了皮的人",
      "motif": "scratch",
      "def": "恋人格外敏感，一点轻伤都直接碰到肉。"
    },
    "ecrire": {
      "no": 32,
      "fr": "Écrire",
      "zh": "写",
      "motif": "pen",
      "def": "想把爱写成作品，却掉进一连串陷阱和死胡同。"
    },
    "errance": {
      "no": 33,
      "fr": "Errance",
      "zh": "流浪",
      "motif": "path",
      "def": "每段爱都觉得是唯一，却隐约知道自己会一段接一段地流浪下去。"
    },
    "etreinte": {
      "no": 34,
      "fr": "Étreinte",
      "zh": "拥抱",
      "motif": "embrace",
      "def": "拥抱的一刻，好像实现了完全合一的梦。"
    },
    "exil": {
      "no": 35,
      "fr": "Exil",
      "zh": "放逐",
      "motif": "door",
      "def": "决定不再爱了，恋人难过地看着自己被逐出想象的国度。"
    },
    "facheux": {
      "no": 36,
      "fr": "Fâcheux",
      "zh": "扫兴的人",
      "motif": "cat",
      "def": "对方的注意力被别的人、事、东西分走，恋人生出小小的嫉妒。"
    },
    "fading": {
      "no": 37,
      "fr": "Fading",
      "zh": "隐退",
      "motif": "fade",
      "def": "对方没有冲谁，也没有离开，只是从一切接触里慢慢退远。"
    },
    "fautes": {
      "no": 38,
      "fr": "Fautes",
      "zh": "过失",
      "motif": "crack",
      "def": "日常一件小事，恋人就觉得自己亏欠了对方。"
    },
    "fete": {
      "art": {
        "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Whistler-Nocturne_in_black_and_gold.jpg?width=1200",
        "artist": "惠斯勒",
        "title": "《黑与金的夜曲：坠落的烟火》",
        "year": "约 1875"
      },
      "no": 39,
      "fr": "Fête",
      "zh": "节日",
      "motif": "lantern",
      "def": "每一次见面，恋人都当作过节。"
    },
    "fou": {
      "no": 40,
      "fr": "Fou",
      "zh": "疯",
      "motif": "spiral",
      "def": "恋人一再想到：我是不是疯了，或者正在变疯。"
    },
    "gene": {
      "no": 41,
      "fr": "Gêne",
      "zh": "尴尬",
      "motif": "table",
      "def": "几个人在场，那层没说破的关系让所有人都不自在。"
    },
    "gradiva": {
      "no": 42,
      "fr": "Gradiva",
      "zh": "格拉迪娃",
      "motif": "step",
      "def": "被爱的人愿意陪恋人进入他的妄想，帮他从里面走出来。"
    },
    "habit": {
      "no": 43,
      "fr": "Habit",
      "zh": "衣装",
      "motif": "coat",
      "def": "为见面穿的衣服，或者初见时穿的那一件，都带着情绪。"
    },
    "identification": {
      "no": 44,
      "fr": "Identification",
      "zh": "认同",
      "motif": "mirror",
      "def": "谁和自己处在同样的位置，恋人就痛苦地把自己代入谁。"
    },
    "image": {
      "no": 45,
      "fr": "Image",
      "zh": "形象",
      "motif": "frame",
      "def": "伤人最深的，往往是看见的，不是知道的。"
    },
    "inconnaissable": {
      "no": 46,
      "fr": "Inconnaissable",
      "zh": "不可知",
      "motif": "fog",
      "def": "想把对方当成一种性格、一种类型来理解，却总是落空。"
    },
    "induction": {
      "no": 47,
      "fr": "Induction",
      "zh": "诱导",
      "motif": "arrow",
      "def": "因为别人示范过他值得被爱，恋人才开始爱他。"
    },
    "informateur": {
      "no": 48,
      "fr": "Informateur",
      "zh": "报信人",
      "motif": "ear",
      "def": "一个朋友若无其事地透露对方的小消息，恰好扰乱了恋人心里的形象。"
    },
    "insupportable": {
      "no": 49,
      "fr": "Insupportable",
      "zh": "受不了",
      "motif": "weight",
      "def": "苦攒到一定程度，恋人喊出来：不能再这样下去了。"
    },
    "issues": {
      "no": 50,
      "fr": "Issues",
      "zh": "出路",
      "motif": "door",
      "def": "设想种种出路，哪怕是灾难性的，也能让人暂时喘口气。",
      "care": true
    },
    "jalousie": {
      "no": 51,
      "fr": "Jalousie",
      "zh": "嫉妒",
      "motif": "two",
      "def": "害怕心爱的人更喜欢别人。"
    },
    "jetaime": {
      "no": 52,
      "fr": "Je-t-aime",
      "zh": "我爱你",
      "motif": "mouth",
      "def": "不是表白，是那三个字被一遍遍喊出来。"
    },
    "langueur": {
      "no": 53,
      "fr": "Langueur",
      "zh": "相思",
      "motif": "wilt",
      "def": "在缺里慢慢耗着的欲望，没有抓取，只有想。"
    },
    "lettre": {
      "art": {
        "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Vermeer,_Johannes_-_Woman_reading_a_letter_-_ca._1662-1663.jpg?width=1200",
        "artist": "维米尔",
        "title": "《读信的蓝衣女子》",
        "year": "约 1663"
      },
      "no": 54,
      "fr": "Lettre",
      "zh": "情书",
      "motif": "letter",
      "def": "情书的格式是空的，欲望却是满的。"
    },
    "loquele": {
      "no": 55,
      "fr": "Loquèle",
      "zh": "絮叨",
      "motif": "lines",
      "def": "脑子里停不下来的那串话，反复论证一次受伤或一个决定。"
    },
    "magie": {
      "no": 56,
      "fr": "Magie",
      "zh": "巫术",
      "motif": "candle",
      "def": "占卜、许愿、小小的秘密仪式，恋人都做过。"
    },
    "monstrueux": {
      "no": 57,
      "fr": "Monstrueux",
      "zh": "怪物",
      "motif": "shadow",
      "def": "恋人忽然发现自己用一张专制的网罩住了对方。"
    },
    "mutisme": {
      "no": 58,
      "fr": "Mutisme",
      "zh": "沉默",
      "motif": "phone",
      "def": "对方回得很少，或干脆不回，恋人为此焦虑。"
    },
    "nuages": {
      "no": 59,
      "fr": "Nuages",
      "zh": "阴云",
      "motif": "cloud",
      "def": "情绪忽然暗下来，以及恋人怎么用这片阴云。"
    },
    "nuit": {
      "art": {
        "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Caspar_David_Friedrich_-_Zwei_Männer_in_Betrachtung_des_Mondes.jpg?width=1200",
        "artist": "弗里德里希",
        "title": "《凝望月亮的两个人》",
        "year": "1819–1820"
      },
      "no": 60,
      "fr": "Nuit",
      "zh": "夜",
      "motif": "moon",
      "def": "情感的、思想的、存在的黑暗，恋人在里面挣扎，也在里面平静。"
    },
    "objets": {
      "no": 61,
      "fr": "Objets",
      "zh": "物件",
      "motif": "cup",
      "def": "对方碰过的东西，成了对方身体的一部分，恋人舍不得。"
    },
    "obscene": {
      "no": 62,
      "fr": "Obscène",
      "zh": "不体面",
      "motif": "heart",
      "def": "如今多情反倒显得丢人，恋人得把多情当成一种冒犯来担着。"
    },
    "pleurer": {
      "no": 63,
      "fr": "Pleurer",
      "zh": "哭",
      "motif": "rain",
      "def": "恋人格外爱哭，以及眼泪在恋爱里的用处。"
    },
    "potin": {
      "no": 64,
      "fr": "Potin",
      "zh": "闲话",
      "motif": "ear",
      "def": "听到别人用平常的口吻议论心爱的人，恋人觉得受了伤。"
    },
    "pourquoi": {
      "no": 65,
      "fr": "Pourquoi",
      "zh": "为什么",
      "motif": "question",
      "def": "一边追问他为什么不爱我，一边相信他其实爱我，只是不说。"
    },
    "ravissement": {
      "no": 66,
      "fr": "Ravissement",
      "zh": "心醉",
      "motif": "window",
      "def": "被对方的形象一下子“劫持”的那一刻，俗称一见钟情。"
    },
    "regrette": {
      "no": 67,
      "fr": "Regretté",
      "zh": "被惦念",
      "motif": "frame",
      "def": "想象自己死了，对方的生活照常继续。"
    },
    "rencontre": {
      "no": 68,
      "fr": "Rencontre",
      "zh": "相遇",
      "motif": "two",
      "def": "心动之后那段好日子，麻烦还没来。"
    },
    "retentissement": {
      "no": 69,
      "fr": "Retentissement",
      "zh": "回响",
      "motif": "ripple",
      "def": "一句话、一个画面，在恋人心里痛苦地回响。"
    },
    "reveil": {
      "no": 70,
      "fr": "Réveil",
      "zh": "醒来",
      "motif": "dawn",
      "def": "每天醒来，那件心事立刻回来。"
    },
    "scene": {
      "no": 71,
      "fr": "Scène",
      "zh": "吵架",
      "motif": "zigzag",
      "def": "你一句我一句的互相指责。"
    },
    "seul": {
      "no": 72,
      "fr": "Seul",
      "zh": "孤独",
      "motif": "figure",
      "def": "不是生活上的孤独，是没有任何一套思想愿意为激情说话。"
    },
    "signes": {
      "no": 73,
      "fr": "Signes",
      "zh": "迹象",
      "motif": "eye",
      "def": "想证明自己的爱，想判断对方爱不爱，却找不到可靠的信号。"
    },
    "souvenir": {
      "no": 74,
      "fr": "Souvenir",
      "zh": "回忆",
      "motif": "leaf",
      "def": "想起与对方有关的某样东西、某个动作、某个场景，甜的或痛的。"
    },
    "suicide": {
      "no": 75,
      "fr": "Suicide",
      "zh": "死念",
      "motif": "cliff",
      "def": "恋爱中常有一闪而过的轻生念头，一点小事就会引出来。",
      "care": true
    },
    "tel": {
      "no": 76,
      "fr": "Tel",
      "zh": "如其所是",
      "motif": "circle",
      "def": "恋人梦想有一种智慧，能不加形容词地接受对方本来的样子。"
    },
    "tendresse": {
      "no": 77,
      "fr": "Tendresse",
      "zh": "温存",
      "motif": "hands",
      "def": "享受对方的温柔，又不安地意识到，这份温柔不是只给自己的。"
    },
    "union": {
      "no": 78,
      "fr": "Union",
      "zh": "合一",
      "motif": "embrace",
      "def": "与对方完全合为一体的梦。"
    },
    "verite": {
      "no": 79,
      "fr": "Vérité",
      "zh": "真相",
      "motif": "light",
      "def": "恋人觉得只有自己看见了对方的真相。"
    },
    "vouloirsaisir": {
      "no": 80,
      "fr": "Vouloir-saisir",
      "zh": "想占有",
      "motif": "open",
      "def": "明白了麻烦都来自想占有，恋人决定从此放手。"
    }
  }
};
